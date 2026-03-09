import { neon } from "@neondatabase/serverless";

// Lazy wrapper — neon() is only called when sql is actually used,
// not at module import time (avoids build-time errors without DATABASE_URL)
export const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  const db = neon(process.env.DATABASE_URL!);
  return db(strings, ...values);
};

export default sql;
