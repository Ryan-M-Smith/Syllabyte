/**
 * @file components/chat/chat-intake-panel.tsx
 * @description Initial staged-upload panel shown before chat starts
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { FileUp, Sparkles, Upload } from "lucide-react";

import { ACCEPTED_FILE_TYPES, formatFileSize } from "@/lib/chat-workspace";

type ChatIntakePanelProps = {
	courseId: string;
	dragActive: boolean;
	onBrowse: () => void;
	onDragLeave: () => void;
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
	onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
	onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	stagedFileInputRef: React.RefObject<HTMLInputElement | null>;
	stagedFiles: File[];
	uploadNotice: string | null;
	uploadingFiles: boolean;
	onRemoveFile: (index: number) => void;
	onStartChat: () => void;
};

export default function ChatIntakePanel({
	courseId,
	dragActive,
	onBrowse,
	onDragLeave,
	onDragOver,
	onDrop,
	onFileInputChange,
	stagedFileInputRef,
	stagedFiles,
	uploadNotice,
	uploadingFiles,
	onRemoveFile,
	onStartChat,
}: ChatIntakePanelProps) {
	return (
		<div className="flex-1 justify-start items-center overflow-y-auto px-5 py-20 sm:px-6">
			<div className="mx-auto max-w-4xl animate-fade-up">
				<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div className="mb-6 flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg shadow-lg shadow-teal-500/20">
							<Sparkles size={22} className="text-white" />
						</div>
						<div>
							<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Step 1</p>
							<h2 className="text-xl font-semibold text-navy-900">Drop study material for {courseId}</h2>
						</div>
					</div>

					<div
						onClick={onBrowse}
						onDragLeave={onDragLeave}
						onDragOver={onDragOver}
						onDrop={onDrop}
						className={`cursor-pointer rounded-[28px] border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ${
							dragActive
								? "border-teal-400 bg-teal-50/80"
								: "border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-white"
						}`}
					>
						<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg shadow-sm">
							<Upload size={24} className="text-white" />
						</div>
						<h3 className="text-lg font-semibold text-navy-900">Drag and drop your study material</h3>
						<p className="mt-2 text-sm leading-relaxed text-slate-500">
							Syllabi, lecture decks, assignments, lab docs, notes, or code files all work here.
						</p>
						<button
							type="button"
							className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:border-teal-300 hover:text-teal-700"
						>
							<FileUp size={15} />
							Browse files
						</button>
						<input
							ref={stagedFileInputRef}
							accept={ACCEPTED_FILE_TYPES}
							className="hidden"
							multiple
							onChange={onFileInputChange}
							type="file"
						/>
					</div>

					<div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
						<div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Ready to upload</p>
									<h3 className="mt-1 text-sm font-semibold text-navy-900">
										{stagedFiles.length} staged file{stagedFiles.length === 1 ? "" : "s"}
									</h3>
								</div>
								{uploadNotice && <span className="text-xs text-teal-700">{uploadNotice}</span>}
							</div>

							{stagedFiles.length === 0 ? (
								<p className="text-sm text-slate-400">
									No files staged yet. You can still start the chat with the materials already in the bucket explorer.
								</p>
							) : (
								<div className="space-y-3">
									{stagedFiles.map((file, index) => (
										<div
											key={`${file.name}-${file.size}-${file.lastModified}`}
											className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
										>
											<div className="min-w-0">
												<p className="truncate text-sm font-medium text-navy-900">{file.name}</p>
												<p className="mt-1 text-xs text-slate-400">{formatFileSize(file.size)}</p>
											</div>
											<button
												onClick={() => onRemoveFile(index)}
												className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 transition-colors hover:border-danger/20 hover:text-danger"
												type="button"
											>
												Remove
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-5">
							<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Step 2</p>
							<h3 className="mt-1 text-sm font-semibold text-navy-900">Start the tutor</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-500">
								Once the initial upload is in place, the workspace switches into chat mode and keeps file uploads available.
							</p>

							<button
								onClick={onStartChat}
								disabled={uploadingFiles}
								className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-bg px-5 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
								type="button"
							>
								{uploadingFiles ? "Uploading materials..." : stagedFiles.length > 0 ? "Upload and start chat" : "Start with existing materials"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}