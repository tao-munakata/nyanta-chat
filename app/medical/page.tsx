"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NyantaFace, {
  type CharacterVersion,
  type Expression,
} from "@/components/NyantaFace";
import ChatBubble from "@/components/ChatBubble";
import ProgressBar from "@/components/ProgressBar";
import InputArea from "@/components/InputArea";
import { QUESTIONS, type Question } from "@/lib/questions";
import { APP_VERSION } from "@/lib/version";

type Message = {
  role: "nyanta" | "user";
  text: string;
  expression?: Expression;
  version?: CharacterVersion;
};

const WELCOME_MESSAGE =
  "こんにゃちはにゃん！🐾 今日はおうちでお医者さんに来てもらうお話にゃ？\n緊張してるかもだけど、にゃん太が一緒に優しく聞くにゃ♡\n一緒に答えていこっか！";

const SESSION_STORAGE_KEY = "nyanta-medical-current-session";

const CHARACTER_BY_CATEGORY: Record<string, CharacterVersion> = {
  basic: "doctor",
  symptoms: "pink",
  history: "gray",
  medication: "calico",
  adl: "tabby",
  home: "brown",
  wishes: "cream",
};

const getCharacterVersion = (
  questions: Question[],
  questionIndex: number
): CharacterVersion =>
  CHARACTER_BY_CATEGORY[questions[questionIndex]?.category] ?? "doctor";

function validatePhoneNumber(answer: string): string | null {
  const normalized = answer
    .replace(/[０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    )
    .replace(/[‐‑‒–—ー−]/g, "-")
    .trim();

  if (/[^0-9\s\-()（）]/.test(normalized)) {
    return "電話番号は数字、ハイフン、空白、括弧だけで入力してにゃ";
  }

  const digits = normalized.replace(/\D/g, "");

  if (digits.length !== 10 && digits.length !== 11) {
    return "電話番号は数字だけで10桁または11桁にしてにゃ";
  }

  if (!digits.startsWith("0")) {
    return "日本の電話番号は通常0から始まる番号を入力してにゃ";
  }

  if (/^(\d)\1+$/.test(digits) || /^0(\d)\1+$/.test(digits)) {
    return "同じ数字だけの番号は使えないにゃ";
  }

  const dummyNumbers = new Set([
    "0000000000",
    "00000000000",
    "0123456789",
    "01234567890",
    "09012345678",
    "08012345678",
    "07012345678",
  ]);

  if (
    dummyNumbers.has(digits) ||
    "01234567890123456789".includes(digits) ||
    "98765432109876543210".includes(digits)
  ) {
    return "連番やテスト用のような番号は使えないにゃ";
  }

  return null;
}

function validateBirthDate(answer: string): string | null {
  const normalized = answer
    .normalize("NFKC")
    .replace(/\s/g, "")
    .trim();

  const compactMatch = normalized.match(/^(\d{4})(\d{2})(\d{2})$/);
  const separatedParts = normalized.split(/\D+/).filter(Boolean);

  if (!compactMatch && separatedParts.length !== 3) {
    return "生年月日は 19500101 または 1950-01-01 のように入力してにゃ";
  }

  const [, compactYear, compactMonth, compactDay] = compactMatch ?? [];
  const [yearText, monthText, dayText] = compactMatch
    ? [compactYear, compactMonth, compactDay]
    : separatedParts;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return "存在しない日付は入力できないにゃ";
  }

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const oldestAllowedDate = new Date(
    todayDate.getFullYear() - 120,
    todayDate.getMonth(),
    todayDate.getDate()
  );

  if (birthDate > todayDate) {
    return "未来の日付は生年月日にできないにゃ";
  }

  if (birthDate < oldestAllowedDate) {
    return "生年月日は120歳以内の日付で入力してにゃ";
  }

  return null;
}

export default function ChatPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "nyanta", text: WELCOME_MESSAGE, expression: "welcome" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expression, setExpression] = useState<Expression>("welcome");
  const [disabled, setDisabled] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // セッション初期化
  useEffect(() => {
    const showQuestion = (
      questionIndex: number,
      currentMessages: Message[],
      currentQuestions: Question[]
    ) => {
      setTimeout(() => {
        setMessages([
          ...currentMessages,
          {
            role: "nyanta",
            text: currentQuestions[questionIndex].text,
            expression: "welcome",
            version: getCharacterVersion(currentQuestions, questionIndex),
          },
        ]);
      }, 800);
    };

    const loadQuestions = async (): Promise<Question[]> => {
      const response = await fetch("/nyanta/api/questions");
      if (!response.ok) return QUESTIONS;

      const data = (await response.json()) as { questions: Question[] };
      setQuestions(data.questions);
      return data.questions;
    };

    const createNewSession = async (currentQuestions: Question[]) => {
      const response = await fetch("/nyanta/api/session", { method: "POST" });
      const data = (await response.json()) as { sessionId: string };
      window.localStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
      setSessionId(data.sessionId);
      showQuestion(0, [
        { role: "nyanta", text: WELCOME_MESSAGE, expression: "welcome" },
      ], currentQuestions);
    };

    const initSession = async () => {
      const currentQuestions = await loadQuestions();
      const storedSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);

      if (storedSessionId) {
        const response = await fetch(
          `/nyanta/api/session?session=${storedSessionId}`
        );

        if (response.ok) {
          const data = (await response.json()) as {
            session: { status: string };
            answers: { question_id: string; answer: string }[];
          };

          if (data.session.status === "complete") {
            window.localStorage.removeItem(SESSION_STORAGE_KEY);
          } else {
            const nextIndex = Math.min(
              data.answers.length,
              currentQuestions.length - 1
            );
            const resumedMessages: Message[] = [
              { role: "nyanta", text: WELCOME_MESSAGE, expression: "welcome" },
              {
                role: "nyanta",
                text: "前回の続きから再開するにゃ。保存していたところから進めるにゃん♡",
                expression: "encouraging",
                version: getCharacterVersion(currentQuestions, nextIndex),
              },
            ];

            setSessionId(storedSessionId);
            setCurrentIndex(nextIndex);
            showQuestion(nextIndex, resumedMessages, currentQuestions);
            return;
          }
        } else {
          window.localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }

      await createNewSession(currentQuestions);
    };

    initSession();
  }, []);

  // メッセージ追加時に最下部へスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAnswer = async (answer: string): Promise<boolean> => {
    if (!sessionId) return false;
    const question = questions[currentIndex];
    setInputError(null);

    if (question.id === "basic-dob") {
      const birthDateError = validateBirthDate(answer);
      if (birthDateError) {
        setInputError(birthDateError);
        setExpression("serious");
        return false;
      }
    }

    if (question.id === "basic-phone") {
      const phoneError = validatePhoneNumber(answer);
      if (phoneError) {
        setInputError(phoneError);
        setExpression("serious");
        return false;
      }
    }

    // ユーザー回答をチャットに追加
    setMessages((prev) => [
      ...prev,
      { role: "user", text: answer === "" ? "（スキップ）" : answer },
    ]);
    setDisabled(true);
    setExpression("thinking");

    // 回答を保存（スキップ時は空文字を保存）
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
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
    const isLast = nextIndex >= questions.length;

    // リアクションを表示
    setMessages((prev) => [
      ...prev,
      {
            role: "nyanta",
            text: reaction,
            expression: nextExpression,
            version: getCharacterVersion(questions, currentIndex),
          },
        ]);
    setExpression(nextExpression);

    if (isLast) {
      // 完了処理
      await fetch("/nyanta/api/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", sessionId }),
      });
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "nyanta",
            text: "全部答えてくれてありがとうにゃ♡ これでお医者さんがスムーズに来られるにゃ〜！🐾 まとめを見てにゃん！",
            expression: "encouraging",
            version: "cream",
          },
        ]);
        setExpression("encouraging");
      }, 500);
      setTimeout(() => {
        // basePath('/nyanta')はNext.js routerが自動付与するため不要
        router.push(`/medical/complete?session=${sessionId}`);
      }, 3000);
    } else {
      // 次の質問を表示
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "nyanta",
            text: questions[nextIndex].text,
            expression: "welcome",
            version: getCharacterVersion(questions, nextIndex),
          },
        ]);
        setCurrentIndex(nextIndex);
        setExpression("welcome");
        setInputError(null);
        setDisabled(false);
      }, 600);
    }

    return true;
  };

  const handleSkip = () => handleAnswer("");

  const handleBack = () => {
    if (disabled || currentIndex === 0) return;

    const previousIndex = currentIndex - 1;
    if (sessionId) {
      fetch("/nyanta/api/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_answer",
          sessionId,
          questionId: questions[previousIndex].id,
        }),
      });
    }

    setMessages((prev) => prev.slice(0, Math.max(2, prev.length - 3)));
    setCurrentIndex(previousIndex);
    setInputError(null);
    setExpression("welcome");
  };

  const currentQuestion = questions[currentIndex];
  const currentCharacterVersion = getCharacterVersion(questions, currentIndex);
  const isComplete = currentIndex >= questions.length;

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
          <NyantaFace
            expression={expression}
            version={currentCharacterVersion}
            size={48}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-base font-bold text-pink-600">nyanta-medical 問診票</h1>
              <div className="flex items-center gap-2">
                <Link
                  href="/medical/questions"
                  className="shrink-0 rounded-full border border-pink-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-pink-500 transition-colors hover:bg-pink-50"
                >
                  質問を変える
                </Link>
                <span className="shrink-0 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-400">
                  {APP_VERSION}
                </span>
              </div>
            </div>
            <ProgressBar current={currentIndex} total={questions.length} />
          </div>
        </div>
      </header>

      {/* チャット履歴 */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 relative z-10">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            text={msg.text}
            expression={msg.expression}
            version={msg.version}
          />
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
            remainingCount={questions.length - currentIndex}
            errorMessage={inputError}
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
