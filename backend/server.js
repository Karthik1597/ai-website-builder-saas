import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";
import pool from "./lib/db.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ======================================
   PAYMENT ROUTES
====================================== */

app.use("/", paymentRoutes);

/* ======================================
   DEBUG LOG
====================================== */

app.use((req, res, next) => {

  console.log(
    "📡 Incoming:",
    req.method,
    req.url
  );

  next();
});

/* ======================================
   CREATE USERS TABLE
====================================== */

const createTable = async () => {

  try {

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
      "✅ Users table ready"
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
        success: true,
      });
    }

    res.status(401).json({
      error: "Invalid credentials",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* ======================================
   GET USERS
====================================== */

app.get("/admin/users", async (req, res) => {

  try {

    // ✅ check table exists first
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await pool.query(`
      SELECT id, name, email
      FROM users
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(
      "❌ USERS ERROR:",
      err
    );

    res.status(500).json({
      error: "Failed to load users",
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

      const { id } = req.params;

      await pool.query(`
        DELETE FROM users
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
      error: "Failed to load payments",
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
   TEST ROUTE
====================================== */

app.get("/", (req, res) => {

  res.send(
    "Admin Backend working ✅"
  );
});

/* ======================================
   START SERVER
====================================== */

const PORT =
  process.env.PORT || 5001;

app.listen(PORT, () => {

  console.log(
    `🚀 Admin Backend running on port ${PORT}`
  );
});