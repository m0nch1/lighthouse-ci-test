/**
 * npm ライブラリに型がないため、一時的にコピーして利用する
 * https://github.com/GoogleChrome/lighthouse-ci/blob/f28992b5ce434e072e2c3c744ac46dc0ddc0f6f4/types/lighthouse.d.ts
 */

export type DetailsType =
  | 'node'
  | 'code'
  | 'bytes'
  | 'ms'
  | 'timespanMs'
  | 'text'
  | 'numeric'
  | 'url'
  | 'link'
  | 'source-location'
  | 'thumbnail'
  | 'debugdata'
  | 'unknown';

export interface AuditResult {
  id?: string;
  title?: string;
  description?: string;
  errorMessage?: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  details?: {
    type: string;
    items?: Array<Record<string, any>>;
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
    headings?: Array<{
      key: string | null;
      subItemsHeading?: { key: string };
      valueType?: DetailsType;
      itemType?: DetailsType;
      label?: string;
      text?: string;
    }>;
  };
  scoreDisplayMode?:
  | 'notApplicable'
  | 'informative'
  | 'numeric'
  | 'binary'
  | 'error'
  | 'manual';
}

export interface CategoryResult {
  id: string;
  score: number;
  title: string;
  description?: string;
  auditRefs: Array<{ id: string; weight: number; group?: string }>;
}

export interface Result {
  requestedUrl: string;
  finalUrl: string;
  fetchTime: string;
  lighthouseVersion: string;
  categories: { [categoryId: string]: CategoryResult };
  audits: { [auditId: string]: AuditResult };
  categoryGroups?: Record<string, { title: string; description?: string }>;
  configSettings: Record<string, any>;
  runWarnings: string[];
  userAgent: string;
  environment: { hostUserAgent: string; networkUserAgent: string; benchmarkIndex: number };
  timing: { total: number; entries: any[] };
  i18n: {
    rendererFormattedStrings: Record<string, string>;
    icuMessagePaths: Record<string, any[]>;
  };
  stackPacks?: any[];
}
