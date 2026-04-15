import type { Page, Route } from '@playwright/test';

import type { AcceptInviteResponse, InviteDetail } from '../../src/api/invites/types';
import type {
  GroupFavoriteResponse,
  Workspace,
  WorkspaceBilling,
  WorkspaceBillingPeriod,
  WorkspaceBillingPlan,
  WorkspaceDetail,
  WorkspaceGroup,
  WorkspaceInvite,
  WorkspacePlan,
  WorkspaceUser,
} from '../../src/api/workspaces/types';
import { API_DATA } from './api-data';

type ApiDataOverrides = {
  auth?: typeof API_DATA.auth;
  workspaces?: Workspace[];
  workspaceDetail?: WorkspaceDetail | null;
  workspaceBilling?: WorkspaceBilling | null;
  workspaceBillingPlans?: WorkspaceBillingPlan[];
  workspaceUsers?: WorkspaceUser[];
  workspaceGroups?: WorkspaceGroup[];
  invite?: InviteDetail | null;
  acceptInvite?: AcceptInviteResponse;
  createdWorkspace?: Workspace;
  workspaceInviteLink?: WorkspaceInvite;
};

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

// The API origin is set via VITE_API_URL in the playwright webServer command.
// Requests to the Vite dev server (localhost:5173) must never be intercepted —
// those are JS module requests that must pass through untouched.
const API_ORIGIN = 'http://localhost:8000';

function isApi(route: Route) {
  return new URL(route.request().url()).origin === API_ORIGIN;
}

/**
 * Intercepts all HTTP requests to the API server (localhost:8000) and returns
 * mock responses. Call this before page.goto() so mocks are active from the
 * very first request.
 *
 * Uses a single broad pattern for the API origin to avoid accidentally matching
 * Vite dev-server module requests.
 */
export async function setupApiMocks(page: Page, overrides: ApiDataOverrides = {}) {
  const data = { ...API_DATA, ...overrides };
  let workspacesState: Workspace[] = data.workspaces.map((workspace) => ({ ...workspace }));
  let workspaceDetailState: WorkspaceDetail | null = data.workspaceDetail
    ? { ...data.workspaceDetail }
    : null;
  let workspaceBillingState: WorkspaceBilling | null = data.workspaceBilling
    ? { ...data.workspaceBilling }
    : null;
  let workspaceBillingPlansState: WorkspaceBillingPlan[] = data.workspaceBillingPlans.map((plan) => ({
    ...plan,
    limits: { ...plan.limits },
  }));
  let workspaceGroupsState: WorkspaceGroup[] = data.workspaceGroups.map((group) => ({ ...group }));

  await page.route(`${API_ORIGIN}/**`, (route) => {
    if (!isApi(route)) return route.continue();

    const url = new URL(route.request().url());
    const path = url.pathname;
    const method = route.request().method();

    // POST /auth/telegram
    if (method === 'POST' && path === '/auth/telegram') {
      return json(route, data.auth);
    }

    // GET /workspaces  (list)
    if (method === 'GET' && path === '/workspaces') {
      return json(route, workspacesState);
    }

    // POST /workspaces  (create)
    if (method === 'POST' && path === '/workspaces') {
      return json(route, data.createdWorkspace, 201);
    }

    // GET /workspaces/:id/users
    if (method === 'GET' && /^\/workspaces\/[^/]+\/users$/.test(path)) {
      return json(route, data.workspaceUsers);
    }

    // GET /workspaces/:id/groups
    if (method === 'GET' && /^\/workspaces\/[^/]+\/groups$/.test(path)) {
      return json(route, workspaceGroupsState);
    }

    // POST /workspaces/:id/groups
    if (method === 'POST' && /^\/workspaces\/[^/]+\/groups$/.test(path)) {
      const workspaceId = path.split('/')[2];
      const body = route.request().postDataJSON() as {
        title?: string;
        description?: string | null;
      } | null;

      const createdGroup: WorkspaceGroup = {
        id: `group-${workspaceGroupsState.length + 1}`,
        workspace_id: workspaceId,
        title: body?.title ?? 'Новая группа',
        description: body?.description ?? null,
        status: 'active',
        is_favorite: false,
        created_by_user_id: data.auth.user.id,
        created_at: '2026-01-11T11:00:00Z',
      };

      workspaceGroupsState = [createdGroup, ...workspaceGroupsState];

      return json(route, createdGroup, 201);
    }

    // POST /groups/:id/favorite
    if (method === 'POST' && /^\/groups\/[^/]+\/favorite$/.test(path)) {
      const groupId = path.split('/')[2];
      workspaceGroupsState = workspaceGroupsState.map((group) =>
        group.id === groupId
          ? {
              ...group,
              is_favorite: true,
            }
          : group,
      );

      return json(route, { is_favorite: true } satisfies GroupFavoriteResponse);
    }

    // DELETE /groups/:id/favorite
    if (method === 'DELETE' && /^\/groups\/[^/]+\/favorite$/.test(path)) {
      const groupId = path.split('/')[2];
      workspaceGroupsState = workspaceGroupsState.map((group) =>
        group.id === groupId
          ? {
              ...group,
              is_favorite: false,
            }
          : group,
      );

      return json(route, { is_favorite: false } satisfies GroupFavoriteResponse);
    }

    // GET /workspaces/:id/billing
    if (method === 'GET' && /^\/workspaces\/[^/]+\/billing$/.test(path)) {
      if (workspaceBillingState === null) {
        return json(route, { message: 'Not found' }, 404);
      }
      return json(route, workspaceBillingState);
    }

    // GET /workspaces/:id/billing/plans
    if (method === 'GET' && /^\/workspaces\/[^/]+\/billing\/plans$/.test(path)) {
      return json(route, workspaceBillingPlansState);
    }

    // PATCH /workspaces/:id/billing/admin
    if (method === 'PATCH' && /^\/workspaces\/[^/]+\/billing\/admin$/.test(path)) {
      if (workspaceBillingState === null || workspaceDetailState === null) {
        return json(route, { message: 'Not found' }, 404);
      }

      const body = route.request().postDataJSON() as {
        plan?: WorkspacePlan;
        billing_period?: WorkspaceBillingPeriod;
        expires_at?: string | null;
      } | null;
      const nextPlan = body?.plan;
      const billingPeriod = body?.billing_period ?? 'monthly';

      if (!nextPlan) {
        return json(route, { message: 'Validation error' }, 400);
      }

      workspaceBillingPlansState = workspaceBillingPlansState.map((plan) => ({
        ...plan,
        is_current: plan.plan === nextPlan,
      }));
      workspaceDetailState = {
        ...workspaceDetailState,
        plan: nextPlan,
      };
      workspacesState = workspacesState.map((workspace) =>
        workspace.id === workspaceDetailState?.id
          ? {
              ...workspace,
              plan: workspaceDetailState.plan,
            }
          : workspace,
      );

      const selectedPlan = workspaceBillingPlansState.find((plan) => plan.plan === nextPlan);
      const description = `${selectedPlan?.plan.charAt(0).toUpperCase()}${selectedPlan?.plan.slice(1)} — ${billingPeriod} (manual)`;
      const amount = selectedPlan?.price_monthly ?? 0;

      if (nextPlan === 'free') {
        workspaceBillingState = {
          ...workspaceBillingState,
          plan: 'free',
          subscription: null,
          limits_usage: {
            ...workspaceBillingState.limits_usage,
            members: {
              ...workspaceBillingState.limits_usage.members,
              max: 5,
            },
            projects: {
              ...workspaceBillingState.limits_usage.projects,
              max: 1,
            },
          },
          recent_payments: [],
        };
      } else {
        workspaceBillingState = {
          ...workspaceBillingState,
          plan: nextPlan,
          subscription: {
            id: 'sub_next',
            plan: nextPlan,
            billing_period: billingPeriod,
            status: 'active',
            started_at: '2025-04-01T00:00:00Z',
            expires_at: body?.expires_at ?? '2025-05-01T00:00:00Z',
            cancelled_at: null,
            auto_renew: false,
            provider: 'manual',
          },
          limits_usage: {
            ...workspaceBillingState.limits_usage,
            members: {
              ...workspaceBillingState.limits_usage.members,
              max: selectedPlan?.limits.members ?? null,
            },
            projects: {
              ...workspaceBillingState.limits_usage.projects,
              max: selectedPlan?.limits.projects ?? null,
            },
          },
          recent_payments: [
          {
            id: `pay_${nextPlan}`,
            amount: `${amount}.00`,
            currency: 'RUB',
            status: 'paid',
            paid_at: '2025-04-01T00:00:00Z',
            payment_method_last4: '4242',
            description,
            created_at: '2025-04-01T00:00:00Z',
          },
          ...workspaceBillingState.recent_payments,
          ],
        };
      }

      return json(route, workspaceBillingState);
    }

    // POST /workspaces/:id/invites
    if (method === 'POST' && /^\/workspaces\/[^/]+\/invites$/.test(path)) {
      const body = route.request().postDataJSON() as { role?: string } | null;

      return json(
        route,
        {
          ...data.workspaceInviteLink,
          role: body?.role ?? data.workspaceInviteLink.role,
        },
        201,
      );
    }

    // GET /workspaces/:id
    if (method === 'GET' && /^\/workspaces\/[^/]+$/.test(path)) {
      if (workspaceDetailState === null) {
        return json(route, { message: 'Not found' }, 404);
      }
      return json(route, workspaceDetailState);
    }

    // PATCH /workspaces/:id
    if (method === 'PATCH' && /^\/workspaces\/[^/]+$/.test(path)) {
      if (workspaceDetailState === null) {
        return json(route, { message: 'Not found' }, 404);
      }

      const body = route.request().postDataJSON() as Record<string, unknown> | null;
      workspaceDetailState = {
        ...workspaceDetailState,
        ...(body ?? {}),
      };
      workspacesState = workspacesState.map((workspace) =>
        workspace.id === workspaceDetailState?.id
          ? {
              ...workspace,
              title: workspaceDetailState.title,
              status: workspaceDetailState.status,
              plan: workspaceDetailState.plan,
              has_bot: workspaceDetailState.has_bot,
            }
          : workspace,
      );

      return json(route, workspaceDetailState);
    }

    // POST /invites/:token/accept
    if (method === 'POST' && /^\/invites\/[^/]+\/accept$/.test(path)) {
      return json(route, data.acceptInvite);
    }

    // GET /invites/:token
    if (method === 'GET' && /^\/invites\/[^/]+$/.test(path)) {
      if (data.invite === null) {
        return json(route, { message: 'Invite not found' }, 404);
      }
      return json(route, data.invite);
    }

    return route.continue();
  });
}
