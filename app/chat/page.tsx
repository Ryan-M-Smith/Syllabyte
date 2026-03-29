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
import {
	getModeForAgent,
	getOpenClawWebSocketUrl,
	mergeFiles,
	type Message,
	type Mode,
	type OpenClawEnvelope,
	type UploadOutcome,
} from "@/lib/chat-workspace";

function createMessageId(prefix: string) {
	return `${prefix}-${crypto.randomUUID()}`;
}

function ChatInner() {
	const searchParams = useSearchParams();
	const courseId = (searchParams.get("course") || "CS-101").toUpperCase();

	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [chatLoading, setChatLoading] = useState(false);
	const [mode, setMode] = useState<Mode>("qa");
	const [activeAgent, setActiveAgent] = useState<string | null>(null);
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
	const websocketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (hasStartedChat) {
			inputRef.current?.focus();
		}
	}, [hasStartedChat]);

	useEffect(() => {
		return () => {
			websocketRef.current?.close();
		};
	}, []);

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
						id: createMessageId("assistant"),
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

		const socketUrl = getOpenClawWebSocketUrl();
		if (!socketUrl) {
			setMessages((prev) => [
				...prev,
				{
					id: createMessageId("assistant"),
					role: "assistant",
					content: "OpenClaw websocket URL is not configured.",
				},
			]);
			return;
		}

		const userMsg: Message = { id: createMessageId("user"), role: "user", content: text };
		const assistantMessageId = createMessageId("assistant");

		setMessages((prev) => [
			...prev,
			userMsg,
			{ id: assistantMessageId, role: "assistant", content: "", agent: activeAgent || undefined },
		]);
		setInput("");
		setChatLoading(true);
		setActiveAgent("manager");

		const updateAssistantMessage = (updater: (message: Message) => Message) => {
			setMessages((prev) =>
				prev.map((message) =>
					message.id === assistantMessageId ? updater(message) : message
				)
			);
		};

		try {
			websocketRef.current?.close();

			await new Promise<void>((resolve, reject) => {
				const socket = new WebSocket(socketUrl);
				let streamCompleted = false;
				let sawToken = false;

				websocketRef.current = socket;

				socket.onopen = () => {
					socket.send(
						JSON.stringify({
							conversation_history: messages.slice(-10).map(({ role, content, agent }) => ({
								agent,
								content,
								role,
							})),
							course_id: courseId,
							message: text,
							mode,
							prompt: text,
							type: "prompt",
						})
					);
				};

				socket.onmessage = (event) => {
					try {
						const payload = JSON.parse(event.data as string) as OpenClawEnvelope;

						if (payload.type === "routing") {
							setActiveAgent(payload.agent);
							setMode((currentMode) => getModeForAgent(payload.agent, currentMode));
							updateAssistantMessage((message) => ({
								...message,
								agent: payload.agent,
							}));
							return;
						}

						if (payload.type === "token") {
							sawToken = true;
							setActiveAgent(payload.agent);
							setMode((currentMode) => getModeForAgent(payload.agent, currentMode));
							updateAssistantMessage((message) => ({
								...message,
								agent: payload.agent,
								content: `${message.content}${payload.content}`,
							}));
							return;
						}

						if (payload.type === "done") {
							streamCompleted = true;
							setActiveAgent(payload.agent);
							setMode((currentMode) => getModeForAgent(payload.agent, currentMode));
							updateAssistantMessage((message) => ({
								...message,
								agent: payload.agent,
								content: !sawToken && payload.summary ? payload.summary : message.content,
							}));
							socket.close();
							resolve();
							return;
						}

						if (payload.type === "error") {
							streamCompleted = true;
							setActiveAgent(payload.agent || "manager");
							updateAssistantMessage((message) => ({
								...message,
								agent: payload.agent || message.agent,
								content: payload.message,
							}));
							socket.close();
							resolve();
						}
					} catch {
						streamCompleted = true;
						updateAssistantMessage((message) => ({
							...message,
							content: "Received an unreadable response from OpenClaw.",
						}));
						socket.close();
						reject(new Error("Invalid websocket payload."));
					}
				};

				socket.onerror = () => {
					if (!streamCompleted) {
						updateAssistantMessage((message) => ({
							...message,
							content: "Couldn't connect to OpenClaw. Make sure the websocket service is available.",
						}));
					}
				};

				socket.onclose = () => {
					if (websocketRef.current === socket) {
						websocketRef.current = null;
					}

					if (!streamCompleted) {
						updateAssistantMessage((message) => ({
							...message,
							content:
								message.content ||
								"Connection closed before the agent finished responding.",
						}));
						resolve();
					}
				};
			});
		} catch {
			setActiveAgent("manager");
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

			<div className="grid min-h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)] lg:grid-cols-[320px_minmax(0,1fr)] overflow-hidden">
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
							activeAgent={activeAgent}
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
