/**
 * @file components/bucket-file-explorer.tsx
 * @description Left-side file explorer for study materials stored in Google Cloud Storage
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { FileText, FolderTree, RefreshCcw } from "lucide-react";

export type BucketFileItem = {
	contentType?: string;
	name: string;
	path: string;
	size?: number;
	updated?: string;
};

type BucketFileExplorerProps = {
	courseId: string;
	error: string | null;
	files: BucketFileItem[];
	loading: boolean;
	onRefresh: () => void;
};

function formatFileSize(size?: number) {
	if (!size) {
		return "Unknown size";
	}

	if (size < 1024) {
		return `${size} B`;
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} KB`;
	}

	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUpdatedDate(updated?: string) {
	if (!updated) {
		return "Last updated unavailable";
	}

	const date = new Date(updated);
	if (Number.isNaN(date.getTime())) {
		return "Last updated unavailable";
	}

	return date.toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export default function BucketFileExplorer({
	courseId,
	error,
	files,
	loading,
	onRefresh,
}: BucketFileExplorerProps) {
	return (
		<aside className="min-h-0 overflow-hidden border-b border-slate-200 bg-white/80 backdrop-blur-md lg:border-b-0 lg:border-r">
			<div className="flex h-full min-h-0 flex-col">
				<div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
							Material Library
						</p>
						<h2 className="mt-1 text-sm font-semibold text-navy-900">
							{courseId} bucket files
						</h2>
					</div>
					<button
						onClick={onRefresh}
						className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-teal-300 hover:text-teal-700"
						type="button"
					>
						<RefreshCcw size={14} />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
					<div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
						<div className="flex items-center gap-2 text-slate-500">
							<FolderTree size={14} className="text-teal-600" />
							<span className="text-xs font-medium">Your Course Materials</span>
						</div>
						<p className="mt-2 text-xs leading-relaxed text-slate-400">
							View and download course materials your professor has made available. Syllabyte will
							use these files to help you learn.
						</p>
					</div>

					{error && (
						<div className="mb-4 rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-xs leading-relaxed text-danger">
							{error}
						</div>
					)}

					{loading ? (
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, index) => (
								<div
									key={index}
									className="animate-pulse rounded-2xl border border-slate-200 bg-white px-4 py-3"
								>
									<div className="mb-2 h-3 w-2/3 rounded bg-slate-200" />
									<div className="h-3 w-1/2 rounded bg-slate-100" />
								</div>
							))}
						</div>
					) : files.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
							<p className="text-sm font-medium text-slate-600">No files found yet</p>
							<p className="mt-2 text-xs leading-relaxed text-slate-400">
								Upload study material to populate the course library.
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{files.map((file) => (
								<div
									key={file.path}
									className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
								>
									<div className="flex items-start gap-3">
										<div className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-500">
											<FileText size={14} />
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-navy-900">
												{file.name}
											</p>
											<p className="mt-1 truncate font-mono text-[11px] text-slate-400">
												{file.path}
											</p>
											<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
												<span>{formatFileSize(file.size)}</span>
												<span>{formatUpdatedDate(file.updated)}</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</aside>
	);
}