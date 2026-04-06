<script lang="ts">
  import { Typography } from '@chiffa001/tg-svelte-ui';

  import type { WorkspaceUser } from '@/api/workspaces/types';
  import {
    getWorkspaceMemberInitials,
    WORKSPACE_MEMBER_AVATAR_COLORS,
    WORKSPACE_MEMBER_BADGE_COLORS,
    WORKSPACE_MEMBER_FILTER_LABELS,
  } from '@/lib/workspace-members';

  type Props = {
    member: WorkspaceUser;
  };

  const { member }: Props = $props();
</script>

<div class="member-row">
  <div
    class="member-avatar"
    style={`background:${WORKSPACE_MEMBER_AVATAR_COLORS[member.role]};`}
    aria-hidden="true"
  >
    <Typography
      variant="overline"
      color="#ffffff"
    >
      {getWorkspaceMemberInitials(member.full_name)}
    </Typography>
  </div>

  <div class="member-copy">
    <Typography
      variant="body"
      color="#171717"
    >
      {member.full_name}
    </Typography>

    <Typography
      variant="caption"
      color="#737373"
    >
      {member.username ?? 'Без username'}
    </Typography>
  </div>

  <span
    class="member-badge"
    style={`background:${WORKSPACE_MEMBER_BADGE_COLORS[member.role].background};color:${WORKSPACE_MEMBER_BADGE_COLORS[member.role].color};`}
  >
    <Typography
      variant="overline"
      color="currentColor"
    >
      {WORKSPACE_MEMBER_FILTER_LABELS[member.role]}
    </Typography>
  </span>
</div>

<style>
  .member-row {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 12px;
  }

  .member-avatar {
    display: flex;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
  }

  .member-avatar :global(p) {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
  }

  .member-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  .member-copy :global(p) {
    margin: 0;
  }

  .member-copy :global(p:first-child) {
    font-size: 14px;
  }

  .member-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 999px;
    padding: 3px 8px;
    text-align: center;
  }
</style>
