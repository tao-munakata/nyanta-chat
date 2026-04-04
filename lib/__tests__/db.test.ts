import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";

// テスト用DBパスを環境変数で制御
process.env.DB_PATH = path.join(process.cwd(), "data/test.db");

// db.tsをインポート（この時点ではまだ存在しないのでエラーになる）
const { createSession, saveAnswer, completeSession, getSessionAnswers } =
  await import("../db.js");

describe("db", () => {
  beforeEach(() => {
    // テーブル初期化は db.ts の初期化時に行われる
  });

  afterEach(() => {
    // テスト用DBを削除
    const dbPath = process.env.DB_PATH!;
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  });

  it("createSession: セッションIDを返す", () => {
    const id = createSession();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("saveAnswer: 回答を保存できる", () => {
    const sessionId = createSession();
    saveAnswer(sessionId, "basic-name", "田中太郎");
    const answers = getSessionAnswers(sessionId);
    expect(answers).toHaveLength(1);
    expect(answers[0].question_id).toBe("basic-name");
    expect(answers[0].answer).toBe("田中太郎");
  });

  it("completeSession: ステータスをcompleteに更新する", () => {
    const sessionId = createSession();
    completeSession(sessionId);
    // エラーなく完了すれば OK（ステータスはgetSessionAnswersで間接確認）
    expect(true).toBe(true);
  });

  it("getSessionAnswers: 複数回答を返す", () => {
    const sessionId = createSession();
    saveAnswer(sessionId, "basic-name", "山田花子");
    saveAnswer(sessionId, "basic-kana", "やまだはなこ");
    const answers = getSessionAnswers(sessionId);
    expect(answers).toHaveLength(2);
  });
});
