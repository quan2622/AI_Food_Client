/* ============================================================================
 * ALLCODE TYPES
 * APIs: /allcodes
 * ========================================================================== */

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface IAllCode {
  id: number;
  keyMap: string;
  type: string;
  value: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ICreateAllCodeRequest {
  keyMap: string;
  type: string;
  value: string;
  description?: string;
}

export interface IUpdateAllCodeRequest {
  keyMap?: string;
  type?: string;
  value?: string;
  description?: string;
}

export interface IBulkCreateAllCodeRequest {
  items: ICreateAllCodeRequest[];
}

export interface IBulkDeleteAllCodeRequest {
  ids: number[];
}
