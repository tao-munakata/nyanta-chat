import { NextResponse } from "next/server";
import {
  completeSession,
  createSession,
  deleteAnswer,
  getSession,
  getSessionAnswers,
  saveAnswer,
} from "@/lib/db";
import { normalizeAnswerForStorage } from "@/lib/answerNormalization";

// GET: 既存セッションを取得
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session");

  if (!sessionId) {
    return NextResponse.json({ error: "session is required" }, { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "session not found" }, { status: 404 });
  }

  return NextResponse.json({
    session,
    answers: getSessionAnswers(sessionId),
  });
}

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
    saveAnswer(
      sessionId,
      questionId,
      normalizeAnswerForStorage(questionId, answer)
    );
    return NextResponse.json({ ok: true });
  }

  if (body.action === "complete") {
    const { sessionId } = body as { sessionId: string };
    completeSession(sessionId);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "delete_answer") {
    const { sessionId, questionId } = body as {
      sessionId: string;
      questionId: string;
    };
    deleteAnswer(sessionId, questionId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "invalid action" }, { status: 400 });
}
