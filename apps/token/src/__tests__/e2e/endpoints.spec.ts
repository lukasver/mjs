import crypto from "crypto";
import { APIResponse, expect } from "@playwright/test";
import { test } from "../config/fixtures";

const ADMIN_ENDPOINTS = [
	{ method: "POST", url: "/api/sales" },
	{ method: "PATCH", url: "/api/sales" },
	{ method: "PATCH", url: `/api/transactions/${crypto.randomUUID()}` },
	{ method: "POST", url: `/api/transactions/${crypto.randomUUID()}` },
	{ method: "GET", url: `/api/admin/transactions` },
	{ method: "PATCH", url: `/api/admin/transactions` },
	{ method: "POST", url: `/api/salesInformation` },
	{ method: "PATCH", url: `/api/salesInformation` },
];
const PROTECTED_ENDPOINTS = [
	{ method: "GET", url: "/api/user" },
	{ method: "POST", url: "/api/user" },
	{ method: "PATCH", url: "/api/user" },
	{ method: "GET", url: `/api/user/${crypto.randomUUID()}` },
	{ method: "DELETE", url: `/api/user/${crypto.randomUUID()}` },
	{ method: "PATCH", url: "/api/user" },
	{ method: "GET", url: "/api/sales" },
	{ method: "POST", url: "/api/contract" },
	{ method: "GET", url: "/api/minio", status: 400 },
	{ method: "PUT", url: "/api/minio" },
	{ method: "POST", url: "/api/minio" },
	{ method: "DELETE", url: "/api/minio" },
	{ method: "GET", url: "/api/captcha" },
	{ method: "GET", url: "/api/transactions", status: 409 },
	{ method: "POST", url: "/api/transactions" },
	{ method: "PATCH", url: "/api/transactions" },
	{ method: "GET", url: `/api/emailVerification`, status: 400 },
	{ method: "POST", url: `/api/emailVerification` },
	{ method: "DELETE", url: `/api/emailVerification` },
	{ method: "GET", url: `/api/transactions/${crypto.randomUUID()}` },
];
const UNPROTECTED_ENDPOINTS = [{ method: "GET", url: "/api/test" }];

test.describe("ENDPOINTS", () => {
	test("Guest should not be able to call any protected nor admin endpoints", async ({
		page,
	}) => {
		const fetch = page.request;
		for (const endpoint of [...ADMIN_ENDPOINTS, ...PROTECTED_ENDPOINTS]) {
			console.debug(`Fetching [${endpoint.method}]${endpoint.url}`);
			const response: APIResponse = await fetch[endpoint.method.toLowerCase()](
				endpoint.url,
			);
			const status = response.status();
			if (status === 404) {
				// skip not found rutes like /api/transactions/{id}
				continue;
			} else {
				// UNAUTHORIZED
				expect(response.status()).toBe(401);
			}
		}
		for (const endpoint of UNPROTECTED_ENDPOINTS) {
			console.debug(`Fetching [${endpoint.method}]${endpoint.url}`);
			const response: APIResponse = await fetch[endpoint.method.toLowerCase()](
				endpoint.url,
			);
			const status = response.status();
			expect(status).toBe(200);
		}
	});

	test("Admin user should be allow to call protected endpoints", async ({
		adminPage,
	}) => {
		const fetch = adminPage.page.request;
		for (const endpoint of ADMIN_ENDPOINTS) {
			console.debug(`Fetching [${endpoint.method}]${endpoint.url}`);
			const response: APIResponse = await fetch[endpoint.method.toLowerCase()](
				endpoint.url,
			);
			const status = response.status();
			if (status === 404) {
				// skip not found rutes like /api/transactions/{id}
				continue;
			} else {
				expect(status).toBe(endpoint.method === "GET" ? 200 : 400);
			}
		}
	});
	test("Non admin user should not be allowed to call protected admin endpoints but protected ones", async ({
		authenticatedPage: { page },
	}) => {
		const fetch = page.request;
		for (const endpoint of ADMIN_ENDPOINTS) {
			console.debug(`Fetching [${endpoint.method}]${endpoint.url}`);
			const response: APIResponse = await fetch[endpoint.method.toLowerCase()](
				endpoint.url,
			);
			const status = response.status();
			if (status === 404) {
				// skip not found rutes like /api/transactions/{id}
				continue;
			} else {
				// FORBIDDEN
				expect(status).toBe(403);
			}
		}
		for (const endpoint of PROTECTED_ENDPOINTS) {
			console.debug(`Fetching [${endpoint.method}]${endpoint.url}`);
			const response: APIResponse = await fetch[endpoint.method.toLowerCase()](
				endpoint.url,
			);
			const status = response.status();
			if (status === 404) {
				// skip not found rutes like /api/transactions/{id}
				continue;
			} else if (endpoint.status) {
				expect(status).toBe(endpoint.status);
			} else {
				expect(status).toBe(endpoint.method === "GET" ? 200 : 400);
			}
		}
	});
});
