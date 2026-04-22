import Link from "next/link";
import { getSessionAnswers } from "@/lib/db";
import { buildAnswersCsv, buildCsvRows } from "@/lib/csv";
import { APP_VERSION } from "@/lib/version";
import CsvCopyButton from "@/components/CsvCopyButton";

type Props = { searchParams: Promise<{ session?: string }> };

export default async function CsvPage({ searchParams }: Props) {
  const { session: sessionId } = await searchParams;
  const answerMap = Object.fromEntries(
    sessionId
      ? getSessionAnswers(sessionId).map((answer) => [
          answer.question_id,
          answer.answer,
        ])
      : []
  );
  const rows = buildCsvRows(answerMap);
  const csv = buildAnswersCsv(rows);
  const downloadHref = sessionId
    ? `/nyanta/api/session/csv?session=${encodeURIComponent(sessionId)}`
    : "/";

  return (
    <div className="min-h-screen bg-pink-50 max-w-lg mx-auto">
      <header className="bg-white border-b border-pink-100 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-pink-600">CSV保存</h1>
          <span className="shrink-0 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-400">
            {APP_VERSION}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          回答内容をCSV形式で確認できます。
        </p>
      </header>

      <main className="p-4 flex flex-col gap-4">
        <section className="bg-white rounded-2xl shadow-sm p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-pink-500">
              CSVデータ
            </h2>
            <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-400">
              {rows.length}件
            </span>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-700 border border-slate-100">
            {csv}
          </pre>
        </section>

        <div className="grid grid-cols-1 gap-3">
          <a
            href={downloadHref}
            download
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-500 text-white rounded-xl py-3 font-semibold hover:bg-emerald-600 transition-colors text-center"
          >
            CSVファイル保存
          </a>
          <CsvCopyButton csv={csv} />
          <Link
            href={sessionId ? `/complete?session=${sessionId}` : "/"}
            className="bg-white border-2 border-pink-200 text-pink-500 rounded-xl py-3 font-semibold hover:bg-pink-50 transition-colors text-center"
          >
            戻る
          </Link>
        </div>
        <p className="text-center text-xs text-slate-400">
          保存できない場合はCSVをコピーして、メモ帳やExcelに貼り付けてください。
        </p>
      </main>
    </div>
  );
}
