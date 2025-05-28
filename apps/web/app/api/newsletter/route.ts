import { siteConfig } from "@/data/config/site.settings";
import { NewsletterAPI } from "@shipixen/pliny/newsletter";

export const dynamic = "force-static";

const handler = NewsletterAPI({
	provider: siteConfig.newsletter.provider,
});

export { handler as GET, handler as POST };
