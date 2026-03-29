"use client";

import { useState, useRef } from "react";
import Link from "next/link";

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

  const handleFiles = (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    setFiles((prev) => [...prev, ...arr]);
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
          message: data.indexed
            ? "Uploaded & indexed"
            : "Uploaded (indexing pending)",
        };
      } catch {
        uploadResults[i] = {
          filename: files[i].name,
          status: "error",
          message: "Failed — check if RPi is connected",
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
    const icons: Record<string, string> = {
      pdf: "📄",
      md: "📝",
      py: "🐍",
      js: "📜",
      ts: "📜",
      java: "☕",
      pptx: "📊",
      docx: "📃",
      csv: "📊",
      ipynb: "📓",
      txt: "📄",
    };
    return icons[ext || ""] || "📎";
  };

  return (
    <div className="min-h-screen relative grain">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[700px] h-[500px] rounded-full bg-sea-100 opacity-30 blur-[120px] -translate-x-1/2 -translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-16 animate-fade-up">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-claw-400 hover:text-claw-700 transition-colors"
            >
              ← Home
            </Link>
          </div>
          <span className="text-xs font-mono text-claw-400">
            Professor Portal
          </span>
        </header>

        {/* Title */}
        <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-display text-5xl md:text-6xl leading-[0.9] text-claw-900 mb-4">
            Upload course
            <br />
            <span className="italic text-sea-500">materials</span>
          </h1>
          <p className="text-claw-500 leading-relaxed">
            Drop your syllabus, lecture notes, assignments, and code files.
            OpenClaw will index everything so students can query it instantly.
          </p>
        </div>

        {/* Course ID */}
        <div
          className="mb-8 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <label className="block text-xs font-medium uppercase tracking-widest text-claw-400 mb-2">
            Course identifier
          </label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="e.g. CS-101"
            className="w-full border border-claw-200 rounded-xl px-4 py-3 text-lg font-mono font-medium text-claw-900 placeholder:text-claw-300 focus:outline-none focus:border-sea-400 focus:ring-2 focus:ring-sea-100 bg-white transition-all"
          />
        </div>

        {/* Drop zone */}
        <div
          className="mb-8 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <label className="block text-xs font-medium uppercase tracking-widest text-claw-400 mb-2">
            Files
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? "border-sea-400 bg-sea-100/30"
                : "border-claw-200 bg-white/40 hover:border-claw-300 hover:bg-white/60"
            }`}
          >
            <div className="text-3xl mb-3">
              {dragOver ? "📂" : "📁"}
            </div>
            <p className="text-sm text-claw-600 mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-claw-400">
              PDF, Markdown, Python, JS, PPTX, DOCX, CSV, and more
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.txt,.md,.py,.js,.ts,.java,.c,.cpp,.h,.html,.css,.json,.csv,.pptx,.docx,.ipynb,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
            />
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div
            className="mb-8 animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="border border-claw-200 rounded-2xl bg-white overflow-hidden divide-y divide-claw-100">
              {files.map((file, i) => {
                const result = results[i];
                return (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <span className="text-lg flex-shrink-0">
                      {getExtIcon(file.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-claw-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-claw-400">
                        {result
                          ? result.status === "uploading"
                            ? "Uploading..."
                            : result.message
                          : formatSize(file.size)}
                      </p>
                    </div>
                    {result ? (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          result.status === "success"
                            ? "bg-sea-100 text-sea-500"
                            : result.status === "error"
                            ? "bg-ember-100 text-ember-500"
                            : "bg-gold-100 text-gold-500"
                        }`}
                      >
                        {result.status === "success"
                          ? "✓"
                          : result.status === "error"
                          ? "✗"
                          : "..."}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="text-claw-300 hover:text-ember-500 transition-colors cursor-pointer text-lg leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload button */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <button
            onClick={uploadAll}
            disabled={!courseId.trim() || files.length === 0 || uploading}
            className="w-full bg-claw-900 text-claw-50 rounded-xl py-4 text-sm font-medium hover:bg-claw-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {uploading
              ? "Uploading to Raspberry Pi..."
              : `Upload ${files.length} file${files.length !== 1 ? "s" : ""} to ${
                  courseId.trim().toUpperCase() || "..."
                }`}
          </button>
          <p className="text-[10px] text-claw-400 mt-3 text-center">
            Files are stored locally on the Raspberry Pi in{" "}
            <span className="font-mono">
              courses/{courseId.trim().toUpperCase() || "COURSE-ID"}/
            </span>
          </p>
        </div>

        {/* Success state */}
        {results.length > 0 &&
          results.every((r) => r.status === "success") && (
            <div
              className="mt-8 border border-sea-200 bg-sea-100/30 rounded-2xl p-6 text-center animate-fade-up"
            >
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm font-medium text-sea-500 mb-3">
                All files uploaded and indexed!
              </p>
              <Link
                href={`/chat?course=${courseId.trim().toUpperCase()}`}
                className="inline-block text-sm font-medium text-claw-900 border border-claw-200 rounded-full px-5 py-2 hover:border-claw-400 transition-colors"
              >
                Try the assistant →
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
