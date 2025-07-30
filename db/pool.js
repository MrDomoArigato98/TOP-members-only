import * as pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   ...(isProduction && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});