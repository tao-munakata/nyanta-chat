"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-1 bg-pink-400 text-white rounded-xl py-3 font-semibold hover:bg-pink-500 transition-colors"
    >
      印刷する
    </button>
  );
}
