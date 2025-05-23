import clsx from "clsx";

/* Configure colors at https://shipixen.com/color-theme-explorer-shadcn */
const defaultColors = {
	primary: {
		lighter: "#f675a7",
		light: "#f45196",
		main: "#e52679",
		dark: "#c7205a",
		darker: "#9c1854",
	},
	secondary: {
		lighter: "#9ca3af",
		light: "#6b7280",
		main: "#4b5563",
		dark: "#374151",
		darker: "#1f2937",
	},
};

export const GlowBg = ({
	className,
	variant = "primary",
	...props
}: {
	className?: string;
	variant?: "primary" | "secondary";
	colors?: typeof defaultColors;
}) => {
	const { colors = defaultColors } = props;
	const stopColor =
		variant === "primary" ? colors.primary.lighter : colors.secondary.lighter;
	const stopColorTwo =
		variant === "primary" ? colors.primary.darker : colors.secondary.darker;

	return (
		<svg
			viewBox="0 0 1024 1024"
			aria-hidden="true"
			className={clsx(className, "absolute -z-10")}
		>
			<circle
				cx="512"
				cy="512"
				r="512"
				fill={`url(#gradient-${variant})`}
				fillOpacity="0.7"
			></circle>
			<defs>
				<radialGradient
					id={`gradient-${variant}`}
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(512 512) rotate(90) scale(512)"
				>
					<stop stopColor={stopColor} stopOpacity="0.5"></stop>
					<stop offset="1" stopColor={stopColorTwo} stopOpacity="0"></stop>
				</radialGradient>
			</defs>
		</svg>
	);
};
