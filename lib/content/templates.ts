// Static content templates for the report

export const EFFECTIVENESS_STATEMENTS: Record<string, string> = {
  strong: 'effectively multiplies',
  moderate: 'partially multiplies',
  developing: 'struggles to multiply',
  critical: 'fails to multiply',
};

export const STATUS_LABELS: Record<number, string> = {
  80: 'strong',
  60: 'moderate',
  40: 'developing',
  0: 'critical',
};

export function getOverallStatus(score: number): string {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'moderate';
  if (score >= 40) return 'developing';
  return 'critical';
}

export function getEffectivenessStatement(score: number): string {
  return EFFECTIVENESS_STATEMENTS[getOverallStatus(score)];
}

// Infrastructure element labels
export const INFRASTRUCTURE_LABELS: Record<string, string> = {
  written_plan: 'Written strategic plan (updated within 12 months)',
  quarterly_objectives: 'Documented quarterly objectives with clear owners',
  progress_review: 'Weekly/biweekly progress review rhythm',
  metrics_tracked: 'Defined metrics tracked against initiatives',
  retrospectives: 'Regular retrospectives',
};

// Breakdown point labels
export const BREAKDOWN_LABELS: Record<string, string> = {
  strategy_to_operational: 'Strategy → Operational Planning',
  operational_to_daily: 'Operational Planning → Daily Work',
  tasks_to_completion: 'Tasks → Completion',
  completion_to_results: 'Completion → Results',
};

// Work distribution healthy ranges
export const HEALTHY_RANGES = {
  fullTime: { min: 40, max: 70, label: 'Full-time employees' },
  partTime: { min: 10, max: 30, label: 'Part-time/contract' },
  external: { min: 10, max: 30, label: 'External partners' },
  leadership: { min: 5, max: 20, label: 'Leadership/founders' },
};

// Capability gap labels
export const CAPABILITY_GAP_LABELS: Record<string, string> = {
  strategic_planning: 'Strategic planning and market analysis',
  operational_design: 'Operational design and process building',
  project_management: 'Project management and execution oversight',
  technology: 'Technology implementation and optimization',
  marketing: 'Marketing and demand generation',
  sales: 'Sales process and pipeline management',
  finance: 'Finance and capital allocation',
  people_ops: 'People operations and team building',
};

// Investment capacity labels
export const INVESTMENT_LABELS: Record<string, string> = {
  under_5k: 'Under $5,000/month',
  '5k_7500': '$5,000–$7,500/month',
  '7500_15k': '$7,500–$15,000/month',
  '15k_plus': '$15,000+/month',
  unsure: 'Depends on expected value',
};

// Timeline labels
export const TIMELINE_LABELS: Record<string, string> = {
  immediately: 'Immediately',
  '1_3_months': '1–3 months',
  '3_6_months': '3–6 months',
  exploring: 'Exploring options',
};

// Next step labels
export const NEXT_STEP_LABELS: Record<string, string> = {
  report_only: 'Report only',
  conversation: 'Conversation',
  both: 'Report then conversation',
  just_report: 'Just the report',
};

// Methodology note
export const METHODOLOGY_NOTE = `This diagnostic was developed by Fulcrum Collective based on patterns observed across organizations navigating the growth phase between startup and scale-up. Questions were designed to surface behavior, not intention.

Limitations: This assessment is based on self-reported responses from a single perspective. Findings should be treated as directional hypotheses to explore, not definitive conclusions.`;

// Footer text
export const FOOTER_TEXT = `Fulcrum Collective
Strategy-to-Execution Partnership for SMB Leaders
fulcrumcollective.io`;
