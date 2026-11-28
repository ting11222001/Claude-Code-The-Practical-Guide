import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm, type AuthMode } from "@/components/AuthForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
};

type AuthenticatePageProps = {
  searchParams: Promise<{ mode?: string | string[] }>;
};

const content = {
  signin: {
    heading: "Sign in",
    prompt: "Don't have an account?",
    switchLabel: "Create one",
    switchMode: "signup",
  },
  signup: {
    heading: "Create an account",
    prompt: "Already have an account?",
    switchLabel: "Sign in",
    switchMode: "signin",
  },
} as const;

export default async function AuthenticatePage({
  searchParams,
}: AuthenticatePageProps) {
  if (await getSession()) redirect("/dashboard");

  const { mode: rawMode } = await searchParams;
  const mode: AuthMode = rawMode === "signup" ? "signup" : "signin";
  const { heading, prompt, switchLabel, switchMode } = content[mode];

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <section
        aria-labelledby="auth-heading"
        className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <h1 id="auth-heading" className="mb-6 text-2xl font-semibold tracking-tight">
          {heading}
        </h1>

        <AuthForm key={mode} mode={mode} />

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          {prompt}{" "}
          <Link
            href={{ pathname: "/authenticate", query: { mode: switchMode } }}
            className="font-medium text-neutral-900 underline-offset-4 hover:underline focus-visible:underline dark:text-neutral-100"
          >
            {switchLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}
