import { describe, it, expect } from "vitest";
import { QUESTIONS, getQuestion, CATEGORIES } from "../questions.js";

describe("questions", () => {
  it("25問定義されている", () => {
    expect(QUESTIONS.length).toBe(25);
  });

  it("全質問にid・category・text・typeが存在する", () => {
    for (const q of QUESTIONS) {
      expect(q.id, `${q.id}: idが空`).toBeTruthy();
      expect(q.category, `${q.id}: categoryが空`).toBeTruthy();
      expect(q.text, `${q.id}: textが空`).toBeTruthy();
      expect(["text", "select", "date", "photo"]).toContain(q.type);
    }
  });

  it("select型にはoptionsが存在する", () => {
    const selects = QUESTIONS.filter((q) => q.type === "select");
    for (const q of selects) {
      expect(q.options, `${q.id}: optionsがない`).toBeDefined();
      expect(q.options!.length).toBeGreaterThan(0);
    }
  });

  it("getQuestion: IDで質問を取得できる", () => {
    const q = getQuestion("basic-name");
    expect(q).toBeDefined();
    expect(q!.id).toBe("basic-name");
  });

  it("getQuestion: 存在しないIDはundefinedを返す", () => {
    expect(getQuestion("nonexistent")).toBeUndefined();
  });

  it("7カテゴリが全て含まれている", () => {
    const cats = new Set(QUESTIONS.map((q) => q.category));
    for (const cat of CATEGORIES) {
      expect(cats.has(cat.id), `カテゴリ ${cat.id} がない`).toBe(true);
    }
  });
});
