const SSR_BASE = process.env.SSR_API;

import {
  getClientTokenCookie,
  setClientTokenCookie,
  removeClientTokenCookie,
} from "./authClient";

export const FORCED_LOGOUT_FLAG = "force_logout";

export function isForcedLogout(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    d.action === "forced_logout_device_limit_reached" ||
    d.enum === "FORCED_LOGOUT_DEVICE_LIMIT_REACHED" ||
    (typeof d.action === "string" && d.action.startsWith("forced_logout")) ||
    (typeof d.enum === "string" && d.enum.startsWith("FORCED_LOGOUT"))
  );
}

export function handleForcedLogout(message?: string) {
  if (typeof window === "undefined") return;

  const msg = message || "Your account is logged on another device";

  sessionStorage.setItem("forced_logout_toast", msg);
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  } else {
    window.location.reload();
  }
}

async function parseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function handleAuthAction(
  data: { action?: string; token?: string } | null | undefined, 
  response: { headers?: { get?: (name: string) => string | null } } | null | undefined, 
  options: { currentToken?: string | null } = {}
) {
  const { currentToken = null } = options;
  
  const headerToken =
    typeof response?.headers?.get === "function" 
      ? response.headers.get("token")
      : null;

  const newToken = data?.token || headerToken;
 
  if (newToken && newToken !== currentToken) {
    setClientTokenCookie(newToken);
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

  const currentTokenValue = response?.headers?.get("token");
  console.log("new token is: ", currentTokenValue);

  const data = await response.json().catch(() => null);
  const existingToken = getClientTokenCookie();
  if (currentTokenValue && existingToken !== currentTokenValue) {
    setClientTokenCookie(currentTokenValue);
    console.log("saved currentToken: ", currentTokenValue);
  }

  if (isForcedLogout(data)) {
    if (!currentTokenValue) {
      removeClientTokenCookie();
    }
    handleForcedLogout(data?.message as string | undefined);
  }

  return { response, data, ok: response.ok, headers: response?.headers };
}

export async function ssrFetch(path: string, token: string | null, extraHeaders: Record<string, string> = {}) {
  console.log("path: ", path);
  console.log("token: ", token);
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

    const isUserHeader = response?.headers?.get("isuser");
    let isuser = null;
    if (isUserHeader && isUserHeader !== "false") {
      try {
        isuser = JSON.parse(isUserHeader);
      } catch {
        isuser = null;
      }
    }
    console.log("isuser from new api call: ", isuser);

    const action = data?.action ?? null;

    return {
      data,
      action: action,
      refreshedToken: response?.headers?.get("token") ?? null,
      status: response.status,
      isuser,
    };
  } catch (error) {
    console.error(`ssrFetch failed for ${path}:`, error);
    return { data: null, refreshedToken: null, status: 0 };
  }
}
