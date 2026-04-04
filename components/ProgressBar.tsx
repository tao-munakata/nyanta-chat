type Props = {
  current: number;  // 0-based index
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const remaining = total - current;
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-2">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className="text-sm">
            {i < current ? "🐾" : "○"}
          </span>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        {remaining > 0
          ? `あと${remaining}問にゃ！`
          : "最後の質問にゃ♡"}
      </p>
    </div>
  );
}
