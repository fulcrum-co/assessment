import { z } from 'zod';

// Contact info validation
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
});

// Section 1: Organizational Context
export const contextSchema = z.object({
  q1_revenue: z.enum(['pre_revenue', '500k_2m', '2m_5m', '5m_10m', '10m_plus']),
  q2_team_size: z.enum(['1_5', '6_15', '16_30', '31_50', '50_plus']),
  q3_org_stage: z.enum(['founder_led', 'leadership_exists', 'leadership_autonomous', 'professional_mgmt']),
  q4_interest_drivers: z.array(z.string()).min(1, 'Select at least one option'),
});

// Section 2: Strategic Clarity
export const strategySchema = z.object({
  q5_decision_behavior: z.enum(['references_priorities', 'debates_sometimes', 'escalates_founder', 'urgency_driven']),
  q6_alignment: z.enum(['nearly_identical', 'substantially_similar', 'overlapping_gaps', 'quite_different']),
  q7_abandoned_initiatives: z.enum(['none', '1_2', '3_5', 'more_than_5']),
  q8_stall_causes: z.array(z.string()).min(1).max(2),
  q9_stalled_priority: z.string().max(400),
});

// Section 3: Execution Capability
export const executionSchema = z.object({
  q10_post_planning: z.enum(['clear_owners', 'some_progress', 'occasionally_referenced', 'not_much']),
  q11_translation_responsibility: z.enum(['dedicated_ops', 'same_people', 'varies', 'recurring_gap']),
  q12_work_connection: z.enum(['tight', 'loose', 'disconnected', 'havent_tried']),
  q13_progress_tracking: z.enum(['surfaced_early', 'leadership_notices', 'not_addressed', 'dont_track']),
  q14_infrastructure: z.array(z.string()).optional().default([]),
  q15_breakdown_points: z.array(z.string()).min(1).max(2),
});

// Section 4: Operational Infrastructure
export const operationsSchema = z.object({
  q16_documentation: z.enum(['most_documented', 'some_exists', 'in_heads', 'doesnt_stick']),
  q17_onboarding: z.enum(['structured', 'some_plus_shadow', 'asking_questions', 'trial_by_fire']),
  q18_tool_count: z.enum(['1_5', '6_10', '11_15', '15_plus']),
  q19_tech_confidence: z.enum(['very_confident', 'somewhat_confident', 'not_confident', 'havent_audited']),
  q20_tech_value: z.enum(['75_plus', '50_75', '25_50', 'less_25', 'not_sure']),
});

// Section 5: Capacity & Team Model
export const capacitySchema = z.object({
  q21_capacity: z.enum(['have_capacity', 'stretched', 'over_capacity', 'underwater']),
  q22_new_capacity: z.enum(['slack', 'team_absorbs', 'hire', 'competes']),
  q23_work_distribution: z.object({
    fullTime: z.number().min(0).max(100),
    partTime: z.number().min(0).max(100),
    external: z.number().min(0).max(100),
    leadership: z.number().min(0).max(100),
  }).refine(
    (data) => data.fullTime + data.partTime + data.external + data.leadership === 100,
    'Percentages must add up to 100'
  ),
  q24_capability_gaps: z.array(z.string()).optional().default([]),
  q25_founder_time: z.enum(['primarily_strategic', 'mixed', 'primarily_operational', 'almost_entirely_operational']),
});

// Section 6: Previous Advisory Experience
export const advisorySchema = z.object({
  q26_previous_engagement: z.enum(['multiple_times', 'once_twice', 'considered', 'never']),
  q27_experience_outcomes: z.array(z.string()).optional().default([]),
  q28_different_engagement: z.string().max(400).optional().default(''),
});

// Section 7: Growth & Leverage
export const leverageSchema = z.object({
  q29_market_clarity: z.enum(['very_clearly', 'somewhat_clearly', 'not_clearly', 'not_relevant']),
  q30_adjacent_markets: z.enum(['actively_pursuing', 'identified_not_acted', 'discussed', 'havent_explored']),
  q31_partnerships: z.enum(['pursuing', 'identified_not_prioritized', 'possibly', 'doesnt_apply']),
  q32_leverage_source: z.string().max(400),
});

// Section 8: Priorities & Readiness
export const readinessSchema = z.object({
  q33_constraint: z.string().max(400),
  q34_partner_help: z.string().max(400),
  q35_breakthrough_year: z.string().max(400),
  q36_investment_capacity: z.enum(['under_5k', '5k_7500', '7500_15k', '15k_plus', 'unsure']),
  q37_timeline: z.enum(['immediately', '1_3_months', '3_6_months', 'exploring']),
  q38_next_step: z.enum(['report_only', 'conversation', 'both', 'just_report']),
});

// Complete diagnostic responses schema
export const diagnosticResponsesSchema = z.object({
  contact: contactSchema,
  context: contextSchema,
  strategy: strategySchema,
  execution: executionSchema,
  operations: operationsSchema,
  capacity: capacitySchema,
  advisory: advisorySchema,
  leverage: leverageSchema,
  readiness: readinessSchema,
});

export type ValidatedDiagnosticResponses = z.infer<typeof diagnosticResponsesSchema>;
