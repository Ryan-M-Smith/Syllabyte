/**
 * @file lib/gcs.ts
 * @description Shared Google Cloud Storage helpers for uploads and file listing
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import { Storage } from "@google-cloud/storage";

let storageClient: Storage | null = null;

function normalizePathSegment(value: string) {
	return value.trim().replace(/^\/+|\/+$/g, "");
}

export function getBucketName() {
	const bucketName = process.env.GCP_BUCKET_NAME?.trim();
	if (!bucketName) {
		throw new Error("Set GCP_BUCKET_NAME to enable Google Cloud Storage access.");
	}

	return bucketName;
}

export function getStorageClient() {
	if (!storageClient) {
		storageClient = new Storage();
	}

	return storageClient;
}

export function normalizeCourseId(courseId: string) {
	return normalizePathSegment(courseId.toUpperCase());
}

export function getCourseUploadPrefix(courseId: string) {
	const normalizedCourseId = normalizeCourseId(courseId);
	if (!normalizedCourseId) {
		throw new Error("A course identifier is required.");
	}

	return `uploads/${normalizedCourseId}`;
}

export function buildObjectPath(courseId: string, fileName: string) {
	const safeFileName = fileName.split("/").pop()?.trim();
	if (!safeFileName) {
		throw new Error("A valid file name is required.");
	}

	return `${getCourseUploadPrefix(courseId)}/${safeFileName}`;
}