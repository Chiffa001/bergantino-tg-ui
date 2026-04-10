import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type InviteDetail,InviteStatus } from '@/api/invites/types';
import { WORKSPACE_ROLE } from '@/api/workspaces/types';
import { useInvitePage } from '@/hooks/use-invite-page.svelte';
import { ApiStatusError } from '@/lib/fetch';
import { InviteScreenState } from '@/lib/invite';

const mocks = vi.hoisted(() => ({
  acceptMutation: {
    isPending: false,
    mutateAsync: vi.fn(),
  },
  authByTelegram: vi.fn(),
  detailQuery: {
    data: undefined as InviteDetail | undefined,
    error: null,
    isError: false,
    isPending: false,
    refetch: vi.fn(),
  },
  getToken: vi.fn(),
  getUser: vi.fn(),
  navigate: vi.fn(),
  setInviteWorkspaceAccess: vi.fn(),
  setToken: vi.fn(),
  setUser: vi.fn(),
}));

vi.mock('@/api/auth/requests', () => ({
  authByTelegram: mocks.authByTelegram,
}));

vi.mock('@/api/invites/queries', () => ({
  createAcceptInviteMutation: vi.fn(() => mocks.acceptMutation),
  createInviteDetailQuery: vi.fn(() => mocks.detailQuery),
}));

vi.mock('@/lib/auth', () => ({
  authStore: {
    getToken: mocks.getToken,
    getUser: mocks.getUser,
    setInviteWorkspaceAccess: mocks.setInviteWorkspaceAccess,
    setToken: mocks.setToken,
    setUser: mocks.setUser,
  },
}));

vi.mock('@/lib/router', () => ({
  router: {
    navigate: mocks.navigate,
  },
}));

import { formatDate } from '@/lib/format-date';

describe('useInvitePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.detailQuery.data = undefined;
    mocks.detailQuery.error = null;
    mocks.detailQuery.isError = false;
    mocks.detailQuery.isPending = false;
    mocks.detailQuery.refetch = vi.fn();

    mocks.acceptMutation.isPending = false;
    mocks.acceptMutation.mutateAsync = vi.fn();

    mocks.getToken.mockReturnValue(null);
    mocks.getUser.mockReturnValue(null);
  });

  function createInviteDetail(overrides: Partial<InviteDetail> = {}): InviteDetail {
    return {
      expires_at: '2026-04-13T00:00:00.000Z',
      role: WORKSPACE_ROLE.ASSISTANT,
      status: InviteStatus.Pending,
      workspace_id: 'workspace-1',
      workspace_title: 'Агентство Иванова',
      ...overrides,
    };
  }

  it('returns loading screen state while invite detail is pending', () => {
    mocks.detailQuery.isPending = true;

    const model = useInvitePage(() => 'invite-token');

    expect(model.screenState).toBe(InviteScreenState.Loading);
  });

  it('formats labels and returns used state for accepted invites', () => {
    mocks.detailQuery.data = createInviteDetail({ status: InviteStatus.Accepted });

    const model = useInvitePage(() => 'invite-token');

    expect(model.screenState).toBe(InviteScreenState.Used);
    expect(model.roleLabel).toBe('Помощник');
    expect(model.expiresAtLabel).toBe(formatDate('2026-04-13T00:00:00.000Z'));
  });

  it('authenticates and navigates to workspace on successful accept', async () => {
    mocks.detailQuery.data = createInviteDetail();
    mocks.authByTelegram.mockResolvedValue({
      access_token: 'token-1',
      token_type: 'bearer',
      user: {
        full_name: 'Test User',
        id: 'user-1',
        is_super_admin: false,
        username: 'test',
      },
    });
    mocks.acceptMutation.mutateAsync.mockResolvedValue({ workspace_id: 'workspace-1' });

    const model = useInvitePage(() => 'invite-token');

    await model.handleAccept();

    expect(mocks.authByTelegram).toHaveBeenCalledOnce();
    expect(mocks.setToken).toHaveBeenCalledWith('token-1');
    expect(mocks.setUser).toHaveBeenCalledWith({
      full_name: 'Test User',
      id: 'user-1',
      is_super_admin: false,
      username: 'test',
    });
    expect(mocks.acceptMutation.mutateAsync).toHaveBeenCalledOnce();
    expect(mocks.setInviteWorkspaceAccess).toHaveBeenCalledWith('workspace-1');
    expect(mocks.navigate).toHaveBeenCalledWith('/workspaces/workspace-1', { replace: true });
  });

  it('switches to already member state when accept returns conflict', async () => {
    mocks.detailQuery.data = createInviteDetail();
    mocks.getToken.mockReturnValue('token-1');
    mocks.getUser.mockReturnValue({
      full_name: 'Test User',
      id: 'user-1',
      is_super_admin: false,
      username: 'test',
    });
    mocks.acceptMutation.mutateAsync.mockRejectedValue(
      new ApiStatusError(409, 'client_error'),
    );

    const model = useInvitePage(() => 'invite-token');

    await model.handleAccept();

    expect(model.screenState).toBe(InviteScreenState.AlreadyMember);
    expect(mocks.setInviteWorkspaceAccess).toHaveBeenCalledWith('workspace-1');
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('retries invite detail query', () => {
    const model = useInvitePage(() => 'invite-token');

    model.retryDetail();

    expect(mocks.detailQuery.refetch).toHaveBeenCalledOnce();
  });
});
