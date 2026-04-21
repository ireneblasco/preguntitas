import { Text, StyleSheet, Pressable, View } from 'react-native';
import { FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

export type MomentOption = { id: string; name: string; emoji: string };

const ARROW_ICON_SIZE = 42;
const CARD_HEIGHT = 116;

const HOME_CARD_STYLES = [
  { cardBg: '#F1F5F3', title: '#244D45', subtitle: '#5D6D66', emblemBg: '#2D584F', emblemText: '#D9ED82', arrow: '#2D584F' },
  { cardBg: '#FBF4E8', title: '#D7773D', subtitle: '#7F7060', emblemBg: '#FCE29A', emblemText: '#F08051', arrow: '#D7773D' },
  { cardBg: '#E3F0EF', title: '#316D65', subtitle: '#5C726E', emblemBg: '#A2DBD0', emblemText: '#3E7C74', arrow: '#316D65' },
  { cardBg: '#F0E7ED', title: '#7A1F3B', subtitle: '#75606D', emblemBg: '#7A1F3B', emblemText: '#EFC9D6', arrow: '#7A1F3B' },
  { cardBg: '#F6E9F0', title: '#8E3B66', subtitle: '#7D6675', emblemBg: '#E9BFD0', emblemText: '#B74B7B', arrow: '#8E3B66' },
] as const;

type MomentCardProps = {
  option: MomentOption;
  index: number;
  subtitleLabel: string;
  onStart: () => void;
};

export function MomentCard({
  option,
  index,
  subtitleLabel,
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
          <Text style={[styles.categoryTitle, { color: visualTheme.title }]} numberOfLines={1}>
            {option.name}
          </Text>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
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
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emblemText: {
    fontSize: 36,
    lineHeight: 40,
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 34 / 2,
    lineHeight: 24,
    fontFamily: FONTS.inter.bold,
    fontWeight: '600',
    textAlign: 'left',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    lineHeight: 22,
    textAlign: 'left',
  },
  arrowButton: {
    width: ARROW_ICON_SIZE,
    height: ARROW_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    marginLeft: SPACING.sm,
  },
  arrowIcon: {
    fontSize: 22,
    lineHeight: 22,
  },
});
