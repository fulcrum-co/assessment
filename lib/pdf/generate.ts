import { renderToBuffer } from '@react-pdf/renderer';
import { ContactInfo, DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import ReportDocument from '@/components/report/ReportDocument';
import { ensureFontsRegistered } from './fonts';

export async function generateReport(
  contact: ContactInfo,
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns,
  content: ReportContent
): Promise<Buffer> {
  // Ensure fonts are registered before generating PDF
  console.log('[PDF Generate] Starting PDF generation...');
  ensureFontsRegistered();

  try {
    const buffer = await renderToBuffer(
      ReportDocument({
        contact,
        responses,
        scores,
        patterns,
        content,
      })
    );

    console.log('[PDF Generate] PDF rendered successfully, buffer size:', buffer.length);
    return Buffer.from(buffer);
  } catch (error) {
    console.error('[PDF Generate] PDF rendering failed:', error);
    throw error;
  }
}
