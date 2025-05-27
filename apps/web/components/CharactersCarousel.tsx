import {
	Carousel,
	CarouselBullets,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@mjs/ui/primitives/carousel";

import { cn } from "@mjs/ui/lib/utils";
import { getTranslations } from "next-intl/server";
import Image from "./Image";

async function CharactersCarousel() {
	const t = await getTranslations();
	const chars = ["tonyKong", "anneWan", "mrsChen", "uncleCai"] as const;

	return (
		<Carousel className="w-full">
			<CarouselContent>
				{chars.map((char, i) => {
					return (
						<CarouselItem key={char}>
							<CharacterCarouselCard
								image={`/static/images/char${i + 1}.png`}
								quote={t(`Characters.${char}.quote`)}
								name={t(`Characters.${char}.name`)}
								description={t(`Characters.${char}.description`)}
							/>
						</CarouselItem>
					);
				})}
			</CarouselContent>
			<CarouselBullets />
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}

const CharacterCarouselCard = ({
	image,
	quote,
	name,
	description,
}: {
	image: string;
	quote: string;
	name: string;
	description: string;
}) => {
	return (
		<div className="flex flex-row gap-4 h-full">
			<picture className="h-full w-full max-w-lg relative grid place-items-center min-h-[550px]">
				<Image
					src={image}
					alt={name}
					fill
					className="object-contain"
					style={{
						filter: "drop-shadow(0 0 10px rgba(0, 0, 0, .25))",
					}}
				/>
			</picture>
			<div className="flex flex-col gap-4 justify-evenly">
				<Quote className="max-w-md">{quote}</Quote>
				<div className="flex flex-col gap-8 max-w-lg">
					<Name>{name}</Name>
					<Description>{description}</Description>
				</div>
			</div>
		</div>
	);
};

const Quote = ({
	children,
	withArrow = true,
	className,
}: {
	children: React.ReactNode;
	withArrow?: boolean;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"rounded-xl p-4 border-2 border-solid border-foreground bg-primary text-center w-fit max-w-md relative text-ellipsis",
				withArrow && [
					// Border arrow
					'before:content-[""] before:absolute before:left-4 before:top-[100%] before:border-t-[22px] before:border-r-[22px] before:border-t-foreground before:border-r-transparent before:bg-transparent before:rounded-b-md',
					// Background arrow
					'after:content-[""] after:absolute after:left-[18px] after:top-[100%] after:border-t-[18px] after:border-r-[18px] after:border-t-primary after:border-r-transparent after:bg-transparent',
				],
				"shadow-sm",
				className,
			)}
		>
			<blockquote className="text-2xl font-semibold w-fit">
				{children}
			</blockquote>
		</div>
	);
};

const Name = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent to-transparent">
			<h3 className="text-5xl font-semibold font-head">{children}</h3>
		</div>
	);
};

const Description = ({ children }: { children: React.ReactNode }) => {
	return (
		<p
			className={cn(
				"text-xl font-semibold py-8 px-4 font-common",
				"bg-gradient-to-b from-white/5 to-transparent rounded-xl",
			)}
		>
			{children}
		</p>
	);
};

export default CharactersCarousel;
