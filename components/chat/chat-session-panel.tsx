/**
 * @file components/chat/chat-session-panel.tsx
 * @description Active chat session view with messages, prompts, and upload-enabled composer
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { Paperclip, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

import {
	ACCEPTED_FILE_TYPES,
	MODE_CONFIG,
	MODE_PROMPTS,
	formatAgentLabel,
	type Message,
	type Mode,
} from "@/lib/chat-workspace";

type ChatSessionPanelProps = {
	activeAgent: string | null;
	bottomRef: React.RefObject<HTMLDivElement | null>;
	chatLoading: boolean;
	chatUploadInputRef: React.RefObject<HTMLInputElement | null>;
	courseId: string;
	handleChatFileSelection: (fileList: FileList | null) => Promise<void>;
	handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	input: string;
	inputRef: React.RefObject<HTMLTextAreaElement | null>;
	messages: Message[];
	mode: Mode;
	onInputChange: (value: string) => void;
	onPromptSelect: (prompt: string) => void;
	onSend: () => void;
	uploadingFiles: boolean;
};

export default function ChatSessionPanel({
	activeAgent,
	bottomRef,
	chatLoading,
	chatUploadInputRef,
	courseId,
	handleChatFileSelection,
	handleKeyDown,
	input,
	inputRef,
	messages,
	mode,
	onInputChange,
	onPromptSelect,
	onSend,
	uploadingFiles,
}: ChatSessionPanelProps) {
	const isStreamingAssistantBubble =
		chatLoading && messages.length > 0 && messages[messages.length - 1]?.role === "assistant";
	const currentModeConfig = MODE_CONFIG[mode];
	const CurrentModeIcon = currentModeConfig.Icon;

	return (
		<>
			<div className="border-b border-slate-200 bg-white/70 px-5 py-4 backdrop-blur-md sm:px-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Study Workspace</p>
						<h1 className="mt-1 text-display text-3xl text-navy-900 sm:text-4xl">Upload first, then tutor.</h1>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
							Bring in fresh study material, let the bucket library update, and continue the conversation without leaving the page.
						</p>
						{activeAgent && (
							<div className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
								<span className="h-2 w-2 rounded-full bg-teal-500" />
								Live agent: {formatAgentLabel(activeAgent)}
							</div>
						)}
					</div>

					<div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm lg:self-center">
						<CurrentModeIcon size={12} />
						Mode: {currentModeConfig.label}
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
				<div className="mx-auto max-w-4xl">
					{messages.length === 0 && (
						<div className="animate-fade-up rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-8">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg shadow-lg shadow-teal-500/20 animate-float">
								<Sparkles size={28} className="text-white" />
							</div>
							<h2 className="text-display text-3xl text-navy-900">{currentModeConfig.desc}</h2>
							<p className="mt-2 text-sm text-slate-400">
								Ask about anything already in the {courseId} bucket, or add more files from the composer below.
							</p>
							<div className="mt-8 flex flex-wrap justify-center gap-2">
								{MODE_PROMPTS[mode].map((question) => (
									<button
										key={question}
										onClick={() => onPromptSelect(question)}
										className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 transition-all hover:border-teal-300 hover:text-teal-700"
										type="button"
									>
										{question}
									</button>
								))}
							</div>
						</div>
					)}

					{messages.map((msg, index) => {
						const isCurrentAssistantBubble =
							isStreamingAssistantBubble && index === messages.length - 1 && msg.role === "assistant";
						const showTypingDots = isCurrentAssistantBubble && !msg.content.trim();

						return (
						<div key={msg.id} className={`mb-6 animate-fade-up ${msg.role === "user" ? "flex justify-end" : ""}`}>
							{msg.role === "user" ? (
								<div className="max-w-[80%] rounded-2xl rounded-br-sm gradient-bg px-5 py-3 text-white shadow-sm">
									<p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
								</div>
							) : (
								<div className="flex max-w-[90%] gap-3">
									<div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-bg shadow-sm">
										<Sparkles size={12} className="text-white" />
									</div>
									<div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-5 py-3 shadow-sm">
										{showTypingDots ? (
											<div className="flex items-center gap-1.5 py-1">
												<div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse-dot" />
												<div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
												<div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
											</div>
										) : (
											<div className="prose prose-sm max-w-none text-slate-800">
												<ReactMarkdown>{msg.content}</ReactMarkdown>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
						);
					})}

					{chatLoading && !isStreamingAssistantBubble && (
						<div className="mb-6 flex animate-fade-up gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-bg shadow-sm">
								<Sparkles size={12} className="text-white" />
							</div>
							<div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-5 py-4 shadow-sm">
								<div className="flex items-center gap-1.5">
									<div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse-dot" />
									<div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
									<div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
								</div>
							</div>
						</div>
					)}

					<div ref={bottomRef} />
				</div>
			</div>

			<div className="border-t border-slate-200 bg-white/85 backdrop-blur-md">
				<div className="mx-auto max-w-4xl px-5 py-4 sm:px-6">
					<div className="mb-3 flex flex-wrap items-center justify-between gap-3">
						<div>
							<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Composer</p>
							<p className="text-sm text-slate-500">Chat and upload additional files without leaving the workspace.</p>
						</div>
						<button
							onClick={() => chatUploadInputRef.current?.click()}
							disabled={uploadingFiles}
							className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
							type="button"
						>
							<Paperclip size={14} />
							Add files
						</button>
						<input
							ref={chatUploadInputRef}
							accept={ACCEPTED_FILE_TYPES}
							className="hidden"
							multiple
							onChange={(event) => {
								void handleChatFileSelection(event.target.files);
								event.target.value = "";
							}}
							type="file"
						/>
					</div>

					<div className="flex justify-center items-start gap-3">
						<div className="flex-1">
							<textarea
								ref={inputRef}
								value={input}
								onChange={(e) => onInputChange(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder={`Ask about ${courseId}...`}
								rows={1}
								className="w-full h-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-sm text-navy-900 placeholder:text-slate-400 transition-all focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
								style={{ minHeight: "44px", maxHeight: "120px" }}
								onInput={(e) => {
									const target = e.target as HTMLTextAreaElement;
									target.style.height = "44px";
									target.style.height = `${target.scrollHeight}px`;
								}}
							/>
						</div>
						
						<button
							onClick={onSend}
							disabled={!input.trim() || chatLoading}
							className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-bg text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
							type="button"
						>
							<Send size={16} />
						</button>
					</div>
					<p className="mt-2 text-center text-[10px] text-slate-400">Penn State AI Tutor · Gemini 3.1 Pro via OpenClaw</p>
				</div>
			</div>
		</>
	);
}