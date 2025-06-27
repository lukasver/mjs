import {
	PricingTier,
	PricingTierFrequency,
} from "@/data/config/pricingDataInterface";

export const pricingTiers: PricingTier[] = [
	{
		name: "Free",
		id: "tier-1",
		href: "/subscribe",
		discountPrice: { "1": "", "2": "" },
		price: { "1": "$0", "2": "$0" },
		description: "Get all goodies for free, no credit card required.",
		features: [
			"Multi-platform compatibility",
			"Real-time notification system",
			"Advanced user permissions",
		],
		featured: false,
		highlighted: false,
		cta: "Sign up",
	},
];

export const pricingFrequencies: PricingTierFrequency[] = [
	{
		id: "a341ac4b-cf22-4ad8-b816-4ffe6ee0e89b",
		value: "1",
		label: "Monthly",
		priceSuffix: "/month",
	},
	{
		id: "4621c825-148c-449f-9a73-a7aea514d0d9",
		value: "2",
		label: "Annually",
		priceSuffix: "/year",
	},
];
