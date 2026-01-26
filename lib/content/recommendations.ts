import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';
import { Recommendation } from '@/lib/types/report';

type DimensionKey = 'strategicClarity' | 'executionGap' | 'operationalMaturity' | 'capacityModel' | 'leverageOpportunity';

export function generateRecommendations(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Get dimensions sorted by percentage (lowest first)
  const dimensions: { key: DimensionKey; percentage: number }[] = [
    { key: 'strategicClarity' as const, percentage: scores.strategicClarity.percentage },
    { key: 'executionGap' as const, percentage: scores.executionGap.percentage },
    { key: 'operationalMaturity' as const, percentage: scores.operationalMaturity.percentage },
    { key: 'capacityModel' as const, percentage: scores.capacityModel.percentage },
    { key: 'leverageOpportunity' as const, percentage: scores.leverageOpportunity.percentage },
  ].sort((a, b) => a.percentage - b.percentage);

  // Generate recommendations for lowest 3 dimensions
  let priority = 1;
  for (const dimension of dimensions.slice(0, 3)) {
    const rec = generateRecommendationForDimension(dimension.key, responses, scores, patterns, priority);
    if (rec) {
      recommendations.push(rec);
      priority++;
    }
  }

  return recommendations;
}

function generateRecommendationForDimension(
  dimension: DimensionKey,
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns,
  priority: number
): Recommendation | null {
  switch (dimension) {
    case 'strategicClarity':
      return generateStrategicClarityRecommendation(responses, scores, priority);
    case 'executionGap':
      return generateExecutionGapRecommendation(responses, scores, patterns, priority);
    case 'operationalMaturity':
      return generateOperationalMaturityRecommendation(responses, scores, patterns, priority);
    case 'capacityModel':
      return generateCapacityModelRecommendation(responses, scores, patterns, priority);
    case 'leverageOpportunity':
      return generateLeverageOpportunityRecommendation(responses, scores, priority);
    default:
      return null;
  }
}

function generateStrategicClarityRecommendation(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  priority: number
): Recommendation {
  const { strategy } = responses;
  const score = scores.strategicClarity;

  let title = 'Establish Strategic Alignment';
  let content = '';
  const actions: string[] = [];

  if (score.score < 6) {
    title = 'Create Strategic Foundation';
    content = 'Your organization needs a clear strategic foundation before execution improvements will yield results. Focus on articulating and aligning around core priorities.';
    actions.push(
      'Document your top 3 strategic priorities with clear success criteria',
      'Conduct alignment sessions with leadership to ensure shared understanding',
      'Create a decision framework that references strategic priorities',
      'Establish a monthly strategy review cadence'
    );
  } else if (score.score < 10) {
    title = 'Strengthen Strategic Alignment';
    content = 'Your strategy exists but isn\'t consistently guiding decisions. Focus on making strategy actionable and consistently referenced.';
    actions.push(
      'Review and refresh strategic priorities quarterly',
      'Create decision logs that reference strategic rationale',
      'Implement a "strategy check" before committing to new initiatives',
      'Reduce active initiatives to focus resources on highest-impact priorities'
    );
  } else {
    title = 'Maintain Strategic Discipline';
    content = 'Your strategic clarity is solid. Focus on maintaining discipline and ensuring strategy continues to guide decisions.';
    actions.push(
      'Continue quarterly strategy reviews',
      'Document and communicate strategic decisions and their rationale',
      'Regularly audit whether resource allocation matches stated priorities'
    );
  }

  return { priority, title, content, actions };
}

function generateExecutionGapRecommendation(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns,
  priority: number
): Recommendation {
  const { execution } = responses;
  const score = scores.executionGap;

  let title = 'Build Execution Infrastructure';
  let content = '';
  const actions: string[] = [];

  if (patterns.planningTheater) {
    title = 'Close the Strategy-Execution Gap';
    content = 'Your organization has strategic clarity but struggles to execute. The fix is execution infrastructure, not more planning.';
    actions.push(
      'Assign clear owners for each strategic priority with explicit accountability',
      'Establish weekly progress reviews focused on movement, not status',
      'Create a visible tracking system that connects daily work to strategic priorities',
      'Implement a 90-day execution sprint focused on a single priority'
    );
  } else if (score.score < 6) {
    title = 'Establish Basic Execution Systems';
    content = 'Without basic execution infrastructure, plans will remain plans. Start with the fundamentals.';
    actions.push(
      'Implement a weekly team rhythm reviewing progress against defined priorities',
      'Create documented quarterly objectives with clear owners',
      'Establish simple metrics to track progress on key initiatives',
      'Start monthly retrospectives to learn from execution successes and failures'
    );
  } else {
    title = 'Strengthen Execution Consistency';
    content = 'Your execution foundation exists but has gaps. Focus on consistency and accountability.';
    actions.push(
      'Ensure every strategic initiative has a single accountable owner',
      'Implement a regular cadence for surfacing and addressing blockers',
      'Create visibility into progress at the leadership level',
      'Build the habit of connecting daily work to strategic priorities'
    );
  }

  return { priority, title, content, actions };
}

function generateOperationalMaturityRecommendation(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns,
  priority: number
): Recommendation {
  const { operations } = responses;
  const score = scores.operationalMaturity;

  let title = 'Build Operational Foundation';
  let content = '';
  const actions: string[] = [];

  if (patterns.toolSprawl) {
    title = 'Consolidate Technology Stack';
    content = 'Your technology sprawl is creating inefficiency and confusion. Focus on consolidation and effective use before adding new tools.';
    actions.push(
      'Audit current technology subscriptions and their actual usage',
      'Identify 2-3 core tools that should be your primary operational hub',
      'Create training and adoption plans for prioritized tools',
      'Establish a governance process for adding new tools'
    );
  } else if (score.score < 7) {
    title = 'Establish Operational Systems';
    content = 'Your organization depends heavily on individuals rather than systems. This limits scale and creates risk.';
    actions.push(
      'Document the 5 most critical recurring processes',
      'Create structured onboarding that doesn\'t depend on specific individuals',
      'Implement a central knowledge base for operational documentation',
      'Assign process owners responsible for keeping documentation current'
    );
  } else if (score.score < 12) {
    title = 'Mature Operational Processes';
    content = 'Your operational foundation exists but needs development. Focus on consistency and scalability.';
    actions.push(
      'Complete documentation for all critical operational processes',
      'Review and update outdated documentation',
      'Create process improvement cycles that regularly refine operations',
      'Ensure technology tools are being used to their potential'
    );
  } else {
    title = 'Optimize Operational Efficiency';
    content = 'Your operational maturity is developing. Focus on optimization and continuous improvement.';
    actions.push(
      'Implement metrics to measure process efficiency',
      'Create regular review cycles to identify improvement opportunities',
      'Document best practices and ensure they\'re consistently applied'
    );
  }

  return { priority, title, content, actions };
}

function generateCapacityModelRecommendation(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns,
  priority: number
): Recommendation {
  const { capacity } = responses;
  const score = scores.capacityModel;

  let title = 'Restructure Capacity Model';
  let content = '';
  const actions: string[] = [];

  if (patterns.founderTrap) {
    title = 'Escape the Founder Trap';
    content = 'The organization cannot scale beyond your personal bandwidth. The priority is delegation and capability building.';
    actions.push(
      'Identify the 3 highest-value activities only you can do, delegate everything else',
      'Document processes for work you currently handle that others could do',
      'Hire or develop someone to own operational execution',
      'Block protected time for strategic thinking and leadership development'
    );
  } else if (patterns.capacityCrisis) {
    title = 'Resolve Capacity Crisis';
    content = 'Your team is underwater, and new work cannibalizes existing priorities. Before adding, you must subtract.';
    actions.push(
      'Audit current commitments and explicitly deprioritize or stop lowest-value work',
      'Create a "not now" list for initiatives that don\'t make the cut',
      'Establish capacity thresholds before accepting new commitments',
      'Identify work that could be delegated, automated, or outsourced'
    );
  } else if (score.score < 12) {
    title = 'Rebalance Team Capacity';
    content = 'Your capacity model is strained. Focus on sustainable work distribution and capability building.';
    actions.push(
      'Review work distribution to ensure leadership isn\'t overloaded with execution',
      'Identify capability gaps that could be filled with targeted hires or partners',
      'Create slack in the system for strategic initiatives',
      'Establish clear boundaries between strategic and operational time'
    );
  } else {
    title = 'Optimize Capacity Utilization';
    content = 'Your capacity model is manageable. Focus on optimization and preparing for growth.';
    actions.push(
      'Ensure work distribution supports strategic priorities',
      'Plan for capacity needs as the organization grows',
      'Build redundancy in critical functions'
    );
  }

  return { priority, title, content, actions };
}

function generateLeverageOpportunityRecommendation(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  priority: number
): Recommendation {
  const { leverage } = responses;
  const score = scores.leverageOpportunity;

  let title = 'Identify Leverage Opportunities';
  let content = '';
  const actions: string[] = [];

  if (score.score < 3) {
    title = 'Discover Strategic Leverage';
    content = 'Your organization hasn\'t systematically identified opportunities for strategic multiplication. Start with the basics.';
    actions.push(
      'Map your competitive landscape and identify differentiation opportunities',
      'Brainstorm adjacent markets or audiences you could serve with existing capabilities',
      'Identify potential strategic partnerships that could accelerate growth',
      'Analyze where you could increase output without proportional cost increases'
    );
  } else if (score.score < 6) {
    title = 'Activate Leverage Opportunities';
    content = 'You\'ve begun thinking about leverage but haven\'t systematized the pursuit. Focus on activation.';
    actions.push(
      'Prioritize identified adjacent market opportunities',
      'Develop partnership strategies for high-potential relationships',
      'Create a roadmap for pursuing leverage opportunities',
      'Allocate resources specifically to leverage-focused initiatives'
    );
  } else {
    title = 'Systematize Leverage Pursuit';
    content = 'You\'re actively pursuing some leverage opportunities. Focus on systematic expansion.';
    actions.push(
      'Create a portfolio view of leverage opportunities across markets, partnerships, and efficiency',
      'Establish metrics to track leverage effectiveness',
      'Allocate dedicated resources to leverage initiatives',
      'Regularly review and update your leverage strategy'
    );
  }

  return { priority, title, content, actions };
}

// Engagement readiness content
export function generateEngagementReadiness(
  responses: DiagnosticResponses
): { assessment: string; capacity: string; timeline: string } {
  const { readiness } = responses;

  let assessment = '';
  const isHighCapacity = readiness.q36_investment_capacity === '7500_15k' || readiness.q36_investment_capacity === '15k_plus';
  const isUrgent = readiness.q37_timeline === 'immediately' || readiness.q37_timeline === '1_3_months';

  if (isHighCapacity && isUrgent) {
    assessment = 'Your indicated capacity and urgency align well with comprehensive strategy-to-execution partnership. You\'re positioned to make meaningful progress on the challenges surfaced in this diagnostic.';
  } else if (isHighCapacity) {
    assessment = 'Your investment capacity suggests readiness for comprehensive support. The timeline indicates a more deliberate approach, which can work well with phased engagement.';
  } else if (isUrgent) {
    assessment = 'Your timeline is urgent, though investment capacity may suggest starting with focused engagements that deliver quick wins while building toward more comprehensive partnership.';
  } else {
    assessment = 'Your current investment capacity or timeline suggests a phased approach may be more appropriate. Consider starting with specific, bounded projects that demonstrate value before expanding scope.';
  }

  const capacityMap: Record<string, string> = {
    under_5k: 'Under $5,000/month',
    '5k_7500': '$5,000–$7,500/month',
    '7500_15k': '$7,500–$15,000/month',
    '15k_plus': '$15,000+/month',
    unsure: 'Depends on expected value',
  };

  const timelineMap: Record<string, string> = {
    immediately: 'Immediately',
    '1_3_months': 'Within 1–3 months',
    '3_6_months': 'Within 3–6 months',
    exploring: 'Exploring options',
  };

  return {
    assessment,
    capacity: capacityMap[readiness.q36_investment_capacity] || 'Not specified',
    timeline: timelineMap[readiness.q37_timeline] || 'Not specified',
  };
}

// Next steps content based on Q38
export function generateNextSteps(responses: DiagnosticResponses): { content: string; cta: string } {
  const { readiness } = responses;

  switch (readiness.q38_next_step) {
    case 'conversation':
      return {
        content: 'You\'ve indicated interest in a conversation to discuss findings and potential fit. This diagnostic has revealed patterns and priorities that are best explored through dialogue.',
        cta: 'Schedule a diagnostic review conversation to discuss what these findings mean for your specific situation.',
      };
    case 'both':
      return {
        content: 'This report is your starting point. The diagnostic reveals patterns and priorities, but the real value comes from discussing what these findings mean for your specific situation.',
        cta: 'Schedule a diagnostic review conversation to explore these findings in depth.',
      };
    case 'report_only':
    case 'just_report':
      return {
        content: 'This report summarizes your diagnostic findings. When you\'re ready to explore what these patterns mean for your organization, we\'re here.',
        cta: 'Reach out when you\'re ready to discuss next steps.',
      };
    default:
      return {
        content: 'This diagnostic has surfaced important patterns about your organization\'s operational leverage. The findings are designed to prompt reflection and guide action.',
        cta: 'Consider how these findings apply to your specific context and what changes would have the highest impact.',
      };
  }
}
