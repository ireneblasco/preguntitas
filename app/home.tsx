import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  LayoutChangeEvent,
  ImageBackground,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useRef, useCallback } from 'react';
import { FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, sortMomentOptions, getCategoryDisplayName } from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useTranslation } from '../hooks/useTranslation';
import { MomentCard } from '../components/MomentCard';
import { MainTabBar, mainTabBarBottomInset } from '../components/MainTabBar';
import { analytics } from '../utils/analytics';

/** Colores de texto / tinte estilo iOS (modo claro). */
const IOS_LABEL = '#1C1C1E';
const IOS_SECONDARY_LABEL = 'rgba(60, 60, 67, 0.6)';
const IOS_LINK = '#007AFF';
const IOS_FILL_QUATERNARY = 'rgba(116, 116, 128, 0.08)';
const ARROW_SLOT = 36;

/** Short emotional/experiential label per category (no counts). Fallback for unknown categories. */
const MOMENT_LABELS: Record<string, string> = {
  'Deep Stuff 🧠': 'Deep · Reflective',
  'Go Deep 🧠': 'Deep · Reflective',
  'Deep Talk 🧠': 'Deep · Reflective',
  'Ikigai 🌸': 'Purpose · Values',
  'Date Night 🌙': 'Emotional · Intimate',
  'Con mi abuela': 'Stories · Family',
  'Con mi abuela 👵': 'Stories · Family',
  'With Grandparents 💌': 'Stories · Family',
  'Road Trip 🚗': 'Fun · Stories · Meaningful',
  'On the Road 🚗': 'Fun · Stories · Meaningful',
  'Drinks with Friends 🍸': 'Social · Personal',
  'Table Talks 🍷': 'Social · Personal',
  'Break the Ice 🧊': 'Light · Easy',
};
const DEFAULT_MOMENT_LABEL = 'Meaningful';
const NEW_CATEGORY_MATCHER = /who is most likely to/i;
const BREAK_THE_ICE_MATCHER = /break the ice/i;
export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { momentOptions } = useQuestions();
  const orderedOptions = useMemo(() => sortMomentOptions(momentOptions), [momentOptions]);
  /** Sin Rompe el hielo: ya está en la tarjeta superior. */
  const browseMomentOptions = useMemo(
    () =>
      orderedOptions.filter(
        (o) => !BREAK_THE_ICE_MATCHER.test(o.id) && !BREAK_THE_ICE_MATCHER.test(o.name)
      ),
    [orderedOptions]
  );
  const scrollRef = useRef<ScrollView>(null);
  const browseSectionY = useRef(0);

  const handleStart = useCallback(
    (momentId: string) => {
      const categoryName = momentOptions.find((m) => m.id === momentId)?.name ?? momentId;
      analytics.categoryOpened(categoryName);
      router.push({ pathname: '/questions', params: { moment: momentId } });
    },
    [momentOptions, router]
  );

  const breakTheIceId = useMemo(() => {
    const found = orderedOptions.find(
      (o) => BREAK_THE_ICE_MATCHER.test(o.id) || BREAK_THE_ICE_MATCHER.test(o.name)
    );
    return found?.id ?? null;
  }, [orderedOptions]);

  const onSurpriseMe = useCallback(() => {
    if (breakTheIceId) {
      handleStart(breakTheIceId);
    }
  }, [breakTheIceId, handleStart]);

  const onPremium = useCallback(() => {
    Alert.alert(t('home.premiumTitle'), t('home.premiumSoon'));
  }, [t]);

  const onSeeAll = useCallback(() => {
    scrollRef.current?.scrollTo({ y: Math.max(0, browseSectionY.current - 8), animated: true });
  }, []);

  const onBrowseLayout = useCallback((e: LayoutChangeEvent) => {
    browseSectionY.current = e.nativeEvent.layout.y;
  }, []);

  const tabBarInset = mainTabBarBottomInset(insets.bottom);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarInset + SPACING.lg }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Text style={styles.wordmark}>{t('home.appName')}</Text>
          </View>

          <Text style={styles.sectionHeading}>{t('home.entrySectionTitle')}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.breakIceOuter,
              !breakTheIceId && styles.breakIceDisabled,
              pressed && breakTheIceId && styles.pressed,
            ]}
            onPress={onSurpriseMe}
            disabled={!breakTheIceId}
            accessibilityRole="button"
            accessibilityLabel={`${t('home.surpriseMe')}. ${t('home.surpriseMeDesc')}`}
            accessibilityHint={t('home.breakIceEntry')}
            accessibilityState={{ disabled: !breakTheIceId }}
          >
            <ImageBackground
              source={require('../assets/surprise-me-pattern.png')}
              style={styles.breakIceImageBg}
              imageStyle={styles.breakIcePatternImage}
              resizeMode="cover"
            >
              <View style={styles.breakIceScrim}>
                <View style={styles.breakIceRow}>
                  <Text style={styles.breakIceEmojiLarge} accessible={false}>
                    🧊
                  </Text>
                  <View style={styles.breakIceCopy}>
                    <Text style={styles.breakIceTitle}>{t('home.surpriseMe')}</Text>
                    <Text style={styles.breakIceDesc} numberOfLines={3}>
                      {t('home.surpriseMeDesc')}
                    </Text>
                  </View>
                  <View style={styles.breakIceChevronWrap}>
                    <Ionicons name="chevron-forward" size={22} color={IOS_LINK} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </Pressable>

          <View style={styles.browseHeader} onLayout={onBrowseLayout}>
            <Text style={styles.sectionHeadingFlat}>{t('home.browseByCategory')}</Text>
            <Pressable onPress={onSeeAll} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('home.seeAll')}>
              <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
            </Pressable>
          </View>

          <View style={styles.cardList}>
            {browseMomentOptions.map((option, index) => {
              const displayName = getCategoryDisplayName(option) || option.name;
              const isNewCategory =
                NEW_CATEGORY_MATCHER.test(option.id) || NEW_CATEGORY_MATCHER.test(option.name);
              const subtitleLabel = isNewCategory
                ? 'Fun · Light'
                : MOMENT_LABELS[option.id] ?? MOMENT_LABELS[option.name] ?? DEFAULT_MOMENT_LABEL;
              const emoji = option.emoji;
              return (
                <MomentCard
                  key={option.id}
                  option={{ ...option, name: displayName, emoji }}
                  index={index}
                  subtitleLabel={subtitleLabel}
                  badgeLabel={isNewCategory ? 'NEW' : undefined}
                  onStart={() => handleStart(option.id)}
                  titleColor={IOS_LABEL}
                  subtitleColor={IOS_SECONDARY_LABEL}
                  arrowCircleBg={IOS_FILL_QUATERNARY}
                />
              );
            })}
          </View>

          <Pressable
            onPress={onPremium}
            style={({ pressed }) => [styles.premiumBanner, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <ImageBackground
              source={require('../assets/premium-unlock-pattern.png')}
              style={[styles.premiumInner, styles.premiumInnerTouchable]}
              imageStyle={styles.premiumPatternImage}
              resizeMode="cover"
            >
              <Text style={styles.premiumMark}>m</Text>
              <View style={styles.premiumCopy}>
                <Text style={styles.premiumTitle}>{t('home.premiumTitle')}</Text>
                <Text style={styles.premiumSubtitle}>{t('home.premiumSubtitle')}</Text>
              </View>
              <View style={styles.premiumCta}>
                <Text style={styles.premiumCtaText}>{t('home.goPremium')}</Text>
                <Ionicons name="arrow-forward" size={16} color={IOS_LINK} />
              </View>
            </ImageBackground>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      <MainTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeTop: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  wordmark: {
    fontFamily: FONTS.brasikaDisplay,
    fontSize: FONT_SIZES['2xl'],
    color: IOS_LABEL,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  breakIceOuter: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  breakIceImageBg: {
    width: '100%',
    minHeight: 112,
  },
  breakIcePatternImage: {
    borderRadius: BORDER_RADIUS['2xl'],
  },
  breakIceScrim: {
    flex: 1,
    minHeight: 112,
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255, 244, 196, 0.78)',
  },
  breakIceDisabled: {
    opacity: 0.45,
  },
  breakIceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakIceEmojiLarge: {
    fontSize: 34,
    lineHeight: 40,
    marginRight: SPACING.md,
  },
  breakIceCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: SPACING.sm,
  },
  breakIceTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '600',
    color: IOS_LABEL,
    lineHeight: 22,
    marginBottom: 4,
  },
  breakIceDesc: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    lineHeight: 18,
    color: IOS_SECONDARY_LABEL,
  },
  breakIceChevronWrap: {
    width: ARROW_SLOT,
    height: ARROW_SLOT,
    borderRadius: 18,
    backgroundColor: IOS_FILL_QUATERNARY,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(60, 60, 67, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    color: IOS_LABEL,
    marginBottom: SPACING.md,
  },
  sectionHeadingFlat: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    color: IOS_LABEL,
  },
  browseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: IOS_LINK,
  },
  cardList: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  premiumBanner: {
    borderRadius: BORDER_RADIUS['2xl'],
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  premiumInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    overflow: 'hidden',
  },
  premiumInnerTouchable: {
    pointerEvents: 'box-none',
  },
  premiumPatternImage: {
    borderRadius: BORDER_RADIUS['2xl'],
  },
  premiumMark: {
    fontFamily: FONTS.brasikaDisplay,
    fontSize: 36,
    color: '#FFFFFF',
    width: 44,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  premiumCopy: {
    flex: 1,
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  premiumSubtitle: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
    fontFamily: FONTS.inter.regular,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  premiumCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(60, 60, 67, 0.12)',
  },
  premiumCtaText: {
    color: IOS_LINK,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    fontFamily: FONTS.inter.bold,
  },
});
