import type { Page, Route } from '@playwright/test';

import { API_DATA } from './api-data';

type ApiDataOverrides = {
  auth?: typeof API_DATA.auth;
  workspaces?: typeof API_DATA.workspaces;
  workspaceDetail?: typeof API_DATA.workspaceDetail | null;
  workspaceUsers?: typeof API_DATA.workspaceUsers;
  invite?: typeof API_DATA.invite | null;
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
      return json(route, data.workspaces);
    }

    // POST /workspaces  (create)
    if (method === 'POST' && path === '/workspaces') {
      return json(route, data.createdWorkspace, 201);
    }

    // GET /workspaces/:id/users
    if (method === 'GET' && /^\/workspaces\/[^/]+\/users$/.test(path)) {
      return json(route, data.workspaceUsers);
    }

    // POST /workspaces/:id/invites
    if (method === 'POST' && /^\/workspaces\/[^/]+\/invites$/.test(path)) {
      return json(route, data.workspaceInviteLink, 201);
    }

    // GET /workspaces/:id
    if (method === 'GET' && /^\/workspaces\/[^/]+$/.test(path)) {
      if (data.workspaceDetail === null) {
        return json(route, { message: 'Not found' }, 404);
      }
      return json(route, data.workspaceDetail);
    }

    // PATCH /workspaces/:id
    if (method === 'PATCH' && /^\/workspaces\/[^/]+$/.test(path)) {
      return json(route, data.workspaceDetail ?? API_DATA.workspaceDetail);
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
