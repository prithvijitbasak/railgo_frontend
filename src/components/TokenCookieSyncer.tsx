"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { setClientTokenCookie, removeClientTokenCookie } from "@/lib/authClient";
import { isForcedLogout } from "@/lib/authFetch";
import { toast } from "sonner";

type TokenCookieSyncerProps = {
  token?: string | null;
  action?: unknown;
  message?: string | null;
};

export default function TokenCookieSyncer({
  token,
  action,
  message,
}: TokenCookieSyncerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const handledRef = useRef(false);

  useEffect(() => {
    // 1. Sync token cookie
    if (token) {
      setClientTokenCookie(token);
    }

    // 2. Check for pending forced logout message in cookie (from server redirect)
    if (typeof document !== "undefined") {
      const cookieMatch = document.cookie.match(
        /(?:^|;\s*)forced_logout_toast=([^;]+)/
      );
      if (cookieMatch) {
        const msg = decodeURIComponent(cookieMatch[1]);
        document.cookie =
          "forced_logout_toast=; path=/; max-age=0; samesite=lax";
        toast.error(msg);
      }
    }

    // 3. Check for pending forced logout message in sessionStorage (from client redirect)
    if (typeof window !== "undefined") {
      const sessionMsg = sessionStorage.getItem("forced_logout_toast");
      if (sessionMsg) {
        sessionStorage.removeItem("forced_logout_toast");
        toast.error(sessionMsg);
      }
    }

    // 4. Handle forced logout passed via props
    if (action && isForcedLogout({ action }) && !handledRef.current) {
      handledRef.current = true;
      if (!token) {
        removeClientTokenCookie();
      }
      const msg = message || "Your account is logged on another device";

      if (pathname !== "/") {
        sessionStorage.setItem("forced_logout_toast", msg);
        router.replace("/");
      } else {
        toast.error(msg);
      }
    }
  }, [token, action, message, pathname, router]);

  return null;
}
