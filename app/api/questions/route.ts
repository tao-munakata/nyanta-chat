import { NextResponse } from "next/server";
import {
  deleteQuestionOverride,
  getQuestionOverrides,
  saveQuestionOverride,
} from "@/lib/db";
import { applyQuestionOverrides, QUESTIONS } from "@/lib/questions";

export async function GET() {
  const overrides = getQuestionOverrides();
  const questions = applyQuestionOverrides(QUESTIONS, overrides);

  return NextResponse.json({ questions, overrides });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    questionId?: string;
    text?: string;
  };

  if (!body.questionId || typeof body.text !== "string") {
    return NextResponse.json({ error: "questionId and text are required" }, { status: 400 });
  }

  const baseQuestion = QUESTIONS.find((question) => question.id === body.questionId);
  if (!baseQuestion) {
    return NextResponse.json({ error: "question not found" }, { status: 404 });
  }

  const normalizedText = body.text.trim();
  if (!normalizedText) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (normalizedText === baseQuestion.text) {
    deleteQuestionOverride(body.questionId);
  } else {
    saveQuestionOverride(body.questionId, normalizedText);
  }

  const overrides = getQuestionOverrides();
  return NextResponse.json({
    ok: true,
    questions: applyQuestionOverrides(QUESTIONS, overrides),
    overrides,
  });
}
