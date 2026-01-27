import { DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';
import { generateFallbackInterpretations, AIInterpretations } from './fallback';

// Check if OpenAI is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateInterpretations(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): Promise<AIInterpretations> {
  // If no API key, use fallback
  if (!OPENAI_API_KEY) {
    console.log('[AI] No OpenAI API key configured, using fallback interpretations');
    return generateFallbackInterpretations(responses, scores, patterns);
  }

  try {
    const prompt = buildInterpretationPrompt(responses, scores, patterns);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a senior strategic advisor analyzing organizational diagnostic results.
Your task is to provide insightful, specific interpretations based on the respondent's own words and their quantitative scores.

Guidelines:
- Be direct and observational, not salesy or alarmist
- Use their exact language when quoting their responses
- Connect specific responses to broader patterns
- Maintain an executive, peer-to-peer tone
- Focus on insight, not flattery
- Be specific about implications without being prescriptive yet

Return your response as valid JSON matching the exact structure requested.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('[AI] OpenAI API error:', response.status);
      return generateFallbackInterpretations(responses, scores, patterns);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('[AI] No content in response');
      return generateFallbackInterpretations(responses, scores, patterns);
    }

    // Parse the JSON response
    const interpretations = parseInterpretations(content);
    return interpretations;
  } catch (error) {
    console.error('[AI] Error generating interpretations:', error);
    return generateFallbackInterpretations(responses, scores, patterns);
  }
}

function buildInterpretationPrompt(
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns
): string {
  const { contact, strategy, execution, operations, capacity, advisory, leverage, readiness } = responses;

  const activePatterns = Object.entries(patterns)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return `
Analyze this organizational diagnostic and provide interpretations.

## Scores
- Strategic Clarity: ${scores.strategicClarity.score}/${scores.strategicClarity.maxScore} (${scores.strategicClarity.status})
- Execution Capability: ${scores.executionGap.score}/${scores.executionGap.maxScore} (${scores.executionGap.status})
- Operational Infrastructure: ${scores.operationalMaturity.score}/${scores.operationalMaturity.maxScore} (${scores.operationalMaturity.status})
- Team & Capacity: ${scores.capacityModel.score}/${scores.capacityModel.maxScore} (${scores.capacityModel.status})
- Partnership Readiness: ${scores.advisoryReadiness.score}/${scores.advisoryReadiness.maxScore} (${scores.advisoryReadiness.status})
- Strategic Leverage: ${scores.leverageOpportunity.score}/${scores.leverageOpportunity.maxScore} (${scores.leverageOpportunity.status})
- Overall Score: ${scores.overall}/100

## Detected Patterns
${activePatterns.length > 0 ? activePatterns.join(', ') : 'None detected'}

## Open-Ended Responses

Q9 (Strategic priority that didn't progress):
"${strategy.q9_stalled_priority || 'Not provided'}"

Q28 (What would make advisory valuable):
"${advisory.q28_different_engagement || 'Not provided'}"

Q32 (Where leverage would come from):
"${leverage.q32_leverage_source || 'Not provided'}"

Q33 (Biggest operational constraint):
"${readiness.q33_constraint}"

Q34 (What they'd want help with):
"${readiness.q34_partner_help || 'Not provided'}"

Q35 (What breakthrough year looks like):
"${readiness.q35_breakthrough_year || 'Not provided'}"

## Company Context
- Company: ${contact.companyName}
- Role: ${contact.role}
- Revenue: ${responses.context.q1_revenue}
- Team Size: ${responses.context.q2_team_size}
- Structure: ${responses.context.q3_org_stage}

Provide the following interpretations in JSON format:

{
  "executiveSummaryInsight": "2-3 sentences capturing the core pattern across all dimensions",
  "strategicClarityInterpretation": "2-3 sentences interpreting their strategic clarity situation, referencing Q9 if provided",
  "executionInterpretation": "2-3 sentences on execution capability, connecting to their stated constraint",
  "operationalInterpretation": "2-3 sentences on operational infrastructure",
  "capacityInterpretation": "2-3 sentences on team and capacity, noting founder involvement if relevant",
  "leverageInterpretation": "2-3 sentences on leverage opportunities, referencing Q32 if provided",
  "constraintAnalysis": "3-4 sentences deeply analyzing their stated biggest constraint (Q33)",
  "breakthroughPathway": "2-3 sentences connecting their definition of breakthrough (Q35) to what the data suggests",
  "patternNarrative": "3-4 sentences synthesizing detected patterns into a coherent story"
}
`;
}

function parseInterpretations(content: string): AIInterpretations {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('[AI] Error parsing interpretations:', error);
    // Return empty interpretations - fallback will be used
    return {
      executiveSummaryInsight: '',
      strategicClarityInterpretation: '',
      executionInterpretation: '',
      operationalInterpretation: '',
      capacityInterpretation: '',
      leverageInterpretation: '',
      constraintAnalysis: '',
      breakthroughPathway: '',
      patternNarrative: '',
    };
  }
}

export type { AIInterpretations };
