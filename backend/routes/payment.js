import express from "express";
import pool from "../lib/db.js";

const router = express.Router();

/* SAVE PAYMENT */
router.post("/save-payment", async (req, res) => {
  try {
    const { name, email, phone, address, plan } = req.body;

    const result = await pool.query(
      `INSERT INTO payments (name,email,phone,address,plan,payment_status)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [name, email, phone, address, plan, "success"]
    );

    res.json({ success: true, payment: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment save failed" });
  }
});

/* GET PAYMENTS */
router.get("/admin/payments", async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM payments ORDER BY id DESC`
  );
  res.json(result.rows);
});

/* DELETE PAYMENT */
router.delete("/admin/payments/:id", async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM payments WHERE id=$1`,
      [req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;