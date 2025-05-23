import Image from "@/components/Image";

import { ScrollArea, ScrollBar } from "@mjs/ui/primitives/scroll-area";

export interface Artwork {
	artist: string;
	art: string;
}

export const works: Artwork[] = [
	{
		artist: "Ornella Binni",
		art: "https://picsum.photos/800/400?random=2",
	},
	{
		artist: "Tom Byrom",
		art: "https://picsum.photos/800/400?random=3",
	},
	{
		artist: "Vladimir Malyavko",
		art: "https://picsum.photos/800/400?random=4",
	},
];

export default function ScrollAreaHorizontalDemo() {
	return (
		<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
			<div className="flex w-max space-x-4 p-4">
				{works.map((artwork) => (
					<figure key={artwork.artist} className="shrink-0">
						<div className="overflow-hidden rounded-md">
							<Image
								src={artwork.art}
								alt={`Photo by ${artwork.artist}`}
								className="aspect-3/4 h-fit w-fit object-cover"
								width={300}
								height={400}
							/>
						</div>
						<figcaption className="pt-2 text-xs text-muted-foreground">
							Photo by{" "}
							<span className="font-semibold text-foreground">
								{artwork.artist}
							</span>
						</figcaption>
					</figure>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
