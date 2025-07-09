import { ContactForm, ContactFormModal } from "@/components/ContactForm";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@mjs/ui/primitives/dialog";

import { MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
	const t = await getTranslations("ContactForm");

	return (
		<ContactFormModal>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<MessageSquare className="h-5 w-5" />
						{t("title")}
					</DialogTitle>
					<DialogDescription className="text-secondary-300">
						{t("description")}
					</DialogDescription>
				</DialogHeader>
				<ContactForm />
			</DialogContent>
		</ContactFormModal>
	);
}
