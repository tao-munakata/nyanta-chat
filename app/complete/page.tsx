import Link from "next/link";
import { getSessionAnswers } from "@/lib/db";
import { QUESTIONS, CATEGORIES } from "@/lib/questions";
import { buildImportantPoints, IMPORTANT_POINT_GROUPS } from "@/lib/summary";
import { APP_VERSION } from "@/lib/version";
import CsvDownloadButton from "@/components/CsvDownloadButton";
import NyantaFace from "@/components/NyantaFace";
import PrintButton from "@/components/PrintButton";

type Props = { searchParams: Promise<{ session?: string }> };

export default async function CompletePage({ searchParams }: Props) {
  const { session: sessionId } = await searchParams;

  const rawAnswers = sessionId ? getSessionAnswers(sessionId) : [];
  const answerMap = Object.fromEntries(
    rawAnswers.map((a) => [a.question_id, a.answer])
  );
  const importantPoints = buildImportantPoints(answerMap);
  const toneClass = {
    urgent: "border-red-200 bg-red-50 text-red-600",
    caution: "border-amber-200 bg-amber-50 text-amber-600",
    info: "border-sky-200 bg-sky-50 text-sky-600",
  };

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
        {importantPoints.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-4 border-2 border-pink-100">
            <h2 className="text-sm font-bold text-pink-600 mb-1">
              重要ポイントまとめ
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              診察前に確認してほしい回答を自動でまとめたにゃ
            </p>
            <div className="flex flex-col gap-4">
              {IMPORTANT_POINT_GROUPS.map((group) => {
                const groupPoints = importantPoints.filter(
                  (point) => point.tone === group.tone
                );
                if (groupPoints.length === 0) return null;

                return (
                  <div key={group.tone}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-700">
                          {group.label}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {group.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-400">
                        {groupPoints.length}件
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {groupPoints.map((point) => (
                        <div
                          key={point.id}
                          className={`rounded-xl border px-3 py-2 ${toneClass[point.tone]}`}
                        >
                          <div className="text-xs font-bold">{point.label}</div>
                          <p className="mt-1 text-xs text-slate-500">
                            {point.question}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {point.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
        <div className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-3">
          <PrintButton />
          <CsvDownloadButton sessionId={sessionId} />
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
