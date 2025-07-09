import path from "path";
import { ImageResponse } from "@vercel/og";
import { readFile } from "fs/promises";
import sizeOf from "image-size";
import mime from "mime-types";
import sharp from "sharp";
import { metadata } from "../common/config/site";

export const alt = "Mahjong Stars";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/jpeg";

const MAX_LOGO_HEIGHT = 150;
const MAX_LOGO_WIDTH = 350;

const getLogoSize = (dimensions: { width: number; height: number }) => {
	// Calculate image size, with the height being maximum MAX_LOGO_HEIGHT or width being maximum MAX_LOGO_WIDTH
	const imageWidth = dimensions.width;
	const imageHeight = dimensions.height;

	let logoWidth = imageWidth;
	let logoHeight = imageHeight;

	if (imageWidth > MAX_LOGO_WIDTH) {
		logoWidth = MAX_LOGO_WIDTH;
		logoHeight = (imageHeight * MAX_LOGO_WIDTH) / imageWidth;
	}

	if (logoHeight > MAX_LOGO_HEIGHT) {
		logoHeight = MAX_LOGO_HEIGHT;
		logoWidth = (imageWidth * MAX_LOGO_HEIGHT) / imageHeight;
	}

	return {
		logoWidth,
		logoHeight,
	};
};

const compressArrayBuffer = async (
	arrayBuffer: ArrayBuffer,
): Promise<ArrayBuffer> => {
	const buffer = Buffer.from(arrayBuffer);
	const compressedBuffer = await sharp(buffer).jpeg({ quality: 65 }).toBuffer();
	return new Uint8Array(compressedBuffer).buffer;
};

async function loadGoogleFont(font: string, text: string) {
	const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
		text,
	)}`;
	const css = await (await fetch(url)).text();
	const resource = css.match(
		/src: url\((.+)\) format\('(opentype|truetype)'\)/,
	);

	if (resource) {
		// @ts-expect-error wontfix
		const response = await fetch(resource[1]);
		if (response.status == 200) {
			return await response.arrayBuffer();
		}
	}

	throw new Error("failed to load font data");
}

export default async function Image() {
	const imagePath = path.join(
		process.cwd(),
		"/public/static/favicons/android-chrome-512x512.png",
	);
	const bgPath = path.join(process.cwd(), "/public/static/images/bg2.png");

	const title = metadata.title;
	const description = metadata.description;

	const [logo, bg, teachersTitle, teachersDescription] = await Promise.all([
		readFile(imagePath),
		readFile(bgPath),
		loadGoogleFont("Teachers:wght@700", title),
		loadGoogleFont("Teachers", description),
		// readFile(path.join(process.cwd(), '/public/fonts/clash.ttf')),
	]);

	const mimeType = mime.lookup(imagePath);
	const bgMimeType = mime.lookup(bgPath);
	const dimensions = sizeOf(logo) as { width: number; height: number };

	const { logoWidth, logoHeight } = getLogoSize(dimensions);
	const logoImage = `data:${mimeType};base64,${logo.toString("base64")}`;
	const bgImage = `data:${bgMimeType};base64,${bg.toString("base64")}`;

	const imageResponse = new ImageResponse(
		<div
			style={{
				display: "flex",
				height: "100%",
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				// background: '#4a0000',
				backgroundImage: `url(${bgImage})`,
				position: "relative",
			}}
		>
			<div
				style={{
					padding: 60,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					height: "100%",
				}}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={logoImage}
					alt="Logo"
					style={{
						padding: 10,
						backgroundColor: "transparent",
						borderRadius: "100%",
						width: logoWidth,
						height: logoHeight,
					}}
				/>

				<h1
					style={{
						fontSize: 60,
						fontWeight: 700,
						color: "white",
						marginBottom: 0,
						textAlign: "center",
						fontFamily: "TeachersTitle",
					}}
				>
					{title}
				</h1>
				<p
					style={{
						marginTop: 12,
						fontSize: 32,
						color: "white",
						fontWeight: 400,
						textAlign: "center",
						fontFamily: "TeachersDescription",
					}}
				>
					{description}
				</p>
			</div>
		</div>,
		{
			width: 1200,
			height: 600,
			fonts: [
				{
					name: "TeachersTitle",
					data: teachersTitle,
					style: "normal",
					weight: 700,
				},
				{
					name: "TeachersDescription",
					data: teachersDescription,
					style: "normal",
				},
			],
		},
	);

	const arrayBuffer = await imageResponse.arrayBuffer();
	const compressedImage = await compressArrayBuffer(arrayBuffer);

	const headers = new Headers();
	headers.set("Content-Type", "image/jpeg");
	// the Cache-Control header was set in the ImageResponse so I copied it here
	headers.set(
		"Cache-Control",
		"public, immutable, no-transform, max-age=31536000",
	);
	return new Response(compressedImage, {
		status: 200,
		statusText: "OK",
		headers,
	});
}
