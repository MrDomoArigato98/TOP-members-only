import * as pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  connectionString: "postgresql://dom:@localhost:5432/clubhouse",
});