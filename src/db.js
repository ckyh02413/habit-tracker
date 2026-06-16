import pg from "pg";
import "dotenv/config";

pg.types.setTypeParser(1082, (v) => v);

const url =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString: url,
});

export { pool };
