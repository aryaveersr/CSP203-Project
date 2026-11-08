import { DatabaseSync } from "node:sqlite";

const DATABASE_PATH = process.env.DATABASE_PATH || ":memory:";
const db = new DatabaseSync(DATABASE_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY NOT NULL,
  password_hash BLOB NOT NULL,
  salt TEXT NOT NULL
) STRICT`);

db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  venue TEXT NOT NULL
) STRICT`);

export default db;
