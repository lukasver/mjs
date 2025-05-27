export const getFooterLinks = (
	t: (k: string) => string,
): Array<{
	columnName: string;
	links: Array<{
		href: string;
		title: string;
	}>;
}> => {
	return [
		{
			columnName: "",
			links: [
				{ href: "#home", title: t("Footer.links.home") },
				{ href: "/about", title: t("Footer.links.whoWeAre") },
				{ href: "/terms", title: t("Footer.links.termsAndConditions") },
				{ href: "/privacy", title: t("Footer.links.privacyPolicy") },
				{ href: "/contact", title: t("Footer.links.contact") },
			],
		},
		// {
		// 	columnName: "Company",
		// 	links: [
		// 		{ href: "/", title: "Home" },
		// 		{ href: "/token", title: "Token" },
		// 		{ href: "/docs", title: "Docs" },
		// 		{ href: "/about", title: "About" },
		// 		{ href: "/all-articles", title: "Blog" },
		// 	],
		// },
		// { columnName: "Product", links: [] },
		// {
		// 	columnName: "Docs",
		// 	links: [
		// 		{ href: "/tokenomics", title: "Tokenomics" },
		// 		{ href: "/roadmap", title: "Roadmap" },
		// 	],
		// },
		// {
		// 	columnName: "Support",
		// 	links: [
		// 		{ href: "/support", title: "Contact us" },
		// 		{ href: "/terms", title: "Terms of Service" },
		// 		{ href: "/privacy", title: "Privacy Policy" },
		// 	],
		// },
	];
};
