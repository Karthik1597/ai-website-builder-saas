import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";
import pool from "./lib/db.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(paymentRoutes);

// 🔥 DEBUG LOG
app.use((req, res, next) => {
  console.log("📡 Incoming:", req.method, req.url);
  next();
});

/* ======================================
   ADMIN LOGIN
====================================== */

app.post("/admin-login", async (req, res) => {

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
});

/* ======================================
   GET USERS
====================================== */

app.get("/admin/users", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT id,name,email
      FROM users
      ORDER BY id DESC
      `
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

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

      await pool.query(
        `
        DELETE FROM users
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



// ✅ TEST
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

const PORT = 5001;

app.listen(PORT, () => {

  console.log(
    `🚀 Admin Backend running http://localhost:${PORT}`
  );

});