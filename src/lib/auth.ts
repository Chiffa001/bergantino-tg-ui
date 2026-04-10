import type { CurrentUser } from '@/api/auth/types';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'current_user';
const INVITE_WORKSPACE_ACCESS_KEY = 'invite_workspace_access';

function parseStoredUser(value: string | null): CurrentUser | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as CurrentUser;
  } catch {
    return null;
  }
}

export const authStore = {
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(INVITE_WORKSPACE_ACCESS_KEY);
  },
  clearInviteWorkspaceAccess: () => {
    sessionStorage.removeItem(INVITE_WORKSPACE_ACCESS_KEY);
  },
  getInviteWorkspaceAccess: () => {
    return sessionStorage.getItem(INVITE_WORKSPACE_ACCESS_KEY);
  },
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser: () => {
    return parseStoredUser(localStorage.getItem(USER_KEY));
  },
  setInviteWorkspaceAccess: (workspaceId: string) => {
    sessionStorage.setItem(INVITE_WORKSPACE_ACCESS_KEY, workspaceId);
  },
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  setUser: (user: CurrentUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};
