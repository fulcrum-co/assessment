import { Section } from './types/diagnostic';

export const sections: Section[] = [
  // Section 0: Contact Information
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Tell us about yourself so we can personalize your report.',
    questions: [
      {
        id: 'name',
        text: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Your full name',
      },
      {
        id: 'email',
        text: 'Email',
        type: 'text',
        required: true,
        placeholder: 'you@company.com',
      },
      {
        id: 'companyName',
        text: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Your organization',
      },
      {
        id: 'role',
        text: 'Your Role/Title',
        type: 'text',
        required: true,
        placeholder: 'CEO, Founder, COO, etc.',
      },
    ],
  },

  // Section 1: Organizational Context
  {
    id: 'context',
    title: 'Organizational Context',
    description: 'Help us understand your organization\'s current stage and structure.',
    questions: [
      {
        id: 'q1_revenue',
        text: 'Current annual revenue range:',
        type: 'radio',
        required: true,
        options: [
          { value: 'pre_revenue', label: 'Pre-revenue or under $500K' },
          { value: '500k_2m', label: '$500K – $2M' },
          { value: '2m_5m', label: '$2M – $5M' },
          { value: '5m_10m', label: '$5M – $10M' },
          { value: '10m_plus', label: '$10M+' },
        ],
      },
      {
        id: 'q2_team_size',
        text: 'Team size (full-time equivalents, including key contractors):',
        type: 'radio',
        required: true,
        options: [
          { value: '1_5', label: '1–5' },
          { value: '6_15', label: '6–15' },
          { value: '16_30', label: '16–30' },
          { value: '31_50', label: '31–50' },
          { value: '50_plus', label: '50+' },
        ],
      },
      {
        id: 'q3_org_stage',
        text: 'Which best describes your organization today?',
        type: 'radio',
        required: true,
        options: [
          { value: 'founder_led', label: 'Founder-led with a small supporting team' },
          { value: 'leadership_exists', label: 'Leadership team exists but founder remains primary decision-maker' },
          { value: 'leadership_autonomous', label: 'Leadership team operates with meaningful autonomy' },
          { value: 'professional_mgmt', label: 'Professional management with founder in advisory/board role' },
        ],
      },
      {
        id: 'q4_interest_drivers',
        text: 'What is driving your interest in this diagnostic right now? (Select all that apply)',
        type: 'checkbox',
        required: true,
        options: [
          { value: 'preparing_growth', label: 'We\'re preparing for significant growth' },
          { value: 'stuck', label: 'We\'re stuck and trying to understand why' },
          { value: 'leadership_stretched', label: 'Leadership is stretched too thin' },
          { value: 'previous_failed', label: 'Previous initiatives or plans haven\'t delivered expected results' },
          { value: 'outside_perspective', label: 'We need outside perspective on how we\'re operating' },
          { value: 'exploring_support', label: 'Exploring whether fractional or advisory support makes sense' },
        ],
      },
    ],
  },

  // Section 2: Strategic Clarity
  {
    id: 'strategy',
    title: 'Strategic Clarity',
    description: 'Assess how well strategy guides decisions and actions in your organization.',
    questions: [
      {
        id: 'q5_decision_behavior',
        text: 'When a significant new opportunity or decision arises, what typically happens?',
        type: 'radio',
        required: true,
        options: [
          { value: 'references_priorities', label: 'Leadership references shared priorities and decides accordingly' },
          { value: 'debates_sometimes', label: 'Leadership debates it, sometimes referencing strategy, sometimes not' },
          { value: 'escalates_founder', label: 'It usually escalates to the founder regardless of stated priorities' },
          { value: 'urgency_driven', label: 'Decisions are made based on urgency or who\'s advocating loudest' },
        ],
      },
      {
        id: 'q6_alignment',
        text: 'If you asked three different leaders on your team to describe the organization\'s strategic priorities, how aligned would their answers be?',
        type: 'radio',
        required: true,
        options: [
          { value: 'nearly_identical', label: 'Nearly identical' },
          { value: 'substantially_similar', label: 'Substantially similar with minor differences' },
          { value: 'overlapping_gaps', label: 'Overlapping but with meaningful gaps' },
          { value: 'quite_different', label: 'Likely quite different' },
        ],
      },
      {
        id: 'q7_abandoned_initiatives',
        text: 'In the past 12 months, how many significant strategic initiatives were started and later abandoned or deprioritized?',
        type: 'radio',
        required: true,
        options: [
          { value: 'none', label: 'None' },
          { value: '1_2', label: '1–2' },
          { value: '3_5', label: '3–5' },
          { value: 'more_than_5', label: 'More than 5' },
        ],
      },
      {
        id: 'q8_stall_causes',
        text: 'What typically causes strategic initiatives to stall or get abandoned? (Select up to two)',
        type: 'checkbox',
        required: true,
        maxSelections: 2,
        options: [
          { value: 'capacity_constraints', label: 'Capacity constraints—not enough people or time' },
          { value: 'shifting_priorities', label: 'Shifting priorities from leadership' },
          { value: 'lack_ownership', label: 'Lack of clear ownership' },
          { value: 'implementation_harder', label: 'Implementation proved harder than expected' },
          { value: 'results_not_materializing', label: 'Results weren\'t materializing quickly enough' },
          { value: 'external_factors', label: 'External factors changed the landscape' },
        ],
      },
      {
        id: 'q9_stalled_priority',
        text: 'Describe a strategic priority from the past year that didn\'t progress as expected. What happened?',
        type: 'textarea',
        required: true,
        minLength: 200,
        maxLength: 400,
        placeholder: 'Share a specific example of a strategic priority that stalled or didn\'t deliver as expected...',
      },
    ],
  },

  // Section 3: Execution Capability
  {
    id: 'execution',
    title: 'Execution Capability',
    description: 'Evaluate how effectively your organization translates plans into results.',
    questions: [
      {
        id: 'q10_post_planning',
        text: 'After your last significant planning session (annual, quarterly, or strategic), what happened in the following 30 days?',
        type: 'radio',
        required: true,
        options: [
          { value: 'clear_owners', label: 'Clear owners took action on defined priorities' },
          { value: 'some_progress', label: 'Some progress was made, but momentum faded' },
          { value: 'occasionally_referenced', label: 'The plan was referenced occasionally but didn\'t drive daily work' },
          { value: 'not_much', label: 'Honestly, not much changed' },
        ],
      },
      {
        id: 'q11_translation_responsibility',
        text: 'When strategic plans are created, who is responsible for translating them into operational execution?',
        type: 'radio',
        required: true,
        options: [
          { value: 'dedicated_ops', label: 'A dedicated operations leader or team' },
          { value: 'same_people', label: 'The same people who created the strategy' },
          { value: 'varies', label: 'It varies—sometimes clear, sometimes not' },
          { value: 'recurring_gap', label: 'This is a recurring gap for us' },
        ],
      },
      {
        id: 'q12_work_connection',
        text: 'How would you characterize the connection between your strategic objectives and your team\'s weekly work?',
        type: 'radio',
        required: true,
        options: [
          { value: 'tight', label: 'Tight—people can trace their work to strategic priorities' },
          { value: 'loose', label: 'Loose—the connection exists but isn\'t explicit' },
          { value: 'disconnected', label: 'Disconnected—strategic objectives and daily work feel separate' },
          { value: 'havent_tried', label: 'We haven\'t tried to connect them' },
        ],
      },
      {
        id: 'q13_progress_tracking',
        text: 'When a quarterly priority isn\'t progressing, what typically happens?',
        type: 'radio',
        required: true,
        options: [
          { value: 'surfaced_early', label: 'It\'s surfaced early and addressed in a regular forum' },
          { value: 'leadership_notices', label: 'Leadership notices eventually and intervenes' },
          { value: 'not_addressed', label: 'It often doesn\'t get addressed until the quarter ends' },
          { value: 'dont_track', label: 'We don\'t track progress consistently enough to know' },
        ],
      },
      {
        id: 'q14_infrastructure',
        text: 'Which of the following are currently in place? (Select all that apply)',
        type: 'checkbox',
        required: false,
        options: [
          { value: 'written_plan', label: 'Written strategic plan updated within the past 12 months' },
          { value: 'quarterly_objectives', label: 'Documented quarterly objectives with clear owners' },
          { value: 'progress_review', label: 'Weekly or biweekly team rhythm reviewing progress against priorities' },
          { value: 'metrics_tracked', label: 'Defined metrics tracked against strategic initiatives' },
          { value: 'retrospectives', label: 'Regular retrospectives on what\'s working and what isn\'t' },
        ],
      },
      {
        id: 'q15_breakdown_points',
        text: 'Where does execution most commonly break down in your organization? (Select up to two)',
        type: 'checkbox',
        required: true,
        maxSelections: 2,
        options: [
          { value: 'strategy_to_operational', label: 'Between strategy and operational planning—we plan but don\'t operationalize' },
          { value: 'operational_to_daily', label: 'Between operational planning and daily work—priorities don\'t translate to tasks' },
          { value: 'tasks_to_completion', label: 'Between tasks and completion—things start but don\'t finish' },
          { value: 'completion_to_results', label: 'Between completion and results—we execute but don\'t see expected outcomes' },
        ],
      },
    ],
  },

  // Section 4: Operational Infrastructure
  {
    id: 'operations',
    title: 'Operational Infrastructure',
    description: 'Assess the systems and processes that support your organization\'s work.',
    questions: [
      {
        id: 'q16_documentation',
        text: 'For recurring operational work (onboarding, delivery, reporting), how much is documented in written processes?',
        type: 'radio',
        required: true,
        options: [
          { value: 'most_documented', label: 'Most critical processes are documented and used' },
          { value: 'some_exists', label: 'Some documentation exists, but it\'s incomplete or outdated' },
          { value: 'in_heads', label: 'Processes live mostly in people\'s heads' },
          { value: 'doesnt_stick', label: 'We\'ve tried documenting but it doesn\'t stick' },
        ],
      },
      {
        id: 'q17_onboarding',
        text: 'When someone new joins your team, how do they learn how things work?',
        type: 'radio',
        required: true,
        options: [
          { value: 'structured', label: 'Structured onboarding with documented processes and clear expectations' },
          { value: 'some_plus_shadow', label: 'Some documentation plus shadowing more experienced team members' },
          { value: 'asking_questions', label: 'Primarily by asking questions and figuring it out' },
          { value: 'trial_by_fire', label: 'Trial by fire' },
        ],
      },
      {
        id: 'q18_tool_count',
        text: 'How many different software tools does your organization use for core operations (project management, CRM, communication, documentation, finance)?',
        type: 'radio',
        required: true,
        options: [
          { value: '1_5', label: '1–5 (consolidated and intentional)' },
          { value: '6_10', label: '6–10 (some overlap, generally manageable)' },
          { value: '11_15', label: '11–15 (significant sprawl, some confusion)' },
          { value: '15_plus', label: '15+ (we\'ve lost count)' },
        ],
      },
      {
        id: 'q19_tech_confidence',
        text: 'How confident are you that your current technology stack is being used effectively?',
        type: 'radio',
        required: true,
        options: [
          { value: 'very_confident', label: 'Very confident—we use what we have well' },
          { value: 'somewhat_confident', label: 'Somewhat confident—we\'re using most of it, with some waste' },
          { value: 'not_confident', label: 'Not confident—we\'re paying for capabilities we don\'t leverage' },
          { value: 'havent_audited', label: 'We haven\'t audited this recently' },
        ],
      },
      {
        id: 'q20_tech_value',
        text: 'If you had to estimate, what percentage of your technology subscriptions are actively driving measurable value?',
        type: 'radio',
        required: true,
        options: [
          { value: '75_plus', label: '75%+' },
          { value: '50_75', label: '50–75%' },
          { value: '25_50', label: '25–50%' },
          { value: 'less_25', label: 'Less than 25%' },
          { value: 'not_sure', label: 'Honestly not sure' },
        ],
      },
    ],
  },

  // Section 5: Capacity & Team Model
  {
    id: 'capacity',
    title: 'Capacity & Team Model',
    description: 'Understand your team\'s capacity relative to strategic priorities.',
    questions: [
      {
        id: 'q21_capacity',
        text: 'How would you describe your team\'s current capacity relative to strategic priorities?',
        type: 'radio',
        required: true,
        options: [
          { value: 'have_capacity', label: 'We have capacity to pursue what matters most' },
          { value: 'stretched', label: 'We\'re stretched but managing' },
          { value: 'over_capacity', label: 'We\'re consistently over capacity—everything feels urgent' },
          { value: 'underwater', label: 'We\'re underwater—reactive work crowds out strategic work' },
        ],
      },
      {
        id: 'q22_new_capacity',
        text: 'When new strategic work emerges, where does the capacity typically come from?',
        type: 'radio',
        required: true,
        options: [
          { value: 'slack', label: 'We have slack in the system for new priorities' },
          { value: 'team_absorbs', label: 'Existing team absorbs it by working more' },
          { value: 'hire', label: 'We hire (full-time or contractor)' },
          { value: 'competes', label: 'It competes with existing work, and something suffers' },
        ],
      },
      {
        id: 'q23_work_distribution',
        text: 'What percentage of execution work is currently handled by each category?',
        type: 'percentage_group',
        required: true,
        options: [
          { value: 'fullTime', label: 'Full-time employees' },
          { value: 'partTime', label: 'Part-time or contract support' },
          { value: 'external', label: 'External partners or agencies' },
          { value: 'leadership', label: 'Leadership/founders directly' },
        ],
      },
      {
        id: 'q24_capability_gaps',
        text: 'Which of the following capabilities do you currently lack internally? (Select all that apply)',
        type: 'checkbox',
        required: false,
        options: [
          { value: 'strategic_planning', label: 'Strategic planning and market analysis' },
          { value: 'operational_design', label: 'Operational design and process building' },
          { value: 'project_management', label: 'Project management and execution oversight' },
          { value: 'technology', label: 'Technology implementation and optimization' },
          { value: 'marketing', label: 'Marketing and demand generation' },
          { value: 'sales', label: 'Sales process and pipeline management' },
          { value: 'finance', label: 'Finance and capital allocation' },
          { value: 'people_ops', label: 'People operations and team building' },
        ],
      },
      {
        id: 'q25_founder_time',
        text: 'How much of the founder\'s or CEO\'s time is currently spent on operational execution versus strategic leadership?',
        type: 'radio',
        required: true,
        options: [
          { value: 'primarily_strategic', label: 'Primarily strategic—operations are largely delegated' },
          { value: 'mixed', label: 'Mixed—significant time on both' },
          { value: 'primarily_operational', label: 'Primarily operational—most days are spent in execution' },
          { value: 'almost_entirely_operational', label: 'Almost entirely operational—strategic thinking happens rarely' },
        ],
      },
    ],
  },

  // Section 6: Previous Advisory Experience
  {
    id: 'advisory',
    title: 'Previous Advisory Experience',
    description: 'Help us understand your experience with external support.',
    questions: [
      {
        id: 'q26_previous_engagement',
        text: 'Has your organization previously engaged external consultants, advisors, or fractional executives?',
        type: 'radio',
        required: true,
        options: [
          { value: 'multiple_times', label: 'Yes, multiple times' },
          { value: 'once_twice', label: 'Yes, once or twice' },
          { value: 'considered', label: 'No, but we\'ve considered it' },
          { value: 'never', label: 'No, never considered it' },
        ],
      },
      {
        id: 'q27_experience_outcomes',
        text: 'If yes, how would you characterize those experiences? (Select all that apply)',
        type: 'checkbox',
        required: false,
        options: [
          { value: 'delivered_clarity', label: 'Delivered strategic clarity we still use today' },
          { value: 'partially_implemented', label: 'Produced valuable recommendations that were partially implemented' },
          { value: 'plans_not_executed', label: 'Created plans that largely weren\'t executed' },
          { value: 'temporary_capacity', label: 'Provided temporary capacity but no lasting capability' },
          { value: 'too_expensive', label: 'Were too expensive relative to value delivered' },
          { value: 'didnt_understand', label: 'Didn\'t understand our business well enough' },
          { value: 'disappeared', label: 'Disappeared before implementation' },
          { value: 'na', label: 'N/A—haven\'t used external support' },
        ],
      },
      {
        id: 'q28_different_engagement',
        text: 'What would need to be different about an advisory engagement for it to be valuable to you?',
        type: 'textarea',
        required: false,
        minLength: 200,
        maxLength: 400,
        placeholder: 'Describe what an ideal advisory engagement would look like for your organization...',
      },
    ],
  },

  // Section 7: Growth & Leverage
  {
    id: 'leverage',
    title: 'Growth & Leverage',
    description: 'Explore opportunities for strategic multiplication.',
    questions: [
      {
        id: 'q29_market_clarity',
        text: 'How clearly have you mapped your competitive landscape and market positioning?',
        type: 'radio',
        required: true,
        options: [
          { value: 'very_clearly', label: 'Very clearly—we know our differentiation and can articulate it' },
          { value: 'somewhat_clearly', label: 'Somewhat clearly—we have a sense but haven\'t formalized it' },
          { value: 'not_clearly', label: 'Not clearly—we compete but haven\'t analyzed positioning systematically' },
          { value: 'not_relevant', label: 'This isn\'t relevant to us' },
        ],
      },
      {
        id: 'q30_adjacent_markets',
        text: 'Beyond your core customers, have you identified adjacent markets or audiences you could serve with existing capabilities?',
        type: 'radio',
        required: true,
        options: [
          { value: 'actively_pursuing', label: 'Yes, and we\'re actively pursuing them' },
          { value: 'identified_not_acted', label: 'Yes, but we haven\'t acted on them yet' },
          { value: 'discussed', label: 'We\'ve discussed it but haven\'t mapped it' },
          { value: 'havent_explored', label: 'We haven\'t explored this' },
        ],
      },
      {
        id: 'q31_partnerships',
        text: 'Are there strategic partnerships (distribution, capability, or ecosystem) that could accelerate your growth without proportional investment?',
        type: 'radio',
        required: true,
        options: [
          { value: 'pursuing', label: 'Yes, and we\'re pursuing them' },
          { value: 'identified_not_prioritized', label: 'Yes, but we haven\'t prioritized them' },
          { value: 'possibly', label: 'Possibly, but we haven\'t identified them' },
          { value: 'doesnt_apply', label: 'We don\'t think this applies to us' },
        ],
      },
      {
        id: 'q32_leverage_source',
        text: 'If your organization could operate at twice its current output without doubling costs, where would the leverage come from?',
        type: 'textarea',
        required: true,
        minLength: 200,
        maxLength: 400,
        placeholder: 'Describe where you see the greatest potential for operational leverage...',
      },
    ],
  },

  // Section 8: Priorities & Readiness
  {
    id: 'readiness',
    title: 'Priorities & Readiness',
    description: 'Share your priorities and timeline for addressing these challenges.',
    questions: [
      {
        id: 'q33_constraint',
        text: 'What is the single biggest operational constraint holding your organization back right now?',
        type: 'textarea',
        required: true,
        minLength: 200,
        maxLength: 400,
        placeholder: 'Describe the primary constraint limiting your organization\'s growth or effectiveness...',
      },
      {
        id: 'q34_partner_help',
        text: 'If you had a trusted strategic partner working alongside you for the next 12 months, what would you most want them to help with?',
        type: 'textarea',
        required: true,
        minLength: 200,
        maxLength: 400,
        placeholder: 'What kind of support would make the biggest difference for your organization...',
      },
      {
        id: 'q35_breakthrough_year',
        text: 'What would have to be true for the next 12 months to feel like a breakthrough year for your organization?',
        type: 'textarea',
        required: true,
        minLength: 200,
        maxLength: 400,
        placeholder: 'Define what success looks like for your organization over the next year...',
      },
      {
        id: 'q36_investment_capacity',
        text: 'If you identified the right strategic and operational support, what level of monthly investment could your organization sustain for 12 months?',
        type: 'radio',
        required: true,
        options: [
          { value: 'under_5k', label: 'Under $5,000/month' },
          { value: '5k_7500', label: '$5,000–$7,500/month' },
          { value: '7500_15k', label: '$7,500–$15,000/month' },
          { value: '15k_plus', label: '$15,000+/month' },
          { value: 'unsure', label: 'Unsure—depends on expected value' },
        ],
      },
      {
        id: 'q37_timeline',
        text: 'How soon are you looking to address the challenges surfaced in this diagnostic?',
        type: 'radio',
        required: true,
        options: [
          { value: 'immediately', label: 'Immediately—this is urgent' },
          { value: '1_3_months', label: 'Within the next 1–3 months' },
          { value: '3_6_months', label: 'Within the next 3–6 months' },
          { value: 'exploring', label: 'Exploring options, no specific timeline' },
        ],
      },
      {
        id: 'q38_next_step',
        text: 'What would be most valuable as a next step?',
        type: 'radio',
        required: true,
        options: [
          { value: 'report_only', label: 'A detailed diagnostic report based on my responses' },
          { value: 'conversation', label: 'A conversation to discuss findings and potential fit' },
          { value: 'both', label: 'Both—report first, then conversation' },
          { value: 'just_report', label: 'Just the report—I\'m not ready for a conversation' },
        ],
      },
    ],
  },
];

export const TOTAL_SECTIONS = sections.length;
export const DIAGNOSTIC_SECTIONS = sections.slice(1); // Sections after contact info
