export const CLIENT_FEATURES = {
	Ramp: process.env.NEXT_PUBLIC_FEATURE_RAMP === "true",
	Status: process.env.NEXT_PUBLIC_SMAT_TOKEN_STATUS === "true",
	Dashboard: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD === "true",
};

export const FEATURES = {
	V2Brand: process.env.NEXT_PUBLIC_V2_BRANDING === "true",
	PreSaleOpen: process.env.NEXT_PUBLIC_FEATURE_PRESALE_OPEN === "false",
};
