"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Code,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_OPENCLAW_URL || "http://openclaw.local:18789";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Mode = "qa" | "pair_programming" | "exam_prep";

const MODE_CONFIG: Record<Mode, { label: string; Icon: typeof MessageCircle; desc: string }> =
  {
    qa: {
      label: "Q&A",
      Icon: MessageCircle,
      desc: "Ask anything about your course",
    },
    pair_programming: {
      label: "Pair Code",
      Icon: Code,
      desc: "Code together with course context",
    },
    exam_prep: {
      label: "Exam Prep",
      Icon: ClipboardCheck,
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

      if (!res.ok) throw new Error("Failed");
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
            "Couldn't connect to the Raspberry Pi. Make sure OpenClaw is running on the network.",
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-400 hover:text-navy-700 transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
            <div className="w-px h-5 bg-slate-200" />
            <span className="font-mono font-semibold text-navy-800 tracking-tight">
              {courseId}
            </span>
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse-dot" />
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
            Syllabyte
          </span>
        </div>

        {/* Mode switcher */}
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2">
          {(Object.entries(MODE_CONFIG) as [Mode, typeof MODE_CONFIG.qa][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer font-medium ${
                  mode === key
                    ? "gradient-bg text-white border-transparent shadow-sm"
                    : "bg-transparent text-slate-500 border-slate-200 hover:border-teal-300"
                }`}
              >
                <cfg.Icon size={12} />
                {cfg.label}
              </button>
            )
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <div className="text-center py-20 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20 animate-float">
                <Sparkles size={28} className="text-white" />
              </div>
              <h2 className="text-display text-3xl text-navy-900 mb-2">
                {MODE_CONFIG[mode].desc}
              </h2>
              <p className="text-sm text-slate-400 mb-10">
                Course materials loaded for{" "}
                <span className="font-mono font-semibold text-navy-700">
                  {courseId}
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "What topics does this course cover?",
                  "Summarize the syllabus",
                  "Give me a practice question",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-sm text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2.5 hover:border-teal-300 hover:text-teal-700 transition-all cursor-pointer"
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
            >
              {msg.role === "user" ? (
                <div className="gradient-bg text-white rounded-2xl rounded-br-sm px-5 py-3 max-w-[80%] shadow-sm">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 max-w-[90%]">
                  <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                      {msg.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 mb-6 animate-fade-up">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles size={12} className="text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot" />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${courseId}...`}
                rows={1}
                className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 bg-slate-50 transition-all"
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
              className="w-11 h-11 rounded-xl gradient-bg text-white flex items-center justify-center hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0 shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Syllabyte · Gemini 3.1 Pro via OpenClaw on Raspberry Pi
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <ChatInner />
    </Suspense>
  );
}
