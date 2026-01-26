import { StyleSheet } from '@react-pdf/renderer';

// Import font registration (side effect)
import '@/lib/pdf/fonts';

// Brand colors
export const colors = {
  primary: '#1a1a1a',
  secondary: '#6b7280',
  accent: '#2563eb',
  background: '#ffffff',
  surface: '#f9fafb',
  border: '#e5e7eb',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
};

// Common styles used across PDF components
export const commonStyles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Satoshi',
    fontSize: 10,
    color: colors.primary,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  h1: {
    fontSize: 24,
    fontFamily: 'Satoshi', fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  h2: {
    fontSize: 18,
    fontFamily: 'Satoshi', fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  h3: {
    fontSize: 14,
    fontFamily: 'Satoshi', fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
    marginTop: 12,
  },
  h4: {
    fontSize: 12,
    fontFamily: 'Satoshi', fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
    marginTop: 8,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.primary,
    marginBottom: 8,
  },
  small: {
    fontSize: 9,
    color: colors.secondary,
  },
  caption: {
    fontSize: 8,
    fontFamily: 'Satoshi', fontWeight: 'bold',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  quote: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    padding: 12,
    marginVertical: 12,
    fontStyle: 'italic',
  },
  table: {
    marginVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: colors.surface,
    fontFamily: 'Satoshi', fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  badge: {
    backgroundColor: colors.surface,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    fontSize: 8,
    fontFamily: 'Satoshi', fontWeight: 'bold',
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
    color: colors.success,
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
    color: colors.warning,
  },
  badgeError: {
    backgroundColor: '#fee2e2',
    color: colors.error,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    fontSize: 8,
    color: colors.secondary,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 32,
    right: 48,
    fontSize: 8,
    color: colors.secondary,
  },
  bulletList: {
    marginLeft: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
});
