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

import {
	getBucketName,
	getCourseUploadPrefix,
	hasStorageCredentialsConfigured,
	getStorageClient,
} from "@/lib/gcs";

export async function GET(request: NextRequest) {
	let bucketName: string;

	try {
		bucketName = getBucketName();
	} catch (error) {
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Google Cloud Storage is not configured.",
				files: [],
			},
			{ status: 503 }
		);
	}

	const courseId = request.nextUrl.searchParams.get("courseId")?.trim();
	if (!courseId) {
		return NextResponse.json(
			{
				error: "A courseId query parameter is required.",
				files: [],
			},
			{ status: 400 }
		);
	}

	const prefix = `${getCourseUploadPrefix(courseId)}/`;

	if (!hasStorageCredentialsConfigured()) {
		return NextResponse.json(
			{
				error:
					"Google Cloud credentials are not configured. Set GOOGLE_APPLICATION_CREDENTIALS, GCP_SERVICE_ACCOUNT_KEY, or GCP_CLIENT_EMAIL/GCP_PRIVATE_KEY.",
				files: [],
			},
			{ status: 503 }
		);
	}

	try {
		const [objects] = await getStorageClient().bucket(bucketName).getFiles({
			autoPaginate: false,
			prefix,
		});

		const files = objects
			.filter((object) => {
				if (!object.name || object.name.endsWith("/")) {
					return false;
				}

				const fileName = object.name.split("/").pop();
				return fileName !== "course_info.json";
			})
			.map((object) => {
				const metadata = object.metadata;

				return {
					contentType: metadata.contentType,
					name: object.name.split("/").pop() || object.name,
					path: object.name,
					size: metadata.size ? Number(metadata.size) : undefined,
					updated: metadata.updated,
				};
			})
			.sort((left, right) => {
				if (!left.updated || !right.updated) {
					return left.name.localeCompare(right.name);
				}

				return new Date(right.updated).getTime() - new Date(left.updated).getTime();
			});

		return NextResponse.json({ bucketName, files, prefix });
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Unable to reach Google Cloud Storage from the app server.";

		const isCredentialError = /credential|authentication|auth|private key|client_email|Could not load the default credentials/i.test(
			message
		);

		return NextResponse.json(
			{
				error: message,
				files: [],
			},
			{ status: isCredentialError ? 503 : 502 }
		);
	}
}