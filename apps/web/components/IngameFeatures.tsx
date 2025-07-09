import {
	AnimatePresence,
	EnterAnimation,
	FadeAnimation,
} from "@mjs/ui/components/motion";
import { cn } from "@mjs/ui/lib/utils";
import {
	CardContent,
	CardDescription,
	CardTitle,
} from "@mjs/ui/primitives/card";
import { Card, CardHeader } from "@mjs/ui/primitives/card";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export const IngameFeatures = async () => {
	const t = await getTranslations("GameFeatures.features");
	const features = [
		"stayInGame",
		"trainableAI",
		"collectCharacters",
		"bringFriends",
	] as const;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{features.map((feature, i) => {
				return (
					<AnimatePresence key={feature}>
						<FeatureCard
							key={feature}
							title={t(`${feature}.title`)}
							description={t(`${feature}.description`)}
							image={`/static/images/features${i + 1}.webp`}
							delay={i * 0.2}
						/>
					</AnimatePresence>
				);
			})}
		</div>
	);
};

const FeatureCard = ({
	className,
	title,
	description,
	image,
	delay = 0,
}: {
	className?: string;
	title: string;
	description: string;
	image: string;
	delay?: number;
}) => {
	return (
		<FadeAnimation delay={delay} className="h-full">
			<Card
				className={cn(
					"glassy text-foreground flex flex-col shadow-lg! h-full",
					className,
				)}
			>
				<EnterAnimation delay={delay}>
					<CardHeader className="shrink-0 aspect-square grid place-items-center">
						<picture className="[&>img]:cool-shadow">
							<Image
								src={image}
								alt={"Feature character image"}
								width={200}
								height={200}
								className="object-cover"
								style={{
									filter: "drop-shadow(0 0 10px rgba(0, 0, 0, .25))",
								}}
							/>
						</picture>
					</CardHeader>
				</EnterAnimation>
				<CardContent className="space-y-2 flex-1">
					<CardTitle className="text-3xl font-bold font-common text-center">
						{title}
					</CardTitle>
					<CardDescription className="text-center text-lg font-common font-base">
						{description}
					</CardDescription>
				</CardContent>
			</Card>
		</FadeAnimation>
	);
};
