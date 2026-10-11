"use client";

import { useEffect } from "react";
import { setClientTokenCookie } from "@/lib/authClient";

type TokenCookieSyncerProps = {
  token?: string | null;
  action?: unknown;
};

export default function TokenCookieSyncer({ token, action }: TokenCookieSyncerProps) {
  useEffect(() => {
    if (token) {
      setClientTokenCookie(token);
    }
    
  }, [token, action]);

  return null;
}
