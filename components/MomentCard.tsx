import { Text, StyleSheet, Pressable, View } from 'react-native';
import { FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

export type MomentOption = { id: string; name: string; emoji: string };

const CARD_HEIGHT_COLLAPSED = 100;
const CARD_HEIGHT_EXPANDED = 136;

type MomentCardProps = {
  option: MomentOption;
  theme: { bg: string; text: string };
  questionCount: number;
  isExpanded: boolean;
  onPress: () => void;
  onStart: () => void;
};

export function MomentCard({
  option,
  theme,
  questionCount,
  isExpanded,
  onPress,
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
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        {/* Top row: tag pill (left) + Start button (right), iOS style */}
        <View style={styles.headerRow}>
          <View style={[styles.tagPill, { borderColor: theme.text, backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <Text style={[styles.tagText, { color: theme.text }]} numberOfLines={1}>
              {option.emoji} {option.name}
            </Text>
          </View>
          {showExpanded && (
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startButtonPressed,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              <Text style={styles.startButtonText} allowFontScaling>
                {t('home.start')}
              </Text>
            </Pressable>
          )}
        </View>
        {/* Title: same left edge as card padding */}
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={isExpanded ? 2 : 1}
        >
          {option.name}
        </Text>
        {/* Subtitle: same left alignment as title */}
        <Text
          style={[styles.cardSubtitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {questionCount} {t('home.questionsLabel')}
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
  tagPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
    lineHeight: FONT_SIZES.xs * 1.35,
    textAlign: 'left',
    includeFontPadding: false,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.playfair.bold,
    lineHeight: FONT_SIZES.xl * 1.28,
    textAlign: 'left',
    marginBottom: SPACING.xs,
    includeFontPadding: false,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    lineHeight: FONT_SIZES.sm * 1.35,
    textAlign: 'left',
    opacity: 0.9,
    includeFontPadding: false,
  },
  startButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  startButtonPressed: { opacity: 0.9 },
  startButtonText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.sm * 1.25,
    fontFamily: FONTS.inter.regular,
    color: '#000',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
