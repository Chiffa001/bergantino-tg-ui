import { matchRoute } from '@chiffa001/tg-svelte-ui/router';

import { ApiStatusError } from '@/shared/api/fetch';

export const INVITE_START_PARAM_PREFIX = 'invite_';

export enum HttpStatusCode {
  Conflict = 409,
  Gone = 410,
  NotFound = 404,
}

export enum InviteScreenState {
  AlreadyMember = 'already_member',
  Confirm = 'confirm',
  Error = 'error',
  Expired = 'expired',
  Loading = 'loading',
  NotFound = 'not_found',
  Submitting = 'submitting',
  Used = 'used',
}

export type InviteDetailState = 'confirm' | 'expired' | 'used' | 'not_found' | 'error';
export type InviteAcceptState = 'already_member' | 'error';

export function parseInviteTokenFromStartParam(startParam: string | null | undefined): string | null {
  const normalized = startParam?.trim();

  if (!normalized?.startsWith(INVITE_START_PARAM_PREFIX)) {
    return null;
  }

  const token = normalized.slice(INVITE_START_PARAM_PREFIX.length).trim();

  return token || null;
}

export function isInviteRoute(path: string): boolean {
  return Boolean(matchRoute('/invites/:token', path, true));
}

export function mapInviteDetailError(error: unknown): InviteDetailState {
  if (!(error instanceof ApiStatusError)) {
    return 'error';
  }

  if (error.status === HttpStatusCode.NotFound) {
    return 'not_found';
  }

  if (error.status === HttpStatusCode.Conflict) {
    return 'used';
  }

  if (error.status === HttpStatusCode.Gone) {
    return 'expired';
  }

  return 'error';
}

export function mapAcceptInviteError(error: unknown): InviteAcceptState {
  if (error instanceof ApiStatusError && error.status === HttpStatusCode.Conflict) {
    return 'already_member';
  }

  return 'error';
}

export function mapInviteDetailStateToScreenState(state: InviteDetailState): InviteScreenState {
  switch (state) {
    case 'confirm':
      return InviteScreenState.Confirm;
    case 'expired':
      return InviteScreenState.Expired;
    case 'not_found':
      return InviteScreenState.NotFound;
    case 'used':
      return InviteScreenState.Used;
    case 'error':
    default:
      return InviteScreenState.Error;
  }
}
