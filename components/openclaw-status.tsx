/**
 * @file openclaw-status.tsx
 * @description Ping the OpenClaw agent and display its status in the UI
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import { useEffect } from "react";
import { VscChatSparkle, VscChatSparkleError } from "react-icons/vsc";

type PingResponse = {
	data?: {
		openclaw?: string;
		status?: string;
	};
	openclaw?: string;
	status?: string;
	success?: boolean;
};

interface OpenClawStatusProps {
	online: boolean | null;
	onOnlineChange: (online: boolean) => void;
}

function isOpenClawOnline(payload: PingResponse, fallbackStatus: boolean) {
	if (typeof payload.success === "boolean") {
		return payload.success;
	}

	const openClawState = payload.data?.openclaw || payload.openclaw;
	if (typeof openClawState === "string") {
		return ["ok", "online", "running", "healthy"].includes(openClawState.toLowerCase());
	}

	const status = payload.data?.status || payload.status;
	if (typeof status === "string") {
		return ["ok", "online", "running", "healthy", "success"].includes(status.toLowerCase());
	}

	return fallbackStatus;
}

export default function OpenClawStatus({ online, onOnlineChange }: OpenClawStatusProps) {
	const pingInterval = 5 * 60 * 1000; // 5 minutes
	
	// Check OpenClaw health status immediately on load, then every 5 minutes
	useEffect(() => {
		void ping();

		const intervalId = window.setInterval(() => {
			void ping();
		}, pingInterval);

		return () => window.clearInterval(intervalId);
	}, []);

	const ping = async () => {
		try {
			const response = await fetch("/api/openclaw/ping", { cache: "no-store" });
			const rawText = await response.text();
			const payload = rawText ? (JSON.parse(rawText) as PingResponse) : {};
			onOnlineChange(isOpenClawOnline(payload, response.ok));
		} catch {
			onOnlineChange(false);
		}
	};
	
	return (
		<div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 bg-white/60 border border-slate-200 rounded-full px-5 py-2.5">
			{online === null ? (
				<>
					<span className="h-2.5 w-2.5 rounded-full bg-slate-400 animate-pulse" />
					<span className="text-slate-500">Checking OpenClaw status</span>
				</>
			) : online ? (
				<>
					<VscChatSparkle size={14} className="text-teal-500"/>
					<span className="text-teal-500">OpenClaw Agent Online</span>
				</>
			) : (
				<>
					<VscChatSparkleError size={14} className="text-danger"/>
					<span className="text-danger">OpenClaw Agent Offline</span>
				</>
			)}
		</div>
	);
}