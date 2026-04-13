const LAST_WORKSPACE_SLUG_KEY = 'last_workspace_slug';

function normalizeWorkspaceSlug(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9_-]*$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export function parseWorkspaceSlugFromStartParam(startParam: string | null): string | null {
  if (!startParam) {
    return null;
  }

  const trimmed = startParam.trim();

  if (!trimmed || trimmed.startsWith('invite_')) {
    return null;
  }

  if (/^(?:workspace_slug|workspace|ws)[:_]?$/i.test(trimmed)) {
    return null;
  }

  const prefixedPatterns = [
    /^workspace_slug[:_](.+)$/i,
    /^workspace[:_](.+)$/i,
    /^ws[:_](.+)$/i,
  ];
  const prefixedMatch = prefixedPatterns
    .map((pattern) => trimmed.match(pattern))
    .find((match) => match?.[1]);
  const candidate = prefixedMatch?.[1] ?? trimmed;

  return normalizeWorkspaceSlug(candidate);
}

export function getStoredWorkspaceSlug(): string | null {
  return normalizeWorkspaceSlug(localStorage.getItem(LAST_WORKSPACE_SLUG_KEY));
}

export function setStoredWorkspaceSlug(slug: string): void {
  const normalized = normalizeWorkspaceSlug(slug);

  if (!normalized) {
    return;
  }

  localStorage.setItem(LAST_WORKSPACE_SLUG_KEY, normalized);
}

export function clearStoredWorkspaceSlug(): void {
  localStorage.removeItem(LAST_WORKSPACE_SLUG_KEY);
}
