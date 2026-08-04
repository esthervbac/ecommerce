import { STORAGE_KEYS } from "./constants";

export const authService = {
  setAuthData: (token: string, user: any) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getAuthData: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return { token, user: user ? JSON.parse(user) : null };
  },

  setTheme: (theme: string) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
  },
};
