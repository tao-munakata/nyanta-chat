import "server-only";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const DB_PATH =
  process.env.DB_PATH ?? path.join(process.cwd(), "data/nyanta.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'in_progress'
      );
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );
    `);
  }
  return _db;
}

export function createSession(): string {
  const id = uuidv4();
  getDb()
    .prepare(
      "INSERT INTO sessions (id, created_at, status) VALUES (?, ?, 'in_progress')"
    )
    .run(id, Date.now());
  return id;
}

export function saveAnswer(
  sessionId: string,
  questionId: string,
  answer: string
): void {
  getDb()
    .prepare(
      "INSERT INTO answers (session_id, question_id, answer, created_at) VALUES (?, ?, ?, ?)"
    )
    .run(sessionId, questionId, answer, Date.now());
}

export function completeSession(sessionId: string): void {
  getDb()
    .prepare("UPDATE sessions SET status = 'complete' WHERE id = ?")
    .run(sessionId);
}

export function getSessionAnswers(
  sessionId: string
): { question_id: string; answer: string }[] {
  return getDb()
    .prepare(
      "SELECT question_id, answer FROM answers WHERE session_id = ? ORDER BY id ASC"
    )
    .all(sessionId) as { question_id: string; answer: string }[];
}

export function resetDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
