export type CurrentUser = {
  id: string;
  full_name: string;
  username: string | null;
  is_super_admin: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: 'bearer';
  user: CurrentUser;
};
