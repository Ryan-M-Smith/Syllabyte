/**
 * @file app/api/bucket-files/route.ts
 * @description Server route for listing course materials from a configured Google Cloud Storage bucket
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { NextRequest, NextResponse } from "next/server";

const GCS_API_BASE = "https://storage.googleapis.com/storage/v1";

type GcsObject = {
	contentType?: string;
	mediaLink?: string;
	name: string;
	size?: string;
	updated?: string;
};

export async function GET(request: NextRequest) {
	const bucketName = process.env.GCP_BUCKET_NAME;
	if (!bucketName) {
		return NextResponse.json(
			{
				error: "Set GCP_BUCKET_NAME to enable the Google Cloud file explorer.",
				files: [],
			},
			{ status: 503 }
		);
	}

	const courseId = request.nextUrl.searchParams.get("courseId")?.trim().toUpperCase();
	const explicitPrefix = request.nextUrl.searchParams.get("prefix")?.trim();
	const configuredPrefix = process.env.GCP_BUCKET_PREFIX?.trim().replace(/^\/+|\/+$/g, "");

	const prefixParts = [configuredPrefix, courseId, explicitPrefix].filter(
		(value): value is string => Boolean(value)
	);
	const prefix = prefixParts.length > 0 ? `${prefixParts.join("/")}/` : "";

	const gcsUrl = new URL(`${GCS_API_BASE}/b/${bucketName}/o`);
	gcsUrl.searchParams.set("fields", "items(name,size,updated,contentType,mediaLink)");
	if (prefix) {
		gcsUrl.searchParams.set("prefix", prefix);
	}

	try {
		const response = await fetch(gcsUrl.toString(), { cache: "no-store" });
		const payload = (await response.json()) as { items?: GcsObject[]; error?: { message?: string } };

		if (!response.ok) {
			return NextResponse.json(
				{
					error: payload.error?.message || "Unable to list Google Cloud bucket files.",
					files: [],
				},
				{ status: response.status }
			);
		}

		const files = (payload.items ?? [])
			.filter((item) => item.name && !item.name.endsWith("/"))
			.map((item) => ({
				contentType: item.contentType,
				name: item.name.split("/").pop() || item.name,
				path: item.name,
				size: item.size ? Number(item.size) : undefined,
				updated: item.updated,
				url: item.mediaLink,
			}))
			.sort((left, right) => {
				if (!left.updated || !right.updated) {
					return left.name.localeCompare(right.name);
				}

				return new Date(right.updated).getTime() - new Date(left.updated).getTime();
			});

		return NextResponse.json({ bucketName, files, prefix });
	} catch {
		return NextResponse.json(
			{
				error: "Unable to reach Google Cloud Storage from the app server.",
				files: [],
			},
			{ status: 502 }
		);
	}
}