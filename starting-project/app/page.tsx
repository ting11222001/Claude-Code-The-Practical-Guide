const advantages = [
  "Works directly in your terminal and IDE",
  "Understands your whole codebase, not just a single file",
  "Edits files and runs commands to complete tasks end to end",
  "Handles Git workflows like commits and pull requests",
  "Asks for permission before taking sensitive actions",
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <ul className="list-disc space-y-2 pl-6">
        {advantages.map((advantage) => (
          <li key={advantage}>{advantage}</li>
        ))}
      </ul>
    </main>
  );
}
