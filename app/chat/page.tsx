/**
 * @file app/chat/page.tsx
 * @description Study material intake and chat workspace for the AI-powered course assistant
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import BucketFileExplorer, { type BucketFileItem } from "@/components/bucket-file-explorer";
import ChatIntakePanel from "@/components/chat/chat-intake-panel";
import ChatSessionPanel from "@/components/chat/chat-session-panel";
import WorkspaceHeader from "@/components/chat/workspace-header";
import { OPEN_CLAW_API, mergeFiles, type Message, type Mode, type UploadOutcome } from "@/lib/chat-workspace";

function ChatInner() {
	const searchParams = useSearchParams();
	const courseId = (searchParams.get("course") || "CS-101").toUpperCase();

	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [chatLoading, setChatLoading] = useState(false);
	const [mode, setMode] = useState<Mode>("qa");
	const [hasStartedChat, setHasStartedChat] = useState(false);
	const [stagedFiles, setStagedFiles] = useState<File[]>([]);
	const [uploadingFiles, setUploadingFiles] = useState(false);
	const [uploadNotice, setUploadNotice] = useState<string | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [bucketFiles, setBucketFiles] = useState<BucketFileItem[]>([]);
	const [bucketLoading, setBucketLoading] = useState(true);
	const [bucketError, setBucketError] = useState<string | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const stagedFileInputRef = useRef<HTMLInputElement>(null);
	const chatUploadInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (hasStartedChat) {
			inputRef.current?.focus();
		}
	}, [hasStartedChat]);

	const loadBucketFiles = async () => {
		setBucketLoading(true);
		setBucketError(null);

		try {
			const response = await fetch(`/api/bucket-files?courseId=${encodeURIComponent(courseId)}`, {
				cache: "no-store",
			});
			const data = (await response.json()) as {
				error?: string;
				files?: BucketFileItem[];
			};

			if (!response.ok) {
				throw new Error(data.error || "Couldn't load course files from Google Cloud Storage.");
			}

			setBucketFiles(data.files || []);
		} catch (error) {
			setBucketFiles([]);
			setBucketError(
				error instanceof Error
					? error.message
					: "Couldn't load course files from Google Cloud Storage."
			);
		} finally {
			setBucketLoading(false);
		}
	};

	useEffect(() => {
		void loadBucketFiles();
	}, [courseId]);

	const uploadFiles = async (
		filesToUpload: File[],
		options?: { announceInChat?: boolean; clearStaged?: boolean }
	): Promise<UploadOutcome> => {
		if (filesToUpload.length === 0) {
			return { failureCount: 0, successCount: 0 };
		}

		setUploadingFiles(true);
		setUploadNotice(null);

		let successCount = 0;
		let failureCount = 0;
		const failedFiles: File[] = [];

		for (const file of filesToUpload) {
			try {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("course_id", courseId);

				const response = await fetch(`/api/bucket-upload`, {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`Upload failed with status ${response.status}`);
				}

				successCount += 1;
			} catch {
				failureCount += 1;
				failedFiles.push(file);
			}
		}

		if (options?.clearStaged) {
			setStagedFiles(failedFiles);
		}

		if (successCount > 0) {
			setUploadNotice(
				failureCount > 0
					? `Uploaded ${successCount} file${successCount === 1 ? "" : "s"}. ${failureCount} still need attention.`
					: `Uploaded ${successCount} file${successCount === 1 ? "" : "s"} to ${courseId}.`
			);

			if (options?.announceInChat) {
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: `Added ${successCount} new study material file${successCount === 1 ? "" : "s"} to ${courseId}. Ask me anything about the updated library.`,
					},
				]);
			}
		} else if (failureCount > 0) {
			setUploadNotice("Upload failed. Check the OpenClaw connection and try again.");
		}

		await loadBucketFiles();
		setUploadingFiles(false);

		return { failureCount, successCount };
	};

	const handleStagedFiles = (incomingFiles: FileList | File[]) => {
		setStagedFiles((prev) => mergeFiles(prev, Array.from(incomingFiles)));
	};

	const startChatSession = async () => {
		if (uploadingFiles) {
			return;
		}

		if (stagedFiles.length > 0) {
			await uploadFiles(stagedFiles, { clearStaged: true });
		}

		setHasStartedChat(true);
	};

	const sendMessage = async () => {
		const text = input.trim();
		if (!text || chatLoading) {
			return;
		}

		const userMsg: Message = { role: "user", content: text };
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setChatLoading(true);

		try {
			const res = await fetch(`${OPEN_CLAW_API}/chat`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					course_id: courseId,
					message: text,
					mode,
					conversation_history: messages.slice(-10),
				}),
			});

			if (!res.ok) throw new Error("Failed");
			const data = await res.json();
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: data.reply },
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Couldn't connect to OpenClaw. Make sure the chat service is available.",
				},
			]);
		} finally {
			setChatLoading(false);
		}
	};

	const handleChatFileSelection = async (fileList: FileList | null) => {
		if (!fileList || fileList.length === 0) {
			return;
		}

		await uploadFiles(Array.from(fileList), { announceInChat: true });
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<WorkspaceHeader courseId={courseId} uploadNotice={uploadNotice} />

			<div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-[320px_minmax(0,1fr)]">
				<BucketFileExplorer
					courseId={courseId}
					error={bucketError}
					files={bucketFiles}
					loading={bucketLoading}
					onRefresh={() => {
						void loadBucketFiles();
					}}
				/>

				<section className="flex min-h-0 flex-col">
					{!hasStartedChat ? (
						<ChatIntakePanel
							courseId={courseId}
							dragActive={dragActive}
							onBrowse={() => stagedFileInputRef.current?.click()}
							onDragLeave={() => setDragActive(false)}
							onDragOver={(event) => {
								event.preventDefault();
								setDragActive(true);
							}}
							onDrop={(event) => {
								event.preventDefault();
								setDragActive(false);
								handleStagedFiles(event.dataTransfer.files);
							}}
							onFileInputChange={(event) => {
								if (event.target.files) {
									handleStagedFiles(event.target.files);
									event.target.value = "";
								}
							}}
							stagedFileInputRef={stagedFileInputRef}
							stagedFiles={stagedFiles}
							uploadNotice={uploadNotice}
							uploadingFiles={uploadingFiles}
							onRemoveFile={(index) => {
								setStagedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
							}}
							onStartChat={() => {
								void startChatSession();
							}}
						/>
					) : (
						<ChatSessionPanel
							bottomRef={bottomRef}
							chatLoading={chatLoading}
							chatUploadInputRef={chatUploadInputRef}
							courseId={courseId}
							handleChatFileSelection={handleChatFileSelection}
							handleKeyDown={handleKeyDown}
							input={input}
							inputRef={inputRef}
							messages={messages}
							mode={mode}
							onInputChange={setInput}
							onModeChange={setMode}
							onPromptSelect={setInput}
							onSend={() => {
								void sendMessage();
							}}
							uploadingFiles={uploadingFiles}
						/>
					)}
				</section>
			</div>
		</div>
	);
}

export default function ChatPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
					Loading...
				</div>
			}
		>
			<ChatInner />
		</Suspense>
	);
}
