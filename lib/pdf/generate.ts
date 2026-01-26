import { renderToBuffer } from '@react-pdf/renderer';
import { ContactInfo, DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import ReportDocument from '@/components/report/ReportDocument';

export async function generateReport(
  contact: ContactInfo,
  responses: DiagnosticResponses,
  scores: DimensionScores,
  patterns: DetectedPatterns,
  content: ReportContent
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    ReportDocument({
      contact,
      responses,
      scores,
      patterns,
      content,
    })
  );

  return Buffer.from(buffer);
}
