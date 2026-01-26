import { DimensionScores, DetectedPatterns, InfrastructureStatus, WorkDistribution } from './scores';
import { ContactInfo, DiagnosticResponses } from './diagnostic';

export interface Finding {
  dimension: string;
  title: string;
  content: string;
  quote?: string;
  implication: string;
}

export interface Recommendation {
  priority: number;
  title: string;
  content: string;
  actions: string[];
}

export interface DimensionInterpretation {
  opening: string;
  details: string[];
  implications: string;
}

export interface ReportContent {
  // Page 1: Executive Summary
  executiveSummary: {
    overallScore: number;
    status: string;
    effectivenessStatement: string;
    keyFindings: Finding[];
  };

  // Page 2: Strategic Clarity & Execution
  strategicClarity: {
    interpretation: DimensionInterpretation;
    decisionBehaviorAnalysis: string;
    alignmentAnalysis: string;
    initiativeAnalysis: string;
    stalledPriorityQuote: string;
  };
  executionGap: {
    interpretation: DimensionInterpretation;
    breakdownPoint: string;
    infrastructureStatus: InfrastructureStatus;
    infrastructureAnalysis: string;
  };

  // Page 3: Operations & Capacity
  operationalMaturity: {
    interpretation: DimensionInterpretation;
    documentationAnalysis: string;
    techStackAnalysis: string;
    techSprawlWarning?: string;
  };
  capacityModel: {
    interpretation: DimensionInterpretation;
    workDistribution: WorkDistribution;
    founderTrapWarning?: string;
    capabilityGapAnalysis: string;
  };

  // Page 4: Leverage & Comparative
  leverageOpportunity: {
    interpretation: DimensionInterpretation;
    marketPositionAnalysis: string;
    adjacentMarketAnalysis: string;
    partnershipAnalysis: string;
    leverageSourceQuote: string;
  };
  comparative: {
    benchmarkAnalysis: string;
    patternSynthesis: string;
  };

  // Page 5: Recommendations
  recommendations: Recommendation[];
  engagementReadiness: {
    assessment: string;
    capacity: string;
    timeline: string;
  };
  nextSteps: {
    content: string;
    cta: string;
  };
}

export interface FullReport {
  id: string;
  createdAt: string;
  contact: ContactInfo;
  responses: DiagnosticResponses;
  scores: DimensionScores;
  patterns: DetectedPatterns;
  content: ReportContent;
}
