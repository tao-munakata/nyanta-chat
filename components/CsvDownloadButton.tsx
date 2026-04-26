type Props = {
  sessionId?: string;
};

export default function CsvDownloadButton({ sessionId }: Props) {
  if (!sessionId) {
    return (
      <button
        type="button"
        disabled
        className="flex-1 bg-emerald-200 text-white rounded-xl py-3 font-semibold"
      >
        CSV保存
      </button>
    );
  }

  return (
    <a
      href={`/nyanta/medical/csv?session=${encodeURIComponent(sessionId)}`}
      className="flex-1 bg-emerald-500 text-white rounded-xl py-3 font-semibold hover:bg-emerald-600 transition-colors text-center"
    >
      CSV保存
    </a>
  );
}
