import { DatabaseSync } from "node:sqlite";

const DATABASE_PATH = process.env.DATABASE_PATH || ":memory:";
const db = new DatabaseSync(DATABASE_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  venue TEXT NOT NULL
) STRICT`);

db.exec(`
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL
) STRICT`);

db.exec(`
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY NOT NULL,
  note_id INTEGER NOT NULL,
  filename TEXT NOT NULL
) STRICT`);

export default db;
