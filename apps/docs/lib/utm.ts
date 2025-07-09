type UTM = {
	source: string;
	medium: string;
	campaign: string;
	content: string;
};

const keyMapping: Record<keyof UTM, string> = {
	source: "utm_source",
	medium: "utm_medium",
	campaign: "utm_campaign",
	content: "utm_content",
} as const;

export const applyUTM = (link: string, utm: UTM) => {
	const sp = new URLSearchParams();
	Object.entries(utm).forEach(([key, value]) => {
		sp.set(keyMapping[key as keyof UTM], value);
	});
	return `${link}?${sp.toString()}`;
};
