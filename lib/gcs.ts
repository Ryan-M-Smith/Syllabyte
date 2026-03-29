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

type GcpServiceAccountCredentials = {
	client_email: string;
	private_key: string;
	project_id?: string;
};

function normalizePathSegment(value: string) {
	return value.trim().replace(/^\/+|\/+$/g, "");
}

function normalizePrivateKey(value: string) {
	return value.replace(/\\n/g, "\n");
}

function getServiceAccountCredentials(): GcpServiceAccountCredentials | null {
	const rawJson =
		process.env.GCP_SERVICE_ACCOUNT_KEY ||
		process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

	if (rawJson) {
		const parsed = JSON.parse(rawJson) as GcpServiceAccountCredentials;
		return {
			client_email: parsed.client_email,
			private_key: normalizePrivateKey(parsed.private_key),
			project_id: parsed.project_id,
		};
	}

	const clientEmail = process.env.GCP_CLIENT_EMAIL?.trim();
	const privateKey = process.env.GCP_PRIVATE_KEY?.trim();
	const projectId = process.env.GCP_PROJECT_ID?.trim();

	if (clientEmail && privateKey) {
		return {
			client_email: clientEmail,
			private_key: normalizePrivateKey(privateKey),
			project_id: projectId,
		};
	}

	return null;
}

export function hasStorageCredentialsConfigured() {
	return Boolean(
		process.env.GOOGLE_APPLICATION_CREDENTIALS ||
		process.env.GCP_SERVICE_ACCOUNT_KEY ||
		process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
		(process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY)
	);
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
		const credentials = getServiceAccountCredentials();

		storageClient = credentials
			? new Storage({
				credentials,
				projectId: credentials.project_id || process.env.GCP_PROJECT_ID,
			})
			: new Storage();
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

	const courseRoot = normalizePathSegment(process.env.GCP_BUCKET_PREFIX || "courses");

	return `${courseRoot}/${normalizedCourseId}`;
}

export function buildObjectPath(courseId: string, fileName: string) {
	const safeFileName = fileName.split("/").pop()?.trim();
	if (!safeFileName) {
		throw new Error("A valid file name is required.");
	}

	return `${getCourseUploadPrefix(courseId)}/${safeFileName}`;
}