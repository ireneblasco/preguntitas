import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
  Image,
} from 'react-native';
import { useState, useRef, useCallback, useMemo } from 'react';
import { findBreakTheIceMomentId } from '../constants';
import { analytics } from '../utils/analytics';
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
} from '../constants';
import * as onboardingUtils from '../utils/onboarding';
import { useTranslation } from '../hooks/useTranslation';
import { useQuestions } from '../contexts/QuestionsContext';
import { useLocale } from '../contexts/LocaleContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_PREVIEW_POOL_SIZE = 8;
const HERO_STACK_CARD_COUNT = 4;
const HERO_FORCED_QUESTION = 'What was harder than you expected in life?';

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
  const { questions, questionTextByLocale, momentOptions } = useQuestions();
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

  const finishOnboarding = useCallback(async () => {
    await onboardingUtils.markOnboardingSeen();
    const iceId = findBreakTheIceMomentId(momentOptions);
    if (iceId) {
      const categoryName = momentOptions.find((m) => m.id === iceId)?.name ?? iceId;
      analytics.categoryOpened(categoryName);
      router.replace({
        pathname: '/questions',
        params: { moment: iceId, entry: 'onboarding' },
      });
    } else {
      router.replace('/home');
    }
  }, [momentOptions, router]);

  const handleNext = async () => {
    if (currentIndex < SCREENS.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await finishOnboarding();
    }
  };

  const handleSkip = async () => {
    await finishOnboarding();
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
            index >= 2 && styles.visualContainerTextOnly,
          ]}
        >
          {index === 0 && <MoodBoardHeroVisual question={heroQuestion} />}
          {index === 1 && <MomentsOnboardingVisual />}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.headline}>{item.headline}</Text>
          {item.subtext.trim().length > 0 ? (
            <Text style={styles.subtext}>{item.subtext}</Text>
          ) : null}
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

function MomentsOnboardingVisual() {
  return (
    <View style={styles.momentBentoWrap}>
      <Image
        source={require('../assets/moments-pick-grid.png')}
        style={styles.momentPreviewImage}
        resizeMode="contain"
      />
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
    minHeight: 180,
    marginBottom: SPACING.lg,
    alignSelf: 'stretch',
  },
  /** Pantallas 2–3: sin ilustración; menos aire para que el titular respire. */
  visualContainerTextOnly: {
    minHeight: 72,
    marginBottom: SPACING.xl,
  },
  momentBentoWrap: {
    alignItems: 'center',
    width: '100%',
  },
  momentPreviewImage: {
    width: Math.min(SCREEN_WIDTH - SPACING.lg * 2, 360),
    height: Math.min(SCREEN_WIDTH - SPACING.lg * 2, 360),
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
