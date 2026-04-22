import { describe, expect, it } from "vitest";
import {
  chooseStrongerExpression,
  createEmotionAwareReaction,
  detectAnswerEmotion,
} from "../emotion.js";

describe("emotion", () => {
  it("強い痛みをseriousとして判定する", () => {
    const result = detectAnswerEmotion("今、痛みはあるにゃ？", "かなり痛い");
    expect(result).toEqual({ label: "pain", expression: "serious" });
  });

  it("不安をworriedとして判定する", () => {
    const result = detectAnswerEmotion("伝えておきたいことはあるにゃ？", "少し不安です");
    expect(result).toEqual({ label: "anxiety", expression: "worried" });
  });

  it("問題なしをrelievedとして判定する", () => {
    const result = detectAnswerEmotion("痛みはあるにゃ？", "痛みはない");
    expect(result).toEqual({ label: "relief", expression: "relieved" });
  });

  it("強い表情を優先する", () => {
    expect(chooseStrongerExpression("happy", "serious")).toBe("serious");
    expect(chooseStrongerExpression("serious", "relieved")).toBe("serious");
  });

  it("感情に合わせた声かけを返す", () => {
    const pain = detectAnswerEmotion("今、痛みはあるにゃ？", "我慢できないほど痛い");
    expect(createEmotionAwareReaction(pain, "ありがとうにゃ")).toContain(
      "大事な情報"
    );

    const confusion = detectAnswerEmotion("いつごろからにゃ？", "わからない");
    expect(createEmotionAwareReaction(confusion, "ありがとうにゃ")).toContain(
      "わかる範囲"
    );
  });

  it("通常回答ではAIの声かけをそのまま使う", () => {
    const neutral = detectAnswerEmotion("お名前をおしえてにゃ", "田中太郎");
    expect(createEmotionAwareReaction(neutral, "教えてくれてありがとうにゃ♡")).toBe(
      "教えてくれてありがとうにゃ♡"
    );
  });
});
