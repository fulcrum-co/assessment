import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns, InfrastructureStatus, WorkDistribution } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import { getOverallStatus, getEffectivenessStatement } from './templates';
import { generateKeyFindings } from './findings';
import {
  generateStrategicClarityInterpretation,
  generateExecutionGapInterpretation,
  generateOperationalMaturityInterpretation,
  generateCapacityModelInterpretation,
  generateLeverageOpportunityInterpretation,
} from './interpretations';
import {
  generateRecommendations,
  generateEngagementReadiness,
  generateNextSteps,
} from './recommendations';

export function generateReportContent(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): ReportContent {
  // Infrastructure status from Q14
  const infrastructureItems = responses.execution.q14_infrastructure || [];
  const infrastructureStatus: InfrastructureStatus = {
    writtenPlan: infrastructureItems.includes('written_plan'),
    quarterlyObjectives: infrastructureItems.includes('quarterly_objectives'),
    progressReview: infrastructureItems.includes('progress_review'),
    metricsTracked: infrastructureItems.includes('metrics_tracked'),
    retrospectives: infrastructureItems.includes('retrospectives'),
    total: infrastructureItems.length,
  };

  // Work distribution from Q23
  const workDistribution: WorkDistribution = responses.capacity.q23_work_distribution || {
    fullTime: 0,
    partTime: 0,
    external: 0,
    leadership: 0,
  };

  // Generate all content sections
  const keyFindings = generateKeyFindings(responses, scores, patterns);
  const recommendations = generateRecommendations(responses, scores, patterns);
  const engagementReadiness = generateEngagementReadiness(responses);
  const nextSteps = generateNextSteps(responses);

  // Generate interpretations
  const strategicClarityInterp = generateStrategicClarityInterpretation(responses, scores);
  const executionGapInterp = generateExecutionGapInterpretation(responses, scores);
  const operationalMaturityInterp = generateOperationalMaturityInterpretation(responses, scores, patterns);
  const capacityModelInterp = generateCapacityModelInterpretation(responses, scores, patterns);
  const leverageOpportunityInterp = generateLeverageOpportunityInterpretation(responses, scores);

  // Breakdown point analysis
  const breakdownPoints = responses.execution.q15_breakdown_points || [];
  const primaryBreakdown = breakdownPoints[0];
  const breakdownLabels: Record<string, string> = {
    strategy_to_operational: 'between strategy and operational planning',
    operational_to_daily: 'between operational planning and daily work',
    tasks_to_completion: 'between tasks and completion',
    completion_to_results: 'between completion and results',
  };
  const breakdownAnalysis = primaryBreakdown
    ? `Execution most commonly breaks down ${breakdownLabels[primaryBreakdown] || 'at an unspecified point'}.`
    : 'Breakdown points were not specified.';

  // Tech sprawl warning
  const techSprawlWarning = patterns.toolSprawl
    ? 'Your technology profile suggests significant tool sprawl with limited strategic integration. Based on typical patterns, your organization is likely paying for 40-60% more software capability than it\'s meaningfully using.'
    : undefined;

  // Founder trap warning
  const founderTrapWarning = patterns.founderTrap
    ? 'A critical pattern emerged across multiple responses: your organization is consistently over capacity, new work is absorbed by the team working more, and your time as founder is spent primarily on operational execution. This combination means the organization cannot scale beyond your personal bandwidth. Every growth opportunity increases the burden on you personally rather than building organizational capability.'
    : undefined;

  // Capability gap analysis
  const capabilityGaps = responses.capacity.q24_capability_gaps || [];
  const gapCount = capabilityGaps.length;
  let capabilityGapAnalysis = '';
  if (gapCount === 0) {
    capabilityGapAnalysis = 'No significant capability gaps were identified internally.';
  } else if (gapCount <= 2) {
    capabilityGapAnalysis = 'Your capability gaps are narrow and addressable through targeted hiring or partnerships.';
  } else if (gapCount <= 4) {
    capabilityGapAnalysis = 'Your capability gaps span multiple functions, suggesting a need for broader capability building.';
  } else {
    capabilityGapAnalysis = 'Your capability gaps are extensive, spanning both strategic and operational functions. This breadth requires a systematic approach to capability building.';
  }

  // Pattern synthesis for comparative section
  let patternSynthesis = '';
  if (patterns.planningTheater) {
    patternSynthesis = 'Your organization knows where it wants to go. Strategic clarity is strong—leadership is aligned, priorities are understood, and strategic direction guides decisions. The challenge is the gap between knowing and doing.\n\nYour execution capability and operational maturity scores reveal why strategy isn\'t translating to results: the infrastructure that connects strategic intent to daily work doesn\'t exist or isn\'t being used effectively.';
  } else if (patterns.founderTrap && patterns.capacityCrisis) {
    patternSynthesis = 'Your organization is caught in a compounding pattern: the founder is trapped in operations while the team is in capacity crisis. New strategic work cannibalizes existing priorities, and leadership bandwidth is the binding constraint.\n\nBreaking this pattern requires simultaneously reducing operational load on leadership while building organizational capability to absorb that work.';
  } else if (scores.overall < 40) {
    patternSynthesis = 'Your diagnostic reveals significant challenges across multiple dimensions. The pattern suggests fundamental infrastructure gaps that limit the organization\'s ability to execute on strategic intent.\n\nProgress will require addressing foundational issues before pursuing growth initiatives.';
  } else if (scores.overall >= 60) {
    patternSynthesis = 'Your organization demonstrates solid fundamentals across most dimensions. The opportunity is to strengthen specific areas while building on existing strengths.\n\nFocused improvement in your lowest-scoring areas would meaningfully increase overall organizational leverage.';
  } else {
    patternSynthesis = 'Your organization shows mixed patterns—some areas of strength alongside areas needing development. The priority is identifying which improvements will have the highest leverage on overall performance.\n\nSystematic attention to your lowest-scoring dimensions would improve organizational effectiveness.';
  }

  return {
    executiveSummary: {
      overallScore: scores.overall,
      status: getOverallStatus(scores.overall),
      effectivenessStatement: getEffectivenessStatement(scores.overall),
      keyFindings,
    },
    strategicClarity: {
      interpretation: strategicClarityInterp,
      decisionBehaviorAnalysis: getDecisionBehaviorAnalysis(responses.strategy.q5_decision_behavior),
      alignmentAnalysis: getAlignmentAnalysis(responses.strategy.q6_alignment),
      initiativeAnalysis: getInitiativeAnalysis(responses.strategy.q7_abandoned_initiatives),
      stalledPriorityQuote: responses.strategy.q9_stalled_priority || '',
    },
    executionGap: {
      interpretation: executionGapInterp,
      breakdownPoint: breakdownAnalysis,
      infrastructureStatus,
      infrastructureAnalysis: getInfrastructureAnalysis(infrastructureStatus.total),
    },
    operationalMaturity: {
      interpretation: operationalMaturityInterp,
      documentationAnalysis: getDocumentationAnalysis(responses.operations.q16_documentation),
      techStackAnalysis: getTechStackAnalysis(responses.operations),
      techSprawlWarning,
    },
    capacityModel: {
      interpretation: capacityModelInterp,
      workDistribution,
      founderTrapWarning,
      capabilityGapAnalysis,
    },
    leverageOpportunity: {
      interpretation: leverageOpportunityInterp,
      marketPositionAnalysis: getMarketPositionAnalysis(responses.leverage.q29_market_clarity),
      adjacentMarketAnalysis: getAdjacentMarketAnalysis(responses.leverage.q30_adjacent_markets),
      partnershipAnalysis: getPartnershipAnalysis(responses.leverage.q31_partnerships),
      leverageSourceQuote: responses.leverage.q32_leverage_source || '',
    },
    comparative: {
      benchmarkAnalysis: generateBenchmarkAnalysis(scores),
      patternSynthesis,
    },
    recommendations,
    engagementReadiness,
    nextSteps,
  };
}

// Helper functions for specific analyses
function getDecisionBehaviorAnalysis(behavior: string): string {
  const analyses: Record<string, string> = {
    references_priorities: 'Leadership effectively references shared priorities when making decisions, demonstrating strong strategic alignment.',
    debates_sometimes: 'Leadership debates decisions with occasional reference to strategy, suggesting inconsistent application of strategic priorities.',
    escalates_founder: 'Decisions consistently escalate to the founder regardless of stated priorities, creating a decision-making bottleneck.',
    urgency_driven: 'Decisions are driven by urgency or advocacy rather than strategic alignment, resulting in reactive resource allocation.',
  };
  return analyses[behavior] || 'Decision-making behavior was not specified.';
}

function getAlignmentAnalysis(alignment: string): string {
  const analyses: Record<string, string> = {
    nearly_identical: 'Leadership is strongly aligned on strategic priorities, with nearly identical understanding across the team.',
    substantially_similar: 'Leadership has substantially similar understanding of priorities with only minor differences.',
    overlapping_gaps: 'While there is overlap in how leadership understands priorities, meaningful gaps exist that create coordination challenges.',
    quite_different: 'Leadership would likely give quite different answers about priorities, indicating a fundamental alignment gap.',
  };
  return analyses[alignment] || 'Alignment was not specified.';
}

function getInitiativeAnalysis(abandoned: string): string {
  const analyses: Record<string, string> = {
    none: 'No significant initiatives were abandoned in the past year, suggesting strong initiative discipline or conservative commitment.',
    '1_2': 'A small number of initiatives were abandoned, which may reflect healthy course correction.',
    '3_5': 'Several initiatives were abandoned, pointing to potential issues with initiative selection or execution capacity.',
    more_than_5: 'More than five initiatives were abandoned, suggesting either insufficient vetting before commitment or systemic execution barriers.',
  };
  return analyses[abandoned] || 'Initiative history was not specified.';
}

function getInfrastructureAnalysis(count: number): string {
  if (count === 5) {
    return 'Your execution infrastructure is comprehensive. The question is whether it\'s being used effectively to drive results.';
  } else if (count >= 3) {
    return `Your organization has foundational execution infrastructure (${count} of 5 elements) but gaps remain that may limit execution consistency.`;
  } else {
    return `With ${count} of 5 core execution infrastructure elements in place, your organization is attempting to execute strategy through willpower and ad hoc coordination rather than systems.`;
  }
}

function getDocumentationAnalysis(documentation: string): string {
  const analyses: Record<string, string> = {
    most_documented: 'Most critical processes are documented and actively used, providing a foundation for scalable operations.',
    some_exists: 'Documentation exists but is incomplete or outdated, reducing its practical value for operations and onboarding.',
    in_heads: 'Critical operational knowledge lives in people\'s heads, creating key-person dependencies and onboarding challenges.',
    doesnt_stick: 'Previous documentation efforts haven\'t stuck, suggesting the challenge may be process design rather than discipline.',
  };
  return analyses[documentation] || 'Documentation status was not specified.';
}

function getTechStackAnalysis(operations: DiagnosticResponses['operations']): string {
  const toolCounts: Record<string, string> = {
    '1_5': '1-5 tools (consolidated)',
    '6_10': '6-10 tools (manageable)',
    '11_15': '11-15 tools (significant sprawl)',
    '15_plus': '15+ tools (extensive sprawl)',
  };

  const confidenceLevels: Record<string, string> = {
    very_confident: 'high confidence in effective use',
    somewhat_confident: 'moderate confidence with some waste',
    not_confident: 'low confidence—paying for unused capabilities',
    havent_audited: 'not recently audited',
  };

  const valueLevels: Record<string, string> = {
    '75_plus': '75%+ delivering value',
    '50_75': '50-75% delivering value',
    '25_50': '25-50% delivering value',
    less_25: 'less than 25% delivering value',
    not_sure: 'value unclear',
  };

  return `Current state: ${toolCounts[operations.q18_tool_count] || 'not specified'}. Confidence: ${confidenceLevels[operations.q19_tech_confidence] || 'not specified'}. Estimated value: ${valueLevels[operations.q20_tech_value] || 'not specified'}.`;
}

function getMarketPositionAnalysis(clarity: string): string {
  const analyses: Record<string, string> = {
    very_clearly: 'Competitive positioning is clearly mapped and can be articulated, providing a foundation for strategic growth decisions.',
    somewhat_clearly: 'Market positioning is understood informally but hasn\'t been formalized, limiting strategic communication.',
    not_clearly: 'Competitive positioning hasn\'t been systematically analyzed, meaning opportunities for differentiation may be missed.',
    not_relevant: 'Market positioning has been deemed not relevant, which may indicate missed opportunity or unique market position.',
  };
  return analyses[clarity] || 'Market clarity was not specified.';
}

function getAdjacentMarketAnalysis(markets: string): string {
  const analyses: Record<string, string> = {
    actively_pursuing: 'Adjacent market opportunities have been identified and are being actively pursued.',
    identified_not_acted: 'Adjacent opportunities have been identified but not yet acted upon—unrealized potential awaiting activation.',
    discussed: 'Adjacent markets have been discussed but not systematically mapped.',
    havent_explored: 'Adjacent market opportunities remain unexplored, potentially leaving growth on the table.',
  };
  return analyses[markets] || 'Adjacent market exploration was not specified.';
}

function getPartnershipAnalysis(partnerships: string): string {
  const analyses: Record<string, string> = {
    pursuing: 'Strategic partnerships that could accelerate growth are being actively pursued.',
    identified_not_prioritized: 'Partnership opportunities have been identified but not prioritized for action.',
    possibly: 'Potential partnerships haven\'t been systematically identified.',
    doesnt_apply: 'Strategic partnerships have been deemed not applicable, which may indicate missed opportunity.',
  };
  return analyses[partnerships] || 'Partnership analysis was not specified.';
}

function generateBenchmarkAnalysis(scores: DimensionScores): string {
  const comparisons: string[] = [];

  if (scores.strategicClarity.percentage >= 62) {
    comparisons.push('Strategic clarity is above benchmark');
  } else {
    comparisons.push('Strategic clarity is below benchmark');
  }

  if (scores.executionGap.percentage >= 57) {
    comparisons.push('Execution capability is above benchmark');
  } else {
    comparisons.push('Execution capability is below benchmark');
  }

  if (scores.operationalMaturity.percentage >= 55) {
    comparisons.push('Operational maturity is above benchmark');
  } else {
    comparisons.push('Operational maturity is below benchmark');
  }

  if (scores.capacityModel.percentage >= 60) {
    comparisons.push('Capacity model is above benchmark');
  } else {
    comparisons.push('Capacity model is below benchmark');
  }

  if (scores.leverageOpportunity.percentage >= 42) {
    comparisons.push('Leverage opportunity awareness is above benchmark');
  } else {
    comparisons.push('Leverage opportunity awareness is below benchmark');
  }

  const aboveBenchmark = comparisons.filter(c => c.includes('above')).length;

  if (aboveBenchmark >= 4) {
    return `Your organization outperforms stage benchmarks in most dimensions (${aboveBenchmark} of 5). Focus on the gaps to achieve breakthrough performance.`;
  } else if (aboveBenchmark >= 2) {
    return `Your organization meets or exceeds benchmarks in some areas (${aboveBenchmark} of 5) while falling below in others. Targeted improvement in lagging areas would improve overall leverage.`;
  } else {
    return `Your organization falls below stage benchmarks in most dimensions. Systematic improvement across multiple areas is needed to achieve competitive operational leverage.`;
  }
}

export * from './templates';
export * from './findings';
export * from './interpretations';
export * from './recommendations';
