import Image from "@/components/Image";

import { AspectRatio } from "@mjs/ui/primitives/aspect-ratio";

export default function AspectRatioDemo() {
	return (
		<AspectRatio ratio={16 / 9} className="bg-muted">
			<Image
				src="https://picsum.photos/800/400?random=1"
				alt="Photo by Drew Beamer"
				fill
				className="rounded-md object-cover"
			/>
		</AspectRatio>
	);
}
