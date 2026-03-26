/* ============================================================================
 * AI MODEL & TRAINING JOB TYPES
 * APIs: /ai-models | /ai-training-jobs
 * ========================================================================== */

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface IAITrainingJob {
  id: number;
  startedAt: string;
  finishedAt?: string | null;
  status: string;
  modelId: number;
  model?: IAIModel;
  createdAt: string;
  updatedAt: string;
}

export interface IAIModel {
  id: number;
  version: string;
  accuracy: number;
  loss: number;
  jobs?: IAITrainingJob[];
  createdAt: string;
  updatedAt: string;
}
