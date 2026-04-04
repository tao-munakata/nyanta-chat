import { NextResponse } from "next/server";
import { generateReaction } from "@/lib/claude";

export async function POST(request: Request) {
  const { questionText, userAnswer } = (await request.json()) as {
    questionText: string;
    userAnswer: string;
  };

  const result = await generateReaction(questionText, userAnswer);
  return NextResponse.json(result);
}
