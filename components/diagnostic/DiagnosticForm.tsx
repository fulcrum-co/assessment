'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sections, TOTAL_SECTIONS } from '@/lib/questions';
import { Button, ProgressBar } from '@/components/ui';
import Section from './Section';

// Form state types
interface FormState {
  currentSection: number;
  responses: Record<string, unknown>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitError: string | null;
}

type FormAction =
  | { type: 'SET_RESPONSE'; questionId: string; value: unknown }
  | { type: 'NEXT_SECTION' }
  | { type: 'PREV_SECTION' }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'CLEAR_ERROR'; questionId: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'LOAD_SAVED'; responses: Record<string, unknown>; currentSection: number };

const STORAGE_KEY = 'fulcrum_diagnostic_progress';

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_RESPONSE':
      return {
        ...state,
        responses: { ...state.responses, [action.questionId]: action.value },
        errors: { ...state.errors, [action.questionId]: '' },
      };
    case 'NEXT_SECTION':
      return { ...state, currentSection: state.currentSection + 1 };
    case 'PREV_SECTION':
      return { ...state, currentSection: Math.max(0, state.currentSection - 1) };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'CLEAR_ERROR':
      return { ...state, errors: { ...state.errors, [action.questionId]: '' } };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, submitError: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false };
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, submitError: action.error };
    case 'LOAD_SAVED':
      return { ...state, responses: action.responses, currentSection: action.currentSection };
    default:
      return state;
  }
}

const initialState: FormState = {
  currentSection: 0,
  responses: {
    q23_work_distribution: {
      fullTime: 0,
      partTime: 0,
      external: 0,
      leadership: 0,
    },
  },
  errors: {},
  isSubmitting: false,
  submitError: null,
};

export default function DiagnosticForm() {
  const router = useRouter();
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { responses, currentSection } = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVED', responses, currentSection });
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          responses: state.responses,
          currentSection: state.currentSection,
        })
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [state.responses, state.currentSection]);

  const currentSectionData = sections[state.currentSection];
  const isFirstSection = state.currentSection === 0;
  const isLastSection = state.currentSection === TOTAL_SECTIONS - 1;

  // Calculate starting question number for current section
  const getStartingQuestionNumber = useCallback(() => {
    if (state.currentSection === 0) return undefined; // Contact section has no numbers
    let count = 0;
    for (let i = 1; i < state.currentSection; i++) {
      count += sections[i].questions.length;
    }
    return count + 1;
  }, [state.currentSection]);

  const validateSection = useCallback(() => {
    const errors: Record<string, string> = {};
    const section = sections[state.currentSection];

    for (const question of section.questions) {
      const value = state.responses[question.id];

      // Required validation
      if (question.required) {
        if (question.type === 'checkbox') {
          if (!value || (value as string[]).length === 0) {
            errors[question.id] = 'Please select at least one option';
          }
        } else if (question.type === 'percentage_group') {
          const dist = value as Record<string, number>;
          const total = Object.values(dist || {}).reduce((sum, v) => sum + (v || 0), 0);
          if (total !== 100) {
            errors[question.id] = 'Percentages must add up to 100%';
          }
        } else if (question.type === 'textarea') {
          const text = (value as string) || '';
          if (!text.trim()) {
            errors[question.id] = 'This field is required';
          } else if (question.minLength && text.length < question.minLength) {
            errors[question.id] = `Please provide at least ${question.minLength} characters`;
          }
        } else if (!value || (typeof value === 'string' && !value.trim())) {
          errors[question.id] = 'This field is required';
        }
      }

      // Email validation
      if (question.id === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value as string)) {
          errors[question.id] = 'Please enter a valid email address';
        }
      }

      // Max length validation for textarea
      if (question.type === 'textarea' && question.maxLength && value) {
        if ((value as string).length > question.maxLength) {
          errors[question.id] = `Please keep your response under ${question.maxLength} characters`;
        }
      }
    }

    return errors;
  }, [state.currentSection, state.responses]);

  const handleNext = useCallback(() => {
    const errors = validateSection();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      // Scroll to first error
      const firstErrorId = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorId}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (isLastSection) {
      handleSubmit();
    } else {
      dispatch({ type: 'NEXT_SECTION' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [validateSection, isLastSection]);

  const handlePrev = useCallback(() => {
    dispatch({ type: 'PREV_SECTION' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async () => {
    dispatch({ type: 'SUBMIT_START' });

    try {
      // Structure the responses according to API expectations
      const formattedResponses = {
        contact: {
          name: state.responses.name as string,
          email: state.responses.email as string,
          companyName: state.responses.companyName as string,
          role: state.responses.role as string,
        },
        context: {
          q1_revenue: state.responses.q1_revenue,
          q2_team_size: state.responses.q2_team_size,
          q3_org_stage: state.responses.q3_org_stage,
          q4_interest_drivers: state.responses.q4_interest_drivers,
        },
        strategy: {
          q5_decision_behavior: state.responses.q5_decision_behavior,
          q6_alignment: state.responses.q6_alignment,
          q7_abandoned_initiatives: state.responses.q7_abandoned_initiatives,
          q8_stall_causes: state.responses.q8_stall_causes,
          q9_stalled_priority: state.responses.q9_stalled_priority,
        },
        execution: {
          q10_post_planning: state.responses.q10_post_planning,
          q11_translation_responsibility: state.responses.q11_translation_responsibility,
          q12_work_connection: state.responses.q12_work_connection,
          q13_progress_tracking: state.responses.q13_progress_tracking,
          q14_infrastructure: state.responses.q14_infrastructure || [],
          q15_breakdown_points: state.responses.q15_breakdown_points,
        },
        operations: {
          q16_documentation: state.responses.q16_documentation,
          q17_onboarding: state.responses.q17_onboarding,
          q18_tool_count: state.responses.q18_tool_count,
          q19_tech_confidence: state.responses.q19_tech_confidence,
          q20_tech_value: state.responses.q20_tech_value,
        },
        capacity: {
          q21_capacity: state.responses.q21_capacity,
          q22_new_capacity: state.responses.q22_new_capacity,
          q23_work_distribution: state.responses.q23_work_distribution,
          q24_capability_gaps: state.responses.q24_capability_gaps || [],
          q25_founder_time: state.responses.q25_founder_time,
        },
        advisory: {
          q26_previous_engagement: state.responses.q26_previous_engagement,
          q27_experience_outcomes: state.responses.q27_experience_outcomes || [],
          q28_different_engagement: state.responses.q28_different_engagement || '',
        },
        leverage: {
          q29_market_clarity: state.responses.q29_market_clarity,
          q30_adjacent_markets: state.responses.q30_adjacent_markets,
          q31_partnerships: state.responses.q31_partnerships,
          q32_leverage_source: state.responses.q32_leverage_source,
        },
        readiness: {
          q33_constraint: state.responses.q33_constraint,
          q34_partner_help: state.responses.q34_partner_help,
          q35_breakthrough_year: state.responses.q35_breakthrough_year,
          q36_investment_capacity: state.responses.q36_investment_capacity,
          q37_timeline: state.responses.q37_timeline,
          q38_next_step: state.responses.q38_next_step,
        },
      };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedResponses),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit diagnostic');
      }

      const data = await response.json();

      // Clear saved progress
      localStorage.removeItem(STORAGE_KEY);

      // Store PDF data for download on complete page
      if (data.pdfBase64) {
        localStorage.setItem('fulcrum_report_pdf', JSON.stringify({
          id: data.id,
          pdfBase64: data.pdfBase64,
          companyName: data.companyName,
        }));
      }

      dispatch({ type: 'SUBMIT_SUCCESS' });

      // Navigate to completion page
      router.push(`/diagnostic/complete?id=${data.id}`);
    } catch (error) {
      dispatch({
        type: 'SUBMIT_ERROR',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-[#1a1a1a]">
              Organizational Leverage Diagnostic
            </h1>
          </div>
          <ProgressBar current={state.currentSection + 1} total={TOTAL_SECTIONS} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-32">
        <Section
          section={currentSectionData}
          values={state.responses}
          errors={state.errors}
          onChange={(questionId, value) =>
            dispatch({ type: 'SET_RESPONSE', questionId, value })
          }
          startingQuestionNumber={getStartingQuestionNumber()}
        />
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {state.submitError && (
            <div className="mb-4 p-4 bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-lg">
              <p className="text-sm text-[#dc2626]">{state.submitError}</p>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={isFirstSection || state.isSubmitting}
              className={isFirstSection ? 'invisible' : ''}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              isLoading={state.isSubmitting}
              className="min-w-[140px]"
            >
              {isLastSection ? 'Submit Diagnostic' : 'Continue'}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
