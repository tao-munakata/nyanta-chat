"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NyantaFace, { type Expression } from "@/components/NyantaFace";
import ChatBubble from "@/components/ChatBubble";
import ProgressBar from "@/components/ProgressBar";
import InputArea from "@/components/InputArea";
import { QUESTIONS } from "@/lib/questions";

type Message = {
  role: "nyanta" | "user";
  text: string;
};

const WELCOME_MESSAGE =
  "こんにゃちはにゃん！🐾 今日はおうちでお医者さんに来てもらうお話にゃ？\n緊張してるかもだけど、にゃん太が一緒に優しく聞くにゃ♡\n一緒に答えていこっか！";

export default function ChatPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "nyanta", text: WELCOME_MESSAGE },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expression, setExpression] = useState<Expression>("welcome");
  const [disabled, setDisabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // セッション初期化
  useEffect(() => {
    fetch("/nyanta/api/session", { method: "POST" })
      .then((r) => r.json())
      .then((data: { sessionId: string }) => {
        setSessionId(data.sessionId);
        // 少し待ってから最初の質問を表示
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "nyanta", text: QUESTIONS[0].text },
          ]);
        }, 800);
      });
  }, []);

  // メッセージ追加時に最下部へスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAnswer = async (answer: string) => {
    if (!sessionId) return;
    const question = QUESTIONS[currentIndex];

    // ユーザー回答をチャットに追加
    setMessages((prev) => [
      ...prev,
      { role: "user", text: answer === "" ? "（スキップ）" : answer },
    ]);
    setDisabled(true);
    setExpression("thinking");

    // 回答を保存（スキップ時は空文字を保存）
    await fetch("/nyanta/api/session", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save_answer",
        sessionId,
        questionId: question.id,
        answer,
      }),
    });

    // Claudeにリアクションを生成させる（スキップ時は固定リアクション）
    let reaction = "にゃるほどにゃ〜♡ ありがとうにゃん！";
    let nextExpression: Expression = "happy";

    if (answer !== "") {
      const res = await fetch("/nyanta/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: question.text,
          userAnswer: answer,
        }),
      });
      const data = await res.json() as { reaction: string; expression: Expression };
      reaction = data.reaction;
      nextExpression = data.expression;
    }

    const nextIndex = currentIndex + 1;
    const isLast = nextIndex >= QUESTIONS.length;

    // リアクションを表示
    setMessages((prev) => [...prev, { role: "nyanta", text: reaction }]);
    setExpression(nextExpression);

    if (isLast) {
      // 完了処理
      await fetch("/nyanta/api/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", sessionId }),
      });
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "nyanta",
            text: "全部答えてくれてありがとうにゃ♡ これでお医者さんがスムーズに来られるにゃ〜！🐾 まとめを見てにゃん！",
          },
        ]);
        setExpression("encouraging");
      }, 500);
      setTimeout(() => {
        // basePath('/nyanta')はNext.js routerが自動付与するため不要
        router.push(`/complete?session=${sessionId}`);
      }, 3000);
    } else {
      // 次の質問を表示
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "nyanta", text: QUESTIONS[nextIndex].text },
        ]);
        setCurrentIndex(nextIndex);
        setExpression("welcome");
        setDisabled(false);
      }, 600);
    }
  };

  const handleSkip = () => handleAnswer("");

  const currentQuestion = QUESTIONS[currentIndex];
  const isComplete = currentIndex >= QUESTIONS.length;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col max-w-lg mx-auto">
      {/* ヘッダー */}
      <header className="bg-white border-b border-pink-100 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <NyantaFace expression={expression} size={48} />
          <div className="flex-1">
            <h1 className="text-base font-bold text-pink-600">にゃん太先生の問診室</h1>
            <ProgressBar current={currentIndex} total={QUESTIONS.length} />
          </div>
        </div>
      </header>

      {/* チャット履歴 */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} text={msg.text} />
        ))}
        <div ref={bottomRef} />
      </main>

      {/* 入力エリア */}
      {!isComplete && sessionId && (
        <footer className="bg-white border-t border-pink-100 shadow-md">
          <InputArea
            question={currentQuestion}
            onSubmit={handleAnswer}
            onSkip={handleSkip}
            disabled={disabled}
          />
          <p className="text-center text-xs text-slate-400 pb-3 px-4">
            ※ これはにゃん太先生のお手伝いにゃ。本当の診断は訪問のお医者さんにお任せしてね！
          </p>
        </footer>
      )}
    </div>
  );
}
