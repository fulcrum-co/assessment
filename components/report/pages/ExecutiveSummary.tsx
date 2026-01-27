import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { ContactInfo } from '@/lib/types/diagnostic';
import { DimensionScores } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import { Heading, Paragraph, Quote, commonStyles, colors } from '../primitives';
import RadarChart from '../charts/RadarChart';
import { getLogoPath } from '@/lib/pdf/fonts';

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
    fontFamily: 'Helvetica', fontWeight: 700,
    color: colors.accent,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.secondary,
    marginTop: 4,
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: 24,
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

  return (
    <Page size="A4" style={commonStyles.page}>
      {/* Header with Logo */}
      <View style={styles.headerRow}>
        <Image src={getLogoPath()} style={styles.logo} />
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
          <Text style={{ fontFamily: 'Helvetica', fontWeight: 700 }}>{executiveSummary.status}</Text>{' '}
          operational leverage, meaning your current structure{' '}
          <Text style={{ fontFamily: 'Helvetica', fontWeight: 700 }}>{executiveSummary.effectivenessStatement}</Text>{' '}
          the effort and resources you invest.
        </Text>
      </View>

      {/* Radar Chart */}
      <View style={styles.chartSection}>
        <Text style={commonStyles.h4}>Diagnostic Profile</Text>
        <RadarChart data={radarData} size={280} />
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
            <Text style={[commonStyles.small, { marginTop: 8,  }]}>
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
