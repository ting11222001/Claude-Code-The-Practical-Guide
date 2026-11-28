import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/authenticate");

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-900 dark:focus-visible:outline-neutral-100"
          >
            Sign out
          </button>
        </form>
      </header>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Signed in as {user.email}
      </p>
    </main>
  );
}
