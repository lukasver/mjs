import { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n/get-dictionaries";
import { applyUTM } from "@/lib/utm";
import Icon from "@/public/static/favicons/favicon-48x48.png";
import Image from "next/image";
import Link from "next/link";
import { Banner as BannerComponent } from "nextra/components";

export const Banner = async ({ lang }: { lang: Locale }) => {
	const t = await getTranslations(lang);

	return (
		<BannerComponent storageKey="mjs-key" dismissible>
			<div className="flex items-center gap-2 justify-center">
				<Image
					blurDataURL={Icon.blurDataURL}
					priority
					src={Icon.src}
					alt="MJS Token"
					width={20}
					height={20}
				/>
				<Link
					href={applyUTM(
						`/web/${lang && lang !== "en" ? `${lang}/` : ""}#newsletter`,
						{
							source: "docs",
							medium: "banner",
							campaign: "newsletter_signup",
							content: "top_banner",
						},
					)}
				>
					{t("Global.banner.title")}
				</Link>
			</div>
		</BannerComponent>
	);
};
