const TOKEN_KEY = "token";
const MAX_AGE = 60 * 60 * 24 * 7;

export const getClientTokenCookie = () => {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TOKEN_KEY}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : "";
};

export const setClientTokenCookie = (token: string) => {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${MAX_AGE}; samesite=lax`;
};