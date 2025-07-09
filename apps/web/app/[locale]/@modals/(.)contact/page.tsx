"use client";

import { ContactForm } from "@/components/ContactForm";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@mjs/ui/primitives/dialog";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ModalPage() {
	const t = useTranslations("ContactForm");

	return (
		<DialogContent className="px-0 pb-0 max-w-[95%] md:max-w-lg rounded-xl">
			<DialogHeader className="px-4">
				<DialogTitle className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5" />
					{t("title")}
				</DialogTitle>
				<DialogDescription className="text-secondary-300">
					{t("description")}
				</DialogDescription>
			</DialogHeader>
			<div className="rounded-b-xl bg-[url(/static/images/bg2.webp)] bg-cover bg-center">
				<div className="h-full w-full px-4 py-8 bg-gradient-to-b from-primary to-5% to-transparent">
					<ContactForm />
				</div>
			</div>
		</DialogContent>
	);
}
