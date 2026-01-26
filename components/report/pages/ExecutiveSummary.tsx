import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { ContactInfo } from '@/lib/types/diagnostic';
import { DimensionScores } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import { Heading, Paragraph, Quote, Table, Card, Divider, commonStyles, colors } from '../primitives';
import RadarChart from '../charts/RadarChart';
import { LOGO_PATH } from '@/lib/pdf/fonts';

interface ExecutiveSummaryProps {
  contact: ContactInfo;
  scores: DimensionScores;
  content: ReportContent;
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 80,
    height: 'auto',
  },
  scoreBox: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreNumber: {
    fontSize: 48,
    fontFamily: 'Satoshi', fontWeight: 'bold',
    color: colors.accent,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.secondary,
    marginTop: 4,
  },
  chartSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartContainer: {
    width: '45%',
  },
  tableContainer: {
    width: '50%',
  },
  findingCard: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
});

export default function ExecutiveSummary({ contact, scores, content }: ExecutiveSummaryProps) {
  const { executiveSummary } = content;

  const radarData = [
    { label: 'Strategic Clarity', value: scores.strategicClarity.score, maxValue: scores.strategicClarity.maxScore },
    { label: 'Execution', value: scores.executionGap.score, maxValue: scores.executionGap.maxScore },
    { label: 'Operations', value: scores.operationalMaturity.score, maxValue: scores.operationalMaturity.maxScore },
    { label: 'Capacity', value: scores.capacityModel.score, maxValue: scores.capacityModel.maxScore },
    { label: 'Advisory', value: Math.max(0, scores.advisoryReadiness.score), maxValue: scores.advisoryReadiness.maxScore },
    { label: 'Leverage', value: scores.leverageOpportunity.score, maxValue: scores.leverageOpportunity.maxScore },
  ];

  const dimensionTableData = [
    {
      dimension: 'Strategic Clarity',
      score: `${scores.strategicClarity.score}/${scores.strategicClarity.maxScore}`,
      status: scores.strategicClarity.status,
    },
    {
      dimension: 'Execution Capability',
      score: `${scores.executionGap.score}/${scores.executionGap.maxScore}`,
      status: scores.executionGap.status,
    },
    {
      dimension: 'Operational Maturity',
      score: `${scores.operationalMaturity.score}/${scores.operationalMaturity.maxScore}`,
      status: scores.operationalMaturity.status,
    },
    {
      dimension: 'Capacity & Team Model',
      score: `${scores.capacityModel.score}/${scores.capacityModel.maxScore}`,
      status: scores.capacityModel.status,
    },
    {
      dimension: 'Advisory Readiness',
      score: `${scores.advisoryReadiness.score}/${scores.advisoryReadiness.maxScore}`,
      status: scores.advisoryReadiness.status,
    },
    {
      dimension: 'Leverage Opportunity',
      score: `${scores.leverageOpportunity.score}/${scores.leverageOpportunity.maxScore}`,
      status: scores.leverageOpportunity.status,
    },
  ];

  return (
    <Page size="A4" style={commonStyles.page}>
      {/* Header with Logo */}
      <View style={styles.headerRow}>
        <Image src={LOGO_PATH} style={styles.logo} />
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={commonStyles.caption}>FULCRUM LEVERAGE ASSESSMENT</Text>
          <Text style={[commonStyles.h1, { marginTop: 8 }]}>{contact.companyName}</Text>
          <Text style={commonStyles.small}>
            Prepared for {contact.name} • {contact.role}
          </Text>
        </View>
      </View>

      {/* Overall Score */}
      <View style={styles.scoreBox}>
        <Text style={commonStyles.caption}>ORGANIZATIONAL LEVERAGE SCORE</Text>
        <Text style={styles.scoreNumber}>{executiveSummary.overallScore}</Text>
        <Text style={styles.scoreLabel}>out of 100</Text>
        <Text style={[commonStyles.body, { textAlign: 'center', marginTop: 12, maxWidth: 400 }]}>
          Your organization demonstrates{' '}
          <Text style={{ fontFamily: 'Satoshi', fontWeight: 'bold' }}>{executiveSummary.status}</Text>{' '}
          operational leverage, meaning your current structure{' '}
          <Text style={{ fontFamily: 'Satoshi', fontWeight: 'bold' }}>{executiveSummary.effectivenessStatement}</Text>{' '}
          the effort and resources you invest.
        </Text>
      </View>

      {/* Radar Chart and Dimension Table */}
      <View style={styles.chartSection}>
        <View style={styles.chartContainer}>
          <RadarChart data={radarData} size={180} />
        </View>
        <View style={styles.tableContainer}>
          <Text style={commonStyles.h4}>Diagnostic Profile</Text>
          <Table
            columns={[
              { key: 'dimension', header: 'Dimension', width: 140 },
              { key: 'score', header: 'Score', width: 50 },
              { key: 'status', header: 'Status', width: 60 },
            ]}
            data={dimensionTableData}
          />
        </View>
      </View>

      {/* Key Findings */}
      <View style={commonStyles.section}>
        <Heading level={2}>Key Findings</Heading>
        {executiveSummary.keyFindings.map((finding, index) => (
          <View key={index} style={styles.findingCard}>
            <Text style={commonStyles.h4}>{finding.title}</Text>
            <Paragraph>{finding.content}</Paragraph>
            {finding.quote && (
              <Quote>"{finding.quote}"</Quote>
            )}
            <Text style={[commonStyles.small, { marginTop: 8, fontStyle: 'italic' }]}>
              {finding.implication}
            </Text>
          </View>
        ))}
      </View>

      {/* Page Number */}
      <Text style={commonStyles.pageNumber}>1</Text>
    </Page>
  );
}
