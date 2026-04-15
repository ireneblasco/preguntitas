import { Text, StyleSheet, Pressable, View } from 'react-native';
import { FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const ARROW_ICON_SIZE = 44;

export type MomentOption = { id: string; name: string; emoji: string };

const CARD_HEIGHT_COLLAPSED = 96;
const CARD_HEIGHT_EXPANDED = 120;

type MomentCardProps = {
  option: MomentOption;
  theme: { bg: string; text: string };
  subtitleLabel: string;
  isExpanded: boolean;
  onStart: () => void;
};

export function MomentCard({
  option,
  theme,
  subtitleLabel,
  isExpanded,
  onStart,
}: MomentCardProps) {
  const { t } = useTranslation();
  const showExpanded = isExpanded || true;
  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: theme.bg,
          height: showExpanded ? CARD_HEIGHT_EXPANDED : CARD_HEIGHT_COLLAPSED,
        },
      ]}
      onPress={onStart}
      accessibilityLabel={`${option.name}, ${subtitleLabel}`}
      accessibilityRole="button"
      accessibilityHint={t('home.start')}
    >
      <View style={styles.cardContent}>
        {/* Top row: category name (left) + arrow (visual only) */}
        <View style={styles.headerRow}>
          <Text
            style={[styles.categoryTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {option.name}
          </Text>
          {showExpanded && (
            <View style={styles.arrowButton}>
              <Text style={[styles.arrowIcon, { color: theme.text }]}>↗</Text>
            </View>
          )}
        </View>
        {/* Emotional/experiential label */}
        <Text
          style={[styles.cardSubtitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {subtitleLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  categoryTitle: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    lineHeight: FONT_SIZES.xl * 1.28,
    textAlign: 'left',
    includeFontPadding: false,
    marginRight: SPACING.sm,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    lineHeight: FONT_SIZES.sm * 1.35,
    textAlign: 'left',
    opacity: 0.9,
    includeFontPadding: false,
  },
  arrowButton: {
    width: ARROW_ICON_SIZE,
    height: ARROW_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 22,
    color: '#FFF',
    lineHeight: 22,
    includeFontPadding: false,
  },
});
