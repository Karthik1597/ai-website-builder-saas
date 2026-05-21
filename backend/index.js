import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import Stripe from "stripe";
import pool from "./lib/db.js";

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

const createTables = async () => {

  try {

    /* PROJECTS */

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

    /* PAYMENTS */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id BIGSERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        plan TEXT,
        payment_status TEXT,
        amount TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    /* USERS */

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

createTables();

/* ======================================
   TEST ROUTE
====================================== */

app.get("/", (req, res) => {

  res.send(
    "Backend working ✅"
  );
});

/* ======================================
   ADMIN LOGIN
====================================== */

app.post("/admin-login", async (req, res) => {

  try {

    const {
      username,
      password
    } = req.body;

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      return res.json({
        success: true
      });
    }

    return res.status(401).json({
      error: "Invalid credentials"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });
  }
});

/* ======================================
   GET USERS
====================================== */

app.get("/admin/users", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT id,name,email,created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load users"
    });
  }
});

/* ======================================
   DELETE USER
====================================== */

app.delete(
  "/admin/users/:id",
  async (req, res) => {

    try {

      await pool.query(`
        DELETE FROM users
        WHERE id=$1
      `, [req.params.id]);

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Delete failed"
      });
    }
  }
);

/* ======================================
   GET PAYMENTS
====================================== */

app.get("/admin/payments", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM payments
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load payments"
    });
  }
});

/* ======================================
   DELETE PAYMENT
====================================== */

app.delete(
  "/admin/payments/:id",
  async (req, res) => {

    try {

      await pool.query(`
        DELETE FROM payments
        WHERE id=$1
      `, [req.params.id]);

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Delete failed"
      });
    }
  }
);

/* ======================================
   SIGNUP
====================================== */

app.post("/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        error: "All fields required"
      });
    }

    const existingUser =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email=$1
        `,
        [email]
      );

    if (
      existingUser.rows.length > 0
    ) {

      return res.status(400).json({
        error: "User already exists"
      });
    }

    await pool.query(
      `
      INSERT INTO users
      (name,email,password)
      VALUES ($1,$2,$3)
      `,
      [
        name,
        email,
        password
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Signup failed"
    });
  }
});

/* ======================================
   LOGIN
====================================== */

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const result =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email=$1
        AND password=$2
        `,
        [
          email,
          password
        ]
      );

    if (
      result.rows.length === 0
    ) {

      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Login failed"
    });
  }
});

/* ======================================
   STRIPE CHECKOUT
====================================== */

app.post(
  "/create-checkout-session",
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        address,
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
            "https://ai-website-builder-saas-sigma.vercel.app/checkout",

          metadata: {
            name,
            email,
            phone,
            address,
            plan,
            amount: price
          }
        });

      await pool.query(
        `
        INSERT INTO payments
        (
          name,
          email,
          phone,
          address,
          plan,
          amount,
          payment_status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          name,
          email,
          phone,
          address,
          plan,
          price,
          "success"
        ]
      );

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
        error: "Prompt required"
      });
    }

    if (
      !process.env.OPENAI_API_KEY
    ) {

      return res.status(500).json({
        error: "Missing API key"
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
            "application/json"
        },

        body: JSON.stringify({

          model: "gpt-4o",

          temperature: 0.8,

          max_tokens: 4000,

          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data =
      await response.json();

    let raw =
      data?.choices?.[0]?.message?.content || "";

    raw = raw
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .trim();

    if (
      !raw.includes("<html")
    ) {

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
      html: raw
    });

  } catch (err) {

    console.error(
      "Generation error:",
      err
    );

    res.status(500).json({
      error: "Generation failed"
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
      success: true
    });

  } catch (err) {

    console.error(
      "Save error:",
      err
    );

    res.status(500).json({
      error: "Save failed"
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

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Load failed"
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

      res.json(result.rows);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Load failed"
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

      await pool.query(
        `
        DELETE FROM projects
        WHERE id=$1
        `,
        [req.params.id]
      );

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Delete failed"
      });
    }
  }
);


//* ======================================
   SIGNUP

app.post("/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message:
          "All fields required"
      });
    }

    const existing =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email=$1
        `,
        [email]
      );

    if (
      existing.rows.length > 0
    ) {

      return res.status(400).json({
        message:
          "User already exists"
      });
    }

    await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES ($1,$2,$3)
      `,
      [
        name,
        email,
        password
      ]
    );

    res.json({
      success: true,
      message:
        "Account created successfully"
    });

  } catch (err) {

    console.error(
      "SIGNUP ERROR:",
      err
    );

    res.status(500).json({
      message:
        "Signup failed"
    });
  }
});



/* ======================================
   START SERVER
====================================== */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );
});