import { getAssets } from "@/services/minio.service";
import { IGetPlaiceholder } from "plaiceholder";
import { IGetImageReturn } from "plaiceholder/dist/get-image";

export const getPlaceholderImage = (
	width: number | string,
	height: number | string,
) => `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

const toBase64 = (str) =>
	typeof window === "undefined"
		? Buffer.from(str).toString("base64")
		: window.btoa(str);

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
    <stop stop-color="#d9d9d9" offset="10%" />
      <stop stop-color="#d6d6d6" offset="20%" />
      <stop stop-color="#f6f6f6" offset="30%" />
      <stop stop-color="#d6d6d6" offset="60%" />
      <stop stop-color="#f6f6f6" offset="80%" />
      <stop stop-color="#d9d9d9" offset="90%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#d9d9d9" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

interface ExtendedImageProps extends Pick<IGetImageReturn, "img"> {
	src: string;
	blurDataURL: string;
}
export interface GetLoginImagesReturn {
	[key: string]: ExtendedImageProps;
}

export const getLoginImages = async (
	getPlaiceholder: IGetPlaiceholder,
): Promise<GetLoginImagesReturn> => {
	const imagesResponse = await Promise.all([
		getPlaiceholder(getAssets("v2/v2-isologo.webp")),
		getPlaiceholder(getAssets("v2/SMAT_03.webp")),
		getPlaiceholder(getAssets("v2/SMAT_04.webp")),
		getPlaiceholder(getAssets("v2/v2-logo-tp.webp")),
		getPlaiceholder(getAssets("v2/v2-logo.webp")),
		getPlaiceholder(getAssets("v2/SMAT_07.webp")),
	]);

	return imagesResponse.reduce((agg, image, index) => {
		agg[loginImagesMapping[index]] = {
			...image.img,
			blurDataURL: image.base64,
		};
		return agg;
	}, {});
};

const loginImagesMapping = {
	0: "isologo",
	1: "waves",
	2: "blocks",
	3: "logoBlack",
	4: "logoWhite",
	5: "waterRight",
};
