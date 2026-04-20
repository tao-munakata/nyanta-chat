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
  expression?: Expression;
};

const WELCOME_MESSAGE =
  "こんにゃちはにゃん！🐾 今日はおうちでお医者さんに来てもらうお話にゃ？\n緊張してるかもだけど、にゃん太が一緒に優しく聞くにゃ♡\n一緒に答えていこっか！";

export default function ChatPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "nyanta", text: WELCOME_MESSAGE, expression: "welcome" },
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
            { role: "nyanta", text: QUESTIONS[0].text, expression: "welcome" },
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
    setMessages((prev) => [...prev, { role: "nyanta", text: reaction, expression: nextExpression }]);
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
            expression: "encouraging",
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
          { role: "nyanta", text: QUESTIONS[nextIndex].text, expression: "welcome" },
        ]);
        setCurrentIndex(nextIndex);
        setExpression("welcome");
        setDisabled(false);
      }, 600);
    }
  };

  const handleSkip = () => handleAnswer("");

  const handleBack = () => {
    if (disabled || currentIndex === 0) return;

    setMessages((prev) => prev.slice(0, Math.max(2, prev.length - 3)));
    setCurrentIndex((prev) => prev - 1);
    setExpression("welcome");
  };

  const currentQuestion = QUESTIONS[currentIndex];
  const isComplete = currentIndex >= QUESTIONS.length;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col max-w-lg mx-auto relative overflow-hidden">
      {/* 背景猫イラスト */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-0">
        <svg
          viewBox="0 0 200 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-52 h-52 opacity-20"
          aria-hidden="true"
        >
          {/* 耳（左） */}
          <polygon points="38,70 58,30 78,70" fill="#f9a8d4" />
          <polygon points="46,68 58,42 70,68" fill="#fce7f3" />
          {/* 耳（右） */}
          <polygon points="122,70 142,30 162,70" fill="#f9a8d4" />
          <polygon points="130,68 142,42 154,68" fill="#fce7f3" />
          {/* 頭 */}
          <ellipse cx="100" cy="95" rx="62" ry="58" fill="#f9a8d4" />
          {/* 顔 */}
          <ellipse cx="100" cy="98" rx="54" ry="50" fill="#fce7f3" />
          {/* 目（左） */}
          <ellipse cx="80" cy="90" rx="10" ry="12" fill="#4a2c6e" />
          <ellipse cx="83" cy="87" rx="4" ry="4" fill="white" />
          <ellipse cx="77" cy="96" rx="2" ry="2" fill="white" />
          {/* 目（右） */}
          <ellipse cx="120" cy="90" rx="10" ry="12" fill="#4a2c6e" />
          <ellipse cx="123" cy="87" rx="4" ry="4" fill="white" />
          <ellipse cx="117" cy="96" rx="2" ry="2" fill="white" />
          {/* 鼻 */}
          <ellipse cx="100" cy="108" rx="5" ry="4" fill="#f472b6" />
          {/* 口 */}
          <path d="M94,112 Q100,120 106,112" stroke="#f472b6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* ひげ（左） */}
          <line x1="42" y1="106" x2="88" y2="110" stroke="#f9a8d4" strokeWidth="2" />
          <line x1="42" y1="112" x2="88" y2="112" stroke="#f9a8d4" strokeWidth="2" />
          <line x1="48" y1="118" x2="88" y2="114" stroke="#f9a8d4" strokeWidth="2" />
          {/* ひげ（右） */}
          <line x1="112" y1="110" x2="158" y2="106" stroke="#f9a8d4" strokeWidth="2" />
          <line x1="112" y1="112" x2="158" y2="112" stroke="#f9a8d4" strokeWidth="2" />
          <line x1="112" y1="114" x2="152" y2="118" stroke="#f9a8d4" strokeWidth="2" />
          {/* 胴体 */}
          <ellipse cx="100" cy="175" rx="52" ry="48" fill="#f9a8d4" />
          {/* お腹 */}
          <ellipse cx="100" cy="178" rx="34" ry="34" fill="#fce7f3" />
          {/* 前脚（左） */}
          <ellipse cx="62" cy="210" rx="16" ry="12" fill="#f9a8d4" />
          <ellipse cx="56" cy="216" rx="5" ry="4" fill="#fce7f3" />
          <ellipse cx="63" cy="219" rx="5" ry="4" fill="#fce7f3" />
          <ellipse cx="70" cy="216" rx="5" ry="4" fill="#fce7f3" />
          {/* 前脚（右） */}
          <ellipse cx="138" cy="210" rx="16" ry="12" fill="#f9a8d4" />
          <ellipse cx="130" cy="216" rx="5" ry="4" fill="#fce7f3" />
          <ellipse cx="137" cy="219" rx="5" ry="4" fill="#fce7f3" />
          <ellipse cx="144" cy="216" rx="5" ry="4" fill="#fce7f3" />
          {/* しっぽ */}
          <path d="M148,185 Q185,160 178,130 Q172,115 160,120" stroke="#f9a8d4" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M148,185 Q185,160 178,130 Q172,115 160,120" stroke="#fce7f3" strokeWidth="7" fill="none" strokeLinecap="round" />
        </svg>
      </div>

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
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 relative z-10">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} text={msg.text} expression={msg.expression} />
        ))}
        <div ref={bottomRef} />
      </main>

      {/* 入力エリア */}
      {!isComplete && sessionId && (
        <footer className="bg-white border-t border-pink-100 shadow-md relative z-10">
          <InputArea
            key={currentQuestion.id}
            question={currentQuestion}
            onSubmit={handleAnswer}
            onSkip={handleSkip}
            onBack={handleBack}
            canGoBack={currentIndex > 0}
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
