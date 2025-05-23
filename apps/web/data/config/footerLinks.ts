export const footerLinks: Array<{
	columnName: string;
	links: Array<{
		href: string;
		title: string;
	}>;
}> = [
	{
		columnName: "Company",
		links: [
			{ href: "/", title: "Home" },
			{ href: "/token", title: "Token" },
			{ href: "/docs", title: "Docs" },
			{ href: "/about", title: "About" },
			{ href: "/all-articles", title: "Blog" },
		],
	},
	{ columnName: "Product", links: [] },
	{
		columnName: "Docs",
		links: [
			{ href: "/tokenomics", title: "Tokenomics" },
			{ href: "/roadmap", title: "Roadmap" },
		],
	},
	{
		columnName: "Support",
		links: [
			{ href: "/support", title: "Contact us" },
			{ href: "/terms", title: "Terms of Service" },
			{ href: "/privacy", title: "Privacy Policy" },
		],
	},
];
