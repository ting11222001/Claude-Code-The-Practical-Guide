import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { db } from "./db";

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [nextCookies()], // must stay last
});

export type Session = typeof auth.$Infer.Session;

/** Current session (server components / route handlers), or null. */
export async function getSession(): Promise<Session | null> {
  return auth.api.getSession({ headers: await headers() });
}

/** Current user, or null if unauthenticated. */
export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session = await getSession();
  return session?.user ?? null;
}
