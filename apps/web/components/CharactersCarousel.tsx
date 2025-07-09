import {
	Carousel,
	CarouselBullets,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@mjs/ui/primitives/carousel";

import Char1 from "@/public/static/images/char1.webp";
import Char2 from "@/public/static/images/char2.webp";
import Char3 from "@/public/static/images/char3.webp";
import Char4 from "@/public/static/images/char4.webp";

const mapping = {
	0: Char1,
	1: Char2,
	2: Char3,
	3: Char4,
} as const;

import { cn } from "@mjs/ui/lib/utils";
import { getTranslations } from "next-intl/server";
import { StaticImageData } from "next/image";
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
								image={mapping[i as keyof typeof mapping]}
								quote={t(`Characters.${char}.quote`)}
								name={t(`Characters.${char}.name`)}
								description={t(`Characters.${char}.description`)}
							/>
						</CarouselItem>
					);
				})}
			</CarouselContent>
			<CarouselBullets />
			<CarouselPrevious className="hidden! md:flex!" />
			<CarouselNext className="hidden! md:flex!" />
		</Carousel>
	);
}

const CharacterCarouselCard = ({
	image,
	quote,
	name,
	description,
}: {
	image: StaticImageData;
	quote: string;
	name: string;
	description: string;
}) => {
	return (
		<div className="grid grid-cols-1 grid-rows-1 md:flex md:flex-row gap-4 h-full">
			<picture className="h-full w-full max-w-lg relative grid place-items-center min-h-[500px] md:min-h-[550px] z-10 col-start-1 col-end-2 row-start-1 row-end-2">
				<Image
					alt={name}
					// fill
					className="object-contain"
					style={{
						filter: "drop-shadow(0 0 10px rgba(0, 0, 0, .25))",
					}}
					{...image}
				/>
			</picture>
			<div className="flex flex-col items-center md:items-start gap-4 justify-evenly z-20 col-start-1 col-end-2 row-start-1 row-end-2">
				<Quote className="max-w-md">{quote}</Quote>
				<div className="flex flex-col gap-2 md:gap-8 max-w-lg flex-1 justify-end">
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
				"rounded-xl p-2 md:p-4 border-2 border-solid border-foreground bg-primary text-center w-fit max-w-md relative text-ellipsis",
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
			<blockquote className="text-base md:text-2xl font-semibold w-fit">
				{children}
			</blockquote>
		</div>
	);
};

const Name = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent to-transparent">
			<h3 className="text-lg md:text-5xl font-semibold font-head">
				{children}
			</h3>
		</div>
	);
};

const Description = ({ children }: { children: React.ReactNode }) => {
	return (
		<p
			className={cn(
				"text-md md:text-lg font-semibold px-2 py-2 md:py-8 md:px-4 font-common rounded-xl",
				"md:bg-gradient-to-b md:from-white/5 md:to-transparent",
				"bg-gradient-to-b from-white/5 via-90% to-white/5 backdrop-blur-xs md:backdrop-blur-none",
			)}
		>
			{children}
		</p>
	);
};

export default CharactersCarousel;
