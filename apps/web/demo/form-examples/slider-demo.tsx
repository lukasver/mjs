import { cn } from "@mjs/ui/lib/utils";
import { Slider } from "@mjs/ui/primitives/slider";

type SliderProps = React.ComponentProps<typeof Slider>;

export default function SliderDemo({ className, ...props }: SliderProps) {
	return (
		<Slider
			defaultValue={[50]}
			max={100}
			step={1}
			className={cn("w-[60%]", className)}
			{...props}
		/>
	);
}
