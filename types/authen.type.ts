/* ============================================================================
 * AUTHEN TYPES
 * APIs: POST /auth/login | POST /auth/refresh-token | POST /auth/register
 * ========================================================================== */

// ─── Token Data ───────────────────────────────────────────────────────────────

export interface IAuthTokenData {
  access_token: string;
  refresh_token: string;
}

// ─── User (No Password) ───────────────────────────────────────────────────────

export interface IUser {
  id: number;
  email: string;
  avatarUrl?: string | null;
  fullName: string;
  dateOfBirth?: string | null;
  isAdmin: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  accessToken?: string | null;
  refreshToken?: string | null;
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface IUserAuthPayload {
  id: number;
  email: string;
  isAdmin: boolean;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ICreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
  birthOfDate?: string;
  isAdmin?: boolean;
}

export interface IUpdateUserRequest {
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  birthOfDate?: string;
  isAdmin?: boolean;
}

export interface IUpdatePasswordRequest {
  newPassword: string;
}

export interface IUpdateStatusRequest {
  status: boolean;
}
