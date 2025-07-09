import { FadeAnimation } from "@mjs/ui/components/motion";

export default async function BuyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<FadeAnimation delay={0.1} duration={0.75}>
			<section className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-x-8 p-[1%] md:p-[2%_5%]">
				{children}
			</section>
		</FadeAnimation>
	);
}
