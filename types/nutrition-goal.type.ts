/* ============================================================================
 * NUTRITION GOAL TYPES
 * APIs: /nutrition-goals
 * ========================================================================== */

import { GoalType } from './enum.type';

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface INutritionGoal {
  id: number;
  goalType: GoalType;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDay: string;
  endDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateNutritionGoalRequest {
  goalType: GoalType;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDay: string;
  endDate: string;
}

export interface IUpdateNutritionGoalRequest {
  goalType?: GoalType;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  targetFiber?: number;
  startDay?: string;
  endDate?: string;
}

export interface IBulkDeleteNutritionGoalRequest {
  ids: number[];
}
