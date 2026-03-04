import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'attendees.db');

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
    db.exec(`
      CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attendee_id TEXT NOT NULL,
        type TEXT NOT NULL,
        checked_in_at TEXT NOT NULL,
        UNIQUE(attendee_id, type),
        FOREIGN KEY(attendee_id) REFERENCES attendees(id)
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS push_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attendee_id TEXT,
        token TEXT NOT NULL UNIQUE,
        platform TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(attendee_id) REFERENCES attendees(id)
      )
    `);
  }
  return db;
}

export default getDb;
