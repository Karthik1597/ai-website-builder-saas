import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import paymentRoutes from "./routes/payment.js";
import pool from "./lib/db.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ======================================
   DEBUG (IMPORTANT)
====================================== */

console.log("DATABASE URL:", process.env.DATABASE_URL);

/* ======================================
   PAYMENT ROUTES
====================================== */

app.use("/", paymentRoutes);

/* ======================================
   FILE STORAGE (JSON fallback)
====================================== */

const DATA_FILE = "./projects.json";

/* ======================================
   LOAD PROJECTS
====================================== */

const loadProjects = () => {

  try {

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]");
    }

    const data = fs.readFileSync(DATA_FILE, "utf-8");

    return JSON.parse(data || "[]");

  } catch (err) {

    console.error("Load error:", err);

    return [];
  }
};

/* ======================================
   SAVE PROJECTS
====================================== */

const saveProjects = (projects) => {

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(projects, null, 2)
  );
};

/* ======================================
   CREATE TABLE (NEON CHECK)
====================================== */

const createTable = async () => {

  try {

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

    console.log("✅ Neon database connected");

  } catch (err) {

    console.error("❌ Database error:", err);
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

Return ONLY HTML.
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          temperature: 1,
          max_tokens: 4000,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Create website: ${prompt}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let raw = data?.choices?.[0]?.message?.content || "";

    raw = raw
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .trim();

    const match = raw.match(/<html[\s\S]*<\/html>/i);

    if (!match) {
      return res.status(500).json({
        error: "Invalid HTML output",
      });
    }

    res.json({
      html: match[0],
    });

  } catch (err) {

    console.error("Generation error:", err);

    res.status(500).json({
      error: "Generation failed",
    });
  }
});

/* ======================================
   SAVE PROJECT (NEON DB VERSION)
====================================== */

app.post("/save-project", async (req, res) => {

  try {

    let {
      title,
      prompt,
      html,
      visibility
    } = req.body;

    visibility = String(visibility || "private")
      .trim()
      .toLowerCase();

    await pool.query(
      `
      INSERT INTO projects
      (title, prompt, html, visibility)
      VALUES ($1, $2, $3, $4)
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

    console.error("Save error:", err);

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

    const result = await pool.query(`
      SELECT *
      FROM projects
      WHERE visibility='private'
      ORDER BY id DESC
    `);

    res.json(result.rows);

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

app.get("/community-projects", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM projects
      WHERE visibility='public'
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Load failed",
    });
  }
});

/* ======================================
   DELETE PROJECT
====================================== */

app.delete("/delete-project/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await pool.query(`
      DELETE FROM projects
      WHERE id=$1
    `, [id]);

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Delete failed",
    });
  }
});

/* ======================================
   START SERVER
====================================== */

const PORT = 5000;

app.listen(PORT, () => {

  console.log(`🚀 Server running http://localhost:${PORT}`);

});