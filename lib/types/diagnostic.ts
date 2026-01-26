// Contact information
export interface ContactInfo {
  name: string;
  email: string;
  companyName: string;
  role: string;
}

// Section 1: Organizational Context
export interface ContextResponses {
  q1_revenue: 'pre_revenue' | '500k_2m' | '2m_5m' | '5m_10m' | '10m_plus';
  q2_team_size: '1_5' | '6_15' | '16_30' | '31_50' | '50_plus';
  q3_org_stage: 'founder_led' | 'leadership_exists' | 'leadership_autonomous' | 'professional_mgmt';
  q4_interest_drivers: string[]; // multi-select
}

// Section 2: Strategic Clarity
export interface StrategyResponses {
  q5_decision_behavior: 'references_priorities' | 'debates_sometimes' | 'escalates_founder' | 'urgency_driven';
  q6_alignment: 'nearly_identical' | 'substantially_similar' | 'overlapping_gaps' | 'quite_different';
  q7_abandoned_initiatives: 'none' | '1_2' | '3_5' | 'more_than_5';
  q8_stall_causes: string[]; // multi-select, max 2
  q9_stalled_priority: string; // long text
}

// Section 3: Execution Capability
export interface ExecutionResponses {
  q10_post_planning: 'clear_owners' | 'some_progress' | 'occasionally_referenced' | 'not_much';
  q11_translation_responsibility: 'dedicated_ops' | 'same_people' | 'varies' | 'recurring_gap';
  q12_work_connection: 'tight' | 'loose' | 'disconnected' | 'havent_tried';
  q13_progress_tracking: 'surfaced_early' | 'leadership_notices' | 'not_addressed' | 'dont_track';
  q14_infrastructure: string[]; // multi-select checkboxes
  q15_breakdown_points: string[]; // multi-select, max 2
}

// Section 4: Operational Infrastructure
export interface OperationsResponses {
  q16_documentation: 'most_documented' | 'some_exists' | 'in_heads' | 'doesnt_stick';
  q17_onboarding: 'structured' | 'some_plus_shadow' | 'asking_questions' | 'trial_by_fire';
  q18_tool_count: '1_5' | '6_10' | '11_15' | '15_plus';
  q19_tech_confidence: 'very_confident' | 'somewhat_confident' | 'not_confident' | 'havent_audited';
  q20_tech_value: '75_plus' | '50_75' | '25_50' | 'less_25' | 'not_sure';
}

// Section 5: Capacity & Team Model
export interface CapacityResponses {
  q21_capacity: 'have_capacity' | 'stretched' | 'over_capacity' | 'underwater';
  q22_new_capacity: 'slack' | 'team_absorbs' | 'hire' | 'competes';
  q23_work_distribution: {
    fullTime: number;
    partTime: number;
    external: number;
    leadership: number;
  };
  q24_capability_gaps: string[]; // multi-select
  q25_founder_time: 'primarily_strategic' | 'mixed' | 'primarily_operational' | 'almost_entirely_operational';
}

// Section 6: Previous Advisory Experience
export interface AdvisoryResponses {
  q26_previous_engagement: 'multiple_times' | 'once_twice' | 'considered' | 'never';
  q27_experience_outcomes: string[]; // multi-select
  q28_different_engagement: string; // long text, optional
}

// Section 7: Growth & Leverage
export interface LeverageResponses {
  q29_market_clarity: 'very_clearly' | 'somewhat_clearly' | 'not_clearly' | 'not_relevant';
  q30_adjacent_markets: 'actively_pursuing' | 'identified_not_acted' | 'discussed' | 'havent_explored';
  q31_partnerships: 'pursuing' | 'identified_not_prioritized' | 'possibly' | 'doesnt_apply';
  q32_leverage_source: string; // long text
}

// Section 8: Priorities & Readiness
export interface ReadinessResponses {
  q33_constraint: string; // long text
  q34_partner_help: string; // long text
  q35_breakthrough_year: string; // long text
  q36_investment_capacity: 'under_5k' | '5k_7500' | '7500_15k' | '15k_plus' | 'unsure';
  q37_timeline: 'immediately' | '1_3_months' | '3_6_months' | 'exploring';
  q38_next_step: 'report_only' | 'conversation' | 'both' | 'just_report';
}

// Complete diagnostic responses
export interface DiagnosticResponses {
  contact: ContactInfo;
  context: ContextResponses;
  strategy: StrategyResponses;
  execution: ExecutionResponses;
  operations: OperationsResponses;
  capacity: CapacityResponses;
  advisory: AdvisoryResponses;
  leverage: LeverageResponses;
  readiness: ReadinessResponses;
}

// Question metadata
export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'text' | 'textarea' | 'percentage_group';
  options?: QuestionOption[];
  required?: boolean;
  maxSelections?: number;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}
