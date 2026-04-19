import { retrieveLaunchParams } from '@tma.js/sdk-svelte';
import type { LaunchParams } from '@tma.js/types';

import { getStoredWorkspaceSlug, parseWorkspaceSlugFromStartParam } from '@/core/workspace/context/lib';
import { requestJson } from '@/shared/api/fetch';

import type { AuthResponse } from '../model/types';

export const authByTelegram = async (): Promise<AuthResponse> => {
  const params = retrieveLaunchParams() as LaunchParams;
  const startParam = params.tgWebAppStartParam ?? params.tgWebAppData?.start_param ?? null;
  const workspaceSlug = parseWorkspaceSlugFromStartParam(startParam) ?? getStoredWorkspaceSlug();

  return requestJson<AuthResponse>('/auth/telegram', {
    method: 'POST',
    body: JSON.stringify({
      ...params.tgWebAppData,
      ...(workspaceSlug ? { workspace_slug: workspaceSlug } : {}),
    }),
  });
};
