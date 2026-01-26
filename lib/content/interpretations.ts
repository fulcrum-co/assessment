import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';
import { DimensionInterpretation } from '@/lib/types/report';

// Strategic Clarity Interpretations
export function generateStrategicClarityInterpretation(
  responses: DiagnosticResponses,
  scores: DimensionScores
): DimensionInterpretation {
  const { strategy } = responses;
  const score = scores.strategicClarity;
  const details: string[] = [];

  // Decision behavior analysis
  switch (strategy.q5_decision_behavior) {
    case 'escalates_founder':
      details.push('Decisions consistently escalate to the founder regardless of stated priorities, creating a bottleneck that limits organizational capacity.');
      break;
    case 'urgency_driven':
      details.push('Decisions are driven by urgency or advocacy rather than strategic alignment, resulting in reactive rather than proactive resource allocation.');
      break;
    case 'debates_sometimes':
      details.push('Strategic priorities are sometimes referenced in decision-making, but inconsistently applied.');
      break;
    case 'references_priorities':
      details.push('Leadership effectively references shared priorities when making decisions, demonstrating strong strategic alignment.');
      break;
  }

  // Alignment analysis
  switch (strategy.q6_alignment) {
    case 'quite_different':
      details.push('Leadership would likely give quite different answers when asked about strategic priorities, indicating a fundamental alignment gap.');
      break;
    case 'overlapping_gaps':
      details.push('While there is overlap in how leadership understands priorities, meaningful gaps exist that create coordination challenges.');
      break;
    case 'substantially_similar':
      details.push('Leadership has substantially similar understanding of priorities with only minor differences.');
      break;
    case 'nearly_identical':
      details.push('Leadership alignment on strategic priorities is strong, with nearly identical understanding across the team.');
      break;
  }

  // Initiative persistence
  if (strategy.q7_abandoned_initiatives === 'more_than_5') {
    details.push('More than five significant initiatives were abandoned in the past year, suggesting either insufficient vetting before commitment or systemic execution barriers.');
  } else if (strategy.q7_abandoned_initiatives === '3_5') {
    details.push('Several initiatives were abandoned in the past year, pointing to potential issues with either initiative selection or execution capacity.');
  }

  const opening = score.status === 'Strong' || score.status === 'Moderate'
    ? `Your organization demonstrates ${score.status.toLowerCase()} strategic clarity, meaning ${score.statusDescription.toLowerCase()}.`
    : `Your organization shows signs of strategic ${score.status.toLowerCase()}, where ${score.statusDescription.toLowerCase()}.`;

  const implications = score.score < 10
    ? 'Without stronger strategic clarity, resources will continue to be allocated reactively, and the organization will struggle to build momentum on key initiatives.'
    : 'Your strategic foundation provides a base for execution, though consistency in applying strategy to decisions could be improved.';

  return { opening, details, implications };
}

// Execution Gap Interpretations
export function generateExecutionGapInterpretation(
  responses: DiagnosticResponses,
  scores: DimensionScores
): DimensionInterpretation {
  const { execution } = responses;
  const score = scores.executionGap;
  const details: string[] = [];

  // Post-planning behavior
  switch (execution.q10_post_planning) {
    case 'not_much':
      details.push('Following strategic planning sessions, little tangible change occurs—plans exist in documents but don\'t translate to action.');
      break;
    case 'occasionally_referenced':
      details.push('Strategic plans are occasionally referenced but don\'t drive daily work priorities.');
      break;
    case 'some_progress':
      details.push('Initial momentum following planning sessions fades over time, suggesting execution systems don\'t sustain focus.');
      break;
  }

  // Translation responsibility
  if (execution.q11_translation_responsibility === 'recurring_gap') {
    details.push('The gap between strategy and operational execution is a recurring challenge, with no clear ownership of translation.');
  } else if (execution.q11_translation_responsibility === 'varies') {
    details.push('Responsibility for translating strategy to execution varies, creating inconsistent follow-through.');
  }

  // Work connection
  if (execution.q12_work_connection === 'disconnected' || execution.q12_work_connection === 'havent_tried') {
    details.push('Team members cannot trace their daily work to strategic priorities, meaning strategic objectives don\'t shape resource allocation.');
  }

  const infrastructureCount = (execution.q14_infrastructure || []).length;
  if (infrastructureCount < 3) {
    details.push(`With only ${infrastructureCount} of 5 core execution infrastructure elements in place, the organization relies on individual effort rather than systems to drive execution.`);
  }

  const opening = score.status === 'Strong'
    ? 'Your execution capability is strong—plans translate to results consistently.'
    : `Your execution capability shows a ${score.status.toLowerCase()} pattern, where ${score.statusDescription.toLowerCase()}.`;

  const implications = score.score < 12
    ? 'The execution gap means strategic intent doesn\'t translate to operational reality. Improving execution infrastructure is critical before adding new strategic initiatives.'
    : 'Your execution foundation is developing, though strengthening the connection between strategy and daily work would improve results.';

  return { opening, details, implications };
}

// Operational Maturity Interpretations
export function generateOperationalMaturityInterpretation(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): DimensionInterpretation {
  const { operations } = responses;
  const score = scores.operationalMaturity;
  const details: string[] = [];

  // Documentation analysis
  switch (operations.q16_documentation) {
    case 'in_heads':
      details.push('Critical operational knowledge lives in people\'s heads rather than documented processes, creating key-person dependencies.');
      break;
    case 'doesnt_stick':
      details.push('Previous documentation efforts haven\'t stuck, suggesting the issue may be process design rather than discipline.');
      break;
    case 'some_exists':
      details.push('Documentation exists but is incomplete or outdated, reducing its practical value.');
      break;
  }

  // Onboarding analysis
  if (operations.q17_onboarding === 'trial_by_fire') {
    details.push('New team members learn through trial by fire, extending ramp-up time and creating inconsistent practices.');
  } else if (operations.q17_onboarding === 'asking_questions') {
    details.push('Onboarding relies primarily on asking questions and figuring things out, which doesn\'t scale.');
  }

  // Tech sprawl
  if (patterns.toolSprawl) {
    details.push('Your technology footprint shows signs of sprawl—many tools without confidence in effective use. This typically means paying for capabilities that aren\'t delivering value.');
  }

  const opening = score.status === 'Mature' || score.status === 'Developing'
    ? `Your operational infrastructure is ${score.status.toLowerCase()}, meaning ${score.statusDescription.toLowerCase()}.`
    : `Your operational infrastructure is ${score.status.toLowerCase()}, where ${score.statusDescription.toLowerCase()}.`;

  const implications = score.score < 12
    ? 'Without stronger operational infrastructure, the organization cannot scale beyond its current size without proportionally increasing headcount and management overhead.'
    : 'Your operational foundation supports current operations but may need strengthening to support significant growth.';

  return { opening, details, implications };
}

// Capacity Model Interpretations
export function generateCapacityModelInterpretation(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): DimensionInterpretation {
  const { capacity } = responses;
  const score = scores.capacityModel;
  const details: string[] = [];

  // Capacity state
  switch (capacity.q21_capacity) {
    case 'underwater':
      details.push('The team is underwater—reactive work crowds out strategic work, meaning the organization is running to stand still.');
      break;
    case 'over_capacity':
      details.push('The team is consistently over capacity, with everything feeling urgent, making prioritization difficult.');
      break;
  }

  // Founder time analysis
  if (capacity.q25_founder_time === 'almost_entirely_operational') {
    details.push('The founder\'s time is almost entirely spent on operational execution, leaving little capacity for strategic leadership.');
  } else if (capacity.q25_founder_time === 'primarily_operational') {
    details.push('The founder spends most days in execution rather than strategic work, limiting the organization\'s strategic capacity.');
  }

  // Founder trap pattern
  if (patterns.founderTrap) {
    details.push('A critical pattern emerged: the organization cannot function without the founder in day-to-day operations. Every growth opportunity increases personal burden rather than building organizational capability.');
  }

  // Capacity crisis pattern
  if (patterns.capacityCrisis) {
    details.push('New strategic work competes directly with existing work, with something always suffering. This capacity crisis makes sustainable execution impossible.');
  }

  const leadershipPct = capacity.q23_work_distribution?.leadership || 0;
  if (leadershipPct > 40) {
    details.push(`Leadership directly handles ${leadershipPct}% of execution work, well above the healthy range of 5-20%. This concentration limits scalability.`);
  }

  const opening = score.status === 'Sustainable' || score.status === 'Strained'
    ? `Your capacity model is ${score.status.toLowerCase()}, meaning ${score.statusDescription.toLowerCase()}.`
    : `Your capacity model indicates a ${score.status.toLowerCase()} state, where ${score.statusDescription.toLowerCase()}.`;

  const implications = score.score < 12
    ? 'Until capacity constraints are addressed, adding new strategic initiatives will cannibalize existing work rather than expanding organizational output.'
    : 'Your team can execute current priorities, though leadership bandwidth may become a constraint as you grow.';

  return { opening, details, implications };
}

// Leverage Opportunity Interpretations
export function generateLeverageOpportunityInterpretation(
  responses: DiagnosticResponses,
  scores: DimensionScores
): DimensionInterpretation {
  const { leverage } = responses;
  const score = scores.leverageOpportunity;
  const details: string[] = [];

  // Market clarity
  switch (leverage.q29_market_clarity) {
    case 'not_clearly':
      details.push('Competitive positioning hasn\'t been systematically analyzed, meaning opportunities for differentiation may be missed.');
      break;
    case 'somewhat_clearly':
      details.push('Market positioning is understood informally but hasn\'t been formalized, limiting strategic communication.');
      break;
    case 'very_clearly':
      details.push('Market positioning is clearly mapped and can be articulated, providing a foundation for strategic growth decisions.');
      break;
  }

  // Adjacent markets
  if (leverage.q30_adjacent_markets === 'havent_explored') {
    details.push('Adjacent market opportunities haven\'t been explored, potentially leaving growth on the table.');
  } else if (leverage.q30_adjacent_markets === 'identified_not_acted') {
    details.push('Adjacent market opportunities have been identified but not acted upon—a potential source of leverage awaiting activation.');
  }

  // Partnerships
  if (leverage.q31_partnerships === 'possibly' || leverage.q31_partnerships === 'doesnt_apply') {
    details.push('Strategic partnership opportunities haven\'t been identified or prioritized, missing potential for accelerated growth without proportional investment.');
  }

  const opening = score.status === 'Aware' || score.status === 'Curious'
    ? `Your organization is ${score.status.toLowerCase()} of leverage opportunities, ${score.statusDescription.toLowerCase()}.`
    : `Your organization appears ${score.status.toLowerCase()} to leverage opportunities, ${score.statusDescription.toLowerCase()}.`;

  const implications = score.score < 6
    ? 'Significant opportunity exists to identify strategic multiplication—ways to increase output without proportional increases in investment.'
    : 'You\'ve begun identifying leverage opportunities; the next step is systematic pursuit of the most promising paths.';

  return { opening, details, implications };
}
