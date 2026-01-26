import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { DimensionScores } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import { Heading, Paragraph, Quote, Table, Card, Divider, StatusIcon, commonStyles, colors } from '../primitives';

interface StrategyExecutionProps {
  scores: DimensionScores;
  content: ReportContent;
}

const styles = StyleSheet.create({
  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    backgroundColor: colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  flowDiagram: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 4,
  },
  flowBox: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  flowBoxHighlight: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },
  flowArrow: {
    fontSize: 14,
    color: colors.secondary,
  },
  infrastructureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

export default function StrategyExecution({ scores, content }: StrategyExecutionProps) {
  const { strategicClarity, executionGap } = content;

  const infrastructureItems = [
    { key: 'writtenPlan', label: 'Written strategic plan (updated within 12 months)', checked: executionGap.infrastructureStatus.writtenPlan },
    { key: 'quarterlyObjectives', label: 'Documented quarterly objectives with clear owners', checked: executionGap.infrastructureStatus.quarterlyObjectives },
    { key: 'progressReview', label: 'Weekly/biweekly progress review rhythm', checked: executionGap.infrastructureStatus.progressReview },
    { key: 'metricsTracked', label: 'Defined metrics tracked against initiatives', checked: executionGap.infrastructureStatus.metricsTracked },
    { key: 'retrospectives', label: 'Regular retrospectives', checked: executionGap.infrastructureStatus.retrospectives },
  ];

  return (
    <Page size="A4" style={commonStyles.page}>
      {/* Strategic Clarity Section */}
      <View style={commonStyles.section}>
        <View style={styles.dimensionHeader}>
          <Heading level={2}>Strategic Clarity Assessment</Heading>
          <View style={styles.scoreDisplay}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14 }}>
              {scores.strategicClarity.score}/{scores.strategicClarity.maxScore}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>
                {scores.strategicClarity.status}
              </Text>
            </View>
          </View>
        </View>

        <Paragraph>{strategicClarity.interpretation.opening}</Paragraph>

        {strategicClarity.interpretation.details.map((detail, index) => (
          <Paragraph key={index}>{detail}</Paragraph>
        ))}

        <Card>
          <Heading level={4}>Decision-Making Pattern</Heading>
          <Paragraph>{strategicClarity.decisionBehaviorAnalysis}</Paragraph>
        </Card>

        <Card>
          <Heading level={4}>Leadership Alignment</Heading>
          <Paragraph>{strategicClarity.alignmentAnalysis}</Paragraph>
        </Card>

        <Card>
          <Heading level={4}>Initiative Persistence</Heading>
          <Paragraph>{strategicClarity.initiativeAnalysis}</Paragraph>
        </Card>

        {strategicClarity.stalledPriorityQuote && (
          <View style={{ marginTop: 12 }}>
            <Text style={commonStyles.small}>You described a strategic priority that didn't progress:</Text>
            <Quote>"{strategicClarity.stalledPriorityQuote}"</Quote>
          </View>
        )}

        <Text style={[commonStyles.body, { fontStyle: 'italic', marginTop: 8 }]}>
          {strategicClarity.interpretation.implications}
        </Text>
      </View>

      <Divider />

      {/* Execution Gap Section */}
      <View style={commonStyles.section}>
        <View style={styles.dimensionHeader}>
          <Heading level={2}>Execution Gap Assessment</Heading>
          <View style={styles.scoreDisplay}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14 }}>
              {scores.executionGap.score}/{scores.executionGap.maxScore}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>
                {scores.executionGap.status}
              </Text>
            </View>
          </View>
        </View>

        <Paragraph>{executionGap.interpretation.opening}</Paragraph>

        {executionGap.interpretation.details.map((detail, index) => (
          <Paragraph key={index}>{detail}</Paragraph>
        ))}

        {/* Strategy-to-Results Flow */}
        <Card>
          <Heading level={4}>Strategy-to-Results Flow</Heading>
          <View style={styles.flowDiagram}>
            <View style={styles.flowBox}>
              <Text style={{ fontSize: 8 }}>Strategy</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={styles.flowBox}>
              <Text style={{ fontSize: 8 }}>Operational</Text>
              <Text style={{ fontSize: 8 }}>Planning</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={styles.flowBox}>
              <Text style={{ fontSize: 8 }}>Daily Work</Text>
            </View>
            <Text style={styles.flowArrow}>→</Text>
            <View style={styles.flowBox}>
              <Text style={{ fontSize: 8 }}>Results</Text>
            </View>
          </View>
          <Text style={[commonStyles.small, { textAlign: 'center' }]}>{executionGap.breakdownPoint}</Text>
        </Card>

        {/* Infrastructure Status */}
        <Card>
          <Heading level={4}>Execution Infrastructure ({executionGap.infrastructureStatus.total}/5)</Heading>
          <View style={{ marginTop: 8 }}>
            {infrastructureItems.map((item) => (
              <View key={item.key} style={styles.infrastructureItem}>
                <StatusIcon checked={item.checked} />
                <Text style={{ fontSize: 9, flex: 1 }}>{item.label}</Text>
              </View>
            ))}
          </View>
          <Text style={[commonStyles.small, { marginTop: 12 }]}>
            {executionGap.infrastructureAnalysis}
          </Text>
        </Card>

        <Text style={[commonStyles.body, { fontStyle: 'italic', marginTop: 8 }]}>
          {executionGap.interpretation.implications}
        </Text>
      </View>

      {/* Page Number */}
      <Text style={commonStyles.pageNumber}>2</Text>
    </Page>
  );
}
