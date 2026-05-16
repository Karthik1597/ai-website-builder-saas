import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ai_builder_saas",
  password: "postgres123",
  port: 5433, // ✅ SAME AS PGADMIN
});

export default pool;