import { expect, test } from "@playwright/test";

test.describe("SIGN IN", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("Should find the sign in page", async ({ page }) => {
		await expect(page).toHaveTitle(/SMAT/);
	});

	test("Should direct to sign in page", async ({ page }) => {
		const dashboardBtn = page.getByRole("link", { name: "Access dashboard" });
		await dashboardBtn.waitFor();
		await dashboardBtn.click();
		await expect(page).toHaveTitle(/Sign in/);

		await page
			.getByRole("heading", { name: "Welcome to SMAT Token" })
			.waitFor();
		await page.getByRole("button", { name: "Sign in", exact: true }).waitFor();
		await page.getByRole("button", { name: "Sign in with Ethereum" }).waitFor();
	});
});
