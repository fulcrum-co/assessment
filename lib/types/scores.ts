export type DimensionStatus = 'Strong' | 'Moderate' | 'Weak' | 'Drift' | 'Gap' | 'Crisis' |
  'Mature' | 'Developing' | 'Immature' | 'Fragile' |
  'Sustainable' | 'Strained' | 'Trapped' |
  'Positive' | 'Mixed' | 'Neutral' | 'Skeptic' |
  'Aware' | 'Curious' | 'Blind' | 'Absent';

export interface DimensionScore {
  score: number;
  maxScore: number;
  percentage: number;
  status: DimensionStatus;
  statusDescription: string;
}

export interface DimensionScores {
  strategicClarity: DimensionScore;
  executionGap: DimensionScore;
  operationalMaturity: DimensionScore;
  capacityModel: DimensionScore;
  advisoryReadiness: DimensionScore;
  leverageOpportunity: DimensionScore;
  overall: number; // 0-100
}

export interface DetectedPatterns {
  founderTrap: boolean;
  planningTheater: boolean;
  toolSprawl: boolean;
  shelfConsultant: boolean;
  capacityCrisis: boolean;
  executionInfrastructureGap: boolean;
}

export interface InfrastructureStatus {
  writtenPlan: boolean;
  quarterlyObjectives: boolean;
  progressReview: boolean;
  metricsTracked: boolean;
  retrospectives: boolean;
  total: number;
}

export interface WorkDistribution {
  fullTime: number;
  partTime: number;
  external: number;
  leadership: number;
}

// Benchmark data for comparison
export interface Benchmarks {
  strategicClarity: number;
  executionGap: number;
  operationalMaturity: number;
  capacityModel: number;
  leverageOpportunity: number;
}

export const STAGE_BENCHMARKS: Benchmarks = {
  strategicClarity: 10,
  executionGap: 12,
  operationalMaturity: 11,
  capacityModel: 12,
  leverageOpportunity: 5,
};
