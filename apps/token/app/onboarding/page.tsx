// import { getSession } from '../../lib/auth/better-auth/auth';
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { VerifyEmail } from "../../components/verify-email";

export default async function Onboarding() {
	// const session = await getSession();
	const session = {};

	if (!session) {
		redirect("/?error=unauthorized");
	}

	if (!session.user.emailVerified) {
		return (
			<Container>
				<Suspense fallback={<div>Loading...</div>}>
					<VerifyEmail />
				</Suspense>

				<Image
					src="/static/images/bg.webp"
					alt="bg"
					width={1440}
					height={1024}
					className="w-full h-full object-cover fixed z-[-1] inset-0"
				/>
			</Container>
		);
	}

	return (
		<Container>
			{/* <ConnectWallet /> */}

			<Image
				src="/static/images/bg.webp"
				alt="bg"
				width={1440}
				height={1024}
				className="w-full h-full object-cover fixed z-[-1] inset-0"
			/>
		</Container>
	);
}

const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
			<header className="invisible">a</header>
			<main className="container mx-auto grid place-items-center bg-cover bg-center relative">
				{children}
			</main>
			<footer className="invisible">a</footer>
		</div>
	);
};
