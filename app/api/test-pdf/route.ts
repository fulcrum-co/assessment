import { NextResponse } from 'next/server';
import { calculateAllScores } from '@/lib/scoring';
import { detectPatterns } from '@/lib/scoring/patterns';
import { generateReportContent } from '@/lib/content';
import { generateReport } from '@/lib/pdf/generate';
import { DiagnosticResponses } from '@/lib/types/diagnostic';

// Sample data for testing PDF generation
const sampleResponses: DiagnosticResponses = {
  contact: {
    name: 'Test User',
    email: 'test@example.com',
    companyName: 'Sample Company Inc',
    role: 'CEO',
  },
  context: {
    q1_revenue: '2m_5m',
    q2_team_size: '16_30',
    q3_org_stage: 'leadership_exists',
    q4_interest_drivers: ['scaling_operations', 'improving_efficiency'],
  },
  strategy: {
    q5_decision_behavior: 'debates_sometimes',
    q6_alignment: 'overlapping_gaps',
    q7_abandoned_initiatives: '3_5',
    q8_stall_causes: ['competing_priorities', 'resource_constraints'],
    q9_stalled_priority: 'We wanted to implement a new CRM system but kept getting pulled into client work.',
  },
  execution: {
    q10_post_planning: 'some_progress',
    q11_translation_responsibility: 'same_people',
    q12_work_connection: 'loose',
    q13_progress_tracking: 'leadership_notices',
    q14_infrastructure: ['project_management', 'communication_tools'],
    q15_breakdown_points: ['handoff_points', 'accountability'],
  },
  operations: {
    q16_documentation: 'some_exists',
    q17_onboarding: 'some_plus_shadow',
    q18_tool_count: '6_10',
    q19_tech_confidence: 'somewhat_confident',
    q20_tech_value: '50_75',
  },
  capacity: {
    q21_capacity: 'stretched',
    q22_new_capacity: 'team_absorbs',
    q23_work_distribution: {
      fullTime: 60,
      partTime: 15,
      external: 10,
      leadership: 15,
    },
    q24_capability_gaps: ['operations_management', 'project_management'],
    q25_founder_time: 'mixed',
  },
  advisory: {
    q26_previous_engagement: 'once_twice',
    q27_experience_outcomes: ['some_value', 'learned_preferences'],
    q28_different_engagement: 'Would prefer more hands-on implementation support rather than just advice.',
  },
  leverage: {
    q29_market_clarity: 'somewhat_clearly',
    q30_adjacent_markets: 'identified_not_acted',
    q31_partnerships: 'identified_not_prioritized',
    q32_leverage_source: 'Our proprietary methodology and client relationships are our biggest assets.',
  },
  readiness: {
    q33_constraint: 'Time and bandwidth to implement new systems while maintaining client work.',
    q34_partner_help: 'Help us build systems that run without constant oversight.',
    q35_breakthrough_year: 'Breaking the $5M revenue ceiling while maintaining margins.',
    q36_investment_capacity: '7500_15k',
    q37_timeline: '1_3_months',
    q38_next_step: 'both',
  },
};

export async function GET() {
  try {
    // Calculate scores
    const scores = calculateAllScores(sampleResponses);

    // Detect patterns
    const patterns = detectPatterns(sampleResponses, scores);

    // Generate report content
    const content = generateReportContent(sampleResponses, scores, patterns);

    // Generate PDF
    const pdfBuffer = await generateReport(
      sampleResponses.contact,
      sampleResponses,
      scores,
      patterns,
      content
    );

    // Return PDF as download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-report.pdf"',
      },
    });
  } catch (error) {
    console.error('Test PDF generation error:', error);
    return NextResponse.json(
      {
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
