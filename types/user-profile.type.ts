/* ============================================================================
 * USER PROFILE TYPES
 * APIs: GET|POST|PUT /user-profiles
 * ========================================================================== */

import { ActivityLevel } from "./enum.type";

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface IUserProfile {
  id: number;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  gender?: string | null;
  activityLevel?: ActivityLevel | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateUserProfileRequest {
  age: number;
  height: number;
  weight: number;
  gender?: string;
  activityLevel?: ActivityLevel;
}

export interface IUpdateUserProfileRequest {
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  activityLevel?: ActivityLevel | string;
}
