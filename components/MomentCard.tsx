import { Text, StyleSheet, Pressable, View, Image, type ImageSourcePropType } from 'react-native';
import { FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

export type MomentOption = { id: string; name: string; emoji: string };

const ARROW_ICON_SIZE = 36;
const CARD_HEIGHT = 98;

/** Neutro estilo iOS (systemGray6 + chevron de lista). */
const IOS_GROUPED_FILL = '#F2F2F7';
const IOS_LIST_CHEVRON = '#2C2C2E';

/** Etiqueta NEW: visible y acorde al radio de la tarjeta en la esquina. */
const NEW_BADGE_BG = '#E8456B';

const HOME_CARD_STYLES = [
  {
    cardBg: '#FFFFFF',
    title: '#1C1C1E',
    subtitle: 'rgba(60, 60, 67, 0.6)',
    emblemBg: IOS_GROUPED_FILL,
    emblemText: '#1C1C1E',
  },
] as const;

type MomentCardProps = {
  option: MomentOption;
  index: number;
  subtitleLabel: string;
  badgeLabel?: string;
  onStart: () => void;
  /** Optional icon tile colors (e.g. category theme on Explore home). */
  emblemBg?: string;
  emblemFg?: string;
  titleColor?: string;
  subtitleColor?: string;
  arrowCircleBg?: string;
  emblemImage?: ImageSourcePropType;
};

export function MomentCard({
  option,
  index,
  subtitleLabel,
  badgeLabel,
  onStart,
  emblemBg,
  emblemFg,
  titleColor,
  subtitleColor,
  arrowCircleBg,
  emblemImage,
}: MomentCardProps) {
  const { t } = useTranslation();
  const visualTheme = HOME_CARD_STYLES[index % HOME_CARD_STYLES.length];
  const resolvedEmblemBg = emblemBg ?? visualTheme.emblemBg;
  const resolvedEmblemFg = emblemFg ?? visualTheme.emblemText;
  const resolvedTitle = titleColor ?? visualTheme.title;
  const resolvedSubtitle = subtitleColor ?? visualTheme.subtitle;
  const resolvedArrowBg = arrowCircleBg ?? '#F8F8FA';
  const useEmblemImage = emblemImage != null;
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
        <View
          style={[
            styles.emblemWrap,
            useEmblemImage ? styles.emblemWrapImageTile : { backgroundColor: resolvedEmblemBg },
            !useEmblemImage && emblemBg != null && styles.emblemWrapThemed,
          ]}
        >
          {useEmblemImage ? (
            <Image source={emblemImage} style={styles.emblemImage} resizeMode="cover" />
          ) : (
            <Text style={[styles.emblemText, { color: resolvedEmblemFg }]}>{option.emoji || '✨'}</Text>
          )}
        </View>
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={[styles.categoryTitle, { color: resolvedTitle }]} numberOfLines={1}>
              {option.name}
            </Text>
          </View>
          <Text style={[styles.cardSubtitle, { color: resolvedSubtitle }]} numberOfLines={1}>
            {subtitleLabel}
          </Text>
        </View>
        <View style={[styles.arrowButton, { backgroundColor: resolvedArrowBg }]}>
          <Text style={[styles.arrowIcon, { color: IOS_LIST_CHEVRON }]}>→</Text>
        </View>
      </View>
      {badgeLabel ? (
        <View style={styles.badgeCorner}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {badgeLabel}
          </Text>
        </View>
      ) : null}
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
    borderWidth: 1,
    borderColor: '#ECECF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
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
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(60, 60, 67, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emblemWrapThemed: {
    borderWidth: 0,
  },
  /** Imagen con fondo propio (p. ej. squircle naranja): sin relleno gris detrás, a tamaño completo del tile. */
  emblemWrapImageTile: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    padding: 0,
  },
  emblemText: {
    fontSize: 28,
    lineHeight: 32,
  },
  emblemImage: {
    width: '100%',
    height: '100%',
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
  badgeCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: NEW_BADGE_BG,
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    paddingTop: 6,
    paddingRight: 10,
    paddingBottom: 6,
    paddingLeft: 12,
    shadowColor: NEW_BADGE_BG,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONTS.inter.bold,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
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
    backgroundColor: IOS_GROUPED_FILL,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(60, 60, 67, 0.12)',
    marginLeft: SPACING.sm,
  },
  arrowIcon: {
    fontSize: 19,
    lineHeight: 19,
    fontWeight: '800',
  },
});
