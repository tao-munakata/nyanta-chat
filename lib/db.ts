import "server-only";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const DB_PATH =
  process.env.DB_PATH ?? path.join(process.cwd(), "data/nyanta.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
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
      CREATE TABLE IF NOT EXISTS question_overrides (
        question_id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        updated_at INTEGER NOT NULL
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
  const db = getDb();
  const save = db.transaction(() => {
    db.prepare("DELETE FROM answers WHERE session_id = ? AND question_id = ?").run(
      sessionId,
      questionId
    );
    db.prepare(
      "INSERT INTO answers (session_id, question_id, answer, created_at) VALUES (?, ?, ?, ?)"
    ).run(sessionId, questionId, answer, Date.now());
  });

  save();
}

export function completeSession(sessionId: string): void {
  getDb()
    .prepare("UPDATE sessions SET status = 'complete' WHERE id = ?")
    .run(sessionId);
}

export function deleteAnswer(sessionId: string, questionId: string): void {
  getDb()
    .prepare("DELETE FROM answers WHERE session_id = ? AND question_id = ?")
    .run(sessionId, questionId);
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

export function getSession(
  sessionId: string
): { id: string; status: string } | undefined {
  return getDb()
    .prepare("SELECT id, status FROM sessions WHERE id = ?")
    .get(sessionId) as { id: string; status: string } | undefined;
}

export function getQuestionOverrides(): Record<string, string> {
  const rows = getDb()
    .prepare("SELECT question_id, text FROM question_overrides ORDER BY question_id ASC")
    .all() as { question_id: string; text: string }[];

  return Object.fromEntries(rows.map((row) => [row.question_id, row.text]));
}

export function saveQuestionOverride(questionId: string, text: string): void {
  getDb()
    .prepare(
      `
        INSERT INTO question_overrides (question_id, text, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(question_id) DO UPDATE SET
          text = excluded.text,
          updated_at = excluded.updated_at
      `
    )
    .run(questionId, text, Date.now());
}

export function deleteQuestionOverride(questionId: string): void {
  getDb()
    .prepare("DELETE FROM question_overrides WHERE question_id = ?")
    .run(questionId);
}

export function resetDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
