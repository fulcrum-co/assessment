import { NextResponse } from 'next/server';
import { getSubmission } from '@/lib/storage/submissions';
import { generateReport } from '@/lib/pdf/generate';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the submission
    const submission = await getSubmission(id);

    if (!submission) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateReport(
      submission.contact,
      submission.responses,
      submission.scores,
      submission.patterns,
      submission.content
    );

    // Create filename
    const filename = `${submission.contact.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Diagnostic_Report.pdf`;

    // Return PDF as download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Report download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
