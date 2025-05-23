import { GET_UNHANDLED_ERROR } from "@/utils";
import { toast } from "react-toastify";

interface ICopyOrShareUrl {
	url?: string;
	title: string;
	toastText?: string;
	breakpoint?: boolean;
	text?: string;
	disableToast?: boolean;
}

export default async function copyToClipboard({
	url,
	title,
	toastText,
	breakpoint,
	text,
	disableToast,
}: ICopyOrShareUrl) {
	const isOperaBrowser = navigator?.userAgent?.includes("OPR");
	const isMozillaInAndroid = navigator?.userAgent?.match(
		/Mozilla.*Android|Mozilla.*Android/i,
	);
	const shareObject = { title, url, text };
	if (!text) delete shareObject.text;
	if (!url) delete shareObject.url;

	if (breakpoint && navigator.share && !isOperaBrowser && !isMozillaInAndroid) {
		if (window?.location?.protocol !== "https:")
			console.error("Share API needs HTTPS to work");
		await navigator
			.share(shareObject)
			.then(() => {
				toast.success(toastText || "Copied to clipboard");
				return "Copied successfully";
			})
			.catch((error) => {
				console.error(error);
				toast.error(error || GET_UNHANDLED_ERROR);
				return error || "error";
			});
	} else {
		const value = url || text;
		if (value) {
			await navigator?.clipboard?.writeText(value);
		}
		if (disableToast) return;
		toast.success(toastText || "Copied to clipboard");
	}
}
