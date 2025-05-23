import bundleAnalyzer from "@next/bundle-analyzer";
import { type NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const BUNDLE_ANALIZER_ON = process.env.ANALYZE === "true";

const CRYPTO_NODES = {
	mainnet: `wss://eth-mainnet.g.alchemy.com https://eth-mainnet.g.alchemy.com`,
	sepolia: `wss://eth-sepolia.g.alchemy.com https://eth-sepolia.g.alchemy.com`,
	goerli: `wss://eth-goerli.g.alchemy.com https://eth-goerli.g.alchemy.com`,
	polygon: `wss://polygon-mainnet.g.alchemy.com https://polygon-mainnet.g.alchemy.com`,
	mumbai: `wss://polygon-mumbai.g.alchemy.com https://polygon-mumbai.g.alchemy.com`,
};

const CRYPTO_NODES_CSP = Object.values(CRYPTO_NODES).join(" ");
const WALLETS_CSP = `wss://*.walletconnect.org wss://*.walletconnect.com https://*.walletconnect.org https://*.walletconnect.com`;
const EXTERNAL_PROVIDERS = `min-api.cryptocompare.com`;
const ANALYTICS_PROVIDERS = `*.plausible.io`;
const GOOGLE_CSP = `https://fonts.googleapis.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha https://www.google.com/recaptcha/enterprise.js https://www.gstatic.com/recaptcha/releases/`;
const MAIN_DOMAIN =
	process.env.NODE_ENV === "production"
		? `https://*.smat.io https://api.beta.smat.io`
		: `https://*.smat.io https://api.stage.smat.io http://localhost:3000 http://proxyman.debug:3000`;
const ADOBE = `https://*.adobesign.com/api/rest/v6/`;
const MINIO_DOMAIN =
	process.env.NODE_ENV === "production" && process.env.IS_STAGE !== "true"
		? `https://cdn.beta.smat.io`
		: "https://minio.stage.smat.io";

const cspHeader = `
    default-src 'self' ${MAIN_DOMAIN};
    connect-src 'self' ${MAIN_DOMAIN} ${ANALYTICS_PROVIDERS} ${EXTERNAL_PROVIDERS} ${WALLETS_CSP} ${CRYPTO_NODES_CSP} ${ADOBE} ${MINIO_DOMAIN};
    frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha https://*.adobesign.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' ${ANALYTICS_PROVIDERS} ${GOOGLE_CSP} ${ADOBE};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: ${MAIN_DOMAIN} https://*.walletconnect.org https://*.walletconnect.com https://purecatamphetamine.github.io/;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' *.calendly.com *.adobesign.com;
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

export default () => {
	const plugins = [
		bundleAnalyzer({
			enabled: BUNDLE_ANALIZER_ON,
		}),
		createNextIntlPlugin("./src/lib/i18n.ts"),
	];
	return plugins.reduce((acc, next) => next(acc), {
		reactStrictMode: true,
		async headers() {
			return [
				{
					source: "/(.*)",
					headers: [
						{
							key: "Content-Security-Policy",
							value: cspHeader.replace(/\n/g, ""),
						},
					],
				},
			];
		},

		images: {
			remotePatterns: [
				{
					protocol: "https",
					hostname: "picsum.photos",
					port: "",
				},
			],
		},
		experimental: {
			optimizePackageImports: ["wagmi", "@mjs/ui"],
		},
		compiler: {
			// Automatically remove console.* other than 'error' & 'info' in production,
			...(process.env.NODE_ENV !== "development" && {
				removeConsole: {
					exclude: ["error", "info", "debug", "warn"],
				},
			}),
		},
		// productionBrowserSourceMaps: !!(process.env.NODE_ENV === "production"),
	} as NextConfig);
};
