/* ============================================================================
 * DAILY LOG & MEAL TYPES
 * APIs: /daily-logs | /meals | /meal-items | /food-images
 * ========================================================================== */

import { MealType, StatusType } from './enum.type';
import { IFood } from './food.type';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface IMealItem {
  id: number;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  foodId: number;
  food?: IFood;
  mealId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFoodImage {
  id: number;
  imageUrl: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  uploadedAt: string;
  userId: number;
  mealId: number;
}

export interface IMeal {
  id: number;
  mealType: MealType;
  mealDateTime: string;
  dailyLogId: number;
  mealItems?: IMealItem[];
  foodImages?: IFoodImage[];
  createdAt: string;
  updatedAt: string;
}

export interface IDailyLog {
  id: number;
  logDate: string;
  status: StatusType;
  userId: number;
  meals?: IMeal[];
  createdAt: string;
  updatedAt: string;
}

export interface IDailyLogSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  mealCount: number;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateMealItemRequest {
  foodId: number;
  quantity: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface IUpdateMealItemRequest {
  quantity?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface ICreateFoodImageRequest {
  mealId: number;
}

export interface ICreateMealRequest {
  mealType: MealType;
  mealDateTime: string;
}

export interface IUpdateMealRequest {
  mealType?: MealType;
  mealDateTime?: string;
}

export interface ICreateDailyLogRequest {
  logDate: string;
}

export interface IUpdateDailyLogRequest {
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  targetFiber?: number;
  status?: StatusType;
}
