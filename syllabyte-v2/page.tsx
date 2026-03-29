"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Upload,
  Brain,
  GraduationCap,
  ArrowRight,
  Wifi,
  FileText,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

type Course = {
  course_id: string;
  file_count: number;
  total_size_bytes: number;
  files: string[];
};

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_OPENCLAW_URL || "http://openclaw.local:18789";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${GATEWAY_URL}/api/courses`)
      .then((r) => r.json())
      .then(setCourses)
      .catch(() =>
        setCourses([
          {
            course_id: "CS-101",
            file_count: 3,
            total_size_bytes: 245000,
            files: ["syllabus.pdf", "lecture1.md", "assignment1.py"],
          },
          {
            course_id: "MATH-201",
            file_count: 2,
            total_size_bytes: 180000,
            files: ["syllabus.pdf", "formulas.md"],
          },
          {
            course_id: "ENG-150",
            file_count: 4,
            total_size_bytes: 520000,
            files: [
              "syllabus.pdf",
              "reading-list.md",
              "essay-guide.pdf",
              "rubric.md",
            ],
          },
        ])
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-teal-100 opacity-50 blur-[140px]" />
        <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] rounded-full bg-navy-100 opacity-40 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/3 w-[400px] h-[400px] rounded-full bg-leaf-100 opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-20 animate-fade-up">
          <div className="flex items-center gap-3">
            <img
              src="/syllabyte-logo.png"
              alt="Syllabyte"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-semibold text-navy-800 tracking-tight text-base">
              SYLLA<span className="text-teal-600">BYTE</span>
            </span>
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
        <div className="mb-20 max-w-3xl">
          <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={12} />
              AI Peer Tutoring
            </span>
          </div>
          <h1
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tight text-navy-900 mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Your syllabus,
            <br />
            <span className="italic gradient-text">byte-sized.</span>
          </h1>
          <p
            className="text-lg text-slate-500 max-w-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Upload your course materials. Get an AI peer tutor that knows your
            syllabus inside out — running on a Raspberry Pi in your
            professor&apos;s office.
          </p>

          <div
            className="flex flex-wrap gap-3 mt-10 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href={courses.length > 0 ? `/chat?course=${courses[0].course_id}` : "/chat?course=CS-101"}
              className="inline-flex items-center gap-2 gradient-bg text-white rounded-full px-7 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-teal-500/20"
            >
              <BookOpen size={16} />
              Start Learning
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-white text-navy-700 border border-slate-200 rounded-full px-7 py-3.5 text-sm font-medium hover:border-teal-300 transition-colors"
            >
              <Upload size={16} />
              Upload Syllabus
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-20 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Professor uploads",
                desc: "Syllabus, notes, slides, code — any format.",
                Icon: Upload,
              },
              {
                step: "02",
                title: "AI indexes everything",
                desc: "OpenClaw + Gemini process your course materials.",
                Icon: Brain,
              },
              {
                step: "03",
                title: "Students learn",
                desc: "Chat, pair program, and prep for exams.",
                Icon: GraduationCap,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-md hover:shadow-teal-50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-4 shadow-sm">
                  <item.Icon size={18} className="text-white" />
                </div>
                <div className="text-[10px] font-mono font-semibold text-teal-500 uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-semibold text-navy-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Available courses
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            <span className="text-xs text-slate-400 font-mono">
              {courses.length} active
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-400 py-16">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-dot" />
              <span className="text-sm">Connecting to Raspberry Pi...</span>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <Link
                  key={course.course_id}
                  href={`/chat?course=${course.course_id}`}
                  className="group block animate-fade-up"
                  style={{ animationDelay: `${0.45 + i * 0.08}s` }}
                >
                  <div className="border border-slate-200 rounded-2xl p-6 bg-white/70 backdrop-blur-sm hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100/40 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <span className="font-mono text-2xl font-semibold text-navy-800 tracking-tight">
                          {course.course_id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-1 font-medium">
                          <FileText size={10} />
                          {course.file_count} files
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {course.files.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="text-[11px] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5"
                          >
                            {f}
                          </span>
                        ))}
                        {course.files.length > 3 && (
                          <span className="text-[11px] text-slate-400">
                            +{course.files.length - 3} more
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
          )}
        </div>

        {/* Footer */}
        <footer
          className="mt-24 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-navy-700">
              SYLLA<span className="text-teal-600">BYTE</span>
            </span>
            <span className="text-slate-300">·</span>
            <span>Agentic AI for Higher Education</span>
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
