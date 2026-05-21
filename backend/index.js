import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import paymentRoutes from "./routes/payment.js";
import pool from "./lib/db.js";
import Stripe from "stripe";

const app = express();

app.use(cors());
app.use(express.json());

/* ======================================
   STRIPE
====================================== */

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

/* ======================================
   DEBUG
====================================== */

console.log(
  "DATABASE URL:",
  process.env.DATABASE_URL
);

/* ======================================
   PAYMENT ROUTES
====================================== */

app.use("/", paymentRoutes);

/* ======================================
   FILE STORAGE
====================================== */

const DATA_FILE = "./projects.json";

/* ======================================
   LOAD PROJECTS
====================================== */

const loadProjects = () => {

  try {

    if (!fs.existsSync(DATA_FILE)) {

      fs.writeFileSync(
        DATA_FILE,
        "[]"
      );
    }

    const data = fs.readFileSync(
      DATA_FILE,
      "utf-8"
    );

    return JSON.parse(data || "[]");

  } catch (err) {

    console.error(
      "Load error:",
      err
    );

    return [];
  }
};

/* ======================================
   SAVE PROJECTS
====================================== */

const saveProjects = (projects) => {

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      projects,
      null,
      2
    )
  );
};

/* ======================================
   CREATE TABLES
====================================== */

const createTable = async () => {

  try {

    /* PROJECTS TABLE */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id BIGSERIAL PRIMARY KEY,
        title TEXT,
        prompt TEXT,
        html TEXT,
        visibility TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    /* PAYMENTS TABLE */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id BIGSERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        plan TEXT,
        payment_status TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    /* USERS TABLE */

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);


    console.log(
      "✅ Neon database connected"
    );

  } catch (err) {

    console.error(
      "❌ Database error:",
      err
    );
  }
};

createTable();

/* ======================================
   TEST ROUTE
====================================== */

app.get("/", (req, res) => {

  res.send("Backend working ✅");
});

/* ======================================
   STRIPE CHECKOUT
====================================== */

app.post(
  "/create-checkout-session",
  async (req, res) => {

    try {

      const {
        plan,
        price
      } = req.body;

      const session =
        await stripe.checkout.sessions.create({

          payment_method_types: [
            "card"
          ],

          mode: "payment",

          line_items: [
            {
              price_data: {

                currency: "myr",

                product_data: {
                  name:
                    `AI Website Builder - ${plan} Plan`
                },

                unit_amount:
                  Math.round(
                    Number(price) * 100
                  )
              },

              quantity: 1
            }
          ],

          success_url:
            "https://ai-website-builder-saas-sigma.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",

          cancel_url:
            "https://ai-website-builder-saas-sigma.vercel.app/checkout"
        });

      res.json({
        url: session.url
      });

    } catch (err) {

      console.error(
        "❌ STRIPE ERROR:",
        err
      );

      res.status(500).json({
        error: err.message
      });
    }
  }
);

/* ======================================
   GENERATE WEBSITE
====================================== */

app.post("/generate", async (req, res) => {

  try {

    const { prompt } = req.body;

    if (!prompt) {

      return res.status(400).json({
        error: "Prompt required",
      });
    }

    if (!process.env.OPENAI_API_KEY) {

      return res.status(500).json({
        error: "Missing API key",
      });
    }

    const SYSTEM_PROMPT = `
You are an elite frontend engineer.

Generate a COMPLETE modern responsive website.

Rules:
- Return ONLY raw HTML
- Do NOT use markdown
- Do NOT use triple backticks
- Include all CSS inside <style>
- Include all JS inside <script>
- Make UI modern and professional
- Use responsive layout
- Use beautiful sections
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.OPENAI_API_KEY}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          model: "gpt-4o",

          temperature: 0.8,

          max_tokens: 4000,

          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(
      "OPENAI RESPONSE:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    let raw =
      data?.choices?.[0]?.message?.content || "";

    raw = raw
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .trim();

    if (!raw.includes("<html")) {

      raw = `
      <html>
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>

        <body>
          ${raw}
        </body>
      </html>
      `;
    }

    res.json({
      html: raw,
    });

  } catch (err) {

    console.error(
      "Generation error:",
      err
    );

    res.status(500).json({
      error: "Generation failed",
    });
  }
});

/* ======================================
   SAVE PROJECT
====================================== */

app.post("/save-project", async (req, res) => {

  try {

    let {
      title,
      prompt,
      html,
      visibility
    } = req.body;

    visibility = String(
      visibility || "private"
    )
      .trim()
      .toLowerCase();

    await pool.query(
      `
      INSERT INTO projects
      (
        title,
        prompt,
        html,
        visibility
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        title || prompt,
        prompt,
        html,
        visibility
      ]
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "Save error:",
      err
    );

    res.status(500).json({
      error: "Save failed",
    });
  }
});

/* ======================================
   MY PROJECTS
====================================== */

app.get("/my-projects", async (req, res) => {

  try {

    const result =
      await pool.query(`
        SELECT *
        FROM projects
        WHERE visibility='private'
        ORDER BY id DESC
      `);

    res.json(
      result.rows
    );

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Load failed",
    });
  }
});

/* ======================================
   COMMUNITY PROJECTS
====================================== */

app.get(
  "/community-projects",
  async (req, res) => {

    try {

      const result =
        await pool.query(`
          SELECT *
          FROM projects
          WHERE visibility='public'
          ORDER BY id DESC
        `);

      res.json(
        result.rows
      );

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Load failed",
      });
    }
  }
);

/* ======================================
   DELETE PROJECT
====================================== */

app.delete(
  "/delete-project/:id",
  async (req, res) => {

    try {

      const id =
        req.params.id;

      await pool.query(
        `
        DELETE FROM projects
        WHERE id=$1
        `,
        [id]
      );

      res.json({
        success: true,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Delete failed",
      });
    }
  }
);

/* ======================================
   START SERVER
====================================== */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running http://localhost:${PORT}`
  );
});