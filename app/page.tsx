"use client";

import Link from "next/link";
import {
  Upload,
  Wifi,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Building2,
  BookOpen,
  Users,
} from "lucide-react";

const SCHOOLS = [
  {
    id: "penn-state",
    name: "Penn State University",
    short: "PSU",
    courses: 3,
    students: 142,
    color: "from-navy-800 to-navy-600",
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    short: "MIT",
    courses: 2,
    students: 87,
    color: "from-red-700 to-red-500",
  },
  {
    id: "stanford",
    name: "Stanford University",
    short: "Stanford",
    courses: 4,
    students: 203,
    color: "from-emerald-800 to-emerald-600",
  },
  {
    id: "cmu",
    name: "Carnegie Mellon University",
    short: "CMU",
    courses: 2,
    students: 64,
    color: "from-rose-800 to-rose-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
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
              AI Peer Tutoring for Higher Education
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
            Select your school to find your courses. Each class has a
            personalized AI tutor that knows your syllabus inside out.
          </p>
        </div>

        {/* Schools grid */}
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Building2 size={14} className="text-slate-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Schools
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            <span className="text-xs text-slate-400 font-mono">
              {SCHOOLS.length} institutions
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SCHOOLS.map((school, i) => (
              <Link
                key={school.id}
                href={`/school/${school.id}`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${0.35 + i * 0.08}s` }}
              >
                <div className="border border-slate-200 rounded-2xl p-6 bg-white/70 backdrop-blur-sm hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />

                  <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${school.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <GraduationCap size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-navy-800 text-lg leading-tight mb-1">
                          {school.short}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {school.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <BookOpen size={12} className="text-teal-500" />
                        <span className="font-mono font-medium">{school.courses}</span>
                        <span>courses</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users size={12} className="text-teal-500" />
                        <span className="font-mono font-medium">{school.students}</span>
                        <span>students</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>View courses</span>
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