/**
 * @file next.config.mjs
 * @description Next.js configuration for proxying OpenClaw API requests
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		const openClawUrl =
			process.env.OPENCLAW_URL ||
			process.env.NEXT_PUBLIC_OPENCLAW_URL ||
			process.env.OPEN_CLAW_URL ||
			process.env.NEXT_PUBLIC_OPEN_CLAW_URL;

		if (!openClawUrl) {
			return [];
		}

		return [
			{
				source: "/api/openclaw/:path*",
				destination: `${openClawUrl}/api/:path*`,
			},
		];
	},
};

export default nextConfig;
