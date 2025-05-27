import { PostHogProvider } from '../components/PostHogProvider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PostHogProvider>{children}</PostHogProvider>
    </>
  );
}
