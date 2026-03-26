/* ============================================================================
 * REPORT TYPES
 * APIs: /reports
 * ========================================================================== */

import { ReportType } from './enum.type';

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface IReport {
  id: number;
  reportType: ReportType;
  generatedAt: string;
  timeRangeStart: string;
  timeRangeEnd: string;
  data: string; // JSON string
  userId: number;
  createdAt: string;
  updatedAt: string;
}
