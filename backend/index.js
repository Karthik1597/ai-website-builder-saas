import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
      fs.writeFileSync(DATA_FILE, "[]");
    }

    const data = fs.readFileSync(
      DATA_FILE,
      "utf-8"
    );

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

    let raw =
      data?.choices?.[0]?.message?.content || "";

    raw = raw
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .trim();

    const match = raw.match(
      /<html[\s\S]*<\/html>/i
    );

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
   SAVE PROJECT
====================================== */

app.post("/save-project", (req, res) => {

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

    const projects = loadProjects();

    const baseProject = {
      id: Date.now(),
      title: title || prompt,
      prompt,
      html,
      createdAt: new Date().toISOString(),
    };

    let newProjects = [];

    if (visibility === "private") {

      newProjects.push({
        ...baseProject,
        visibility: "private",
      });
    }

    else if (visibility === "public") {

      newProjects.push({
        ...baseProject,
        visibility: "public",
      });
    }

    else if (visibility === "both") {

      newProjects.push({
        ...baseProject,
        id: Date.now(),
        visibility: "private",
      });

      newProjects.push({
        ...baseProject,
        id: Date.now() + 1,
        visibility: "public",
      });
    }

    else {

      newProjects.push({
        ...baseProject,
        visibility: "private",
      });
    }

    projects.unshift(...newProjects);

    saveProjects(projects);

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

app.get("/my-projects", (req, res) => {

  const projects = loadProjects();

  const data = projects
    .filter(
      (p) =>
        (p.visibility || "")
          .toLowerCase() === "private"
    )
    .sort((a, b) => b.id - a.id);

  res.json(data);
});

/* ======================================
   COMMUNITY PROJECTS
====================================== */

app.get(
  "/community-projects",
  (req, res) => {

    const projects = loadProjects();

    const data = projects
      .filter(
        (p) =>
          (p.visibility || "")
            .toLowerCase() === "public"
      )
      .sort((a, b) => b.id - a.id);

    res.json(data);
  }
);

/* ======================================
   DELETE PROJECT
====================================== */

app.delete(
  "/delete-project/:id",
  (req, res) => {

    const id = Number(req.params.id);

    let projects = loadProjects();

    projects = projects.filter(
      (p) => p.id !== id
    );

    saveProjects(projects);

    res.json({
      success: true,
    });
  }
);

/* ======================================
   START SERVER
====================================== */

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running http://localhost:${PORT}`
  );
});