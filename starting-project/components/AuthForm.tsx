"use client";

import { useActionState } from "react";
import {
  signInAction,
  signUpAction,
  type AuthFormState,
} from "@/lib/auth-actions";

export type AuthMode = "signin" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

const initialState: AuthFormState = {};

const copy = {
  signin: {
    action: signInAction,
    submit: "Sign in",
    pending: "Signing in…",
    autoComplete: "current-password",
    hint: undefined,
  },
  signup: {
    action: signUpAction,
    submit: "Create account",
    pending: "Creating account…",
    autoComplete: "new-password",
    hint: "At least 8 characters.",
  },
} as const;

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs outline-none transition focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/20 aria-invalid:border-red-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus-visible:border-neutral-100 dark:focus-visible:ring-neutral-100/20";

export function AuthForm({ mode }: AuthFormProps) {
  const config = copy[mode];
  const [state, formAction, isPending] = useActionState(
    config.action,
    initialState,
  );
  const hasError = Boolean(state.error);
  const errorId = hasError ? "auth-error" : undefined;
  const passwordDescribedBy =
    [config.hint && "password-hint", errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          aria-invalid={hasError}
          aria-describedby={errorId}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={config.autoComplete}
          required
          minLength={8}
          aria-invalid={hasError}
          aria-describedby={passwordDescribedBy}
          className={inputClass}
        />
        {config.hint && (
          <p id="password-hint" className="text-xs text-neutral-500">
            {config.hint}
          </p>
        )}
      </div>

      <p
        id="auth-error"
        role="alert"
        className="min-h-5 text-sm text-red-600 dark:text-red-400"
      >
        {state.error}
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:outline-neutral-100"
      >
        {isPending ? config.pending : config.submit}
      </button>
    </form>
  );
}
