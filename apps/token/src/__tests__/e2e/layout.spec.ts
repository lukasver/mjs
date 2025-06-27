import { expect } from "@playwright/test";
import { Profile, User } from "@prisma/client";
import { test } from "../config/fixtures";

interface UserWithProfile extends User {
	profile: Profile;
}

test.describe("BASIC NAVIGATIONS", () => {
	test("User should see basic layout and controls", async ({
		authenticatedPage: { page },
	}) => {
		await page.goto("/dashboard");
		const data: { user: UserWithProfile } = await (
			await page.request.get("/api/user")
		)?.json();
		const user = data?.user;
		await page.waitForURL("/dashboard");
		await page
			.getByRole("button", { name: "dashboard" })
			.waitFor({ state: "visible" });

		await expect(
			page.getByRole("link", { name: "Buy Token", exact: true }),
		).toBeVisible();
		await expect(page.getByRole("link", { name: "Admin" })).not.toBeVisible();
		await expect(page.getByRole("button", { name: "more" })).toBeVisible();
		await expect(
			page.locator("span").filter({ hasText: user.profile.name! }),
		).toBeVisible();
	});
	test("User trying to manipulate url to access admin page should be rerouted", async ({
		authenticatedPage: { page },
	}) => {
		await page.goto("/admin/sales");
		await page.waitForURL("/dashboard");
		await page.goto("/admin/new-sale?step=create");
		await page.waitForURL("/dashboard");
		await page.goto("/admin/transactions");
		await page.waitForURL("/dashboard");
	});
	test("Admin should see admin button", async ({ adminPage: { page } }) => {
		await page.goto("/dashboard");
		await page.getByRole("link", { name: "Admin" }).click();
		await page.waitForURL("/admin/sales");
		await page.getByRole("tab", { name: "transactions" }).click();
		await page.waitForURL("/admin/transactions");
	});
});
