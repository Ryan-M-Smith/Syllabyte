/**
 * @file app/school/[id]/page.tsx
 * @description Dynamic school detail page displaying courses and AI chat access
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ChevronRight,
  BookOpen,
  Users,
  Upload,
} from "lucide-react";
import { PENN_STATE } from "@/config/schools";

export default function SchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  if (id !== PENN_STATE.id) {
    notFound();
  }

  const school = PENN_STATE;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-teal-100 opacity-40 blur-[140px]" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-navy-100 opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 animate-fade-up">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-navy-700 transition-colors text-sm"
          >
            <ArrowLeft size={14} />
            <img
              src="/horizontal-mark-registered-symbol.png"
              alt="Penn State"
              className="h-7 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors border border-slate-200 rounded-full px-4 py-2 hover:border-teal-300"
          >
            <Upload size={14} />
            Upload
          </Link>
        </header>

        {/* School header */}
        <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/penn-state-shield.jpg"
              alt="Penn State shield"
              className="w-14 h-14 rounded-xl object-cover shadow-md ring-1 ring-slate-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div>
              <h1 className="text-display text-4xl sm:text-5xl text-navy-900 leading-tight">
                {school.short}
              </h1>
              <p className="text-sm text-slate-400">{school.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <BookOpen size={14} className="text-teal-500" />
              <span className="font-mono font-medium">{school.courses.length}</span>
              <span>courses</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Users size={14} className="text-teal-500" />
              <span>AI tutors active</span>
            </div>
          </div>
        </div>

        {/* Courses list */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={14} className="text-slate-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Courses
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {school.courses.map((course, i) => (
              <Link
                key={course.course_id}
                href={`/chat?course=${course.course_id}&school=${school.id}`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${0.25 + i * 0.08}s` }}
              >
                <div className="border border-slate-200 rounded-2xl p-6 bg-white/70 backdrop-blur-sm hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100/40 transition-all duration-300 relative overflow-hidden h-full">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />

                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-xl font-semibold text-navy-800 tracking-tight">
                        {course.course_id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-1 font-medium">
                        <FileText size={10} />
                        {course.file_count}
                      </span>
                    </div>

                    <h3 className="font-medium text-navy-700 text-sm mb-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      {course.professor}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {course.files.slice(0, 2).map((f) => (
                        <span
                          key={f}
                          className="text-[11px] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5"
                        >
                          {f}
                        </span>
                      ))}
                      {course.files.length > 2 && (
                        <span className="text-[11px] text-slate-400">
                          +{course.files.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Start learning</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
          <div className="font-mono">
            OpenClaw + Gemini 3.1 Pro · Raspberry Pi 5
          </div>
        </footer>
      </div>
    </div>
  );
}
