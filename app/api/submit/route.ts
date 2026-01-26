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
    let report;
    try {
      report = await saveSubmission({
        contact: responses.contact,
        responses,
        scores,
        patterns,
        content,
      });
    } catch (storageError) {
      console.error('Storage error:', storageError);
      // Generate a temporary ID if storage fails
      report = {
        id: `temp-${Date.now()}`,
        contact: responses.contact,
        responses,
        scores,
        patterns,
        content,
        createdAt: new Date().toISOString(),
      };
    }

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

    // Return success response with PDF data for client-side download
    return NextResponse.json({
      success: true,
      id: report.id,
      overallScore: scores.overall,
      pdfBase64: pdfBuffer.length > 0 ? pdfBuffer.toString('base64') : null,
      companyName: responses.contact.companyName,
    });
  } catch (error) {
    console.error('Submission error:', error instanceof Error ? error.stack : error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
