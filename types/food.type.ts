/* ============================================================================
 * FOOD TYPES
 * APIs: /foods | /food-categories
 * ========================================================================== */

import { IFoodNutritionProfile } from "./nutrient.type";

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface IFoodCategory {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  parent?: IFoodCategory | null;
  children?: IFoodCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface IFoodIngredient {
  id?: number;
  ingredientId?: number;
  quantityGrams: number;
  ingredient?: {
    id?: number;
    ingredientName: string;
    ingredientAllergens?: Array<{
      allergen?: {
        name: string;
        imageUrl?: string | null;
      } | null;
    }>;
  } | null;
}

export interface IFood {
  id: number;
  foodName: string;
  description?: string | null;
  imageUrl?: string | null;
  categoryId?: number | null;
  defaultServingGrams?: number | null;
  foodCategory?: IFoodCategory | null;
  nutritionProfile?: IFoodNutritionProfile | null;
  foodIngredients?: IFoodIngredient[];
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateFoodRequest {
  foodName: string;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
}

export interface IUpdateFoodRequest {
  foodName?: string;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
}

export interface ICreateFoodCategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
}

export interface IUpdateFoodCategoryRequest {
  name?: string;
  description?: string;
  parentId?: number;
}

export interface IBulkCreateFoodRequest {
  items: ICreateFoodRequest[];
}

export interface IBulkDeleteFoodRequest {
  ids: number[];
}
