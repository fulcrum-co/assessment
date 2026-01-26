import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { DimensionScores } from '@/lib/types/scores';
import { ReportContent } from '@/lib/types/report';
import { Heading, Paragraph, Card, Divider, ProgressBar, commonStyles, colors } from '../primitives';
import { HEALTHY_RANGES } from '@/lib/content/templates';

interface OperationsCapacityProps {
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
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distributionLabel: {
    width: 140,
    fontSize: 9,
  },
  distributionBar: {
    flex: 1,
    marginHorizontal: 8,
  },
  distributionValue: {
    width: 60,
    fontSize: 9,
    textAlign: 'right',
  },
  healthyRange: {
    fontSize: 8,
    color: colors.secondary,
  },
  warningBox: {
    backgroundColor: colors.warning + '20',
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    padding: 12,
    marginVertical: 12,
  },
});

export default function OperationsCapacity({ scores, content }: OperationsCapacityProps) {
  const { operationalMaturity, capacityModel } = content;

  const workDistribution = [
    {
      key: 'fullTime',
      label: 'Full-time employees',
      value: capacityModel.workDistribution.fullTime,
      range: HEALTHY_RANGES.fullTime,
    },
    {
      key: 'partTime',
      label: 'Part-time/contract',
      value: capacityModel.workDistribution.partTime,
      range: HEALTHY_RANGES.partTime,
    },
    {
      key: 'external',
      label: 'External partners',
      value: capacityModel.workDistribution.external,
      range: HEALTHY_RANGES.external,
    },
    {
      key: 'leadership',
      label: 'Leadership/founders',
      value: capacityModel.workDistribution.leadership,
      range: HEALTHY_RANGES.leadership,
    },
  ];

  const isOutOfRange = (value: number, range: { min: number; max: number }) => {
    return value < range.min || value > range.max;
  };

  return (
    <Page size="A4" style={commonStyles.page}>
      {/* Operational Maturity Section */}
      <View style={commonStyles.section}>
        <View style={styles.dimensionHeader}>
          <Heading level={2}>Operational Maturity Assessment</Heading>
          <View style={styles.scoreDisplay}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14 }}>
              {scores.operationalMaturity.score}/{scores.operationalMaturity.maxScore}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>
                {scores.operationalMaturity.status}
              </Text>
            </View>
          </View>
        </View>

        <Paragraph>{operationalMaturity.interpretation.opening}</Paragraph>

        {operationalMaturity.interpretation.details.map((detail, index) => (
          <Paragraph key={index}>{detail}</Paragraph>
        ))}

        <Card>
          <Heading level={4}>Process Documentation</Heading>
          <Paragraph>{operationalMaturity.documentationAnalysis}</Paragraph>
        </Card>

        <Card>
          <Heading level={4}>Technology Stack</Heading>
          <Paragraph>{operationalMaturity.techStackAnalysis}</Paragraph>
        </Card>

        {operationalMaturity.techSprawlWarning && (
          <View style={styles.warningBox}>
            <Text style={[commonStyles.body, { color: colors.warning }]}>
              {operationalMaturity.techSprawlWarning}
            </Text>
          </View>
        )}

        <Text style={[commonStyles.body, { fontStyle: 'italic', marginTop: 8 }]}>
          {operationalMaturity.interpretation.implications}
        </Text>
      </View>

      <Divider />

      {/* Capacity & Team Model Section */}
      <View style={commonStyles.section}>
        <View style={styles.dimensionHeader}>
          <Heading level={2}>Capacity & Team Model Assessment</Heading>
          <View style={styles.scoreDisplay}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14 }}>
              {scores.capacityModel.score}/{scores.capacityModel.maxScore}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>
                {scores.capacityModel.status}
              </Text>
            </View>
          </View>
        </View>

        <Paragraph>{capacityModel.interpretation.opening}</Paragraph>

        {capacityModel.interpretation.details.map((detail, index) => (
          <Paragraph key={index}>{detail}</Paragraph>
        ))}

        {/* Work Distribution */}
        <Card>
          <Heading level={4}>Work Distribution</Heading>
          <View style={{ marginTop: 12 }}>
            {workDistribution.map((item) => {
              const outOfRange = isOutOfRange(item.value, item.range);
              return (
                <View key={item.key} style={styles.distributionRow}>
                  <Text style={styles.distributionLabel}>{item.label}</Text>
                  <View style={styles.distributionBar}>
                    <ProgressBar
                      value={item.value}
                      max={100}
                      color={outOfRange ? colors.warning : colors.accent}
                    />
                  </View>
                  <View style={{ width: 80 }}>
                    <Text style={[styles.distributionValue, outOfRange ? { color: colors.warning } : {}]}>
                      {item.value}%
                    </Text>
                    <Text style={styles.healthyRange}>
                      ({item.range.min}-{item.range.max}%)
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <Text style={[commonStyles.small, { marginTop: 8 }]}>
            Healthy ranges shown in parentheses. Values outside ranges highlighted.
          </Text>
        </Card>

        {capacityModel.founderTrapWarning && (
          <View style={styles.warningBox}>
            <Heading level={4}>Critical Pattern: Founder Trap</Heading>
            <Text style={[commonStyles.body, { color: colors.warning }]}>
              {capacityModel.founderTrapWarning}
            </Text>
          </View>
        )}

        <Card>
          <Heading level={4}>Capability Gaps</Heading>
          <Paragraph>{capacityModel.capabilityGapAnalysis}</Paragraph>
        </Card>

        <Text style={[commonStyles.body, { fontStyle: 'italic', marginTop: 8 }]}>
          {capacityModel.interpretation.implications}
        </Text>
      </View>

      {/* Page Number */}
      <Text style={commonStyles.pageNumber}>3</Text>
    </Page>
  );
}
