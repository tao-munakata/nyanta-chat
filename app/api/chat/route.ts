import { NextResponse } from "next/server";
import { generateReaction, generateServiceReply } from "@/lib/claude";
import {
  chooseStrongerExpression,
  createEmotionAwareReaction,
  detectAnswerEmotion,
} from "@/lib/emotion";
import { getServiceConfig, type ServiceId } from "@/lib/services";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    questionText?: string;
    userAnswer?: string;
    serviceId?: ServiceId;
    userMessage?: string;
  };

  if (body.serviceId && body.userMessage) {
    const service = getServiceConfig(body.serviceId);
    const result = await generateServiceReply(service.id, body.userMessage);

    return NextResponse.json({
      ...result,
      serviceId: service.id,
    });
  }

  const questionText = body.questionText ?? "";
  const userAnswer = body.userAnswer ?? "";

  const result = await generateReaction(questionText, userAnswer);
  const detected = detectAnswerEmotion(questionText, userAnswer);

  return NextResponse.json({
    ...result,
    reaction: createEmotionAwareReaction(detected, result.reaction),
    expression: chooseStrongerExpression(result.expression, detected.expression),
    emotion: detected.label,
  });
}
