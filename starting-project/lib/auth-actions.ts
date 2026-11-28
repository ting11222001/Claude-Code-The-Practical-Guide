"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "./auth";

export type AuthFormState = {
  error?: string;
  email?: string;
};

const credentialsSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type Credentials = z.infer<typeof credentialsSchema>;

function parseCredentials(
  formData: FormData,
): { data: Credentials } | { state: AuthFormState } {
  const email = String(formData.get("email") ?? "").trim();
  const result = credentialsSchema.safeParse({
    email,
    password: formData.get("password"),
  });

  if (!result.success) {
    return { state: { error: result.error.issues[0]?.message, email } };
  }
  return { data: result.data };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseCredentials(formData);
  if ("state" in parsed) return parsed.state;

  try {
    await auth.api.signInEmail({ body: parsed.data });
  } catch (error) {
    if (isAPIError(error)) {
      return { error: "Invalid email or password.", email: parsed.data.email };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseCredentials(formData);
  if ("state" in parsed) return parsed.state;

  const { email, password } = parsed.data;

  try {
    // better-auth requires a name; we don't collect one, so reuse the email.
    await auth.api.signUpEmail({ body: { name: email, email, password } });
  } catch (error) {
    if (isAPIError(error)) {
      const message =
        error.body?.code === "USER_ALREADY_EXISTS" ||
        error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
          ? "An account with this email already exists."
          : (error.body?.message ?? "Could not create account.");
      return { error: message, email };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
