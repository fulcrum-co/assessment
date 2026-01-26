import { Document } from '@react-pdf/renderer';
import { ContactInfo, DiagnosticResponses } from '@/lib/types/diagnostic';
import { DimensionScores, DetectedPatterns } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import ExecutiveSummary from './pages/ExecutiveSummary';
import StrategyExecution from './pages/StrategyExecution';
import OperationsCapacity from './pages/OperationsCapacity';
import LeverageComparative from './pages/LeverageComparative';
import Recommendations from './pages/Recommendations';

interface ReportDocumentProps {
  contact: ContactInfo;
  responses: DiagnosticResponses;
  scores: DimensionScores;
  patterns: DetectedPatterns;
  content: ReportContent;
}

export default function ReportDocument({
  contact,
  scores,
  content,
}: ReportDocumentProps) {
  return (
    <Document
      title={`Fulcrum Leverage Assessment - ${contact.companyName}`}
      author="Fulcrum Collective"
      subject="Organizational Leverage Diagnostic Report"
      keywords="organizational leverage, diagnostic, strategy, execution"
    >
      <ExecutiveSummary contact={contact} scores={scores} content={content} />
      <StrategyExecution scores={scores} content={content} />
      <OperationsCapacity scores={scores} content={content} />
      <LeverageComparative scores={scores} content={content} />
      <Recommendations content={content} />
    </Document>
  );
}
