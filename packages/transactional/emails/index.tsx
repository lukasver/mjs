import { ContactFormEmail } from "./contact";
import { TestEmail } from "./test";
import { EmailVerification } from "./verify-email";
import { WaitlistEmail } from "./waitlist";
import { WelcomeEmail } from "./welcome";

const templates = {
	contact: ContactFormEmail,
	waitlist: WaitlistEmail,
	test: TestEmail,
	emailVerification: EmailVerification,
	welcome: WelcomeEmail,
};

export { templates };
