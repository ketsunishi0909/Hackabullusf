import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'attendees.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS attendees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        checked_in INTEGER DEFAULT 0,
        checked_in_at TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }
  return db;
}

export default getDb;
