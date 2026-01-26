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
    let pdfError: Error | null = null;
    try {
      console.log('Starting PDF generation...');
      pdfBuffer = await generateReport(
        responses.contact,
        responses,
        scores,
        patterns,
        content
      );
      console.log('PDF generated successfully, size:', pdfBuffer.length);
    } catch (err) {
      pdfError = err instanceof Error ? err : new Error(String(err));
      console.error('PDF generation failed:', pdfError.message, pdfError.stack);
      // Continue without PDF - don't fail the entire submission
      pdfBuffer = Buffer.from(''); // Empty buffer as fallback
    }

    // Send report email to user (even if PDF failed, send notification)
    if (process.env.RESEND_API_KEY) {
      try {
        // Only send report email with attachment if PDF was generated
        if (pdfBuffer.length > 0) {
          const emailResult = await sendReportEmail({
            contact: responses.contact,
            scores,
            reportId: report.id,
            pdfBuffer,
          });

          if (!emailResult.success) {
            console.error('Failed to send report email:', emailResult.error);
          } else {
            console.log('Report email sent successfully');
          }
        } else {
          console.warn('PDF was empty, skipping report email with attachment');
        }

        // Always send notification email to admin
        await sendNotificationEmail({
          contact: responses.contact,
          scores,
          reportId: report.id,
        });
        console.log('Notification email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError instanceof Error ? emailError.message : emailError);
        // Don't fail the submission if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not set, skipping emails');
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
