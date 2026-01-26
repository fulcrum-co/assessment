import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';

export function detectPatterns(
  responses: DiagnosticResponses,
  scores: DimensionScores
): DetectedPatterns {
  const { capacity, advisory, operations } = responses;

  // Founder Trap Pattern
  // Detected when: capacity score is low, leadership handles >40% of work,
  // and founder is almost entirely operational
  const founderTrap =
    scores.capacityModel.score <= 11 &&
    (capacity.q23_work_distribution?.leadership || 0) > 40 &&
    capacity.q25_founder_time === 'almost_entirely_operational';

  // Planning Theater Pattern
  // Detected when: strategic clarity is decent but execution is poor
  // (knows what to do, doesn't do it)
  const planningTheater =
    scores.strategicClarity.score >= 10 &&
    scores.executionGap.score <= 11;

  // Tool Sprawl Pattern
  // Detected when: many tools (11+), not confident in tech use, and low tech value
  const toolSprawl =
    (operations.q18_tool_count === '11_15' || operations.q18_tool_count === '15_plus') &&
    operations.q19_tech_confidence !== 'very_confident' &&
    operations.q20_tech_value !== '75_plus';

  // Shelf Consultant Pattern
  // Detected when: previous advisory created plans that weren't executed or disappeared
  const experienceOutcomes = advisory.q27_experience_outcomes || [];
  const shelfConsultant =
    experienceOutcomes.includes('plans_not_executed') ||
    experienceOutcomes.includes('disappeared');

  // Capacity Crisis Pattern
  // Detected when: underwater + new work competes with existing
  const capacityCrisis =
    capacity.q21_capacity === 'underwater' &&
    capacity.q22_new_capacity === 'competes';

  return {
    founderTrap,
    planningTheater,
    toolSprawl,
    shelfConsultant,
    capacityCrisis,
  };
}

// Helper to get pattern descriptions for reporting
export function getPatternDescription(patternName: keyof DetectedPatterns): {
  title: string;
  description: string;
  implications: string;
} {
  const patterns: Record<keyof DetectedPatterns, { title: string; description: string; implications: string }> = {
    founderTrap: {
      title: 'Founder Trap',
      description: 'The organization cannot function without the founder in day-to-day operations.',
      implications: 'Every growth opportunity increases personal burden rather than building organizational capability. Scale is impossible without addressing this pattern.',
    },
    planningTheater: {
      title: 'Planning Theater',
      description: 'Strategic conversations feel productive but don\'t connect to changed behavior.',
      implications: 'Resources spent on planning don\'t yield results. The gap is in execution infrastructure, not strategy quality.',
    },
    toolSprawl: {
      title: 'Tool Sprawl',
      description: 'Significant technology investment without proportional operational benefit.',
      implications: 'You\'re likely paying for 40-60% more capability than you\'re using. Consolidation and training would improve ROI.',
    },
    shelfConsultant: {
      title: 'Shelf Consultant',
      description: 'Previous advisory engagements produced recommendations that weren\'t implemented.',
      implications: 'The challenge isn\'t lack of insight—it\'s translating insight to action. Future engagements must include implementation support.',
    },
    capacityCrisis: {
      title: 'Capacity Crisis',
      description: 'The team is underwater, and new priorities cannibalize existing work.',
      implications: 'Adding strategic initiatives without capacity creates the illusion of progress while actually fragmenting execution.',
    },
  };

  return patterns[patternName];
}
