import { CATEGORIES, QUESTIONS, type Question } from "@/lib/questions";

export type CsvRow = {
  category: string;
  question: string;
  answer: string;
};

export type AnswerMap = Record<string, string | undefined>;

const escapeCsv = (value: string): string => `"${value.replace(/"/g, '""')}"`;

export function buildCsvRows(
  answerMap: AnswerMap,
  questions: Question[] = QUESTIONS
): CsvRow[] {
  return CATEGORIES.flatMap((category) =>
    questions
      .filter((question) => question.category === category.id)
      .filter((question) => answerMap[question.id])
      .map((question) => ({
        category: category.label,
        question: question.text,
        answer: answerMap[question.id]!.startsWith("data:image")
          ? "画像あり"
          : answerMap[question.id]!,
      }))
  );
}

export function buildAnswersCsv(rows: CsvRow[]): string {
  return [
    ["カテゴリ", "質問", "回答"],
    ...rows.map((row) => [row.category, row.question, row.answer]),
  ]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");
}
