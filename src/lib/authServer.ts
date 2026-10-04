"use server";
const MAX_AGE = 60 * 60 * 24 * 7;

import { cookies } from "next/headers";

export async function getServerTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export async function setServerTokenCookie(token: string) {
  (await cookies()).set("token", token, { maxAge: MAX_AGE });
}