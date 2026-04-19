import { GoalType, NutritionGoalStatus } from "./enum.type";

export interface INutritionGoal {
  id: number;
  userId: number;
  goalType: GoalType;
  targetWeight: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
  status: NutritionGoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateNutritionGoalRequest {
  goalType: GoalType;
  targetWeight: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
  status?: NutritionGoalStatus;
}

export interface ISmartNutritionGoalRequest {
  goalType: GoalType;
  targetWeight?: number;
  endDate: string;
}

export interface IUpdateNutritionGoalRequest extends Partial<ICreateNutritionGoalRequest> {}

export interface IBulkDeleteNutritionGoalRequest {
  ids: number[];
}
