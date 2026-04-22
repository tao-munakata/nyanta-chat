import { getSessionAnswers } from "@/lib/db";
import { buildAnswersCsv, buildCsvRows } from "@/lib/csv";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session");

  if (!sessionId) {
    return new Response("session is required", { status: 400 });
  }

  const answerMap = Object.fromEntries(
    getSessionAnswers(sessionId).map((answer) => [
      answer.question_id,
      answer.answer,
    ])
  );
  const csv = buildAnswersCsv(buildCsvRows(answerMap));

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nyanta-answers-${sessionId}.csv"`,
    },
  });
}
