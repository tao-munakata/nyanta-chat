import { NextResponse } from "next/server";
import { generateReaction } from "@/lib/claude";
import { chooseStrongerExpression, detectAnswerEmotion } from "@/lib/emotion";

export async function POST(request: Request) {
  const { questionText, userAnswer } = (await request.json()) as {
    questionText: string;
    userAnswer: string;
  };

  const result = await generateReaction(questionText, userAnswer);
  const detected = detectAnswerEmotion(questionText, userAnswer);

  return NextResponse.json({
    ...result,
    expression: chooseStrongerExpression(result.expression, detected.expression),
    emotion: detected.label,
  });
}
