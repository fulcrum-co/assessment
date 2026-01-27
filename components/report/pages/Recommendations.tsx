import { Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import { ReportContent } from '@/lib/types/report';
import { Heading, Paragraph, BulletList, Card, Divider, commonStyles, colors } from '../primitives';
import { METHODOLOGY_NOTE, FOOTER_TEXT } from '@/lib/content/templates';

interface RecommendationsProps {
  content: ReportContent;
}

const styles = StyleSheet.create({
  recommendationCard: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  priorityBadge: {
    backgroundColor: colors.accent,
    color: colors.background,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 2,
    fontSize: 8,
    fontFamily: 'Helvetica', fontWeight: 700,
    marginRight: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  readinessBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 4,
    marginVertical: 12,
  },
  readinessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nextStepsBox: {
    backgroundColor: colors.accent + '10',
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 16,
    borderRadius: 4,
    marginVertical: 16,
  },
  methodologyBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 4,
    marginTop: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    textAlign: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default function Recommendations({ content }: RecommendationsProps) {
  const { recommendations, engagementReadiness, nextSteps } = content;

  return (
    <Page size="A4" style={commonStyles.page}>
      {/* Recommendations Section */}
      <View style={commonStyles.section}>
        <Heading level={2}>Your Strategic Priorities (Next 90 Days)</Heading>

        {recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Text style={styles.priorityBadge}>PRIORITY {rec.priority}</Text>
              <Text style={[commonStyles.h4, { marginBottom: 0, marginTop: 0 }]}>{rec.title}</Text>
            </View>
            <Paragraph>{rec.content}</Paragraph>
            <View style={{ marginTop: 8 }}>
              <Text style={[commonStyles.small, { fontFamily: 'Helvetica', fontWeight: 700, marginBottom: 4 }]}>
                Recommended Actions:
              </Text>
              <BulletList items={rec.actions} />
            </View>
          </View>
        ))}
      </View>

      <Divider />

      {/* Engagement Readiness Section */}
      <View style={commonStyles.section}>
        <Heading level={2}>Engagement Readiness Assessment</Heading>

        <View style={styles.readinessBox}>
          <View style={styles.readinessRow}>
            <Text style={commonStyles.small}>Investment Capacity:</Text>
            <Text style={[commonStyles.small, { fontFamily: 'Helvetica', fontWeight: 700 }]}>
              {engagementReadiness.capacity}
            </Text>
          </View>
          <View style={styles.readinessRow}>
            <Text style={commonStyles.small}>Timeline:</Text>
            <Text style={[commonStyles.small, { fontFamily: 'Helvetica', fontWeight: 700 }]}>
              {engagementReadiness.timeline}
            </Text>
          </View>
        </View>

        <Paragraph>{engagementReadiness.assessment}</Paragraph>
      </View>

      {/* Next Steps Section */}
      <View style={styles.nextStepsBox}>
        <Heading level={3}>Next Steps</Heading>
        <Paragraph>{nextSteps.content}</Paragraph>
        <Text style={[commonStyles.body, { fontFamily: 'Helvetica', fontWeight: 700, color: colors.accent }]}>
          {nextSteps.cta}
        </Text>
        <Link
          src="https://cal.com/fulcrumcollective/discovery-call"
          style={[commonStyles.body, { color: colors.accent, marginTop: 8, textDecoration: 'underline' }]}
        >
          Schedule a Discovery Call →
        </Link>
      </View>

      {/* Methodology Note */}
      <View style={styles.methodologyBox}>
        <Heading level={4}>About This Assessment</Heading>
        {METHODOLOGY_NOTE.split('\n\n').map((paragraph, index) => (
          <Text key={index} style={[commonStyles.small, { marginBottom: 4 }]}>{paragraph}</Text>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {FOOTER_TEXT.split('\n').map((line, index) => (
          <Text key={index} style={commonStyles.small}>{line}</Text>
        ))}
      </View>

      {/* Page Number */}
      <Text style={commonStyles.pageNumber}>5</Text>
    </Page>
  );
}
