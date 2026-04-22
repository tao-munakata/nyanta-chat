import Link from "next/link";
import { getSessionAnswers } from "@/lib/db";
import { QUESTIONS, CATEGORIES } from "@/lib/questions";
import { APP_VERSION } from "@/lib/version";
import NyantaFace from "@/components/NyantaFace";
import PrintButton from "@/components/PrintButton";

type Props = { searchParams: Promise<{ session?: string }> };

export default async function CompletePage({ searchParams }: Props) {
  const { session: sessionId } = await searchParams;

  const rawAnswers = sessionId ? getSessionAnswers(sessionId) : [];
  const answerMap = Object.fromEntries(
    rawAnswers.map((a) => [a.question_id, a.answer])
  );

  return (
    <div className="min-h-screen bg-pink-50 max-w-lg mx-auto">
      {/* ヘッダー */}
      <header className="bg-white border-b border-pink-100 px-4 py-4 text-center">
        <NyantaFace expression="encouraging" version="cream" size={64} />
        <h1 className="text-xl font-bold text-pink-600 mt-2">
          問診完了にゃ♡
        </h1>
        <p className="mt-1 text-[10px] font-semibold text-pink-400">
          {APP_VERSION}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          全部答えてくれてありがとうにゃ〜！🐾
        </p>
      </header>

      {/* 回答まとめ */}
      <main className="p-4 flex flex-col gap-4">
        {CATEGORIES.map((cat) => {
          const questions = QUESTIONS.filter((q) => q.category === cat.id);
          const answered = questions.filter((q) => answerMap[q.id]);
          if (answered.length === 0) return null;
          return (
            <section key={cat.id} className="bg-white rounded-2xl shadow-sm p-4">
              <h2 className="text-sm font-bold text-pink-500 mb-3 border-b border-pink-100 pb-2">
                🐾 {cat.label}
              </h2>
              <div className="flex flex-col gap-3">
                {answered.map((q) => (
                  <div key={q.id}>
                    <p className="text-xs text-slate-400 mb-1">{q.text}</p>
                    {answerMap[q.id]?.startsWith("data:image") ? (
                      <img
                        src={answerMap[q.id]}
                        alt="お薬手帳"
                        className="max-h-40 rounded-lg object-contain border"
                      />
                    ) : (
                      <p className="text-sm text-slate-700 font-medium">
                        {answerMap[q.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* アクションボタン */}
        <div className="flex gap-3 mt-2">
          <PrintButton />
          {/* basePath('/nyanta')はNext.js Linkが自動付与する */}
          <Link
            href="/"
            className="flex-1 bg-white border-2 border-pink-200 text-pink-500 rounded-xl py-3 font-semibold hover:bg-pink-50 transition-colors text-center"
          >
            最初からやり直す
          </Link>
        </div>

        <p className="text-center text-xs text-slate-400 pb-4 px-2">
          ※ これはにゃん太先生のお手伝いにゃ。本当の診断・診療は訪問のお医者さんにお任せしてね！
        </p>
      </main>
    </div>
  );
}
