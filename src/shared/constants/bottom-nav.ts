export const WORKSPACE_BOTTOM_NAV_SECTION = {
  GROUPS: 'groups',
  ABOUT: 'about',
} as const;

export type WorkspaceBottomNavSection =
  (typeof WORKSPACE_BOTTOM_NAV_SECTION)[keyof typeof WORKSPACE_BOTTOM_NAV_SECTION];
