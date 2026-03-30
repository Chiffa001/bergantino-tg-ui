import { apiFetch } from '@/lib/fetch';

import type { Workspace } from './types';

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const res = await apiFetch('/workspaces');

  if (res.status >= 400 && res.status < 500) {
    throw new Error('client_error');
  }

  if (!res.ok) {
    throw new Error('server_error');
  }

  return res.json();
};
