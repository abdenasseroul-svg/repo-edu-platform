// إدارة التوكنات والمصادقة
const TOKEN_KEY = 'edu_access_token';
const REFRESH_TOKEN_KEY = 'edu_refresh_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const logout = () => {
  removeTokens();
  window.location.href = '/login';
};

export const refreshToken = async (): Promise<string> => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');

  const response = await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  if (!response.ok) throw new Error('Refresh failed');

  const data = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const decodeToken = (): any => {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
