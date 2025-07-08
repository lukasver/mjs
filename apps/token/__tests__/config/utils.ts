import { Page } from "@playwright/test";

export const signInUser = async (
	page: Page,
	{
		username = process.env.NEXT_PUBLIC_TEST_USER!,
		password = process.env.NEXT_PUBLIC_TEST_PWD!,
	} = {},
) => {
	await page.goto("/login");
	await page.waitForLoadState("load", { timeout: 1000 });

	const cookies = page.getByLabel("Accept cookies");
	if (await cookies.isVisible()) {
		await cookies.click();
	}

	await page.click('button:has-text("Sign In")');
	await page.waitForLoadState("load", { timeout: 1000 });
	await page.waitForURL(/zitadel/);
	await page.fill('//input[@type="text" and @name="loginName"]', username);
	await page.click("[id='submit-button']");
	await page.waitForLoadState("networkidle");
	await page.waitForURL(/login/);
	await page.fill('//input[@type="password" and @name="password"]', password);
	await page.click("[id='submit-button']");
	await page.waitForLoadState("domcontentloaded", { timeout: 1000 });
	if (
		await page
			.getByRole("heading", { name: "2-Factor setup (optional)" })
			.isVisible()
	) {
		await page.getByRole("button", { name: "Skip" }).click();
	}

	await page.reload();
	await page.waitForURL(/dashboard/);
};

export function countDecimalDigits(data: number | string) {
	let numberAsString: string;
	if (typeof data === "number") {
		numberAsString = data.toString();
	} else {
		numberAsString = data;
	}

	if (numberAsString.indexOf(".") === -1) {
		return 0; // No digits after the decimal point
	}

	return numberAsString.split(".")[1].length;
}
