/**
 * Fixture data for Playwright E2E tests.
 * Shapes match the TypeScript types from src/api/**.
 */

export const API_DATA = {
  auth: {
    access_token: 'mock-jwt-token',
    token_type: 'bearer' as const,
    user: {
      id: '1',
      full_name: 'Test User',
      username: 'testuser',
      is_super_admin: true,
    },
  },

  workspaces: [
    {
      id: '1',
      title: 'My Workspace',
      slug: 'my-workspace',
      status: 'active' as const,
      plan: 'pro' as const,
      created_at: '2024-01-15T10:00:00Z',
      has_bot: false,
    },
    {
      id: '2',
      title: 'Team Alpha',
      slug: 'team-alpha',
      status: 'active' as const,
      plan: 'free' as const,
      created_at: '2024-03-01T08:00:00Z',
      has_bot: true,
    },
    {
      id: '3',
      title: 'Archived Project',
      slug: 'archived-project',
      status: 'archived' as const,
      plan: 'basic' as const,
      created_at: '2023-06-10T12:00:00Z',
      has_bot: false,
    },
  ],

  workspaceDetail: {
    id: '1',
    title: 'My Workspace',
    slug: 'my-workspace',
    status: 'active' as const,
    plan: 'pro' as const,
    created_at: '2024-01-15T10:00:00Z',
    has_bot: false,
    fee_rate: '5.0',
    members_count: {
      assistant: 3,
      client: 12,
      workspace_admin: 2,
    },
    bot_username: null,
    mini_app_url: null,
  },

  workspaceDetailWithBot: {
    id: '2',
    title: 'Team Alpha',
    slug: 'team-alpha',
    status: 'active' as const,
    plan: 'free' as const,
    created_at: '2024-03-01T08:00:00Z',
    has_bot: true,
    fee_rate: '3.0',
    members_count: {
      assistant: 1,
      client: 5,
      workspace_admin: 1,
    },
    bot_username: 'team_alpha_bot',
    mini_app_url: 'https://t.me/team_alpha_bot/team_alpha',
  },

  workspaceBilling: {
    plan: 'pro' as const,
    fee_rate: '5.0',
    subscription: {
      id: 'sub_1',
      plan: 'pro' as const,
      billing_period: 'monthly' as const,
      status: 'active' as const,
      started_at: '2025-03-01T00:00:00Z',
      expires_at: '2025-04-01T00:00:00Z',
      cancelled_at: null,
      auto_renew: true,
      provider: 'manual' as const,
    },
    limits_usage: {
      members: {
        current: 35,
        max: 50,
      },
      projects: {
        current: 6,
        max: null,
      },
    },
    recent_payments: [
      {
        id: 'pay_1',
        amount: '2490.00',
        currency: 'RUB' as const,
        status: 'paid' as const,
        paid_at: '2025-03-01T00:00:00Z',
        payment_method_last4: '4242',
        description: 'Pro — ежемесячно',
        created_at: '2025-03-01T00:00:00Z',
      },
      {
        id: 'pay_2',
        amount: '2490.00',
        currency: 'RUB' as const,
        status: 'paid' as const,
        paid_at: '2025-02-01T00:00:00Z',
        payment_method_last4: '4242',
        description: 'Pro — ежемесячно',
        created_at: '2025-02-01T00:00:00Z',
      },
      {
        id: 'pay_3',
        amount: '2490.00',
        currency: 'RUB' as const,
        status: 'paid' as const,
        paid_at: '2025-01-01T00:00:00Z',
        payment_method_last4: '4242',
        description: 'Pro — ежемесячно',
        created_at: '2025-01-01T00:00:00Z',
      },
    ],
  },

  workspaceBillingPlans: [
    {
      plan: 'free' as const,
      price_monthly: 0,
      price_annual: 0,
      limits: {
        members: 5,
        projects: 1,
        crypto: false,
      },
      is_current: false,
    },
    {
      plan: 'pro' as const,
      price_monthly: 2490,
      price_annual: 24900,
      limits: {
        members: 50,
        projects: null,
        crypto: true,
      },
      is_current: true,
    },
    {
      plan: 'business' as const,
      price_monthly: 7490,
      price_annual: 74900,
      limits: {
        members: null,
        projects: null,
        crypto: true,
      },
      is_current: false,
    },
  ],

  workspaceUsers: [
    {
      id: '10',
      full_name: 'Test User',
      username: 'testuser',
      role: 'workspace_admin' as const,
      joined_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '11',
      full_name: 'Alice Smith',
      username: 'alice',
      role: 'assistant' as const,
      joined_at: '2024-02-01T09:00:00Z',
    },
    {
      id: '12',
      full_name: 'Bob Johnson',
      username: null,
      role: 'client' as const,
      joined_at: '2024-03-15T14:00:00Z',
    },
  ],

  invite: {
    workspace_id: '3',
    workspace_title: 'Partner Space',
    role: 'assistant' as const,
    expires_at: '2026-12-31T00:00:00Z',
    status: 'pending' as const,
  },

  acceptInvite: {
    workspace_id: '3',
  },

  createdWorkspace: {
    id: '99',
    title: 'New Space',
    slug: 'new-space',
    status: 'active' as const,
    plan: 'free' as const,
    created_at: '2026-04-10T10:00:00Z',
    has_bot: false,
  },

  workspaceInviteLink: {
    id: 'inv1',
    token: 'generated-invite-token',
    role: 'assistant' as const,
    expires_at: '2026-05-10T10:00:00Z',
    invite_url: 'https://t.me/bot?start=invite_generated-invite-token',
  },
};
