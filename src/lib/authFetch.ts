const CLIENT_BASE = process.env.NEXT_PUBLIC_CLIENT_API;
const SSR_BASE = process.env.SSR_API;

import { getClientTokenCookie, setClientTokenCookie } from "./authClient";

export const FORCED_LOGOUT_FLAG = "force_logout";

// export function forceLogout() {
//   if (typeof window !== "undefined") {
//     window.name = FORCED_LOGOUT_FLAG;
//     const locale = localeFromPathname(window.location.pathname);
//     window.location.href = getAppLocaleHref(locale, "/");
//   }
// }

async function parseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function clientFetch(path: string, options: RequestInit = {}) {
  const token = getClientTokenCookie();

  const response = await fetch(`${CLIENT_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { access_token: token } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const data = await parseBody(response);
  return { response, data, ok: response.ok };
}

export async function ssrFetch(path: string, token: string | null, extraHeaders: Record<string, string> = {}) {
  try {
    const response = await fetch(`${SSR_BASE}${path}`, {
      cache: "no-store",
      headers: {
        access_token: token ?? "",
        ...extraHeaders,
      },
    });

    const data = await parseBody(response);

    if (!response.ok) {
      return { data: null, refreshedToken: null, status: response.status };
    }

    const action = data?.action ?? null;

    return {
      data,
      action: action,
      refreshedToken: data?.access_token ?? null,
      status: response.status,
    };
  } catch (error) {
    console.error(`ssrFetch failed for ${path}:`, error);
    return { data: null, refreshedToken: null, status: 0 };
  }
}
