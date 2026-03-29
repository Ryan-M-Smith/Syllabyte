/**
 * @file app/page.tsx
 * @description Home/landing page component
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Upload, Sparkles, BookOpen } from "lucide-react";

import { Course } from "@/lib/models";
import CourseCard from "@/components/course-card";
import Footer from "@/components/footer";
import OpenClawStatus from "@/components/openclaw-status";

export default function Home() {
	const [courses, setCourses] = useState([] as Course[]);
	const [online, setOnline] = useState<boolean | null>(null);
	
	const apiUrl = `${process.env.NEXT_PUBLIC_OPENCLAW_URL}/api`;

	// Fetch courses dynamically from OpenClaw
	useEffect(() => {
		(async () => {
			const response = await fetch(`${apiUrl}/courses`);
			const { courses } = await response.json();
			
			setCourses(courses.map((course: Record<string, any>) => ({
				code: 		course.course_code,
				name: 		course.course_name,
				professor: 	course.professor,
				fileCount: 	course.file_count
			} as Course)));
		})();
	}, []);
	
	return (
		<div className="h-screen relative overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute inset-0 dark:hidden light">
					<div className="absolute -top-32 -right-32 w-175 h-175 rounded-full bg-teal-100 opacity-50 blur-[140px]" />
					<div className="absolute top-1/2 -left-48 w-125 h-125 rounded-full bg-navy-100 opacity-40 blur-[120px]" />
					<div className="absolute -bottom-32 right-1/3 w-100 h-100 rounded-full bg-leaf-100 opacity-30 blur-[100px]" />
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

						<OpenClawStatus online={online} onOnlineChange={setOnline}/>
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
						<BookOpen size={14} className="text-slate-500" />
						<h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
							Penn State Courses
						</h2>
						<div className="flex-1 h-px bg-linear-to-r from-slate-200 to-transparent" />
						<span className="text-xs text-navy-700 font-mono">
							{`${courses.length} active course${courses.length === 1 ? "" : "s"}`}
						</span>
					</div>

					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto pr-1 -mr-1 min-h-0 flex-1 content-start">
						{courses.map((course, i) => (
							<CourseCard key={course.code} course={course} index={i}/>
						))}
					</div>
				</div>

				<Footer/>
			</div>
		</div>
	);
}