import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "ep-steep-field-aou2wt83.c-2.ap-southeast-1.aws.neon.tech",
  user: "neondb_owner",
  password: "npg_0YmWTbPJif9a",
  database: "neondb",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;