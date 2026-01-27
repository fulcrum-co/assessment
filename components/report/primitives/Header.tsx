import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { getLogoPath } from '@/lib/pdf/fonts';
import { colors } from './styles';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 80,
    height: 'auto',
  },
  title: {
    fontSize: 8,
    color: colors.secondary,
    fontFamily: 'Helvetica',
  },
});

export default function Header({ title = 'Fulcrum Leverage Assessment', showLogo = true }: HeaderProps) {
  return (
    <View style={styles.header}>
      {showLogo && (
        <Image src={getLogoPath()} style={styles.logo} />
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
