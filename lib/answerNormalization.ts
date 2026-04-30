export function normalizeFullWidthAscii(answer: string): string {
  return answer
    .replace(/[！-～]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    )
    .replace(/　/g, " ");
}

export function normalizeAnswerForStorage(
  questionId: string,
  answer: string
): string {
  const normalized = normalizeFullWidthAscii(answer).trim();

  if (questionId === "basic-dob" || questionId === "basic-phone") {
    return normalized.replace(/[‐‑‒–—ー−]/g, "-");
  }

  return normalized;
}
