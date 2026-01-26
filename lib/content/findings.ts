import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';
import { Finding } from '@/lib/types/report';

type DimensionKey = 'strategicClarity' | 'executionGap' | 'operationalMaturity' | 'capacityModel' | 'leverageOpportunity';

interface DimensionInfo {
  key: DimensionKey;
  name: string;
  percentage: number;
}

export function generateKeyFindings(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): Finding[] {
  const findings: Finding[] = [];

  // Get dimensions sorted by percentage (lowest first) to prioritize problem areas
  const dimensions: DimensionInfo[] = [
    { key: 'strategicClarity' as const, name: 'Strategic Clarity', percentage: scores.strategicClarity.percentage },
    { key: 'executionGap' as const, name: 'Execution Capability', percentage: scores.executionGap.percentage },
    { key: 'operationalMaturity' as const, name: 'Operational Maturity', percentage: scores.operationalMaturity.percentage },
    { key: 'capacityModel' as const, name: 'Capacity & Team Model', percentage: scores.capacityModel.percentage },
    { key: 'leverageOpportunity' as const, name: 'Leverage Opportunity', percentage: scores.leverageOpportunity.percentage },
  ].sort((a, b) => a.percentage - b.percentage);

  // Generate findings for the 3 lowest-scoring dimensions
  const lowestThree = dimensions.slice(0, 3);

  for (const dimension of lowestThree) {
    const finding = generateFindingForDimension(dimension, responses, scores, patterns);
    if (finding) {
      findings.push(finding);
    }
  }

  return findings;
}

function generateFindingForDimension(
  dimension: DimensionInfo,
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): Finding | null {
  switch (dimension.key) {
    case 'strategicClarity':
      return generateStrategicClarityFinding(responses, scores);
    case 'executionGap':
      return generateExecutionGapFinding(responses, scores, patterns);
    case 'operationalMaturity':
      return generateOperationalMaturityFinding(responses, scores, patterns);
    case 'capacityModel':
      return generateCapacityModelFinding(responses, scores, patterns);
    case 'leverageOpportunity':
      return generateLeverageOpportunityFinding(responses, scores);
    default:
      return null;
  }
}

function generateStrategicClarityFinding(
  responses: DiagnosticResponses,
  scores: DimensionScores
): Finding {
  const { strategy } = responses;
  const score = scores.strategicClarity;

  let content = '';
  let quote: string | undefined;

  if (strategy.q5_decision_behavior === 'urgency_driven' || strategy.q5_decision_behavior === 'escalates_founder') {
    content = 'Your diagnostic responses reveal decisions are made reactively rather than strategically. ';
    if (strategy.q5_decision_behavior === 'escalates_founder') {
      content += 'Significant decisions consistently escalate to the founder regardless of stated priorities, creating a bottleneck. ';
    } else {
      content += 'Decisions are driven by urgency or who advocates loudest, not strategic alignment. ';
    }
  } else {
    content = 'While your organization has strategic awareness, inconsistency in applying strategy to decisions limits effectiveness. ';
  }

  if (strategy.q6_alignment === 'quite_different' || strategy.q6_alignment === 'overlapping_gaps') {
    content += 'Leadership would give meaningfully different answers about priorities, indicating an alignment gap that creates coordination friction.';
  }

  if (strategy.q9_stalled_priority && strategy.q9_stalled_priority.length > 50) {
    quote = strategy.q9_stalled_priority;
  }

  const implication = score.score < 10
    ? 'Without strategic clarity driving decisions, the organization will continue to fragment its attention and resources across reactive demands.'
    : 'Strengthening the connection between stated strategy and decision-making would improve resource allocation.';

  return {
    dimension: 'Strategic Clarity',
    title: `Strategic Clarity: ${score.status}`,
    content,
    quote,
    implication,
  };
}

function generateExecutionGapFinding(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): Finding {
  const { execution } = responses;
  const score = scores.executionGap;

  let content = '';
  let quote: string | undefined;

  if (patterns.planningTheater) {
    content = 'A critical pattern emerged: your strategic clarity scores well, but execution doesn\'t follow. This is "planning theater"—strategic conversations that feel productive but don\'t connect to changed behavior. ';
  } else {
    content = 'Your diagnostic responses reveal a significant execution gap between strategic planning and operational reality. ';
  }

  if (execution.q10_post_planning === 'not_much' || execution.q10_post_planning === 'occasionally_referenced') {
    content += `When asked about what happened in the 30 days following your last planning session, you indicated that "${
      execution.q10_post_planning === 'not_much' ? 'not much changed' : 'the plan was occasionally referenced but didn\'t drive daily work'
    }." `;
  }

  const infrastructureCount = (execution.q14_infrastructure || []).length;
  if (infrastructureCount < 3) {
    content += `With only ${infrastructureCount} of 5 execution infrastructure elements in place, plans depend on individual willpower rather than systems.`;
  }

  const implication = score.score < 12
    ? 'The execution gap means strategic intent doesn\'t translate to operational reality. Adding more strategic initiatives will only widen this gap.'
    : 'Strengthening execution infrastructure would improve the translation of strategy to results.';

  return {
    dimension: 'Execution Capability',
    title: `Execution Gap: ${score.status}`,
    content,
    quote,
    implication,
  };
}

function generateOperationalMaturityFinding(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): Finding {
  const { operations } = responses;
  const score = scores.operationalMaturity;

  let content = '';

  if (operations.q16_documentation === 'in_heads' || operations.q16_documentation === 'doesnt_stick') {
    content = 'Critical operational knowledge lives in people\'s heads rather than documented processes. ';
    if (operations.q16_documentation === 'doesnt_stick') {
      content += 'Previous documentation efforts haven\'t stuck, suggesting the challenge is process design, not discipline. ';
    }
  }

  if (operations.q17_onboarding === 'trial_by_fire' || operations.q17_onboarding === 'asking_questions') {
    content += 'New team members learn through trial by fire or figuring it out, which extends ramp-up time and creates inconsistent practices. ';
  }

  if (patterns.toolSprawl) {
    content += 'Your technology profile suggests significant tool sprawl with limited strategic integration. Based on typical patterns, your organization is likely paying for 40-60% more software capability than it\'s meaningfully using.';
  }

  const implication = score.score < 12
    ? 'Without stronger operational infrastructure, the organization cannot scale beyond its current size without proportionally increasing headcount and management overhead.'
    : 'Your operational foundation supports current operations but may need strengthening to support significant growth.';

  return {
    dimension: 'Operational Maturity',
    title: `Operational Maturity: ${score.status}`,
    content,
    implication,
  };
}

function generateCapacityModelFinding(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): Finding {
  const { capacity } = responses;
  const score = scores.capacityModel;

  let content = '';

  if (patterns.founderTrap) {
    content = 'A critical pattern emerged across multiple responses: your organization is consistently over capacity, new work is absorbed by the team working more, and your time as founder is spent primarily on operational execution. This combination means the organization cannot scale beyond your personal bandwidth. Every growth opportunity increases the burden on you personally rather than building organizational capability. ';
  } else if (patterns.capacityCrisis) {
    content = 'Your team is underwater—reactive work crowds out strategic work. When new priorities emerge, they compete with existing work and something suffers. This capacity crisis makes sustainable execution impossible. ';
  } else {
    content = 'Your capacity model shows strain. ';
    if (capacity.q21_capacity === 'underwater' || capacity.q21_capacity === 'over_capacity') {
      content += 'The team is consistently stretched beyond sustainable capacity. ';
    }
    if (capacity.q25_founder_time === 'primarily_operational' || capacity.q25_founder_time === 'almost_entirely_operational') {
      content += 'Leadership time is consumed by operational execution rather than strategic work. ';
    }
  }

  const leadershipPct = capacity.q23_work_distribution?.leadership || 0;
  if (leadershipPct > 40) {
    content += `Leadership directly handles ${leadershipPct}% of execution work, well above the healthy range of 5-20%.`;
  }

  const implication = score.score < 12
    ? 'Until capacity constraints are addressed, strategic ambitions will be limited by operational bandwidth. The organization cannot grow faster than leadership\'s personal capacity allows.'
    : 'While capacity is strained, strategic execution remains possible with careful prioritization.';

  return {
    dimension: 'Capacity & Team Model',
    title: `Capacity Model: ${score.status}`,
    content,
    implication,
  };
}

function generateLeverageOpportunityFinding(
  responses: DiagnosticResponses,
  scores: DimensionScores
): Finding {
  const { leverage } = responses;
  const score = scores.leverageOpportunity;

  let content = '';
  let quote: string | undefined;

  if (leverage.q29_market_clarity === 'not_clearly' || leverage.q29_market_clarity === 'not_relevant') {
    content = 'Competitive positioning hasn\'t been systematically mapped. Without clear differentiation, pricing power and market expansion opportunities are limited. ';
  }

  if (leverage.q30_adjacent_markets === 'havent_explored') {
    content += 'Adjacent market opportunities remain unexplored, potentially leaving growth on the table. ';
  } else if (leverage.q30_adjacent_markets === 'identified_not_acted') {
    content += 'Adjacent opportunities have been identified but not pursued—unrealized potential awaiting action. ';
  }

  if (leverage.q31_partnerships === 'possibly' || leverage.q31_partnerships === 'doesnt_apply') {
    content += 'Strategic partnerships that could accelerate growth without proportional investment haven\'t been identified or prioritized.';
  }

  if (leverage.q32_leverage_source && leverage.q32_leverage_source.length > 50) {
    quote = leverage.q32_leverage_source;
  }

  const implication = score.score < 6
    ? 'Significant opportunity exists to identify strategic multiplication—ways to increase output without proportional increases in investment.'
    : 'You\'ve begun identifying leverage opportunities; systematic pursuit would unlock additional growth.';

  return {
    dimension: 'Leverage Opportunity',
    title: `Leverage Opportunity: ${score.status}`,
    content,
    quote,
    implication,
  };
}
