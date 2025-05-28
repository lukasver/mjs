import { TestEmail } from './test';
import { EmailVerification } from './verify-email';
import { WaitlistEmail } from './waitlist';
import { WelcomeEmail } from './welcome';
import { ContactFormEmail } from './contact';

const templates = {
  contact: ContactFormEmail,
  waitlist: WaitlistEmail,
  test: TestEmail,
  emailVerification: EmailVerification,
  welcome: WelcomeEmail,
};

export { templates };
