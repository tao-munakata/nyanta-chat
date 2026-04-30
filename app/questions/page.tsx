"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NyantaFace from "@/components/NyantaFace";
import { APP_VERSION } from "@/lib/version";
import { CATEGORIES, QUESTIONS, type Question } from "@/lib/questions";
import { withBasePath } from "@/lib/paths";

type QuestionApiResponse = {
  questions: Question[];
  overrides: Record<string, string>;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await fetch(withBasePath("/api/questions"));
      if (!response.ok) return;

      const data = (await response.json()) as QuestionApiResponse;
      setQuestions(data.questions);
      setDrafts(
        Object.fromEntries(data.questions.map((question) => [question.id, question.text]))
      );
    };

    loadQuestions();
  }, []);

  const questionsByCategory = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        questions: questions.filter((question) => question.category === category.id),
      })),
    [questions]
  );

  const handleSave = async (questionId: string) => {
    setSavingId(questionId);
    setMessage(null);

    const response = await fetch(withBasePath("/api/questions"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        text: drafts[questionId] ?? "",
      }),
    });

    if (!response.ok) {
      setMessage("保存できなかったにゃ。もう一度ためしてみてにゃ。");
      setSavingId(null);
      return;
    }

    const data = (await response.json()) as QuestionApiResponse & { ok: true };
    setQuestions(data.questions);
    setDrafts(
      Object.fromEntries(data.questions.map((question) => [question.id, question.text]))
    );
    setMessage("質問文を保存したにゃ。次の問診から反映されるにゃ。");
    setSavingId(null);
  };

  return (
    <div className="min-h-screen bg-pink-50 max-w-lg mx-auto">
      <header className="bg-white border-b border-pink-100 px-4 py-4 text-center">
        <NyantaFace expression="thinking" version="doctor" size={64} />
        <h1 className="mt-2 text-xl font-bold text-pink-600">質問編集ページ</h1>
        <p className="mt-1 text-[10px] font-semibold text-pink-400">
          {APP_VERSION}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          完了画面みたいに見ながら、質問文を差し替えられるにゃ。
        </p>
      </header>

      <main className="p-4 flex flex-col gap-4">
        <section className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm">
          <div className="bg-pink-500 px-4 py-3 text-white">
            <div className="text-xs font-semibold uppercase tracking-wide">
              Question Editor
            </div>
            <h2 className="mt-1 text-base font-bold">質問の差し替え管理</h2>
            <p className="mt-2 text-sm leading-6 text-pink-50">
              語尾や説明を調整して、デモ向けの見せ方を整えられるにゃ。
            </p>
          </div>
          <div className="grid gap-px bg-pink-100 sm:grid-cols-2">
            <div className="bg-white px-4 py-4">
              <div className="text-xs font-bold text-pink-500">反映先</div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                問診画面、完了画面、CSV出力に反映するにゃ。
              </p>
            </div>
            <div className="bg-white px-4 py-4">
              <div className="text-xs font-bold text-pink-500">使い方</div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                質問ごとに編集して保存。保存し直せば何度でも変えられるにゃ。
              </p>
            </div>
          </div>
        </section>

        {message && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </section>
        )}

        {questionsByCategory.map((category) => (
          <section key={category.id} className="bg-white rounded-2xl shadow-sm p-4 border border-pink-100">
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-pink-100 pb-2">
              <h2 className="text-sm font-bold text-pink-500">{category.label}</h2>
              <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-400">
                {category.questions.length}問
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {category.questions.map((question, index) => (
                <article key={question.id} className="rounded-xl border border-pink-100 bg-pink-50/40 p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold text-pink-400">
                        {index + 1}. {question.id}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {question.type === "select"
                          ? `選択式${question.options ? ` (${question.options.join(" / ")})` : ""}`
                          : question.type === "photo"
                            ? "画像アップロード"
                            : question.type === "date"
                              ? "日付入力"
                              : "自由入力"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSave(question.id)}
                      disabled={savingId === question.id}
                      className="shrink-0 rounded-xl bg-pink-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
                    >
                      {savingId === question.id ? "保存中..." : "保存"}
                    </button>
                  </div>
                  <textarea
                    value={drafts[question.id] ?? question.text}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [question.id]: event.target.value,
                      }))
                    }
                    rows={4}
                    className="min-h-[112px] w-full rounded-xl border border-pink-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  />
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/medical"
            className="bg-white border-2 border-pink-200 text-pink-500 rounded-xl py-3 font-semibold hover:bg-pink-50 transition-colors text-center"
          >
            問診に戻る
          </Link>
          <Link
            href="/medical/complete"
            className="bg-pink-500 text-white rounded-xl py-3 font-semibold hover:bg-pink-600 transition-colors text-center"
          >
            完了画面を見る
          </Link>
        </div>
      </main>
    </div>
  );
}
