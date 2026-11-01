const TOKEN_KEY = "token";
const MAX_AGE = 60 * 60 * 24 * 7;

export const getClientTokenCookie = () => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TOKEN_KEY}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : "";
};

export const setClientTokenCookie = (token: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${MAX_AGE}; samesite=lax`;
};

export const removeClientTokenCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
};
