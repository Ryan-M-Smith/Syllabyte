/**
 * @file components/footer.tsx
 * @description Footer component displayed across all pages
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { FiCpu } from "react-icons/fi";
import { GiCrabClaw } from "react-icons/gi";

export default function Footer() {
	return (
		<>
			<footer
				className={
					`mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between
					gap-2 text-[11px] text-slate-400 animate-fade-up w-full`
				}
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
					<span>Agentic AI Tutor</span>
				</div>
				<div className="flex items-center gap-2 font-mono">
					<GiCrabClaw size={14} className="text-teal-500"/>
					<span> OpenClaw Gemini 3.1 Pro </span>
					<span className="text-slate-300">·</span>
					<FiCpu size={14} className="text-teal-500"/>
					<span> Google Cloud Compute Engine </span>
				</div>
			</footer>
		</>
	)
}