"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import NyantaFace, { type Expression } from "@/components/NyantaFace";
import type { ServiceConfig } from "@/lib/services";
import { APP_VERSION } from "@/lib/version";
import { withBasePath } from "@/lib/paths";

type Message = {
  role: "nyanta" | "user";
  text: string;
  expression?: Expression;
};

type Props = {
  service: ServiceConfig;
};

export default function FreeChatPage({ service }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "nyanta",
      text: service.welcomeMessage,
      expression: service.expression,
    },
  ]);
  const [text, setText] = useState("");
  const [expression, setExpression] = useState<Expression>(service.expression);
  const [disabled, setDisabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, messages.length]);

  const submitMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || disabled) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setText("");
    setDisabled(true);
    setExpression("thinking");

    try {
      const response = await fetch(withBasePath("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          userMessage: trimmed,
        }),
      });
      const data = (await response.json()) as {
        reaction: string;
        expression: Expression;
      };
      setMessages((prev) => [
        ...prev,
        {
          role: "nyanta",
          text: data.reaction,
          expression: data.expression,
        },
      ]);
      setExpression(data.expression);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "nyanta",
          text: service.fallbackReaction,
          expression: service.expression,
        },
      ]);
      setExpression(service.expression);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className={`min-h-screen ${service.bgClass} flex flex-col max-w-lg mx-auto`}>
      <header className={`sticky top-0 z-10 border-b ${service.borderClass} bg-white px-4 py-3 shadow-sm`}>
        <div className="flex items-center gap-3">
          <NyantaFace
            expression={expression}
            version={service.character}
            size={52}
            speaking={disabled}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className={`text-[11px] font-bold uppercase ${service.textClass}`}>
                  {service.themeLabel}
                </p>
                <h1 className={`text-base font-bold ${service.textClass}`}>
                  {service.name}
                </h1>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${service.bgClass} ${service.textClass}`}>
                {APP_VERSION}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {service.description}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((message, index) => (
          <ChatBubble
            key={`${message.role}-${index}`}
            role={message.role}
            text={message.text}
            expression={message.expression}
            version={service.character}
          />
        ))}
        <div ref={bottomRef} />
      </main>

      <footer className={`border-t ${service.borderClass} bg-white px-4 py-3 shadow-md`}>
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {service.quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => void submitMessage(reply)}
              disabled={disabled}
              className={`shrink-0 rounded-full border ${service.borderClass} px-3 py-2 text-xs font-semibold ${service.textClass} disabled:opacity-50`}
            >
              {reply}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={disabled}
            rows={2}
            placeholder={service.placeholder}
            className={`min-h-[56px] flex-1 resize-none rounded-xl border-2 ${service.borderClass} px-3 py-3 text-base text-slate-700 outline-none transition focus:ring-2 disabled:opacity-50`}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submitMessage(text);
              }
            }}
          />
          <button
            type="button"
            onClick={() => void submitMessage(text)}
            disabled={disabled || !text.trim()}
            className={`w-20 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 ${service.buttonClass}`}
          >
            送る
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Link href="/" className="text-xs font-semibold text-slate-400 underline">
            サービス一覧
          </Link>
          <p className="text-right text-[11px] leading-5 text-slate-400">
            {service.disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
