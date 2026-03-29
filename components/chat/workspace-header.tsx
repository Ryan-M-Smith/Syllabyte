/**
 * @file components/chat/workspace-header.tsx
 * @description Header for the course chat workspace
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OpenClawStatus from "../openclaw-status";

type WorkspaceHeaderProps = {
	courseId: string;
	uploadNotice: string | null;
};

export default function WorkspaceHeader({ courseId, uploadNotice }: WorkspaceHeaderProps) {
	const [online, setOnline] = useState<boolean | null>(null);

	return (
		<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
				<div className="flex items-center gap-3">
					<Link
						href="/"
						className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-navy-700"
					>
						<ArrowLeft size={14} />
						Back
					</Link>
					<div className="h-5 w-px bg-slate-200" />
					<img
						src="/veritcal-2-mark_registered.png"
						alt="Penn State shield"
						className="h-4 w-4 object-contain"
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = "none";
						}}
					/>
					<span className="font-mono font-semibold tracking-tight text-navy-800 mr-10">{courseId}</span>
					<div className="absolute right-1 flex justify-start items-center">
						<OpenClawStatus online={online} onOnlineChange={setOnline} />
					</div>
				</div>

				<div className="flex items-center gap-3">
					{uploadNotice && (
						<span className="hidden rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs text-teal-700 lg:inline-flex">
							{uploadNotice}
						</span>
					)}
					<img
						src="/horizontal-mark-registered-symbol.png"
						alt="Penn State"
						className="hidden h-6 w-auto object-contain sm:block"
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = "none";
						}}
					/>
				</div>
			</div>
		</header>
	);
}