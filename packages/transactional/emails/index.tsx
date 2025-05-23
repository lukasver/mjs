import { TestEmail } from "./test";
import { EmailVerification } from "./verify-email";
import { WaitlistEmail } from "./waitlist";
import { WelcomeEmail } from "./welcome";

const templates = {
	waitlist: WaitlistEmail,
	test: TestEmail,
	emailVerification: EmailVerification,
	welcome: WelcomeEmail,
};

export { templates };
