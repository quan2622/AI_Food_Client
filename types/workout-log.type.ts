/* ============================================================================
 * WORKOUT LOG TYPES
 * APIs: /workout-logs
 * ========================================================================== */

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface IWorkoutLog {
  id: number;
  userId: number;
  workoutType: string;
  durationMinute?: number | null;
  burnedCalories: number;
  startedAt: string;
  endedAt?: string | null;
  source?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateWorkoutLogRequest {
  workoutType: string;
  durationMinute?: number;
  burnedCalories?: number;
  startedAt: string;
  endedAt?: string;
  source?: string;
}

export interface IUpdateWorkoutLogRequest {
  workoutType?: string;
  durationMinute?: number;
  burnedCalories?: number;
  startedAt?: string;
  endedAt?: string;
  source?: string;
}
