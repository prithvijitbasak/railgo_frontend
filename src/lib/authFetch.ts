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

export async function clientFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  const isFormData = options.body instanceof FormData;

  // Let the browser set multipart/form-data + boundary for FormData
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getClientTokenCookie();
  if (token) headers.set("access_token", token);

  const response = await fetch(url, {
    ...options,
    headers,
    body:
      isFormData || typeof options.body === "string" || !options.body
        ? options.body
        : JSON.stringify(options.body),   // plain objects only
  });

  const data = await response.json().catch(() => null);
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
