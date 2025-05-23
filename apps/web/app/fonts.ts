import { Teachers } from "next/font/google";
import localFont from "next/font/local";

export const fontClash = localFont({
	src: "../public/fonts/clash.ttf",
	variable: "--font-head",
});

export const fontTeachers = Teachers({
	subsets: ["latin"],
	variable: "--font-sans",
});
