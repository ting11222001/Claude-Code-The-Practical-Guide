export default async function PublicNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="p-6">
      <h1>Public note: {slug}</h1>
    </main>
  );
}
