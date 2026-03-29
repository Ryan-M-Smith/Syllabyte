"use client";

import Link from "next/link";
import {
  Upload,
  Wifi,
  Sparkles,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Users,
  FileText,
} from "lucide-react";
import { PENN_STATE } from "@/config/schools";

export default function Home() {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Light mode */}
        <div className="absolute inset-0 dark:hidden light">
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-teal-100 opacity-50 blur-[140px]" />
          <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] rounded-full bg-navy-100 opacity-40 blur-[120px]" />
          <div className="absolute -bottom-32 right-1/3 w-[400px] h-[400px] rounded-full bg-leaf-100 opacity-30 blur-[100px]" />
        </div>
        
        {/* Dark mode */}
        <div className="absolute inset-0 hidden dark:block dark">
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-teal-900 opacity-30 blur-[140px]" />
          <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] rounded-full bg-navy-900 opacity-25 blur-[120px]" />
          <div className="absolute -bottom-32 right-1/3 w-[400px] h-[400px] rounded-full bg-slate-900 opacity-20 blur-[100px]" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-4 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 animate-fade-up">
          <div className="flex items-center gap-3">
            <img
              src="/horizontal-mark-registered-symbol.png"
              alt="Penn State"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors border border-slate-200 rounded-full px-5 py-2.5 hover:border-teal-300 hover:shadow-sm"
            >
              <Upload size={14} />
              Professor Portal
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-white/60 border border-slate-200 rounded-full px-3 py-2">
              <Wifi size={12} className="text-teal-500" />
              <span className="font-mono">RPi online</span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="mb-6 max-w-3xl">
          <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-700 bg-navy-50 border border-navy-200 rounded-full px-3 py-1 mb-3">
              <Sparkles size={12} />
              Penn State AI Tutoring
            </span>
          </div>
          <h1
            className="text-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight text-navy-900 mb-3 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Penn State,
            <br />
            <span className="italic gradient-text">byte-sized.</span>
          </h1>
          <p
            className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Your Penn State courses in one place, each with a personalized AI
            tutor that understands your syllabus and assignments.
          </p>
        </div>

        {/* Courses grid */}
        <div className="animate-fade-up flex-1 min-h-0 flex flex-col" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={14} className="text-slate-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Penn State Courses
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            <span className="text-xs text-slate-400 font-mono">
              {PENN_STATE.courses.length} active courses
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto pr-1 -mr-1 min-h-0 flex-1 content-start">
            {PENN_STATE.courses.map((course, i) => (
              <Link
                key={course.course_id}
                href={`/chat?course=${course.course_id}`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${0.35 + i * 0.08}s` }}
              >
                <div className="border border-slate-200 rounded-2xl p-4 bg-white/70 backdrop-blur-sm hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />

                  <div className="relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${PENN_STATE.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <GraduationCap size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-navy-800 text-base leading-tight mb-0.5">
                          {course.course_id}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {course.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users size={12} className="text-teal-500" />
                        <span className="font-mono font-medium">{course.professor}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FileText size={12} className="text-teal-500" />
                        <span className="font-mono font-medium">{course.file_count}</span>
                        <span>files</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Open chat</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/veritcal-2-mark_registered.png"
              alt="Penn State shield"
              className="w-4 h-4 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-semibold text-navy-700">Penn State</span>
            <span className="text-slate-300">·</span>
            <span>AI Academic Assistant</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>OpenClaw + Gemini 3.1 Pro</span>
            <span className="text-slate-300">·</span>
            <span>Raspberry Pi 5</span>
          </div>
        </footer>
      </div>
    </div>
  );
}