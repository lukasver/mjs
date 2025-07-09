import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_LOCALES } from "@mjs/i18n";

async function main() {
	const messagesDir = path.join(__dirname, "..", "messages");

	await fs.mkdir(messagesDir, { recursive: true });

	const res = await Promise.allSettled(
		DEFAULT_LOCALES.map(async (locale) => {
			const messages = await import(`@mjs/i18n/web/${locale}.json`);
			const dest = path.join(messagesDir, `${locale}.json`);
			await fs.writeFile(dest, JSON.stringify(messages, null, 2));
		}),
	);
	if (!res.every((r) => r.status === "fulfilled")) {
		console.error(
			"Failed to copy localization messages",
			JSON.stringify(res.filter((r) => r.status === "rejected")),
		);
		process.exit(1);
	}
}

try {
	main().then(() => {
		console.log("Localization messages copied");
	});
} catch (error) {
	console.error(error);
	process.exit(1);
}
