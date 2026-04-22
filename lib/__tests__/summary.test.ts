import { describe, expect, it } from "vitest";
import { buildImportantPoints } from "../summary.js";

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
});
