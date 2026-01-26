import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores } from '@/lib/types/scores';
import {
  calculateStrategicClarity,
  calculateExecutionGap,
  calculateOperationalMaturity,
  calculateCapacityModel,
  calculateAdvisoryReadiness,
  calculateLeverageOpportunity,
} from './dimensions';

export function calculateAllScores(responses: DiagnosticResponses): DimensionScores {
  const strategicClarity = calculateStrategicClarity(responses);
  const executionGap = calculateExecutionGap(responses);
  const operationalMaturity = calculateOperationalMaturity(responses);
  const capacityModel = calculateCapacityModel(responses);
  const advisoryReadiness = calculateAdvisoryReadiness(responses);
  const leverageOpportunity = calculateLeverageOpportunity(responses);

  // Calculate overall score (0-100)
  // Weight distribution:
  // - Strategic Clarity: 20%
  // - Execution Gap: 25%
  // - Operational Maturity: 20%
  // - Capacity Model: 20%
  // - Advisory Readiness: 5%
  // - Leverage Opportunity: 10%
  const overall = Math.round(
    (strategicClarity.score / strategicClarity.maxScore) * 20 +
    (executionGap.score / executionGap.maxScore) * 25 +
    (operationalMaturity.score / operationalMaturity.maxScore) * 20 +
    (capacityModel.score / capacityModel.maxScore) * 20 +
    (Math.max(0, advisoryReadiness.score) / advisoryReadiness.maxScore) * 5 +
    (leverageOpportunity.score / leverageOpportunity.maxScore) * 10
  );

  return {
    strategicClarity,
    executionGap,
    operationalMaturity,
    capacityModel,
    advisoryReadiness,
    leverageOpportunity,
    overall,
  };
}

export * from './dimensions';
