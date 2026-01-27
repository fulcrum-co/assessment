import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { DimensionScores } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import { STAGE_BENCHMARKS } from '@/lib/types/scores';
import { Heading, Paragraph, Quote, Table, Card, Divider, commonStyles, colors } from '../primitives';

interface LeverageComparativeProps {
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
  benchmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  benchmarkLabel: {
    flex: 2,
    fontSize: 9,
  },
  benchmarkValue: {
    flex: 1,
    fontSize: 9,
    textAlign: 'center',
  },
  benchmarkGap: {
    flex: 1,
    fontSize: 9,
    textAlign: 'center',
    fontFamily: 'Satoshi', fontWeight: 700,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.error,
  },
  synthesisBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 4,
    marginTop: 16,
  },
});

export default function LeverageComparative({ scores, content }: LeverageComparativeProps) {
  const { leverageOpportunity, comparative } = content;

  const benchmarkData = [
    {
      dimension: 'Strategic Clarity',
      score: scores.strategicClarity.score,
      maxScore: scores.strategicClarity.maxScore,
      benchmark: STAGE_BENCHMARKS.strategicClarity,
    },
    {
      dimension: 'Execution Capability',
      score: scores.executionGap.score,
      maxScore: scores.executionGap.maxScore,
      benchmark: STAGE_BENCHMARKS.executionGap,
    },
    {
      dimension: 'Operational Maturity',
      score: scores.operationalMaturity.score,
      maxScore: scores.operationalMaturity.maxScore,
      benchmark: STAGE_BENCHMARKS.operationalMaturity,
    },
    {
      dimension: 'Capacity Model',
      score: scores.capacityModel.score,
      maxScore: scores.capacityModel.maxScore,
      benchmark: STAGE_BENCHMARKS.capacityModel,
    },
    {
      dimension: 'Leverage Opportunity',
      score: scores.leverageOpportunity.score,
      maxScore: scores.leverageOpportunity.maxScore,
      benchmark: STAGE_BENCHMARKS.leverageOpportunity,
    },
  ];

  return (
    <Page size="A4" style={commonStyles.page}>
      {/* Leverage Opportunity Section */}
      <View style={commonStyles.section}>
        <View style={styles.dimensionHeader}>
          <Heading level={2}>Leverage Opportunity Assessment</Heading>
          <View style={styles.scoreDisplay}>
            <Text style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14 }}>
              {scores.leverageOpportunity.score}/{scores.leverageOpportunity.maxScore}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={{ fontSize: 9, fontFamily: 'Satoshi', fontWeight: 700 }}>
                {scores.leverageOpportunity.status}
              </Text>
            </View>
          </View>
        </View>

        <Paragraph>{leverageOpportunity.interpretation.opening}</Paragraph>

        {leverageOpportunity.interpretation.details.map((detail, index) => (
          <Paragraph key={index}>{detail}</Paragraph>
        ))}

        <Card>
          <Heading level={4}>Market Position</Heading>
          <Paragraph>{leverageOpportunity.marketPositionAnalysis}</Paragraph>
        </Card>

        <Card>
          <Heading level={4}>Adjacent Markets</Heading>
          <Paragraph>{leverageOpportunity.adjacentMarketAnalysis}</Paragraph>
        </Card>

        <Card>
          <Heading level={4}>Strategic Partnerships</Heading>
          <Paragraph>{leverageOpportunity.partnershipAnalysis}</Paragraph>
        </Card>

        {leverageOpportunity.leverageSourceQuote && (
          <View style={{ marginTop: 12 }}>
            <Text style={commonStyles.small}>
              When asked where leverage would come from if you could double output without doubling costs:
            </Text>
            <Quote>"{leverageOpportunity.leverageSourceQuote}"</Quote>
          </View>
        )}

        <Text style={[commonStyles.body, {  marginTop: 8 }]}>
          {leverageOpportunity.interpretation.implications}
        </Text>
      </View>

      <Divider />

      {/* Comparative Profile Section */}
      <View style={commonStyles.section}>
        <Heading level={2}>Comparative Profile</Heading>

        <Card>
          <Heading level={4}>Benchmark Comparison</Heading>
          <Text style={[commonStyles.small, { marginBottom: 8 }]}>
            Benchmarks based on organizations at similar revenue stage.
          </Text>

          {/* Header Row */}
          <View style={[styles.benchmarkRow, { backgroundColor: colors.surface }]}>
            <Text style={[styles.benchmarkLabel, { fontFamily: 'Satoshi', fontWeight: 700 }]}>Dimension</Text>
            <Text style={[styles.benchmarkValue, { fontFamily: 'Satoshi', fontWeight: 700 }]}>Your Score</Text>
            <Text style={[styles.benchmarkValue, { fontFamily: 'Satoshi', fontWeight: 700 }]}>Benchmark</Text>
            <Text style={[styles.benchmarkGap, { fontFamily: 'Satoshi', fontWeight: 700 }]}>Gap</Text>
          </View>

          {/* Data Rows */}
          {benchmarkData.map((item, index) => {
            const gap = item.score - item.benchmark;
            const gapDisplay = gap >= 0 ? `+${gap}` : `${gap}`;
            return (
              <View key={index} style={styles.benchmarkRow}>
                <Text style={styles.benchmarkLabel}>{item.dimension}</Text>
                <Text style={styles.benchmarkValue}>
                  {item.score}/{item.maxScore}
                </Text>
                <Text style={styles.benchmarkValue}>
                  {item.benchmark}/{item.maxScore}
                </Text>
                <Text style={[styles.benchmarkGap, gap >= 0 ? styles.positive : styles.negative]}>
                  {gapDisplay}
                </Text>
              </View>
            );
          })}
        </Card>

        <Text style={[commonStyles.body, { marginTop: 12 }]}>
          {comparative.benchmarkAnalysis}
        </Text>

        {/* Pattern Synthesis */}
        <View style={styles.synthesisBox}>
          <Heading level={4}>Pattern Synthesis</Heading>
          {comparative.patternSynthesis.split('\n\n').map((paragraph, index) => (
            <Paragraph key={index}>{paragraph}</Paragraph>
          ))}
        </View>
      </View>

      {/* Page Number */}
      <Text style={commonStyles.pageNumber}>4</Text>
    </Page>
  );
}
