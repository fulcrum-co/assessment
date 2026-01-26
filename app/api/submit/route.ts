import { NextResponse } from 'next/server';
import { diagnosticResponsesSchema } from '@/lib/validation/schema';
import { calculateAllScores } from '@/lib/scoring';
import { detectPatterns } from '@/lib/scoring/patterns';
import { generateReportContent } from '@/lib/content';
import { generateReport } from '@/lib/pdf/generate';
import { saveSubmission } from '@/lib/storage/submissions';
import { sendReportEmail, sendNotificationEmail } from '@/lib/email/send';
import { DiagnosticResponses } from '@/lib/types/diagnostic';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate the data
    const validationResult = diagnosticResponsesSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      console.error('Validation errors:', errors);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const responses: DiagnosticResponses = validationResult.data;

    // Calculate scores
    const scores = calculateAllScores(responses);

    // Detect patterns
    const patterns = detectPatterns(responses, scores);

    // Generate report content
    const content = generateReportContent(responses, scores, patterns);

    // Save submission to storage
    const report = await saveSubmission({
      contact: responses.contact,
      responses,
      scores,
      patterns,
      content,
    });

    // Generate PDF
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generateReport(
        responses.contact,
        responses,
        scores,
        patterns,
        content
      );
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      // Continue without PDF - don't fail the entire submission
      pdfBuffer = Buffer.from(''); // Empty buffer as fallback
    }

    // Send report email to user
    if (pdfBuffer.length > 0 && process.env.RESEND_API_KEY) {
      try {
        const emailResult = await sendReportEmail({
          contact: responses.contact,
          scores,
          reportId: report.id,
          pdfBuffer,
        });

        if (!emailResult.success) {
          console.error('Failed to send report email:', emailResult.error);
        }

        // Send notification email to admin
        await sendNotificationEmail({
          contact: responses.contact,
          scores,
          reportId: report.id,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the submission if email fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      id: report.id,
      overallScore: scores.overall,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
