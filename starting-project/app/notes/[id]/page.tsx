export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="p-6">
      <h1>Note editor: {id}</h1>
    </main>
  );
}
