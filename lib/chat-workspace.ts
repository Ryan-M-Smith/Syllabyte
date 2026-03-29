/**
 * @file lib/chat-workspace.ts
 * @description Shared chat workspace types, prompts, and file helpers
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { ClipboardCheck, GraduationCap, MessageCircle } from "lucide-react";

export const OPEN_CLAW_API = "/api/openclaw";
export const ACCEPTED_FILE_TYPES = ".pdf,.txt,.md,.py,.js,.ts,.java,.c,.cpp,.h,.html,.css,.json,.csv,.pptx,.docx,.ipynb,.png,.jpg,.jpeg";

export type Message = {
	role: "user" | "assistant";
	content: string;
};

export type UploadOutcome = {
	failureCount: number;
	successCount: number;
};

export type Mode = "qa" | "exam_prep" | "grading";

export const MODE_CONFIG: Record<Mode, { label: string; Icon: typeof MessageCircle; desc: string }> = {
	qa: {
		label: "Chat",
		Icon: MessageCircle,
		desc: "Ask anything about your course",
	},
	exam_prep: {
		label: "Exam Prep",
		Icon: ClipboardCheck,
		desc: "Practice questions & review",
	},
	grading: {
		label: "Grading",
		Icon: GraduationCap,
		desc: "Grade submissions with rubric-based feedback",
	},
};

export const MODE_PROMPTS: Record<Mode, string[]> = {
	qa: [
		"What topics does this course cover?",
		"Summarize the syllabus",
		"Explain this week's core concept in simple terms",
	],
	exam_prep: [
		"Give me 5 likely exam questions",
		"Quiz me on key definitions",
		"Create a timed practice set for this unit",
	],
	grading: [
		"Create a grading rubric for this assignment",
		"Grade this response and justify the score",
		"Give feedback focused on improvement areas",
	],
};

export function mergeFiles(existingFiles: File[], incomingFiles: File[]) {
	const fileMap = new Map(
		existingFiles.map((file) => [`${file.name}-${file.size}-${file.lastModified}`, file])
	);

	for (const file of incomingFiles) {
		fileMap.set(`${file.name}-${file.size}-${file.lastModified}`, file);
	}

	return Array.from(fileMap.values());
}

export function formatFileSize(size: number) {
	if (size < 1024) {
		return `${size} B`;
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} KB`;
	}

	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}