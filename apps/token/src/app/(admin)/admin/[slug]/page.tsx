export default async function AdminPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return <div>Admin {slug}</div>;
}
