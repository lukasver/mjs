import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

export const ContactFormEmail = ({
  name = 'John Doe',
  email = 'john@example.com',
  subject = 'General Inquiry',
  message = 'Hello, I would like to get in touch with you regarding your services.',
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => (
  <Html>
    <Head />
    <Preview>New contact form submission from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Submission</Heading>

        <Section style={section}>
          <Text style={label}>From:</Text>
          <Text style={value}>{name}</Text>
        </Section>

        <Section style={section}>
          <Text style={label}>Email:</Text>
          <Link href={`mailto:${email}`} style={emailLink}>
            {email}
          </Link>
        </Section>

        <Section style={section}>
          <Text style={label}>Subject:</Text>
          <Text style={value}>{subject}</Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={label}>Message:</Text>
          <Text style={messageText}>{message}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This message was sent from your website contact form.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const section = {
  marginBottom: '24px',
};

const label = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const value = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
  lineHeight: '24px',
};

const emailLink = {
  color: '#2563eb',
  fontSize: '16px',
  textDecoration: 'underline',
};

const messageText = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
  lineHeight: '24px',
  whiteSpace: 'pre-wrap' as const,
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  border: '1px solid #e9ecef',
};

const hr = {
  borderColor: '#e9ecef',
  margin: '20px 0',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};
