/* ============================================================================
 * ENUM TYPES (shared across all domains)
 * ========================================================================== */

export enum GoalType {
  GOAL_LOSS = 'GOAL_LOSS',
  GOAL_GAIN = 'GOAL_GAIN',
  GOAL_MAINTAIN = 'GOAL_MAINTAIN',
  GOAL_STRICT = 'GOAL_STRICT',
}

export enum NutritionGoalStatus {
  NUTR_GOAL_ONGOING = 'NUTR_GOAL_ONGOING',
  NUTR_GOAL_COMPLETED = 'NUTR_GOAL_COMPLETED',
  NUTR_GOAL_PAUSED = 'NUTR_GOAL_PAUSED',
  NUTR_GOAL_FAILED = 'NUTR_GOAL_FAILED',
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
}

export enum StatusType {
  BELOW = 'BELOW',
  MET = 'MET',
  ABOVE = 'ABOVE',
}

export enum SeverityType {
  SEV_LOW = 'SEV_LOW',
  SEV_MEDIUM = 'SEV_MEDIUM',
  SEV_HIGH = 'SEV_HIGH',
  SEV_LIFE_THREATENING = 'SEV_LIFE_THREATENING',
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
  SUPER_ACTIVE = 'SUPER_ACTIVE',
}

export enum ReportType {
  UPLOAD_COUNT = 'UPLOAD_COUNT',
  POPULAR_FOOD = 'POPULAR_FOOD',
  TRAFFIC = 'TRAFFIC',
}

export enum SourceType {
  USDA = 'USDA',
  MANUAL = 'MANUAL',
  CALCULATED = 'CALCULATED',
}

export enum UnitType {
  UNIT_G = 'UNIT_G',
  UNIT_KG = 'UNIT_KG',
  UNIT_MG = 'UNIT_MG',
  UNIT_OZ = 'UNIT_OZ',
  UNIT_LB = 'UNIT_LB',
}
