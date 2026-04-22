"use client";

import { useState } from "react";

type Props = {
  csv: string;
};

export default function CsvCopyButton({ csv }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="bg-emerald-500 text-white rounded-xl py-3 font-semibold hover:bg-emerald-600 transition-colors text-center"
    >
      {copied ? "コピーしました" : "CSVをコピー"}
    </button>
  );
}
