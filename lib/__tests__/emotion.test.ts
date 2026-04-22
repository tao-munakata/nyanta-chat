import { describe, expect, it } from "vitest";
import {
  chooseStrongerExpression,
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
});
