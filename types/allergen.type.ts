/* ============================================================================
 * ALLERGEN TYPES
 * APIs: /allergens | /user-allergies
 * ========================================================================== */

import { SeverityType } from './enum.type';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface IAllergen {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUserAllergy {
  id: number;
  severity: SeverityType;
  note?: string | null;
  userId: number;
  allergenId: number;
  allergen?: IAllergen;
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateAllergenRequest {
  name: string;
  description?: string;
}

export interface ICreateUserAllergyRequest {
  allergenId: number;
  severity: SeverityType;
  note?: string;
}

export interface IUpdateUserAllergyRequest {
  severity?: SeverityType;
  note?: string;
}
