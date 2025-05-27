import { getTranslations } from "next-intl/server";
import Image from "./Image";

export const GameVariants = async () => {
	const t = await getTranslations("GameVariants.variants");
	const variants = ["shenzhen", "riichi"] as const;

	return (
		<div className="grid grid-cols-2 gap-20">
			{variants.map((variant, i) => {
				return (
					<div key={variant} className="space-y-4">
						<div className="shadow-xl">
							<Image
								src={`/static/images/game${i + 1}.png`}
								alt={t(`${variant}.title`)}
								height={283}
								width={612}
								// sizes='(min-width: 808px) 50vw, 100vw'
								className="rounded-2xl shadow-lg"
							/>
						</div>
						<div className="[&>*]:text-center">
							<h3 className="text-2xl font-bold font-common">
								{t(`${variant}.title`)}
							</h3>
							<p className="text-lg font-common font-base">
								{t(`${variant}.description`)}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};
