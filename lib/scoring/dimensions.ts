import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScore, DimensionStatus } from '@/lib/types/scores';

// Helper to calculate percentage
const toPercentage = (score: number, max: number): number => Math.round((score / max) * 100);

// Strategic Clarity Index (Q5, Q6, Q7, Q8)
export function calculateStrategicClarity(responses: DiagnosticResponses): DimensionScore {
  const { strategy } = responses;
  let score = 0;
  const maxScore = 16;

  // Q5: Decision behavior
  const q5Scores: Record<string, number> = {
    references_priorities: 4,
    debates_sometimes: 2,
    escalates_founder: 1,
    urgency_driven: 0,
  };
  score += q5Scores[strategy.q5_decision_behavior] || 0;

  // Q6: Alignment
  const q6Scores: Record<string, number> = {
    nearly_identical: 4,
    substantially_similar: 3,
    overlapping_gaps: 1,
    quite_different: 0,
  };
  score += q6Scores[strategy.q6_alignment] || 0;

  // Q7: Abandoned initiatives
  const q7Scores: Record<string, number> = {
    none: 4,
    '1_2': 3,
    '3_5': 1,
    more_than_5: 0,
  };
  score += q7Scores[strategy.q7_abandoned_initiatives] || 0;

  // Q8: Stall causes (each selection adds points)
  const q8Scores: Record<string, number> = {
    capacity_constraints: 2,
    shifting_priorities: 1,
    lack_ownership: 0,
    implementation_harder: 1,
    results_not_materializing: 2,
    external_factors: 3,
  };
  const maxQ8 = 4; // Cap at 4 points
  let q8Total = 0;
  for (const cause of strategy.q8_stall_causes || []) {
    q8Total += q8Scores[cause] || 0;
  }
  score += Math.min(q8Total, maxQ8);

  // Determine status
  let status: DimensionStatus;
  let statusDescription: string;
  if (score >= 14) {
    status = 'Strong';
    statusDescription = 'Strategy actively guides decisions';
  } else if (score >= 10) {
    status = 'Moderate';
    statusDescription = 'Strategy exists but inconsistently referenced';
  } else if (score >= 6) {
    status = 'Weak';
    statusDescription = 'Strategy is implicit or disconnected';
  } else {
    status = 'Drift';
    statusDescription = 'Decisions are reactive, not strategic';
  }

  return {
    score,
    maxScore,
    percentage: toPercentage(score, maxScore),
    status,
    statusDescription,
  };
}

// Execution Gap Index (Q10, Q11, Q12, Q13, Q14, Q15)
export function calculateExecutionGap(responses: DiagnosticResponses): DimensionScore {
  const { execution } = responses;
  let score = 0;
  const maxScore = 21;

  // Q10: Post-planning
  const q10Scores: Record<string, number> = {
    clear_owners: 4,
    some_progress: 2,
    occasionally_referenced: 1,
    not_much: 0,
  };
  score += q10Scores[execution.q10_post_planning] || 0;

  // Q11: Translation responsibility
  const q11Scores: Record<string, number> = {
    dedicated_ops: 4,
    same_people: 2,
    varies: 1,
    recurring_gap: 0,
  };
  score += q11Scores[execution.q11_translation_responsibility] || 0;

  // Q12: Work connection
  const q12Scores: Record<string, number> = {
    tight: 4,
    loose: 2,
    disconnected: 0,
    havent_tried: 0,
  };
  score += q12Scores[execution.q12_work_connection] || 0;

  // Q13: Progress tracking
  const q13Scores: Record<string, number> = {
    surfaced_early: 4,
    leadership_notices: 2,
    not_addressed: 1,
    dont_track: 0,
  };
  score += q13Scores[execution.q13_progress_tracking] || 0;

  // Q14: Infrastructure (each item adds 1 point, max 5)
  score += Math.min((execution.q14_infrastructure || []).length, 5);

  // Q15: Breakdown points (higher score = later in process = better)
  const q15Scores: Record<string, number> = {
    strategy_to_operational: 0,
    operational_to_daily: 1,
    tasks_to_completion: 2,
    completion_to_results: 3,
  };
  let q15Max = 0;
  for (const point of execution.q15_breakdown_points || []) {
    q15Max = Math.max(q15Max, q15Scores[point] || 0);
  }
  score += q15Max;

  // Determine status
  let status: DimensionStatus;
  let statusDescription: string;
  if (score >= 18) {
    status = 'Strong';
    statusDescription = 'Plans translate to results';
  } else if (score >= 12) {
    status = 'Moderate';
    statusDescription = 'Some plans execute, many stall';
  } else if (score >= 6) {
    status = 'Gap';
    statusDescription = 'Planning and doing are disconnected';
  } else {
    status = 'Crisis';
    statusDescription = 'Plans rarely become reality';
  }

  return {
    score,
    maxScore,
    percentage: toPercentage(score, maxScore),
    status,
    statusDescription,
  };
}

// Operational Maturity Index (Q16, Q17, Q18, Q19, Q20)
export function calculateOperationalMaturity(responses: DiagnosticResponses): DimensionScore {
  const { operations } = responses;
  let score = 0;
  const maxScore = 20;

  // Q16: Documentation
  const q16Scores: Record<string, number> = {
    most_documented: 4,
    some_exists: 2,
    in_heads: 1,
    doesnt_stick: 0,
  };
  score += q16Scores[operations.q16_documentation] || 0;

  // Q17: Onboarding
  const q17Scores: Record<string, number> = {
    structured: 4,
    some_plus_shadow: 2,
    asking_questions: 1,
    trial_by_fire: 0,
  };
  score += q17Scores[operations.q17_onboarding] || 0;

  // Q18: Tool count
  const q18Scores: Record<string, number> = {
    '1_5': 4,
    '6_10': 3,
    '11_15': 1,
    '15_plus': 0,
  };
  score += q18Scores[operations.q18_tool_count] || 0;

  // Q19: Tech confidence
  const q19Scores: Record<string, number> = {
    very_confident: 4,
    somewhat_confident: 2,
    not_confident: 1,
    havent_audited: 0,
  };
  score += q19Scores[operations.q19_tech_confidence] || 0;

  // Q20: Tech value
  const q20Scores: Record<string, number> = {
    '75_plus': 4,
    '50_75': 3,
    '25_50': 1,
    less_25: 0,
    not_sure: 0,
  };
  score += q20Scores[operations.q20_tech_value] || 0;

  // Determine status
  let status: DimensionStatus;
  let statusDescription: string;
  if (score >= 17) {
    status = 'Mature';
    statusDescription = 'Systems support scale';
  } else if (score >= 12) {
    status = 'Developing';
    statusDescription = 'Foundation exists, gaps remain';
  } else if (score >= 7) {
    status = 'Immature';
    statusDescription = 'Heavily dependent on individuals';
  } else {
    status = 'Fragile';
    statusDescription = 'No systems, high key-person risk';
  }

  return {
    score,
    maxScore,
    percentage: toPercentage(score, maxScore),
    status,
    statusDescription,
  };
}

// Capacity & Team Model Index (Q21, Q22, Q23, Q24, Q25)
export function calculateCapacityModel(responses: DiagnosticResponses): DimensionScore {
  const { capacity } = responses;
  let score = 0;
  const maxScore = 20;

  // Q21: Capacity
  const q21Scores: Record<string, number> = {
    have_capacity: 4,
    stretched: 2,
    over_capacity: 1,
    underwater: 0,
  };
  score += q21Scores[capacity.q21_capacity] || 0;

  // Q22: New capacity
  const q22Scores: Record<string, number> = {
    slack: 4,
    team_absorbs: 1,
    hire: 2,
    competes: 0,
  };
  score += q22Scores[capacity.q22_new_capacity] || 0;

  // Q23: Leadership percentage in work distribution
  const leadershipPct = capacity.q23_work_distribution?.leadership || 0;
  if (leadershipPct < 20) {
    score += 4;
  } else if (leadershipPct < 40) {
    score += 2;
  } else if (leadershipPct < 60) {
    score += 1;
  }
  // 60%+ = 0 points

  // Q24: Capability gaps count
  const gapCount = (capacity.q24_capability_gaps || []).length;
  if (gapCount <= 2) {
    score += 4;
  } else if (gapCount <= 4) {
    score += 2;
  } else if (gapCount <= 6) {
    score += 1;
  }
  // 7+ = 0 points

  // Q25: Founder time
  const q25Scores: Record<string, number> = {
    primarily_strategic: 4,
    mixed: 2,
    primarily_operational: 1,
    almost_entirely_operational: 0,
  };
  score += q25Scores[capacity.q25_founder_time] || 0;

  // Determine status
  let status: DimensionStatus;
  let statusDescription: string;
  if (score >= 17) {
    status = 'Sustainable';
    statusDescription = 'Team can execute strategy';
  } else if (score >= 12) {
    status = 'Strained';
    statusDescription = 'Execution possible but leadership overextended';
  } else if (score >= 7) {
    status = 'Crisis';
    statusDescription = 'Strategic work crowded out';
  } else {
    status = 'Trapped';
    statusDescription = 'Organization cannot function without founder in operations';
  }

  return {
    score,
    maxScore,
    percentage: toPercentage(score, maxScore),
    status,
    statusDescription,
  };
}

// Advisory Readiness Index (Q26, Q27)
export function calculateAdvisoryReadiness(responses: DiagnosticResponses): DimensionScore {
  const { advisory } = responses;
  let score = 0;
  const maxScore = 5;

  // Q26: Previous engagement
  const q26Scores: Record<string, number> = {
    multiple_times: 3,
    once_twice: 2,
    considered: 1,
    never: 0,
  };
  score += q26Scores[advisory.q26_previous_engagement] || 0;

  // Q27: Experience outcomes (can be positive or negative)
  const q27Scores: Record<string, number> = {
    delivered_clarity: 2,
    partially_implemented: 1,
    plans_not_executed: -1,
    temporary_capacity: 0,
    too_expensive: -1,
    didnt_understand: -2,
    disappeared: -2,
    na: 0,
  };
  for (const outcome of advisory.q27_experience_outcomes || []) {
    score += q27Scores[outcome] || 0;
  }

  // Clamp score
  score = Math.max(-3, Math.min(maxScore, score));

  // Determine status
  let status: DimensionStatus;
  let statusDescription: string;
  if (score >= 4) {
    status = 'Positive';
    statusDescription = 'Knows value, knows what to look for';
  } else if (score >= 2) {
    status = 'Mixed';
    statusDescription = 'Open but cautious';
  } else if (score >= 0) {
    status = 'Neutral';
    statusDescription = 'Limited exposure';
  } else {
    status = 'Skeptic';
    statusDescription = 'Has been burned, needs proof';
  }

  return {
    score,
    maxScore,
    percentage: toPercentage(Math.max(0, score), maxScore),
    status,
    statusDescription,
  };
}

// Leverage Opportunity Index (Q29, Q30, Q31)
export function calculateLeverageOpportunity(responses: DiagnosticResponses): DimensionScore {
  const { leverage } = responses;
  let score = 0;
  const maxScore = 12;

  // Q29: Market clarity
  const q29Scores: Record<string, number> = {
    very_clearly: 4,
    somewhat_clearly: 2,
    not_clearly: 1,
    not_relevant: 0,
  };
  score += q29Scores[leverage.q29_market_clarity] || 0;

  // Q30: Adjacent markets
  const q30Scores: Record<string, number> = {
    actively_pursuing: 4,
    identified_not_acted: 2,
    discussed: 1,
    havent_explored: 0,
  };
  score += q30Scores[leverage.q30_adjacent_markets] || 0;

  // Q31: Partnerships
  const q31Scores: Record<string, number> = {
    pursuing: 4,
    identified_not_prioritized: 2,
    possibly: 1,
    doesnt_apply: 0,
  };
  score += q31Scores[leverage.q31_partnerships] || 0;

  // Determine status
  let status: DimensionStatus;
  let statusDescription: string;
  if (score >= 10) {
    status = 'Aware';
    statusDescription = 'Actively seeking multiplication';
  } else if (score >= 6) {
    status = 'Curious';
    statusDescription = 'Recognizes potential, hasn\'t systematized';
  } else if (score >= 3) {
    status = 'Blind';
    statusDescription = 'Focused on core, missing ecosystem';
  } else {
    status = 'Absent';
    statusDescription = 'No strategic view of multiplication';
  }

  return {
    score,
    maxScore,
    percentage: toPercentage(score, maxScore),
    status,
    statusDescription,
  };
}
