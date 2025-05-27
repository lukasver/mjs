// const { withContentlayer } = require("next-contentlayer2");
import createNextIntlPlugin from "next-intl/plugin";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com *.vercel-scripts.com *.cloudflareinsights.com *.posthog.com; 
  style-src 'self' 'unsafe-inline';
  img-src *.supabase.co * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
`;

const securityHeaders = [
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
	{
		key: "Content-Security-Policy",
		value: ContentSecurityPolicy.replace(/\n/g, ""),
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
	const plugins = [
		withBundleAnalyzer,
		createNextIntlPlugin("./lib/i18n/request.ts"),
	];
	return plugins.reduce((acc, next) => next(acc), {
		reactStrictMode: true,
		typescript: {
			ignoreBuildErrors: true,
		},
		// eslint: {
		//   ignoreDuringBuilds: true,
		// },
		transpilePackages: ["@mjs/ui"],
		pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
		eslint: {
			dirs: ["app", "components", "layouts", "scripts"],
		},
		images: {
			remotePatterns: [
				{
					protocol: "https",
					hostname: "picsum.photos",
					port: "",
					pathname: "**/*",
				},
				{
					protocol: "https",
					hostname: "shipixen.com",
					port: "",
					pathname: "**/*",
				},
			],
		},
		// PostHog rewrites to proxy ingest requests
		async rewrites() {
			return [
				{
					source: "/ingest/static/:path*",
					destination: "https://eu-assets.i.posthog.com/static/:path*",
				},
				{
					source: "/ingest/:path*",
					destination: "https://eu.i.posthog.com/:path*",
				},
				{
					source: "/ingest/decide",
					destination: "https://eu.i.posthog.com/decide",
				},
			];
		},
		// This is required to support PostHog trailing slash API requests
		skipTrailingSlashRedirect: true,
		async headers() {
			return [
				{
					source: "/(.*)",
					headers: securityHeaders,
				},
			];
		},
		webpack: (config, _options) => {
			config.module.rules.push({
				test: /\.svg$/,
				use: ["@svgr/webpack"],
			});

			return config;
		},
	});
};
