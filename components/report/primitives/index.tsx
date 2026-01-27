import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import { colors, commonStyles } from './styles';

// Heading components
export function Heading({ level, children }: { level: 1 | 2 | 3 | 4; children: React.ReactNode }) {
  const style = {
    1: commonStyles.h1,
    2: commonStyles.h2,
    3: commonStyles.h3,
    4: commonStyles.h4,
  }[level];

  return <Text style={style}>{children}</Text>;
}

// Paragraph component
export function Paragraph({ children, style }: { children: React.ReactNode; style?: Style }) {
  const styles = style ? [commonStyles.body, style] : commonStyles.body;
  return <Text style={styles}>{children}</Text>;
}

// Quote component
export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <View style={commonStyles.quote}>
      <Text style={commonStyles.body}>{children}</Text>
    </View>
  );
}

// Bullet list component
export function BulletList({ items }: { items: string[] }) {
  return (
    <View style={commonStyles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={commonStyles.bulletItem}>
          <Text style={commonStyles.bullet}>•</Text>
          <Text style={commonStyles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// Table component
interface TableColumn {
  key: string;
  header: string;
  width?: number;
}

interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

export function Table({ columns, data }: { columns: TableColumn[]; data: TableRow[] }) {
  const getCellStyle = (width?: number) => ({
    ...commonStyles.tableCell,
    ...(width ? { flex: 0, width } : {}),
  });

  return (
    <View style={commonStyles.table}>
      {/* Header */}
      <View style={[commonStyles.tableRow, commonStyles.tableHeader]}>
        {columns.map((col) => (
          <View key={col.key} style={getCellStyle(col.width)}>
            <Text style={{ fontFamily: 'Helvetica', fontWeight: 700, fontSize: 9 }}>{col.header}</Text>
          </View>
        ))}
      </View>
      {/* Body */}
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={commonStyles.tableRow}>
          {columns.map((col) => (
            <View key={col.key} style={getCellStyle(col.width)}>
              {typeof row[col.key] === 'string' || typeof row[col.key] === 'number' ? (
                <Text style={{ fontSize: 9 }}>{row[col.key]}</Text>
              ) : (
                row[col.key]
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// Score badge component
export function ScoreBadge({ score, maxScore, status }: { score: number; maxScore: number; status: string }) {
  const percentage = Math.round((score / maxScore) * 100);

  let badgeStyle = commonStyles.badge;
  if (percentage >= 70) {
    badgeStyle = { ...badgeStyle, ...commonStyles.badgeSuccess };
  } else if (percentage >= 40) {
    badgeStyle = { ...badgeStyle, ...commonStyles.badgeWarning };
  } else {
    badgeStyle = { ...badgeStyle, ...commonStyles.badgeError };
  }

  return (
    <View style={[commonStyles.row, { gap: 8 }]}>
      <Text style={{ fontSize: 11, fontFamily: 'Helvetica', fontWeight: 700 }}>
        {score}/{maxScore}
      </Text>
      <View style={badgeStyle}>
        <Text>{status}</Text>
      </View>
    </View>
  );
}

// Section divider
export function Divider() {
  return <View style={commonStyles.divider} />;
}

// Card component
export function Card({ children, style }: { children: React.ReactNode; style?: Style }) {
  const styles = style ? [commonStyles.card, style] : commonStyles.card;
  return <View style={styles}>{children}</View>;
}

// Progress bar (simplified for PDF)
export function ProgressBar({ value, max, color = colors.accent }: { value: number; max: number; color?: string }) {
  const percentage = Math.round((value / max) * 100);
  const localStyles = StyleSheet.create({
    container: {
      height: 8,
      backgroundColor: colors.surface,
      borderRadius: 4,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: color,
      width: `${percentage}%`,
      borderRadius: 4,
    },
  });

  return (
    <View style={localStyles.container}>
      <View style={localStyles.fill} />
    </View>
  );
}

// Check/X icon for infrastructure status
export function StatusIcon({ checked }: { checked: boolean }) {
  return (
    <Text style={{ color: checked ? colors.success : colors.error, fontSize: 12 }}>
      {checked ? '✓' : '✗'}
    </Text>
  );
}

export { colors, commonStyles };
