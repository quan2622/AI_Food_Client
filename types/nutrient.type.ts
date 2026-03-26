/* ============================================================================
 * NUTRIENT TYPES
 * APIs: /nutrients | /ingredient-nutritions
 * ========================================================================== */

import { UnitType, SourceType } from './enum.type';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface INutrient {
  id: number;
  name: string;
  unit: UnitType;
  createdAt?: string;
  updatedAt?: string;
}

export interface INutritionValue {
  id: number;
  value: number;
  nutrientId: number;
  nutrient?: INutrient;
  ingredientNutritionId: number;
}

export interface IIngredientNutrition {
  id: number;
  servingSize: number;
  servingUnit: UnitType;
  source: SourceType;
  isCalculated: boolean;
  ingredientId: number;
  values?: INutritionValue[];
  createdAt: string;
  updatedAt: string;
}

// ─── Food Nutrition (linked to Food, not Ingredient) ──────────────────────────

export interface IFoodNutritionValue {
  id: number;
  value: number;
  nutrientId: number;
  nutrient?: INutrient;
  foodNutritionProfileId: number;
}

export interface IFoodNutritionProfile {
  id: number;
  source: SourceType;
  isCalculated: boolean;
  foodId: number;
  values?: IFoodNutritionValue[];
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateNutrientRequest {
  name: string;
  unit: UnitType;
}

export interface ICreateIngredientNutritionRequest {
  servingSize: number;
  servingUnit: UnitType;
  source?: SourceType;
  isCalculated?: boolean;
}

export interface IUpsertNutritionValueRequest {
  values: Array<{
    nutrientId: number;
    value: number;
  }>;
}
