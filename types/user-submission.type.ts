export enum SubmissionType {
  REPORT = "REPORT",
  CONTRIBUTION = "CONTRIBUTION",
}

export enum SubmissionCategory {
  WRONG_INFO = "WRONG_INFO",
  BAD_IMAGE = "BAD_IMAGE",
  NEW_FOOD = "NEW_FOOD",
  DUPLICATE = "DUPLICATE",
}

export enum SubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IUserSubmission {
  id: number;
  type: SubmissionType;
  category: SubmissionCategory;
  targetFoodId?: number;
  payload?: any;
  description: string;
  status: SubmissionStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSubmissionRequest {
  type: SubmissionType;
  targetFoodId?: number;
  category: SubmissionCategory;
  payload?: Record<string, any>;
  description: string;
}
