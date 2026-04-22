import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  LayoutChangeEvent,
  ImageBackground,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
              <LinearGradient
                colors={['rgba(255, 188, 128, 0.58)', 'rgba(255, 138, 76, 0.50)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.breakIceScrim}
              >
                <View style={styles.breakIceRow}>
                  <View style={styles.breakIceCopy}>
                    <Text style={styles.breakIceTitle}>{t('home.surpriseMe')}</Text>
                    <Text style={styles.breakIceDesc} numberOfLines={3}>
                      {t('home.surpriseMeDesc')}
                    </Text>
                  </View>
                  <View style={styles.breakIceCta}>
                    <Text style={styles.breakIceCtaText}>{t('home.startHere')}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
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
              <View style={styles.premiumMarkMask}>
                <Image
                  source={require('../assets/icon.png')}
                  style={styles.premiumMarkIcon}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                />
              </View>
              <View style={styles.premiumCopy}>
                <Text style={styles.premiumTitle} numberOfLines={2}>
                  {t('home.premiumTitle')}
                </Text>
                <Text style={styles.premiumSubtitle} numberOfLines={1}>
                  {t('home.premiumSubtitle')}
                </Text>
              </View>
              <View style={styles.premiumCta}>
                <Text style={styles.premiumCtaText}>{t('home.goPremium')}</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
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
    borderWidth: 1,
    borderColor: 'rgba(28, 28, 30, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  breakIceImageBg: {
    width: '100%',
    minHeight: 128,
  },
  breakIcePatternImage: {
    borderRadius: BORDER_RADIUS['2xl'],
  },
  breakIceScrim: {
    flex: 1,
    minHeight: 128,
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS['2xl'],
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
    paddingLeft: SPACING.xs,
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
  breakIceCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0B1D43',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    flexShrink: 0,
  },
  breakIceCtaText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    fontFamily: FONTS.inter.bold,
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
    paddingVertical: SPACING.md,
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
  premiumMarkMask: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumMarkIcon: {
    width: 62,
    height: 62,
    marginLeft: -9,
    marginTop: -9,
  },
  premiumCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  premiumTitle: {
    color: '#17171A',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
  },
  premiumSubtitle: {
    color: 'rgba(23, 23, 26, 0.78)',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
    lineHeight: 16,
  },
  premiumCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0B1D43',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'center',
    flexShrink: 0,
  },
  premiumCtaText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    fontFamily: FONTS.inter.bold,
  },
});
