import { NextResponse } from "next/server";
import { createSession, saveAnswer, completeSession } from "@/lib/db";

// POST: 新しいセッションを作成
export async function POST() {
  const sessionId = createSession();
  return NextResponse.json({ sessionId });
}

// PUT: 回答保存 or セッション完了
export async function PUT(request: Request) {
  const body = await request.json();

  if (body.action === "save_answer") {
    const { sessionId, questionId, answer } = body as {
      sessionId: string;
      questionId: string;
      answer: string;
    };
    saveAnswer(sessionId, questionId, answer);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "complete") {
    const { sessionId } = body as { sessionId: string };
    completeSession(sessionId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "invalid action" }, { status: 400 });
}
