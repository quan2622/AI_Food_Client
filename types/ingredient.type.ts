/* ============================================================================
 * INGREDIENT TYPES
 * APIs: /ingredients | /food-ingredients | /ingredient-allergens
 * ========================================================================== */

import { IAllergen } from './allergen.type';
import { IFood } from './food.type';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface IIngredient {
  id: number;
  ingredientName: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IFoodIngredient {
  id: number;
  quantityGrams: number;
  foodId: number;
  food?: IFood;
  ingredientId: number;
  ingredient?: IIngredient;
  createdAt: string;
  updatedAt: string;
}

export interface IIngredientAllergen {
  id: number;
  ingredientId: number;
  ingredient?: IIngredient;
  allergenId: number;
  allergen?: IAllergen;
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateFoodIngredientRequest {
  ingredientId: number;
  quantityGrams: number;
}

export interface IUpdateFoodIngredientRequest {
  ingredientId?: number;
  quantityGrams?: number;
}

export interface ICreateIngredientAllergenRequest {
  ingredientId: number;
  allergenId: number;
}
