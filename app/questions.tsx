import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import type { ClosenessLevel } from '../types/questions';
import {
  COLORS,
  type CategoryTheme,
  FONTS,
  FONT_SIZES,
  SPACING,
  getThemeForMomentId,
  getCategoryDisplayName,
  FIRST_5_QUESTION_IDS_BY_MOMENT,
} from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useFavorites } from '../utils/useFavorites';
import { usePreferredLanguage, getQuestionText } from '../utils/usePreferredLanguage';
import { useTranslation } from '../hooks/useTranslation';
import { analytics } from '../utils/analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const CARD_MARGIN = SPACING.md;
const CARD_RADIUS = 32;

const WHO_IS_MOST_LIKELY_TO_MATCHER = /who is most likely to/i;

/** Tras onboarding: solo estas preguntas de Break the ice antes de ir a inicio. */
const ONBOARDING_BREAK_ICE_COUNT = 3;

function closenessLabelKey(level: ClosenessLevel): string {
  if (level === 1) return 'questions.closenessLabels.level1';
  if (level === 2) return 'questions.closenessLabels.level2';
  return 'questions.closenessLabels.level3';
}

function toSoftCardColor(hex: string): string {
  const source = hex.replace('#', '');
  if (source.length !== 6) return '#E9EEF7';
  const r = parseInt(source.slice(0, 2), 16);
  const g = parseInt(source.slice(2, 4), 16);
  const b = parseInt(source.slice(4, 6), 16);
  const mix = (value: number) => Math.round(value * 0.2 + 255 * 0.8);
  const sr = mix(r).toString(16).padStart(2, '0');
  const sg = mix(g).toString(16).padStart(2, '0');
  const sb = mix(b).toString(16).padStart(2, '0');
  return `#${sr}${sg}${sb}`;
}

function toTextBadgeColor(hex: string): string {
  const source = hex.replace('#', '');
  if (source.length !== 6) return '#E5ECF5';
  const r = parseInt(source.slice(0, 2), 16);
  const g = parseInt(source.slice(2, 4), 16);
  const b = parseInt(source.slice(4, 6), 16);
  const mix = (value: number) => Math.round(value * 0.12 + 255 * 0.88);
  const sr = mix(r).toString(16).padStart(2, '0');
  const sg = mix(g).toString(16).padStart(2, '0');
  const sb = mix(b).toString(16).padStart(2, '0');
  return `#${sr}${sg}${sb}`;
}

/** Misma referencia al final: evita costura entre capas; blanco puro al borde. */
const GRADIENT_END = COLORS.background.white;

function cardFaceGradient(theme: CategoryTheme) {
  return [
    toSoftCardColor(theme.bg),
    toTextBadgeColor(theme.bg),
    COLORS.background.warm,
    // Repetir el último color en la cola alarga la zona lisa (menos “corte” visual)
    GRADIENT_END,
    GRADIENT_END,
  ] as const;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return undefined;
}

export default function Questions() {
  const params = useLocalSearchParams<{ moment?: string; selectedmoment?: string; entry?: string }>();
  const moment =
    firstParam(params.moment) ??
    (typeof (params as Record<string, unknown>).selectedmoment === 'string'
      ? ((params as Record<string, unknown>).selectedmoment as string)
      : undefined);
  const entryFromOnboarding = firstParam(params.entry) === 'onboarding';
  const router = useRouter();
  const handleLeave = useCallback(() => {
    if (entryFromOnboarding) {
      router.replace('/home');
    } else {
      router.back();
    }
  }, [entryFromOnboarding, router]);
  const { t } = useTranslation();
  const { questions, momentOptions, questionTextByLocale } = useQuestions();
  const { toggleFavorite, isFavorite } = useFavorites();

  const momentOption = moment ? momentOptions.find((m) => m.id === moment) : null;
  const momentLabel = moment
    ? (getCategoryDisplayName(momentOption) || momentOption?.name || moment)
    : '';
  const momentTitleColor = COLORS.text.primary;
  const isWhoIsMostLikelyTo =
    !!moment &&
    (WHO_IS_MOST_LIKELY_TO_MATCHER.test(moment) ||
      WHO_IS_MOST_LIKELY_TO_MATCHER.test(momentOption?.name ?? ''));
  const momentTheme = moment
    ? getThemeForMomentId(moment, momentOptions)
    : getThemeForMomentId(momentOptions[0]?.id ?? '', momentOptions);
  const lang = usePreferredLanguage();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');

  const translateX = useSharedValue(0);

  const filteredQuestions = useMemo(() => {
    if (!moment) return [];
    return questions.filter((q) => q.moment.includes(moment));
  }, [questions, moment]);

  const shuffledQuestions = useMemo(() => {
    if (filteredQuestions.length === 0 || !moment) return [];
    const firstFiveIds = FIRST_5_QUESTION_IDS_BY_MOMENT[moment] ?? [];
    const byId = new Map(filteredQuestions.map((q) => [q.id, q]));
    const fixed: typeof filteredQuestions = [];
    for (const id of firstFiveIds) {
      const q = byId.get(id);
      if (q) fixed.push(q);
    }
    const rest = filteredQuestions.filter((q) => !firstFiveIds.includes(q.id));
    for (let i = rest.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return [...fixed, ...rest];
  }, [filteredQuestions, moment]);

  const onboardingDeck = useMemo(() => {
    if (!entryFromOnboarding || shuffledQuestions.length === 0) return [];
    const n = Math.min(ONBOARDING_BREAK_ICE_COUNT, shuffledQuestions.length);
    return shuffledQuestions.slice(0, n);
  }, [entryFromOnboarding, shuffledQuestions]);

  const activeDeck = entryFromOnboarding ? onboardingDeck : shuffledQuestions;
  const isOnboardingLimited = entryFromOnboarding && onboardingDeck.length > 0;

  const currentQuestion =
    activeDeck.length > 0
      ? activeDeck[
          isOnboardingLimited
            ? Math.min(questionIndex, activeDeck.length - 1)
            : questionIndex % activeDeck.length
        ]
      : undefined;

  useEffect(() => {
    if (currentQuestion) {
      setCurrentQuestionId(currentQuestion.id);
      analytics.questionViewed(currentQuestion.id);
    }
  }, [currentQuestion]);

  const goHomeFromIntro = useCallback(() => {
    router.replace('/home');
  }, [router]);

  const handleNext = useCallback(() => {
    if (isOnboardingLimited) {
      setQuestionIndex((prev) => {
        if (onboardingDeck.length === 0) return prev;
        if (prev >= onboardingDeck.length - 1) {
          queueMicrotask(goHomeFromIntro);
          return prev;
        }
        return prev + 1;
      });
      return;
    }
    if (filteredQuestions.length === 0) return;
    setQuestionIndex((prev) => prev + 1);
  }, [filteredQuestions.length, goHomeFromIntro, isOnboardingLimited, onboardingDeck.length]);

  const handlePrevious = () => {
    setQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleFavorite = async () => {
    if (currentQuestion) await toggleFavorite(currentQuestion.id);
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const goRight = event.translationX > 0;
        translateX.value = withTiming(
          goRight ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { duration: 180 },
          () => {
            if (goRight) {
              runOnJS(handlePrevious)();
            } else {
              runOnJS(handleNext)();
            }
            translateX.value = 0;
          }
        );
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-6, 0, 6],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotate}deg` },
      ],
    };
  });

  if (!moment) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={handleLeave} hitSlop={12}>
              <Text style={styles.backLabel}>‹</Text>
            </Pressable>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('questions.emptySelectMoment')}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={handleLeave} hitSlop={12}>
              <Text style={styles.backLabel}>‹</Text>
            </Pressable>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('questions.emptyNoQuestions')}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleLeave} hitSlop={12}>
            <Text style={styles.backLabel}>‹</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: momentTitleColor }]} numberOfLines={1}>
            {momentLabel}
          </Text>
          {isOnboardingLimited ? (
            <Pressable
              style={styles.skipBtn}
              onPress={handleLeave}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t('questions.onboardingSkip')}
            >
              <Text style={styles.skipBtnText}>{t('questions.onboardingSkip')}</Text>
            </Pressable>
          ) : (
            <View style={styles.headerRight} />
          )}
        </View>

        {isOnboardingLimited ? (
          <View
            style={styles.onboardingProgress}
            accessible
            accessibilityLabel={t('questions.onboardingProgress')
              .replace('{{current}}', String(questionIndex + 1))
              .replace('{{total}}', String(onboardingDeck.length))}
          >
            <Text style={styles.onboardingProgressText}>
              {t('questions.onboardingProgress')
                .replace('{{current}}', String(questionIndex + 1))
                .replace('{{total}}', String(onboardingDeck.length))}
            </Text>
            <View style={styles.onboardingDots} importantForAccessibility="no-hide-descendants">
              {onboardingDeck.map((_, i) => (
                <View
                  key={i}
                  style={[styles.onboardingDot, i === questionIndex && styles.onboardingDotActive]}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.cardWrap}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.cardOuter, animatedCardStyle]}>
              <View style={styles.cardSurface}>
                <LinearGradient
                  colors={[...cardFaceGradient(momentTheme)]}
                  locations={[0, 0.26, 0.55, 0.82, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.75, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                {/*
                 * "transparent" en muchos móviles interpola con negro; terminar en #RRGGBB00
                 * con el RGB del inicio de la carta (toSoft) evita banda/raya bajo el brillo.
                 */}
                <LinearGradient
                  colors={[
                    `${momentTheme.text}36`,
                    `${toTextBadgeColor(momentTheme.bg)}6E`,
                    `${toSoftCardColor(momentTheme.bg)}00`,
                  ]}
                  locations={[0, 0.42, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.55, y: 1 }}
                  style={styles.cardTopShine}
                  pointerEvents="none"
                />
                <View style={styles.cardInner}>
                  {momentLabel ? (
                    <View style={styles.momentPillRow} pointerEvents="none">
                      <View
                        style={[
                          styles.momentPill,
                          { borderColor: `${momentTheme.text}55` },
                        ]}
                      >
                        <Text
                          style={styles.momentPillText}
                          numberOfLines={1}
                        >
                          {momentLabel}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                <Animated.View
                  key={currentQuestion?.id ?? 'empty'}
                  style={styles.cardContentWrap}
                  entering={FadeIn.duration(260)}
                  exiting={FadeOut.duration(200)}
                >
                  {!isWhoIsMostLikelyTo && currentQuestion?.closenessLevel != null && (
                    <View style={styles.closenessLabelWrap}>
                      <View
                        style={[
                          styles.closenessPill,
                          { backgroundColor: `${COLORS.brand.forest}1A` },
                        ]}
                      >
                        <Text
                          style={[styles.closenessPillText, { color: COLORS.brand.forest }]}
                        >
                          {t(closenessLabelKey(currentQuestion.closenessLevel))}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.questionBlock}>
                    <Text
                      style={styles.questionText}
                    >
                      {currentQuestion
                        ? getQuestionText(currentQuestion, lang, questionTextByLocale)
                        : ''}
                    </Text>
                  </View>
                </Animated.View>
                <Pressable
                  style={({ pressed }) => [styles.favBtn, pressed && styles.favBtnPressed]}
                  onPress={handleFavorite}
                  hitSlop={12}
                >
                  <Ionicons
                    name={isFavorite(currentQuestionId) ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={
                      isFavorite(currentQuestionId)
                        ? COLORS.brand.terracotta
                        : `${COLORS.text.primary}6E`
                    }
                  />
                </Pressable>
                <Image
                  source={require('../assets/mellow-card-m-mark.png')}
                  style={styles.cardBrandMark}
                  resizeMode="contain"
                  accessible={false}
                  accessibilityIgnoresInvertColors
                />
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>
            {isOnboardingLimited ? t('questions.onboardingHint') : t('questions.hint')}
          </Text>
          <View style={styles.footerButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.iosBtn,
                styles.iosBtnSecondary,
                { backgroundColor: toSoftCardColor(momentTheme.bg) },
                questionIndex === 0 && styles.iosBtnDisabled,
                pressed && questionIndex > 0 && styles.iosBtnPressed,
              ]}
              onPress={handlePrevious}
              disabled={questionIndex === 0}
              hitSlop={12}
            >
              <Text
                style={[
                  styles.iosBtnSecondaryLabel,
                  { backgroundColor: toTextBadgeColor(momentTheme.bg) },
                  questionIndex === 0 && styles.iosBtnDisabledLabel,
                ]}
                numberOfLines={1}
              >
                {t('questions.previous')}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.iosBtn,
                styles.iosBtnPrimary,
                { backgroundColor: toSoftCardColor(momentTheme.bg) },
                pressed && styles.iosBtnPressed,
              ]}
              onPress={handleNext}
              hitSlop={12}
            >
              <Text style={[styles.iosBtnPrimaryLabel, { backgroundColor: toTextBadgeColor(momentTheme.bg) }]} numberOfLines={1}>
                {isOnboardingLimited && questionIndex >= onboardingDeck.length - 1
                  ? t('questions.onboardingDone')
                  : t('questions.next')}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    minHeight: 44,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.brand.forest,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    width: 44,
  },
  skipBtn: {
    minWidth: 44,
    maxWidth: 100,
    paddingHorizontal: SPACING.sm,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    color: COLORS.brand.forest,
  },
  onboardingProgress: {
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  onboardingProgressText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    color: COLORS.text.secondary,
    letterSpacing: 0.3,
  },
  onboardingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onboardingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border.light,
  },
  onboardingDotActive: {
    width: 22,
    borderRadius: 4,
    backgroundColor: COLORS.brand.forest,
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  cardOuter: {
    flex: 1,
    width: '100%',
    borderRadius: CARD_RADIUS,
    shadowColor: COLORS.brand.forest,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.14,
    shadowRadius: 40,
    elevation: 10,
  },
  cardSurface: {
    flex: 1,
    width: '100%',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    // Fondo = última parada del gradiente: si el relleno antialias se corta 1px, no se nota
    backgroundColor: GRADIENT_END,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  cardTopShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  momentPillRow: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  momentPill: {
    maxWidth: '100%',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  momentPillText: {
    fontSize: 12,
    fontFamily: FONTS.inter.regular,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  cardContentWrap: {
    flex: 1,
  },
  closenessLabelWrap: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  closenessPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 100,
  },
  closenessPillText: {
    fontSize: 12,
    fontFamily: FONTS.inter.bold,
    fontWeight: '600',
    letterSpacing: 0.25,
    textAlign: 'center',
  },
  questionBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    minHeight: 120,
  },
  questionText: {
    fontSize: 28,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 40,
    color: COLORS.text.primary,
    letterSpacing: 0.2,
  },
  favBtn: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    padding: SPACING.sm,
    borderRadius: 20,
  },
  favBtnPressed: {
    opacity: 0.7,
  },
  cardBrandMark: {
    position: 'absolute',
    right: SPACING['2xl'],
    bottom: SPACING.lg,
    width: 56,
    height: 46,
    opacity: 0.92,
  },
  footer: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: SPACING['2xl'],
    paddingTop: SPACING.lg,
  },
  hint: {
    fontSize: 13,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 0,
  },
  // Base iOS-style button (44pt min height, 10pt radius)
  iosBtn: {
    height: 68,
    width: '48%',
    minWidth: 164,
    maxWidth: 210,
    paddingHorizontal: 18,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Previous: iOS secondary (gray fill)
  iosBtnSecondary: {
    borderWidth: 1,
    borderColor: COLORS.border.light,
    shadowColor: COLORS.brand.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  iosBtnSecondaryLabel: {
    fontSize: 20,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    flexShrink: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  // Next: acento lima en el borde (iOS "filled" coherente con Mellow)
  iosBtnPrimary: {
    borderWidth: 1,
    borderColor: `${COLORS.brand.lime}B3`,
  },
  iosBtnPrimaryLabel: {
    fontSize: 20,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    flexShrink: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  iosBtnPressed: {
    opacity: 0.8,
  },
  iosBtnDisabled: {
    opacity: 0.45,
  },
  iosBtnDisabledLabel: {
    color: COLORS.text.light,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: 17,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.light,
    textAlign: 'center',
  },
});
