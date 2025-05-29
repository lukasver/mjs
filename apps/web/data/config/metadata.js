const VERCEL_URL =
	process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

const domain =
	VERCEL_URL ||
	process.env.NEXT_PUBLIC_DOMAIN?.split("://")?.[1] ||
	"mahjongstars.comn";

const metadata = {
	title: "Mahjong Stars",
	description: "Join the Web3 Mahjong Game",
	domain,
	logoTitle: "Mahjong Stars",
	businessName: "Mahjong Stars",
	siteUrl: `http${
		process.env.NODE_ENV === "development" ? "" : "s"
	}://${domain}`,
	siteRepo: "",
	socialBanner: "/api/og",
	supportEmail: "contact@mahjongstars.com",
	email: "contact@mahjongstars.com",
	twitter: "https://x.com/mahjongstars",
	instagram: "https://instagram.com/@mahjongstars",
	tiktok: "https://tiktok.com/@mahjongstars",
	github: "",
	linkedin: "",
	youtube: "",
	facebook: "",
	threads: "",
	mastodon: "",
	author: "WASABI GAMES DMCC",
	language: "en",
	theme: "system",
	locale: "en",
};

module.exports = { metadata };
