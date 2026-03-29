/**
 * @file src/app/chat/page.tsx
 * @description Chat interface page for the AI-powered course assistant
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_OPENCLAW_URL || "http://openclaw.local:18789";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Mode = "qa" | "pair_programming" | "exam_prep";

const MODE_CONFIG: Record<Mode, { label: string; icon: string; desc: string }> =
  {
    qa: {
      label: "Q&A",
      icon: "💬",
      desc: "Ask anything about your course",
    },
    pair_programming: {
      label: "Pair Code",
      icon: "⌨️",
      desc: "Code together with course context",
    },
    exam_prep: {
      label: "Exam Prep",
      icon: "📝",
      desc: "Practice questions & review",
    },
  };

function ChatInner() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course") || "CS-101";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("qa");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${GATEWAY_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          message: text,
          mode,
          conversation_history: messages.slice(-10),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the Raspberry Pi. Make sure OpenClaw is running on the local network.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-claw-50">
      {/* Top bar */}
      <header className="border-b border-claw-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-claw-400 hover:text-claw-700 transition-colors"
            >
              ← Back
            </Link>
            <div className="w-px h-5 bg-claw-200" />
            <span className="font-mono font-medium text-claw-900 tracking-tight">
              {courseId}
            </span>
            <div className="w-2 h-2 rounded-full bg-sea-400 animate-pulse-dot" />
          </div>
          <span className="text-xs text-claw-400 font-mono hidden sm:block">
            via OpenClaw · RPi 5
          </span>
        </div>

        {/* Mode switcher */}
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2">
          {(Object.entries(MODE_CONFIG) as [Mode, typeof MODE_CONFIG.qa][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                  mode === key
                    ? "bg-claw-900 text-claw-50 border-claw-900"
                    : "bg-transparent text-claw-500 border-claw-200 hover:border-claw-400"
                }`}
              >
                {cfg.icon} {cfg.label}
              </button>
            )
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <div className="text-center py-24 animate-fade-up">
              <div className="text-6xl mb-4">🦞</div>
              <h2 className="text-display text-3xl text-claw-900 mb-2">
                {MODE_CONFIG[mode].desc}
              </h2>
              <p className="text-sm text-claw-400 mb-8">
                Course materials are loaded. Ask me anything about{" "}
                <span className="font-mono font-medium">{courseId}</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "What topics does this course cover?",
                  "Summarize the syllabus",
                  "Give me a practice question",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => sendMessage(), 50);
                    }}
                    className="text-sm text-claw-600 bg-white border border-claw-200 rounded-full px-4 py-2 hover:border-ember-300 hover:text-ember-600 transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-6 animate-fade-up ${
                msg.role === "user" ? "flex justify-end" : ""
              }`}
              style={{ animationDelay: "0.05s" }}
            >
              {msg.role === "user" ? (
                <div className="bg-claw-900 text-claw-50 rounded-2xl rounded-br-sm px-5 py-3 max-w-[80%]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 max-w-[90%]">
                  <div className="w-7 h-7 rounded-lg bg-ember-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🦞</span>
                  </div>
                  <div className="bg-white border border-claw-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-claw-800">
                      {msg.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 mb-6 animate-fade-up">
              <div className="w-7 h-7 rounded-lg bg-ember-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🦞</span>
              </div>
              <div className="bg-white border border-claw-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-claw-400 animate-pulse-dot"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-claw-400 animate-pulse-dot"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-claw-400 animate-pulse-dot"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-claw-200 bg-white/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${courseId}...`}
                rows={1}
                className="w-full resize-none border border-claw-200 rounded-xl px-4 py-3 text-sm text-claw-900 placeholder:text-claw-400 focus:outline-none focus:border-claw-400 focus:ring-2 focus:ring-claw-100 bg-claw-50 transition-all"
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = "44px";
                  t.style.height = t.scrollHeight + "px";
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl bg-claw-900 text-claw-50 flex items-center justify-center hover:bg-claw-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-claw-400 mt-2 text-center">
            Responses generated by Gemini 3.1 Pro via OpenClaw on Raspberry Pi 5
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-claw-50 text-claw-400 text-sm">
          Loading...
        </div>
      }
    >
      <ChatInner />
    </Suspense>
  );
}
