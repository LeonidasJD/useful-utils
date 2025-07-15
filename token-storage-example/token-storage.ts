const ACCESS_TOKEN_KEY = "fairplay_access_token";
const REFRESH_TOKEN_KEY = "fairplay_refresh_token";

const isBrowser = () => typeof window !== "undefined";

export const setAccessToken = (token: string): void => {
  if (isBrowser()) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const setRefreshToken = (token: string) => {
  if (isBrowser()) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const getAccessToken = (): string | undefined => {
  if (isBrowser()) {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || undefined;
  }
  return undefined;
};

export const getRefreshToken = (): string | undefined => {
  if (isBrowser()) {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
  }
  return undefined;
};

export const removeAccessToken = (): void => {
  if (isBrowser()) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const removeRefreshToken = (): void => {
  if (isBrowser()) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
