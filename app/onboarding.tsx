import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { useState, useRef, useCallback, useMemo } from 'react';
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
import { useLocale } from '../contexts/LocaleContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Vista previa en onboarding (orden fijo; datos reales desde Notion / caché). */
const ONBOARDING_MOMENT_PREVIEW_IDS = [
  'Drinks with Friends 🍸',
  'Go Deep 🧠',
  'Date Night 🌙',
  'With Grandparents 💌',
] as const;

const HERO_PREVIEW_POOL_SIZE = 8;
const HERO_STACK_CARD_COUNT = 4;
const HERO_FORCED_QUESTION = 'If you had to switch lives with one of your friends, who would you pick?';

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
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { questions, questionTextByLocale } = useQuestions();
  const SCREENS = useOnboardingScreens();
  const heroQuestion = useMemo(() => {
    if (HERO_FORCED_QUESTION.trim().length > 0) {
      return HERO_FORCED_QUESTION;
    }
    const byLocale = questionTextByLocale[locale] ?? questionTextByLocale['en-US'] ?? {};
    const available = questions
      .map((q) => byLocale[q.id] ?? '')
      .filter(
        (text): text is string =>
          typeof text === 'string' &&
          text.trim().length > 0 &&
          !/^do you think everything happened/i.test(text.trim())
      );
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, HERO_PREVIEW_POOL_SIZE)[0] ?? '';
  }, [locale, questionTextByLocale, questions]);
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
          {index === 0 && <MoodBoardHeroVisual question={heroQuestion} />}
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

function MoodBoardHeroVisual({ question }: { question: string }) {
  const stackThemes = useMemo(
    () => Array.from({ length: HERO_STACK_CARD_COUNT }, (_, i) => CARD_THEMES[i % CARD_THEMES.length]),
    []
  );
  const frontTheme = stackThemes[stackThemes.length - 1];
  return (
    <View style={styles.heroCarouselWrap}>
      <View style={styles.heroStackWrap}>
        {stackThemes.map((theme, index) => {
          const isFront = index === stackThemes.length - 1;
          return (
            <View
              key={index}
              style={[
                styles.heroStackCard,
                {
                  backgroundColor: `${theme.bg}F0`,
                  borderColor: `${theme.text}26`,
                  top: index * 10,
                  zIndex: index + 1,
                },
                isFront && styles.heroStackCardFront,
              ]}
            >
              {isFront && (
                <View style={styles.heroQuestionCardInner}>
                  <View style={styles.heroQuestionTextBlock}>
                    <Text style={[styles.heroQuestionPromptLabel, { color: `${frontTheme.text}CC` }]}>
                      Question
                    </Text>
                    <Text style={[styles.heroQuestionText, { color: frontTheme.text }]} numberOfLines={3}>
                      {question}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Cuatro momentos en rejilla 2×2: colores del mood board + emoji + nombre.
 */
function MomentsOnboardingVisual() {
  const { momentOptions } = useQuestions();
  const { locale } = useLocale();
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
  const totalCategories = momentOptions.length;
  const remainingCategories = Math.max(totalCategories - previewMoments.length, 0);
  const categoriesHint =
    locale.startsWith('es')
      ? remainingCategories > 0
        ? `+${remainingCategories} categorías más →`
        : `${totalCategories} categorías`
      : remainingCategories > 0
        ? `+${remainingCategories} more categories →`
        : `${totalCategories} categories`;

  return (
    <View style={styles.momentBentoWrap}>
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
      <Text style={styles.momentBentoHintText}>{categoriesHint}</Text>
    </View>
  );
}

/** Tarjeta de ejemplo con etiqueta de nivel (solo informativa, sin filtro). */
function ClosenessVisual() {
  const { t, tArray } = useTranslation();
  const theme = CARD_THEMES[2];
  const sampleQs = tArray('onboarding.screens.0.tileQuestions');
  const sample = sampleQs[0] ?? '…';

  return (
    <View style={styles.closenessWrap}>
      <View style={[styles.questionCardWrap, { width: SCREEN_WIDTH - SPACING.lg * 4, backgroundColor: theme.bg }]}>
        <Text style={[styles.closenessDiscreteLabel, { color: theme.text }]}>
          {t('questions.closenessLabels.level2')}
        </Text>
        <Text style={[styles.closenessExampleQuestion, { color: theme.text }]} numberOfLines={3}>
          {sample}
        </Text>
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
    minHeight: 240,
    maxHeight: 300,
  },
  visualContainerMoments: {
    minHeight: 260,
    alignSelf: 'stretch',
  },
  momentBentoWrap: {
    alignItems: 'center',
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
  momentBentoHintText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  heroCarouselWrap: {
    width: '100%',
    alignSelf: 'center',
  },
  heroStackWrap: {
    width: '100%',
    maxWidth: 340,
    height: 220,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  heroStackCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#0A0A0A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    minHeight: 150,
  },
  heroStackCardFront: {
    minHeight: 170,
  },
  heroQuestionCardInner: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    minHeight: 170,
  },
  heroQuestionTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  heroQuestionPromptLabel: {
    fontSize: 11,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  heroQuestionText: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '500',
    letterSpacing: 0.1,
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  closenessDiscreteLabel: {
    fontSize: 12,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
    opacity: 0.72,
    letterSpacing: 0.2,
    marginBottom: SPACING.md,
  },
  closenessExampleQuestion: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.inter.regular,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: SPACING.sm,
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
