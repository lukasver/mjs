import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function About() {
	return (
		<div className="flex flex-col w-full items-center justify-between fancy-overlay">
			<Header />

			<div className="w-full flex flex-col items-center mb-12">
				<section className="w-full p-6 container-narrow">
					<h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
						About Mahjong Stars
					</h1>

					<p className="mt-6 md:text-xl">
						$MJS is the core utility token of Mahjong Stars, enabling NFT
						trading, AI upgrades, tournament access, and revenue staking.
						Participate in a multi-billion dollar Web3 opportunity and fuel the
						first global social mahjong platform with real-world value and AI
						liquidity.
					</p>

					<p className="mt-6 md:text-xl"></p>
				</section>
			</div>

			<Footer />
		</div>
	);
}
