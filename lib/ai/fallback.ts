import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';

export interface AIInterpretations {
  executiveSummaryInsight: string;
  strategicClarityInterpretation: string;
  executionInterpretation: string;
  operationalInterpretation: string;
  capacityInterpretation: string;
  leverageInterpretation: string;
  constraintAnalysis: string;
  breakthroughPathway: string;
  patternNarrative: string;
}

export function generateFallbackInterpretations(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): AIInterpretations {
  const { contact } = responses;

  // Executive Summary based on overall score
  let executiveSummaryInsight = '';
  if (scores.overall >= 70) {
    executiveSummaryInsight = `${contact.companyName} demonstrates strong operational foundations across most dimensions. The opportunity lies in optimizing what's working and addressing specific gaps to unlock the next level of growth.`;
  } else if (scores.overall >= 50) {
    executiveSummaryInsight = `${contact.companyName} shows moderate organizational leverage with clear areas for improvement. The assessment reveals specific patterns that, once addressed, could significantly accelerate execution and results.`;
  } else if (scores.overall >= 30) {
    executiveSummaryInsight = `${contact.companyName} is experiencing meaningful friction between strategy and execution. Several foundational elements need attention before sustainable growth becomes possible.`;
  } else {
    executiveSummaryInsight = `${contact.companyName} faces significant structural challenges that are limiting progress. Addressing these core issues should take priority over new strategic initiatives.`;
  }

  // Strategic Clarity interpretation
  let strategicClarityInterpretation = '';
  if (scores.strategicClarity.status === 'Strong') {
    strategicClarityInterpretation = 'Your organization demonstrates strong strategic clarity. Decisions reference shared priorities, and leadership alignment appears high. This foundation supports effective execution when other elements are in place.';
  } else if (scores.strategicClarity.status === 'Moderate') {
    strategicClarityInterpretation = 'Strategic clarity exists but isn\'t consistently guiding decisions. While priorities are understood, they don\'t always drive day-to-day choices, creating occasional misalignment.';
  } else {
    strategicClarityInterpretation = 'Strategic clarity is a significant gap. Without shared understanding of priorities, decisions become reactive and initiatives compete rather than compound.';
  }

  // Execution interpretation
  let executionInterpretation = '';
  if (scores.executionGap.status === 'Strong') {
    executionInterpretation = 'Execution infrastructure is solid—plans translate to action with clear ownership and accountability. This capability allows strategic priorities to become operational reality.';
  } else if (scores.executionGap.status === 'Moderate') {
    executionInterpretation = 'Execution happens but inconsistently. Some initiatives gain traction while others stall, suggesting the gap isn\'t strategy quality but execution infrastructure.';
  } else {
    executionInterpretation = 'The strategy-to-execution gap is significant. Plans are created but don\'t reliably translate to changed behavior, ownership, or results.';
  }

  // Operational interpretation
  let operationalInterpretation = '';
  if (scores.operationalMaturity.status === 'Mature') {
    operationalInterpretation = 'Operational infrastructure supports scale. Processes are documented, knowledge is transferable, and systems reduce dependence on specific individuals.';
  } else if (scores.operationalMaturity.status === 'Developing') {
    operationalInterpretation = 'Operational foundation exists but with gaps. Some processes are documented while others remain in people\'s heads, creating vulnerability and inconsistency.';
  } else {
    operationalInterpretation = 'Operational infrastructure is underdeveloped. Heavy reliance on institutional knowledge creates risk and limits the organization\'s ability to scale.';
  }

  // Capacity interpretation
  let capacityInterpretation = '';
  const leadershipPct = responses.capacity.q23_work_distribution?.leadership || 0;
  if (scores.capacityModel.status === 'Sustainable') {
    capacityInterpretation = 'Team capacity aligns with strategic demands. Leadership time is appropriately allocated to strategic work rather than operational execution.';
  } else if (scores.capacityModel.status === 'Strained') {
    capacityInterpretation = `Capacity is strained with leadership handling ${leadershipPct}% of execution work. New priorities compete with existing commitments, and strategic thinking often gets crowded out.`;
  } else {
    capacityInterpretation = `Capacity is in crisis. With leadership directly handling ${leadershipPct}% of execution, the organization cannot function without founder involvement in day-to-day operations.`;
  }

  // Leverage interpretation
  let leverageInterpretation = '';
  if (scores.leverageOpportunity.status === 'Aware') {
    leverageInterpretation = 'You\'re actively identifying leverage opportunities—adjacent markets, partnerships, and multiplication strategies. The foundation exists to pursue non-linear growth.';
  } else if (scores.leverageOpportunity.status === 'Curious') {
    leverageInterpretation = 'Leverage potential is recognized but not systematically pursued. Opportunities exist in market expansion, partnerships, or operational multiplication that haven\'t been formalized.';
  } else {
    leverageInterpretation = 'Leverage thinking is limited. Focus remains on core execution without systematic exploration of how to multiply impact without proportional resource increase.';
  }

  // Constraint analysis
  const constraint = responses.readiness.q33_constraint;
  const constraintAnalysis = `You identified "${constraint}" as your primary constraint. This aligns with patterns visible in your responses—specifically ${getConstraintAlignment(scores, patterns)}. Addressing this constraint likely requires structural changes rather than simply adding resources.`;

  // Breakthrough pathway
  const breakthrough = responses.readiness.q35_breakthrough_year;
  let breakthroughPathway = '';
  if (breakthrough) {
    breakthroughPathway = `Your vision of a breakthrough year—"${breakthrough.substring(0, 100)}${breakthrough.length > 100 ? '...' : ''}"—is achievable when the structural constraints identified in this assessment are addressed. The path forward requires focused action on the highest-leverage gaps.`;
  } else {
    breakthroughPathway = 'Defining what breakthrough looks like creates clarity for where to focus. The patterns identified in this assessment point to specific structural changes that could unlock significant progress.';
  }

  // Pattern narrative
  const patternNarrative = buildPatternNarrative(patterns, scores);

  return {
    executiveSummaryInsight,
    strategicClarityInterpretation,
    executionInterpretation,
    operationalInterpretation,
    capacityInterpretation,
    leverageInterpretation,
    constraintAnalysis,
    breakthroughPathway,
    patternNarrative,
  };
}

function getConstraintAlignment(scores: DimensionScores, patterns: DetectedPatterns): string {
  const issues: string[] = [];

  if (scores.strategicClarity.score <= 10) issues.push('strategic clarity gaps');
  if (scores.executionGap.score <= 11) issues.push('execution infrastructure weaknesses');
  if (scores.operationalMaturity.score <= 11) issues.push('operational immaturity');
  if (scores.capacityModel.score <= 11) issues.push('capacity constraints');
  if (patterns.founderTrap) issues.push('founder dependency');
  if (patterns.planningTheater) issues.push('planning-execution disconnect');

  if (issues.length === 0) return 'your overall profile suggests this is an optimization challenge rather than a structural one';
  if (issues.length === 1) return issues[0];
  if (issues.length === 2) return `${issues[0]} and ${issues[1]}`;
  return `${issues.slice(0, -1).join(', ')}, and ${issues[issues.length - 1]}`;
}

function buildPatternNarrative(patterns: DetectedPatterns, scores: DimensionScores): string {
  const activePatterns: string[] = [];

  if (patterns.founderTrap) {
    activePatterns.push('The organization shows signs of founder dependency—strategic work is crowded out by operational demands, and growth increases personal burden rather than building organizational capability.');
  }

  if (patterns.planningTheater) {
    activePatterns.push('Strategic clarity exists, but execution infrastructure is weak. Plans are created without the ownership, accountability, and rhythm needed to translate them into results.');
  }

  if (patterns.toolSprawl) {
    activePatterns.push('Technology investment exceeds utilization. The stack has grown without proportional operational benefit, suggesting consolidation and training could improve ROI.');
  }

  if (patterns.shelfConsultant) {
    activePatterns.push('Previous advisory engagements produced recommendations that weren\'t fully implemented. Future support must include execution mechanisms, not just strategic insight.');
  }

  if (patterns.capacityCrisis) {
    activePatterns.push('The team is operating beyond sustainable capacity. New priorities cannibalize existing work rather than building on it.');
  }

  if (patterns.executionInfrastructureGap) {
    activePatterns.push('Execution infrastructure is missing critical elements. Without documented objectives, progress rhythms, and accountability systems, plans fail to translate to results.');
  }

  if (activePatterns.length === 0) {
    return `No severe patterns detected. Your organization shows balanced challenges across dimensions with a ${scores.overall}/100 overall score. The opportunity is optimization rather than crisis intervention.`;
  }

  return activePatterns.join(' ');
}
