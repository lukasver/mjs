import {
	FAQPage,
	type Organization,
	type Thing,
	type WithContext,
} from "schema-dts";

/**
 * @description https://developers.google.com/search/docs/appearance/structured-data
 */
export const JsonLd = <T extends Thing>({
	jsonLd,
}: {
	jsonLd: WithContext<T>;
}) => {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
};

export const createOrganizationJsonLd = (): WithContext<Organization> => {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Mahjong Stars",
		legalName: "WASABI GAMES DMCC",
		url:
			process.env.NODE_ENV === "development"
				? "http://www.mahjongstars.com"
				: "https://www.mahjongstars.com",
		email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
		description: "Join the Web3 Mahjong Game",
		sameAs: [
			"https://x.com/mahjongstars",
			"https://instagram.com/@mahjongstars",
			"https://tiktok.com/@mahjongstars",
		].filter(Boolean),
		contactPoint: {
			"@type": "ContactPoint",
			email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
			contactType: "customer service",
		},
	};
};

export const createFaqJsonLd = (
	content: FAQPage["mainEntity"],
): WithContext<FAQPage> => {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		name: "FAQ",
		mainEntity: content,
	};
};
