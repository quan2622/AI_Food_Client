/* ============================================================================
 * ENUM TYPES (shared across all domains)
 * ========================================================================== */

export enum GoalType {
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  WEIGHT_GAIN = 'WEIGHT_GAIN',
  MAINTENANCE = 'MAINTENANCE',
  STRICT_DIET = 'STRICT_DIET',
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
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  LIFE_THREATENING = 'LIFE_THREATENING',
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
