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

import { getBucketName, getCourseUploadPrefix, getStorageClient } from "@/lib/gcs";

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

	try {
		const [objects] = await getStorageClient().bucket(bucketName).getFiles({
			autoPaginate: false,
			prefix,
		});

		const files = objects
			.filter((object) => object.name && !object.name.endsWith("/"))
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
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Unable to reach Google Cloud Storage from the app server.",
				files: [],
			},
			{ status: 502 }
		);
	}
}