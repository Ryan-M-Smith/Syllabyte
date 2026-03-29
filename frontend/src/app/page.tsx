"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="min-h-screen relative grain">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-ember-100 opacity-40 blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-sea-100 opacity-30 blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-20 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-claw-900 flex items-center justify-center">
              <span className="text-claw-50 text-lg">🦞</span>
            </div>
            <span className="font-medium text-claw-700 tracking-tight text-sm uppercase">
              OpenClaw
            </span>
          </div>
          <Link
            href="/upload"
            className="text-sm font-medium text-claw-500 hover:text-claw-900 transition-colors border border-claw-200 rounded-full px-4 py-2 hover:border-claw-400"
          >
            Professor Portal →
          </Link>
        </header>

        {/* Hero */}
        <div className="mb-16">
          <h1
            className="text-display text-6xl md:text-8xl leading-[0.9] tracking-tight text-claw-900 mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Your course,
            <br />
            <span className="italic text-ember-500">understood.</span>
          </h1>
          <p
            className="text-lg text-claw-500 max-w-md leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            AI-powered course assistant running locally on a Raspberry Pi.
            Select your course to start chatting.
          </p>
        </div>

        {/* Courses grid */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-claw-400">
              Available courses
            </h2>
            <div className="flex-1 h-px bg-claw-200" />
            <span className="text-xs text-claw-400 font-mono">
              {courses.length} courses
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-claw-400 py-12">
              <div className="w-2 h-2 rounded-full bg-ember-400 animate-pulse-dot" />
              <span className="text-sm">
                Connecting to Raspberry Pi...
              </span>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <Link
                  key={course.course_id}
                  href={`/chat?course=${course.course_id}`}
                  className="group block"
                  style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                >
                  <div className="animate-fade-up border border-claw-200 rounded-2xl p-6 bg-white/60 backdrop-blur-sm hover:border-ember-300 hover:shadow-lg hover:shadow-ember-100/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <span className="font-mono text-2xl font-medium text-claw-900 tracking-tight">
                        {course.course_id}
                      </span>
                      <span className="text-xs font-mono text-claw-400 bg-claw-100 rounded-full px-2.5 py-1">
                        {course.file_count} files
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.files.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="text-xs text-claw-500 bg-claw-100 rounded px-2 py-0.5"
                        >
                          {f}
                        </span>
                      ))}
                      {course.files.length > 3 && (
                        <span className="text-xs text-claw-400">
                          +{course.files.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ember-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Start chatting</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer
          className="mt-24 pt-8 border-t border-claw-200 flex items-center justify-between text-xs text-claw-400 animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          <span>
            Powered by OpenClaw on Raspberry Pi 5
          </span>
          <span className="font-mono">
            Gemini 3.1 Pro
          </span>
        </footer>
      </div>
    </div>
  );
}
