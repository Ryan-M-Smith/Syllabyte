/**
 * @file app/api/bucket-upload/route.ts
 * @description Server route for uploading course materials into Google Cloud Storage
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { NextResponse } from "next/server";

import {
	buildObjectPath,
	getBucketName,
	getCourseUploadPrefix,
	hasStorageCredentialsConfigured,
	getStorageClient,
	normalizeCourseId,
} from "@/lib/gcs";

export async function POST(request: Request) {
	let bucketName: string;

	try {
		bucketName = getBucketName();
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Google Cloud Storage is not configured." },
			{ status: 503 }
		);
	}

	const formData = await request.formData();
	const file = formData.get("file");
	const courseIdValue = formData.get("course_id");

	if (!(file instanceof File)) {
		return NextResponse.json({ error: "A file upload is required." }, { status: 400 });
	}

	if (typeof courseIdValue !== "string" || !courseIdValue.trim()) {
		return NextResponse.json({ error: "A course_id is required." }, { status: 400 });
	}

	const courseId = normalizeCourseId(courseIdValue);
	const objectPath = buildObjectPath(courseId, file.name);

	if (!hasStorageCredentialsConfigured()) {
		return NextResponse.json(
			{
				error:
					"Google Cloud credentials are not configured. Set GOOGLE_APPLICATION_CREDENTIALS, GCP_SERVICE_ACCOUNT_KEY, or GCP_CLIENT_EMAIL/GCP_PRIVATE_KEY.",
			},
			{ status: 503 }
		);
	}

	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		const bucket = getStorageClient().bucket(bucketName);
		const blob = bucket.file(objectPath);

		await blob.save(buffer, {
			contentType: file.type || undefined,
			metadata: {
				metadata: {
					courseId,
					originalName: file.name,
				},
			},
			resumable: false,
			validation: "crc32c",
		});

		return NextResponse.json({
			bucketName,
			courseId,
			path: objectPath,
			prefix: getCourseUploadPrefix(courseId),
			success: true,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Upload to Google Cloud Storage failed.";
		const isCredentialError = /credential|authentication|auth|private key|client_email|Could not load the default credentials/i.test(
			message
		);

		return NextResponse.json(
			{
				error: message,
			},
			{ status: isCredentialError ? 503 : 502 }
		);
	}
}