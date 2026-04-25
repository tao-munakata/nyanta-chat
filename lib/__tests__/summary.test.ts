import { describe, expect, it } from "vitest";
import { buildImportantPoints, buildVisitSummaryCard } from "../summary.js";
import { applyQuestionOverrides, QUESTIONS } from "../questions.js";

describe("summary", () => {
  it("痛みやアレルギーなどの重要項目を抽出する", () => {
    const points = buildImportantPoints({
      "symptoms-pain": "かなり痛い",
      "med-allergy": "ある",
      "adl-walk": "車椅子を使う",
    });

    expect(points.map((point) => point.label)).toEqual([
      "痛み",
      "アレルギー・副作用",
      "生活動作・介助",
    ]);
    expect(points[0].tone).toBe("urgent");
  });

  it("問題ない回答は重要ポイントに出しすぎない", () => {
    const points = buildImportantPoints({
      "symptoms-pain": "痛みはない",
      "med-allergy": "ない",
      "home-parking": "ある",
      "home-access": "ない・フラット",
    });

    expect(points).toHaveLength(0);
  });

  it("訪問前サマリーカードを組み立てる", () => {
    const answerMap = {
      "symptoms-main": "足のむくみが続いている",
      "symptoms-pain": "かなり痛い",
      "adl-walk": "車椅子を使う",
      "adl-family": "妻と同居",
      "wishes-visit": "来週の午前中",
    };
    const points = buildImportantPoints(answerMap);
    const card = buildVisitSummaryCard(answerMap, points);

    expect(card.headline).toContain("足のむくみ");
    expect(card.sections).toHaveLength(4);
    expect(card.sections[1].body).toContain("痛み");
    expect(card.sections[2].body).toContain("車椅子");
  });

  it("質問上書きを重要ポイントの文言に反映する", () => {
    const questions = applyQuestionOverrides(QUESTIONS, {
      "symptoms-main": "いちばん困っていることを教えてにゃ",
    });

    const points = buildImportantPoints(
      {
        "symptoms-main": "足のむくみが続いている",
      },
      questions
    );

    expect(points[0].question).toBe("いちばん困っていることを教えてにゃ");
  });
});
