import { describe, expect, it } from "vitest";
import { normalizeAnswerForStorage } from "../answerNormalization";

describe("normalizeAnswerForStorage", () => {
  it("converts full-width numbers to half-width before storage", () => {
    expect(normalizeAnswerForStorage("basic-dob", "１９５０-０１-０１")).toBe(
      "1950-01-01"
    );
  });

  it("converts phone numbers and common separators to half-width", () => {
    expect(normalizeAnswerForStorage("basic-phone", "０９０ー１２３４ー５６７８")).toBe(
      "090-1234-5678"
    );
  });

  it("keeps Japanese text while converting full-width ASCII", () => {
    expect(normalizeAnswerForStorage("symptoms-main", "頭痛が３日あります")).toBe(
      "頭痛が3日あります"
    );
  });
});
