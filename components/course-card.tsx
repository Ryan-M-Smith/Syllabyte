/**
 * @file components/course-card.tsx
 * @description Reusable course card component for linking to a course chat
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import Link from "next/link";
import { ChevronRight, FileText, GraduationCap, Users } from "lucide-react";

import type { Course } from "@/lib/models";

type CourseCardProps = {
	course: Course;
	index: number;
};

export default function CourseCard({ course, index }: CourseCardProps) {
	const { code, name, professor, fileCount } = course;

	return (
		<Link
			href={`/chat?course=${code}`}
			className="group block animate-fade-up"
			style={{ animationDelay: `${0.35 + index * 0.08}s` }}
		>
			<div className="border border-slate-200 rounded-2xl p-4 bg-white/70 backdrop-blur-sm hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100/40 transition-all duration-300 relative overflow-hidden">
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />

				<div className="relative">
					<div className="flex items-start gap-3 mb-3">
						<div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy-900 to-navy-700 flex items-center justify-center shrink-0 shadow-sm">
							<GraduationCap size={18} className="text-white" />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-navy-800 text-base leading-tight mb-0.5">
								{code}
							</h3>
							<p className="text-xs text-slate-400 truncate">{name}</p>
						</div>
					</div>

					<div className="flex items-center gap-3 mb-2">
						<div className="flex items-center gap-1.5 text-xs text-slate-500">
							<Users size={12} className="text-teal-500" />
							<span className="font-mono font-medium">{professor}</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs text-slate-500">
							<FileText size={12} className="text-teal-500" />
							<span className="font-mono font-medium">{fileCount}</span>
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
	);
}