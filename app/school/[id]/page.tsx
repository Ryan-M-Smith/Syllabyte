"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Users,
  Upload,
} from "lucide-react";

type Course = {
  course_id: string;
  name: string;
  professor: string;
  file_count: number;
  files: string[];
};

type School = {
  id: string;
  name: string;
  short: string;
  color: string;
  courses: Course[];
};

const SCHOOLS: Record<string, School> = {
  "penn-state": {
    id: "penn-state",
    name: "Penn State University",
    short: "PSU",
    color: "from-navy-800 to-navy-600",
    courses: [
      {
        course_id: "CS-101",
        name: "Intro to Computer Science",
        professor: "Dr. Smith",
        file_count: 3,
        files: ["syllabus.pdf", "lecture1.md", "assignment1.py"],
      },
      {
        course_id: "MATH-201",
        name: "Linear Algebra",
        professor: "Dr. Johnson",
        file_count: 2,
        files: ["syllabus.pdf", "formulas.md"],
      },
      {
        course_id: "ENG-150",
        name: "Technical Writing",
        professor: "Dr. Williams",
        file_count: 4,
        files: ["syllabus.pdf", "reading-list.md", "essay-guide.pdf", "rubric.md"],
      },
    ],
  },
  mit: {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    short: "MIT",
    color: "from-red-700 to-red-500",
    courses: [
      {
        course_id: "6.006",
        name: "Introduction to Algorithms",
        professor: "Prof. Demaine",
        file_count: 5,
        files: ["syllabus.pdf", "ps1.pdf", "ps2.pdf", "lecture-notes.md", "recitation1.md"],
      },
      {
        course_id: "6.042",
        name: "Mathematics for Computer Science",
        professor: "Prof. Leighton",
        file_count: 3,
        files: ["syllabus.pdf", "problem-sets.pdf", "proofs-guide.md"],
      },
    ],
  },
  stanford: {
    id: "stanford",
    name: "Stanford University",
    short: "Stanford",
    color: "from-emerald-800 to-emerald-600",
    courses: [
      {
        course_id: "CS-229",
        name: "Machine Learning",
        professor: "Prof. Ng",
        file_count: 6,
        files: ["syllabus.pdf", "lecture1.pdf", "ps1.pdf", "notes.md", "data.csv", "model.py"],
      },
      {
        course_id: "CS-231N",
        name: "Deep Learning for Computer Vision",
        professor: "Prof. Li",
        file_count: 4,
        files: ["syllabus.pdf", "assignment1.ipynb", "lecture-slides.pptx", "references.md"],
      },
      {
        course_id: "CS-224N",
        name: "Natural Language Processing",
        professor: "Prof. Manning",
        file_count: 3,
        files: ["syllabus.pdf", "hw1.pdf", "lecture-notes.md"],
      },
      {
        course_id: "PHIL-181",
        name: "Philosophy of Mind",
        professor: "Prof. Searle",
        file_count: 2,
        files: ["syllabus.pdf", "reading-list.md"],
      },
    ],
  },
  cmu: {
    id: "cmu",
    name: "Carnegie Mellon University",
    short: "CMU",
    color: "from-rose-800 to-rose-600",
    courses: [
      {
        course_id: "15-213",
        name: "Introduction to Computer Systems",
        professor: "Prof. O'Hallaron",
        file_count: 4,
        files: ["syllabus.pdf", "lab1.tar", "lecture1.pdf", "recitation1.md"],
      },
      {
        course_id: "15-451",
        name: "Algorithm Design and Analysis",
        professor: "Prof. Sleator",
        file_count: 3,
        files: ["syllabus.pdf", "hw1.pdf", "notes.md"],
      },
    ],
  },
};

export default function SchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const school = SCHOOLS[id];

  if (!school) {
    notFound();
  }

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
            <span className="font-semibold text-navy-700">
              SYLLA<span className="text-teal-600">BYTE</span>
            </span>
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
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${school.color} flex items-center justify-center shadow-md`}>
              <GraduationCap size={24} className="text-white" />
            </div>
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
            <span className="font-semibold text-navy-700">
              SYLLA<span className="text-teal-600">BYTE</span>
            </span>
            <span className="text-slate-300">·</span>
            <span>Agentic AI for Higher Education</span>
          </div>
          <div className="font-mono">
            OpenClaw + Gemini 3.1 Pro · Raspberry Pi 5
          </div>
        </footer>
      </div>
    </div>
  );
}
