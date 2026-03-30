const TOKEN_KEY = 'access_token';

export const authStore = {
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
};
