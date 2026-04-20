"use client";

import { useState, useRef } from "react";
import type { Question } from "@/lib/questions";

type Props = {
  question: Question;
  onSubmit: (answer: string) => boolean | Promise<boolean>;
  onSkip: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  remainingCount: number;
  errorMessage?: string | null;
  disabled: boolean;
};

export default function InputArea({
  question,
  onSubmit,
  onSkip,
  onBack,
  canGoBack = false,
  remainingCount,
  errorMessage,
  disabled,
}: Props) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (question.type === "photo") {
      if (preview) {
        const accepted = await onSubmit(preview);
        if (accepted !== false) setPreview(null);
      }
      return;
    }
    if (text.trim()) {
      const accepted = await onSubmit(text.trim());
      if (accepted !== false) setText("");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      setPreview(b64);
    };
    reader.readAsDataURL(file);
  };

  if (question.type === "select") {
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex min-h-6 items-center justify-between">
          {canGoBack ? (
            <button
              onClick={onBack}
              disabled={disabled}
              className="text-slate-500 text-sm font-medium disabled:opacity-50"
            >
              ← 戻る
            </button>
          ) : (
            <span />
          )}
          <span className="text-xs font-semibold text-pink-500">
            残り{remainingCount}問
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {question.options!.map((opt) => (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => {
                void onSubmit(opt);
              }}
              className="min-h-[60px] bg-white border-2 border-pink-200 rounded-xl px-4 py-3 text-slate-700 text-base font-medium hover:bg-pink-50 hover:border-pink-400 active:bg-pink-100 disabled:opacity-50 transition-colors text-left"
            >
              {opt}
            </button>
          ))}
        </div>
        {question.skippable && (
          <button
            onClick={onSkip}
            disabled={disabled}
            className="text-slate-400 text-sm underline text-center disabled:opacity-50"
          >
            スキップする
          </button>
        )}
      </div>
    );
  }

  if (question.type === "photo") {
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex min-h-6 items-center justify-between">
          {canGoBack ? (
            <button
              onClick={onBack}
              disabled={disabled}
              className="text-slate-500 text-sm font-medium disabled:opacity-50"
            >
              ← 戻る
            </button>
          ) : (
            <span />
          )}
          <span className="text-xs font-semibold text-pink-500">
            残り{remainingCount}問
          </span>
        </div>
        {preview ? (
          <img src={preview} alt="プレビュー" className="max-h-40 rounded-lg object-contain border" />
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={disabled}
            className="min-h-[60px] bg-pink-50 border-2 border-dashed border-pink-300 rounded-xl px-4 py-3 text-pink-500 font-medium hover:bg-pink-100 disabled:opacity-50 transition-colors"
          >
            📷 写真を選ぶにゃ！
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        <div className="flex gap-2">
          {preview && (
            <button
              onClick={handleSubmit}
              disabled={disabled}
              className="flex-1 min-h-[52px] bg-pink-400 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-pink-500 transition-colors"
            >
              これを送るにゃ →
            </button>
          )}
          {question.skippable && (
            <button onClick={onSkip} disabled={disabled} className="text-slate-400 text-sm underline disabled:opacity-50">
              スキップ
            </button>
          )}
        </div>
      </div>
    );
  }

  // text / date
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex min-h-6 items-center justify-between">
        {canGoBack ? (
          <button
            onClick={onBack}
            disabled={disabled}
            className="text-slate-500 text-sm font-medium disabled:opacity-50"
          >
            ← 戻る
          </button>
        ) : (
          <span />
        )}
        <span className="text-xs font-semibold text-pink-500">
          残り{remainingCount}問
        </span>
      </div>
      {question.type === "date" ? (
        <input
          type="date"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 text-base text-slate-700 focus:outline-none focus:border-pink-400 disabled:opacity-50"
        />
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="ここに入力するにゃ..."
          className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 text-base text-slate-700 resize-none focus:outline-none focus:border-pink-400 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit();
            }
          }}
        />
      )}
      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}
      <div className="flex gap-2 items-center">
        {question.skippable && (
          <button onClick={onSkip} disabled={disabled} className="text-slate-400 text-sm underline disabled:opacity-50">
            スキップ
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
          className="ml-auto min-h-[52px] px-8 bg-pink-400 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-pink-500 transition-colors"
        >
          送る →
        </button>
      </div>
    </div>
  );
}
