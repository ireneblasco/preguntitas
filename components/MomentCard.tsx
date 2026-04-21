import { Text, StyleSheet, Pressable, View } from 'react-native';
import { FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

export type MomentOption = { id: string; name: string; emoji: string };

const ARROW_ICON_SIZE = 36;
const CARD_HEIGHT = 98;

const HOME_CARD_STYLES = [
  // Break the Ice
  { cardBg: '#EAF6FF', title: '#0F5F7A', subtitle: '#4F7484', emblemBg: '#0B7E9E', emblemText: '#D6F6FF', arrow: '#0F5F7A' },
  // Drinks with Friends
  { cardBg: '#FBF4E8', title: '#D7773D', subtitle: '#7F7060', emblemBg: '#FCE29A', emblemText: '#F08051', arrow: '#D7773D' },
  // Go Deep
  { cardBg: '#E3F0EF', title: '#316D65', subtitle: '#5C726E', emblemBg: '#A2DBD0', emblemText: '#3E7C74', arrow: '#316D65' },
  // Date Night (ahora con colores de On the Road)
  { cardBg: '#F6E9F0', title: '#8E3B66', subtitle: '#7D6675', emblemBg: '#E9BFD0', emblemText: '#B74B7B', arrow: '#8E3B66' },
  // On the Road (ahora con colores de Ikigai)
  { cardBg: '#ECF5D6', title: '#2D584F', subtitle: '#63705A', emblemBg: '#EEF7B8', emblemText: '#2D584F', arrow: '#2D584F' },
  // Ikigai (ahora con colores de Date Night)
  { cardBg: '#F0E7ED', title: '#7A1F3B', subtitle: '#75606D', emblemBg: '#7A1F3B', emblemText: '#EFC9D6', arrow: '#7A1F3B' },
  // Grandparents
  { cardBg: '#F7EFE6', title: '#6A4A3B', subtitle: '#8A7164', emblemBg: '#F3D8BC', emblemText: '#6A4A3B', arrow: '#6A4A3B' },
] as const;

type MomentCardProps = {
  option: MomentOption;
  index: number;
  subtitleLabel: string;
  badgeLabel?: string;
  onStart: () => void;
};

export function MomentCard({
  option,
  index,
  subtitleLabel,
  badgeLabel,
  onStart,
}: MomentCardProps) {
  const { t } = useTranslation();
  const visualTheme = HOME_CARD_STYLES[index % HOME_CARD_STYLES.length];
  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: visualTheme.cardBg,
          height: CARD_HEIGHT,
        },
      ]}
      onPress={onStart}
      accessibilityLabel={`${option.name}, ${subtitleLabel}`}
      accessibilityRole="button"
      accessibilityHint={t('home.start')}
    >
      <View style={styles.cardContent}>
        <View style={[styles.emblemWrap, { backgroundColor: visualTheme.emblemBg }]}>
          <Text style={[styles.emblemText, { color: visualTheme.emblemText }]}>{option.emoji || '✨'}</Text>
        </View>
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={[styles.categoryTitle, { color: visualTheme.title }]} numberOfLines={1}>
              {option.name}
            </Text>
            {badgeLabel ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {badgeLabel}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.cardSubtitle, { color: visualTheme.subtitle }]} numberOfLines={1}>
            {subtitleLabel}
          </Text>
        </View>
        <View style={styles.arrowButton}>
          <Text style={[styles.arrowIcon, { color: visualTheme.arrow }]}>→</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emblemWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emblemText: {
    fontSize: 28,
    lineHeight: 32,
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
    fontFamily: FONTS.inter.bold,
    fontWeight: '600',
    textAlign: 'left',
    flexShrink: 1,
  },
  badge: {
    backgroundColor: '#FFE58F',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    color: '#8A5A00',
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    lineHeight: 18,
    textAlign: 'left',
  },
  arrowButton: {
    width: ARROW_ICON_SIZE,
    height: ARROW_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    marginLeft: SPACING.sm,
  },
  arrowIcon: {
    fontSize: 18,
    lineHeight: 18,
  },
});
