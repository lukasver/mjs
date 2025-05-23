import { FullConfig, Page, test as base, chromium } from "@playwright/test";
import dotenv from "dotenv";
import { signInUser } from "./utils";

dotenv.config({ path: [".env.test.local"] });

const PASSWORD = "asdASD123";

const USERS = [
	{
		username: "devs+admin@smat.io",
		password: PASSWORD,
		path: "adminState.json",
	},
	{
		username: "devs+test@smat.io",
		password: PASSWORD,
		path: "authenticatedState.json",
	},
];

async function globalSetup(config: FullConfig) {
	if (!process.env.RENEW_STATE) return;
	const { baseURL } = config.projects[0].use;
	console.info("ENV: ", process.env.NODE_ENV);
	console.info("BASE_URL: ", baseURL);

	for (const { username, password, path } of USERS) {
		console.info(`⌚️ Saving global config for ${username}, please wait...`);
		const browser = await chromium.launch();
		const page = await browser.newPage({
			baseURL,
		});
		await signInUser(page, {
			username,
			password,
		});
		await page.context().storageState({
			path: `${process.cwd()}/src/__tests__/config/states/${path}` as string,
		});

		console.info(`🌐 Logged in succesfully as ${username}!`);
		await browser.close();
	}
}

class SignedInPage {
	page: Page;

	constructor(page: Page) {
		this.page = page;
	}
}

type MyFixtures = {
	adminPage: SignedInPage;
	authenticatedPage: SignedInPage;
};

const createCustomPage =
	(fileName: string) =>
	async ({ browser }, use) => {
		const context = await browser.newContext({
			storageState: `${__dirname}/states/${fileName}`,
		});
		const pageWithContext = new SignedInPage(await context.newPage());
		await pageWithContext.page.goto("/");
		await use(pageWithContext);
	};

export const test = base.extend<MyFixtures>({
	adminPage: createCustomPage("adminState.json"),
	authenticatedPage: createCustomPage("authenticatedState.json"),
});

export default globalSetup;
