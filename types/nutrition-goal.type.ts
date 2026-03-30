/* ============================================================================
 * NUTRITION GOAL TYPES
 * APIs: /nutrition-goals
 * ========================================================================== */

import { GoalType } from './enum.type';

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface INutritionGoal {
  id: number;
  goalType: GoalType | string;
  status: string;
  targetWeight: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  goalTypeInfo?: Record<string, unknown> | null;
  statusInfo?: Record<string, unknown> | null;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateNutritionGoalRequest {
  goalType: GoalType | string;
  status?: string;
  targetWeight: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
}

export interface IUpdateNutritionGoalRequest {
  goalType?: GoalType | string;
  status?: string;
  targetWeight?: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  targetFiber?: number;
  startDate?: string;
  endDate?: string;
}

export interface IBulkDeleteNutritionGoalRequest {
  ids: number[];
}
