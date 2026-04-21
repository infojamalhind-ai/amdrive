import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "amj_admin_session";

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "";
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function isValidAdminLogin(identifier: string, password: string) {
  const adminUsername = getAdminUsername().trim().toLowerCase();
  const adminEmail = getAdminEmail().trim().toLowerCase();
  const adminPassword = getAdminPassword();

  const input = identifier.trim().toLowerCase();

  const identifierMatch =
    input === adminUsername || (adminEmail && input === adminEmail);

  const passwordMatch = password === adminPassword;

  return identifierMatch && passwordMatch;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const sessionSecret = getAdminSessionSecret();

  if (!sessionSecret) return false;

  return sessionCookie === sessionSecret;
}