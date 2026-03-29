/**
 * @file app/upload/page.tsx
 * @description File upload page for submitting course syllabi and materials
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FolderOpen,
  FileText,
  FileCode,
  FileSpreadsheet,
  File,
  Presentation,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  PartyPopper,
} from "lucide-react";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_OPENCLAW_URL || "http://openclaw.local:18789";

type UploadResult = {
  filename: string;
  status: "success" | "error" | "uploading";
  message?: string;
};

export default function UploadPage() {
  const [courseId, setCourseId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | globalThis.File[]) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    if (!courseId.trim() || files.length === 0) return;

    setUploading(true);
    const uploadResults: UploadResult[] = files.map((f) => ({
      filename: f.name,
      status: "uploading" as const,
    }));
    setResults([...uploadResults]);

    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("course_id", courseId.trim().toUpperCase());

        const res = await fetch(`${GATEWAY_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        uploadResults[i] = {
          filename: files[i].name,
          status: "success",
          message: data.indexed ? "Uploaded & indexed" : "Uploaded",
        };
      } catch {
        uploadResults[i] = {
          filename: files[i].name,
          status: "error",
          message: "Failed — check RPi connection",
        };
      }
      setResults([...uploadResults]);
    }
    setUploading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getExtIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const icons: Record<string, typeof FileText> = {
      pdf: FileText,
      md: FileText,
      txt: FileText,
      py: FileCode,
      js: FileCode,
      ts: FileCode,
      java: FileCode,
      c: FileCode,
      cpp: FileCode,
      h: FileCode,
      html: FileCode,
      css: FileCode,
      json: FileCode,
      ipynb: FileCode,
      csv: FileSpreadsheet,
      pptx: Presentation,
      docx: FileText,
    };
    const Icon = icons[ext || ""] || File;
    return <Icon size={16} className="text-slate-400" />;
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[700px] h-[500px] rounded-full bg-teal-100 opacity-30 blur-[140px] -translate-x-1/2 -translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-16 animate-fade-up">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-navy-700 transition-colors text-sm">
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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-white/60 border border-slate-200 rounded-full px-3 py-1.5">
            <img
              src="/veritcal-2-mark_registered.png"
              alt="Penn State shield"
              className="w-3.5 h-3.5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Upload size={10} />
            Professor Portal
          </span>
        </header>

        {/* Title */}
        <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl leading-[0.92] text-navy-900 mb-4">
            Upload course
            <br />
            <span className="italic gradient-text">materials</span>
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Drop your syllabus, lecture notes, assignments, and code.
            The Penn State tutor will index everything so students can query it instantly.
          </p>
        </div>

        {/* Course ID */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
            Course identifier
          </label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="e.g. CS-101"
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-lg font-mono font-semibold text-navy-800 placeholder:text-slate-300 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 bg-white transition-all"
          />
        </div>

        {/* Drop zone */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
            Files
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? "border-teal-400 bg-teal-50/50"
                : "border-slate-200 bg-white/40 hover:border-teal-300 hover:bg-white/60"
            }`}
          >
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-sm">
              {dragOver ? (
                <FolderOpen size={20} className="text-white" />
              ) : (
                <Upload size={20} className="text-white" />
              )}
            </div>
            <p className="text-sm text-slate-600 mb-1 font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-slate-400">
              PDF, Markdown, Python, JS, PPTX, DOCX, CSV, and more
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.txt,.md,.py,.js,.ts,.java,.c,.cpp,.h,.html,.css,.json,.csv,.pptx,.docx,.ipynb,.png,.jpg,.jpeg"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
            />
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mb-8 animate-fade-up">
            <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden divide-y divide-slate-100">
              {files.map((file, i) => {
                const result = results[i];
                return (
                  <div key={`${file.name}-${i}`} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="flex-shrink-0">{getExtIcon(file.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">
                        {result
                          ? result.status === "uploading" ? "Uploading..." : result.message
                          : formatSize(file.size)}
                      </p>
                    </div>
                    {result ? (
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        result.status === "success"
                          ? "bg-teal-50 text-teal-600"
                          : result.status === "error"
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-500"
                      }`}>
                        {result.status === "success" ? (
                          <Check size={12} />
                        ) : result.status === "error" ? (
                          <AlertCircle size={12} />
                        ) : (
                          <Loader2 size={12} className="animate-spin" />
                        )}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload button */}
        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={uploadAll}
            disabled={!courseId.trim() || files.length === 0 || uploading}
            className="w-full inline-flex items-center justify-center gap-2 gradient-bg text-white rounded-xl py-4 text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-teal-500/20"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading to Raspberry Pi...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {files.length} file{files.length !== 1 ? "s" : ""} to{" "}
                {courseId.trim().toUpperCase() || "..."}
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-400 mt-3 text-center font-mono">
            courses/{courseId.trim().toUpperCase() || "COURSE-ID"}/
          </p>
        </div>

        {/* Success */}
        {results.length > 0 && results.every((r) => r.status === "success") && (
          <div className="mt-8 border border-teal-200 bg-teal-50/50 rounded-2xl p-6 text-center animate-fade-up">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-3">
              <PartyPopper size={20} className="text-teal-600" />
            </div>
            <p className="text-sm font-semibold text-teal-700 mb-3">
              All files uploaded and indexed!
            </p>
            <Link
              href={`/chat?course=${courseId.trim().toUpperCase()}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-white gradient-bg rounded-full px-6 py-2.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              Try the assistant
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
