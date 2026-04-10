import { authByTelegram } from '@/api/auth/requests';
import { createAcceptInviteMutation, createInviteDetailQuery } from '@/api/invites/queries';
import { InviteStatus } from '@/api/invites/types';
import { WORKSPACE_ROLE_LABELS } from '@/api/workspaces/types';
import { authStore } from '@/lib/auth';
import { formatDate } from '@/lib/format-date';
import {
  type InviteAcceptState,
  InviteScreenState,
  mapAcceptInviteError,
  mapInviteDetailError,
  mapInviteDetailStateToScreenState,
} from '@/lib/invite';
import { router } from '@/lib/router';

type TokenAccessor = () => string;

export function useInvitePage(token: TokenAccessor) {
  const detailQuery = createInviteDetailQuery(token);
  const acceptMutation = createAcceptInviteMutation(token);

  let acceptErrorState = $state<InviteAcceptState | null>(null);
  let acceptErrorMessage = $state('');

  const expiresAtLabel = $derived(detailQuery.data ? formatDate(detailQuery.data.expires_at) : '');
  const roleLabel = $derived(
    detailQuery.data?.role ? WORKSPACE_ROLE_LABELS[detailQuery.data.role] : '',
  );

  const detailState = $derived.by<InviteScreenState>(() => {
    if (detailQuery.isPending) {
      return InviteScreenState.Loading;
    }

    if (detailQuery.isError) {
      return mapInviteDetailStateToScreenState(mapInviteDetailError(detailQuery.error));
    }

    if (!detailQuery.data) {
      return InviteScreenState.Error;
    }

    if (detailQuery.data.status === InviteStatus.Accepted) {
      return InviteScreenState.Used;
    }

    if (detailQuery.data.status === InviteStatus.Expired) {
      return InviteScreenState.Expired;
    }

    return InviteScreenState.Confirm;
  });

  const screenState = $derived.by<InviteScreenState>(() => {
    if (acceptMutation.isPending) {
      return InviteScreenState.Submitting;
    }

    if (acceptErrorState === 'already_member') {
      return InviteScreenState.AlreadyMember;
    }

    return detailState;
  });

  function navigateHome() {
    router.navigate('/', { replace: true });
  }

  function navigateToWorkspace() {
    if (!detailQuery.data) {
      return;
    }

    authStore.setInviteWorkspaceAccess(detailQuery.data.workspace_id);
    router.navigate(`/workspaces/${detailQuery.data.workspace_id}`, { replace: true });
  }

  async function ensureTelegramAuth() {
    if (authStore.getToken() && authStore.getUser()) {
      return;
    }

    const auth = await authByTelegram();
    authStore.setToken(auth.access_token);
    authStore.setUser(auth.user);
  }

  async function handleAccept() {
    if (!detailQuery.data || acceptMutation.isPending) {
      return;
    }

    acceptErrorState = null;
    acceptErrorMessage = '';

    try {
      await ensureTelegramAuth();
      const response = await acceptMutation.mutateAsync();
      authStore.setInviteWorkspaceAccess(response.workspace_id);
      router.navigate(`/workspaces/${response.workspace_id}`, { replace: true });
    } catch (error) {
      acceptErrorState = mapAcceptInviteError(error);

      if (acceptErrorState === 'already_member') {
        authStore.setInviteWorkspaceAccess(detailQuery.data.workspace_id);
        return;
      }

      acceptErrorMessage =
        error instanceof Error && error.message === 'client_error'
          ? 'Не удалось принять приглашение. Попробуйте открыть ссылку заново.'
          : 'Сервис временно недоступен. Попробуйте ещё раз чуть позже.';
    }
  }

  function retryDetail() {
    void detailQuery.refetch();
  }

  return {
    acceptMutation,
    detailQuery,
    handleAccept,
    navigateHome,
    navigateToWorkspace,
    retryDetail,
    get acceptErrorMessage() {
      return acceptErrorMessage;
    },
    get expiresAtLabel() {
      return expiresAtLabel;
    },
    get roleLabel() {
      return roleLabel;
    },
    get screenState() {
      return screenState;
    },
  };
}
