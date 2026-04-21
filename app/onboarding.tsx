import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  CARD_THEMES,
  sortMomentOptions,
  getCategoryDisplayName,
  getThemeForMomentId,
} from '../constants';
import * as onboardingUtils from '../utils/onboarding';
import { useTranslation } from '../hooks/useTranslation';
import { useQuestions, type MomentOption } from '../contexts/QuestionsContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Mismos rótulos de nivel que en la pantalla de preguntas (pill superior). */
const HERO_PREVIEW_CLOSENESS_PILLS = [
  'Level 1 Icebreaker',
  'Level 2 Personal',
  'Level 3 Vulnerable',
  'Level 1 Icebreaker',
] as const;

/** Vista previa en onboarding (orden fijo; datos reales desde Notion / caché). */
const ONBOARDING_MOMENT_PREVIEW_IDS = [
  'Drinks with Friends 🍸',
  'Go Deep 🧠',
  'Date Night 🌙',
  'With Grandparents 💌',
] as const;

const HERO_PREVIEW_COUNT = 4;
const HERO_AUTO_ADVANCE_MS = 4200;

type OnboardingScreen = { headline: string; subtext: string; cta?: string };

function useOnboardingScreens(): OnboardingScreen[] {
  const { t } = useTranslation();
  return [
    { headline: t('onboarding.screens.0.headline'), subtext: t('onboarding.screens.0.subtext') },
    { headline: t('onboarding.screens.1.headline'), subtext: t('onboarding.screens.1.subtext') },
    { headline: t('onboarding.screens.2.headline'), subtext: t('onboarding.screens.2.subtext') },
    {
      headline: t('onboarding.screens.3.headline'),
      subtext: t('onboarding.screens.3.subtext'),
      cta: t('onboarding.screens.3.cta'),
    },
  ];
}

export default function Onboarding() {
  const router = useRouter();
  const { t, tArray } = useTranslation();
  const SCREENS = useOnboardingScreens();
  const heroTileQuestions = tArray('onboarding.screens.0.tileQuestions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < SCREENS.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await onboardingUtils.markOnboardingSeen();
      router.replace('/home');
    }
  };

  const handleSkip = async () => {
    await onboardingUtils.markOnboardingSeen();
    router.replace('/home');
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({ item, index }: { item: OnboardingScreen; index: number }) => {
    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        <View
          style={[
            styles.visualContainer,
            index === 0 && styles.visualContainerHero,
            index === 1 && styles.visualContainerMoments,
          ]}
        >
          {index === 0 && <MoodBoardHeroVisual questions={heroTileQuestions} />}
          {index === 1 && <MomentsOnboardingVisual />}
          {index === 2 && <ClosenessVisual />}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.headline}>{item.headline}</Text>
          <Text style={styles.subtext}>{item.subtext}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.background.white, COLORS.background.white]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
        </Pressable>

      <FlatList
        ref={flatListRef}
        data={SCREENS}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, index) => index.toString()}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SCREENS.map((_, index) => (
            <PaginationDot key={index} index={index} currentIndex={currentIndex} />
          ))}
        </View>

        <Pressable
          style={[
            styles.button,
            currentIndex === SCREENS.length - 1 ? styles.buttonPrimary : styles.buttonSecondary,
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.buttonText,
              currentIndex === SCREENS.length - 1
                ? styles.buttonTextPrimary
                : styles.buttonTextSecondary,
            ]}
          >
            {currentIndex === SCREENS.length - 1 ? SCREENS[SCREENS.length - 1].cta : t('onboarding.next')}
          </Text>
        </Pressable>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const PAGINATION_ACTIVE_COLOR = '#1C1C1E';

function PaginationDot({ index, currentIndex }: { index: number; currentIndex: number }) {
  const isActive = index === currentIndex;
  
  const animatedStyle = useAnimatedStyle(() => {
    const width = withTiming(isActive ? 32 : 4, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    return {
      width,
      backgroundColor: isActive ? PAGINATION_ACTIVE_COLOR : COLORS.border.light,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

/** Carrusel horizontal de tarjetas estilo preguntas: swipe + avance automático. */
function MoodBoardHeroVisual({ questions }: { questions: string[] }) {
  const scrollRef = useRef<ScrollView>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const next = (activeRef.current + 1) % HERO_PREVIEW_COUNT;
      activeRef.current = next;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    }, HERO_AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / SCREEN_WIDTH);
    if (i >= 0 && i < HERO_PREVIEW_COUNT) {
      activeRef.current = i;
    }
  }, []);

  return (
    <View style={styles.heroCarouselWrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.heroCarouselScroll}
        decelerationRate="fast"
      >
        {[0, 1, 2, 3].map((i) => {
          const theme = CARD_THEMES[i % CARD_THEMES.length];
          const copy = questions[i] ?? '';
          return (
            <View key={i} style={styles.heroCarouselPage}>
              <View style={[styles.heroQuestionCard, { backgroundColor: theme.bg }]}>
                <View style={styles.heroQuestionCardInner}>
                  <View style={styles.heroQuestionPillWrap}>
                    <View style={[styles.heroQuestionPill, { borderColor: theme.text }]}>
                      <Text style={[styles.heroQuestionPillText, { color: theme.text }]}>
                        {HERO_PREVIEW_CLOSENESS_PILLS[i]}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.heroQuestionTextBlock}>
                    <Text style={[styles.heroQuestionText, { color: theme.text }]}>{copy}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/**
 * Cuatro momentos en rejilla 2×2: colores del mood board + emoji + nombre.
 */
function MomentsOnboardingVisual() {
  const { momentOptions } = useQuestions();
  const { previewMoments, cellW, gridGap } = useMemo(() => {
    const ordered = sortMomentOptions(momentOptions);
    const byId = new Map(ordered.map((o) => [o.id, o]));

    const resolve = (id: (typeof ONBOARDING_MOMENT_PREVIEW_IDS)[number]): MomentOption | undefined => {
      const direct = byId.get(id);
      if (direct) return direct;
      if (id === 'Go Deep 🧠') {
        return ordered.find((o) => o.id === 'Deep Stuff 🧠' || o.name === 'Deep Stuff');
      }
      if (id === 'With Grandparents 💌') {
        return ordered.find(
          (o) =>
            o.id === 'With Grandparents 💌' ||
            o.name === 'With Grandparents' ||
            o.name.startsWith('Con mi abuela')
        );
      }
      return undefined;
    };

    const previewMoments = ONBOARDING_MOMENT_PREVIEW_IDS.map((id) => resolve(id)).filter(
      (o): o is MomentOption => o != null
    );
    const gridGap = 12;
    const maxGrid = Math.min(SCREEN_WIDTH - SPACING.lg * 2, 328);
    const cellW = (maxGrid - gridGap) / 2;
    return { previewMoments, cellW, gridGap };
  }, [momentOptions]);

  return (
    <View style={[styles.momentBentoGrid, { width: cellW * 2 + gridGap, gap: gridGap }]}>
      {previewMoments.map((option, index) => {
        const theme = getThemeForMomentId(option.id, momentOptions);
        const label = getCategoryDisplayName(option) || option.name;
        return (
          <View
            key={option.id}
            style={[
              styles.momentBentoCell,
              {
                width: cellW,
                backgroundColor: theme.bg,
                shadowColor: theme.bg,
              },
            ]}
          >
            <Text style={styles.momentBentoEmoji}>{option.emoji}</Text>
            <Text style={[styles.momentBentoLabel, { color: theme.text }]} numberOfLines={2}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const CLOSENESS_FILTER_PREVIEW = ['Random', 'Icebreaker', 'Personal', 'Vulnerable'] as const;

/** Visual simple del filtro por level (pill + desplegable). */
function ClosenessVisual() {
  const theme = CARD_THEMES[2];

  return (
    <View style={styles.closenessWrap}>
      <View style={[styles.questionCardWrap, { width: SCREEN_WIDTH - SPACING.lg * 4, backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.closenessLevelPill,
            {
              borderColor: theme.text,
              backgroundColor: `${theme.text}22`,
            },
          ]}
        >
          <Text style={[styles.closenessLevelPillText, { color: theme.text }]}>
            Level 2 Personal
          </Text>
          <Text style={[styles.closenessLevelPillArrow, { color: theme.text }]}>▼</Text>
        </View>
        <View style={styles.closenessFilterRow}>
          {CLOSENESS_FILTER_PREVIEW.map((option, optionIndex) => (
            <View
              key={option}
              style={[
                styles.closenessFilterChip,
                {
                  borderColor: theme.text,
                  backgroundColor: optionIndex === 2 ? `${theme.text}22` : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.closenessFilterChipText,
                  { color: theme.text },
                  optionIndex === 2 && styles.closenessFilterChipTextActive,
                ]}
              >
                {option}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.closenessMenuMock}>
          {CLOSENESS_FILTER_PREVIEW.map((option, optionIndex) => (
            <View
              key={`${option}-menu`}
              style={[
                styles.closenessMenuOption,
                optionIndex === 2 && { backgroundColor: `${theme.text}12` },
              ]}
            >
              <Text
                style={[
                  styles.closenessMenuOptionText,
                  { color: theme.text },
                  optionIndex === 2 && styles.closenessMenuOptionTextActive,
                ]}
              >
                {option}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.closenessDots}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.closenessDot,
              i === 1 && styles.closenessDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: SPACING.lg,
    zIndex: 10,
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  visualContainer: {
    minHeight: 200,
    marginBottom: SPACING['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  visualContainerHero: {
    width: '100%',
    alignSelf: 'stretch',
    maxHeight: 420,
  },
  visualContainerMoments: {
    minHeight: 260,
    alignSelf: 'stretch',
  },
  momentBentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  momentBentoCell: {
    minHeight: 118,
    borderRadius: BORDER_RADIUS['2xl'],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  momentBentoEmoji: {
    fontSize: 36,
    lineHeight: 42,
    marginBottom: SPACING.sm,
  },
  momentBentoLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 19,
  },
  heroCarouselWrap: {
    marginHorizontal: -SPACING.lg,
    width: SCREEN_WIDTH,
    alignSelf: 'center',
  },
  heroCarouselScroll: {
    width: SCREEN_WIDTH,
    flexGrow: 0,
  },
  heroCarouselPage: {
    width: SCREEN_WIDTH,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    minHeight: 300,
  },
  heroQuestionCard: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  heroQuestionCardInner: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  heroQuestionPillWrap: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroQuestionPill: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  heroQuestionPillText: {
    fontSize: 13,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
    lineHeight: 18,
  },
  heroQuestionTextBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  heroQuestionText: {
    fontSize: 18,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
    lineHeight: 28,
  },
  closenessWrap: {
    alignItems: 'center',
    width: '100%',
  },
  closenessDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.lg,
  },
  closenessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border.light,
  },
  closenessDotActive: {
    width: 20,
    backgroundColor: COLORS.text.primary,
  },
  questionCardWrap: {
    width: SCREEN_WIDTH - SPACING.lg * 4,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  closenessLevelPill: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  closenessLevelPillText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
  },
  closenessLevelPillArrow: {
    fontSize: 10,
    fontFamily: FONTS.inter.regular,
  },
  closenessFilterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xs,
  },
  closenessFilterChip: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  closenessFilterChipText: {
    fontSize: 11,
    fontFamily: FONTS.inter.regular,
  },
  closenessFilterChipTextActive: {
    fontWeight: '600',
  },
  closenessMenuMock: {
    marginTop: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    padding: SPACING.xs,
  },
  closenessMenuOption: {
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
  },
  closenessMenuOptionText: {
    fontSize: 13,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
  },
  closenessMenuOptionTextActive: {
    fontWeight: '600',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 400,
    zIndex: 1,
  },
  headline: {
    fontSize: FONT_SIZES['3xl'],
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: FONT_SIZES['3xl'] * 1.2,
  },
  subtext: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.base * 1.5,
  },
  footer: {
    paddingBottom: SPACING['3xl'],
    paddingHorizontal: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dot: {
    height: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: PAGINATION_ACTIVE_COLOR,
  },
  buttonSecondary: {
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  buttonText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
  },
  buttonTextPrimary: {
    color: COLORS.text.white,
  },
  buttonTextSecondary: {
    color: COLORS.text.primary,
  },
});
