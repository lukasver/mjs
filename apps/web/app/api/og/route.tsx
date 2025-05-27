import path from "path";
import { metadata } from "@/data/config/metadata";
import { colors } from "@mjs/ui/lib/colors";
import { ImageResponse } from "@vercel/og";
import { readFile } from "fs/promises";
import sizeOf from "image-size";
import mime from "mime-types";

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

export async function GET() {
	const imagePath = path.join(process.cwd(), "/public/static/images/logo.png");
	const file = await readFile(imagePath);
	const mimeType = mime.lookup(imagePath);
	const dimensions = sizeOf(file) as { width: number; height: number };

	const { logoWidth, logoHeight } = getLogoSize(dimensions);
	const logoImage = `data:${mimeType};base64,${file.toString("base64")}`;

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "space-between",
				position: "relative",
				backgroundColor: "transparent",
			}}
		>
			<svg
				viewBox="0 0 1024 1024"
				aria-hidden="true"
				style={{
					opacity: 1,
					width: "1000px",
					height: "1000px",
					position: "absolute",
					top: "-500px",
				}}
			>
				<circle
					cx="512"
					cy="512"
					r="512"
					fill={`url(#gradient)`}
					fillOpacity="0.7"
				></circle>
				<defs>
					<radialGradient
						id={`gradient`}
						cx="0"
						cy="0"
						r="1"
						gradientUnits="userSpaceOnUse"
						gradientTransform="translate(512 512) rotate(90) scale(512)"
					>
						<stop stopColor={colors.primary.light} stopOpacity="0.5"></stop>
						<stop
							offset="1"
							stopColor={colors.primary.lighter}
							stopOpacity="0"
						></stop>
					</radialGradient>
				</defs>
			</svg>

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
						padding: 20,
						backgroundColor: "white",
						borderRadius: "100%",
						width: logoWidth,
						height: logoHeight,
					}}
				/>

				<h1
					style={{
						fontSize: 48,
						fontWeight: 700,
						color: "black",
						marginBottom: 0,
						textAlign: "center",
					}}
				>
					{metadata.title}
				</h1>
				<p
					style={{
						marginTop: 12,
						fontSize: 26,
						color: "black",
						fontWeight: 700,
						textAlign: "center",
					}}
				>
					{metadata.description}
				</p>
			</div>
		</div>,
		{
			width: 1200,
			height: 600,
		},
	);
}
