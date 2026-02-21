import { Text, StyleSheet, Pressable, View } from 'react-native';
import { FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

export type MomentOption = { id: string; name: string; emoji: string };

const CARD_HEIGHT_COLLAPSED = 112;
const CARD_HEIGHT_EXPANDED = 160;

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
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={isExpanded ? 2 : 1}
        >
          {option.name}
        </Text>
        <View style={styles.tagsRow}>
          <View style={[styles.tagPill, { borderColor: theme.text }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>
              {option.emoji} {option.name}
            </Text>
          </View>
          <View style={[styles.tagPill, styles.countPill, { borderColor: theme.text }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>
              {questionCount}
            </Text>
          </View>
        </View>
        {(showExpanded || true) && (
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: theme.text },
                pressed && styles.startButtonPressed,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
                        <View style={styles.cardExpanded}>

              <Text
                style={[
                  styles.startButtonText,
                  { color: theme.bg, backgroundColor: 'red' },
                ]}
                allowFontScaling
              >
                {t('home.start')}
              </Text>
              </View>
            </Pressable>
        )}
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.playfair.bold,
    marginBottom: SPACING.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  tagPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  countPill: {
    minWidth: 28,
    alignItems: 'center',
  },
  tagText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
  },
  cardExpanded: {
    marginTop: SPACING.sm,
    alignItems: 'flex-end',
    minHeight: 40,
    justifyContent: 'center',
  },
  startButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonPressed: { opacity: 0.9 },
  startButtonText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.sm * 1.25,
    fontFamily: FONTS.inter.regular,
    color: 'black',
    includeFontPadding: false,
    minWidth: 100,
    minHeight: 40,
  },
});
