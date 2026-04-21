import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect, useMemo } from 'react';
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
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, getThemeForMomentId, getCategoryDisplayName, FIRST_5_QUESTION_IDS_BY_MOMENT } from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useFavorites } from '../utils/useFavorites';
import { usePreferredLanguage, getQuestionText } from '../utils/usePreferredLanguage';
import { useTranslation } from '../hooks/useTranslation';
import { analytics } from '../utils/analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const CARD_MARGIN = SPACING.md;

const CLOSENESS_LABELS: Record<ClosenessLevel, string> = {
  1: 'Level 1 Icebreaker',
  2: 'Level 2 Personal',
  3: 'Level 3 Vulnerable',
};
type ClosenessFilter = 'all' | ClosenessLevel;
const CLOSENESS_FILTER_LABELS: Record<ClosenessFilter, string> = {
  all: 'Random',
  1: CLOSENESS_LABELS[1],
  2: CLOSENESS_LABELS[2],
  3: CLOSENESS_LABELS[3],
};
const CLOSENESS_FILTER_OPTIONS: ClosenessFilter[] = ['all', 1, 2, 3];
const LEVEL_DROPDOWN_TEXT_COLOR = '#1C1C1E';
function getClosenessLabel(level?: ClosenessLevel): string {
  if (level === 1 || level === 2 || level === 3) return CLOSENESS_LABELS[level];
  return CLOSENESS_LABELS[1];
}

export default function Questions() {
  const params = useLocalSearchParams<{ moment?: string; selectedmoment?: string }>();
  const moment =
    (typeof params.moment === 'string' ? params.moment : null) ??
    (typeof (params as Record<string, unknown>).selectedmoment === 'string'
      ? ((params as Record<string, unknown>).selectedmoment as string)
      : undefined);
  const router = useRouter();
  const { t } = useTranslation();
  const { questions, momentOptions, questionTextByLocale } = useQuestions();
  const { toggleFavorite, isFavorite } = useFavorites();

  const momentOption = moment ? momentOptions.find((m) => m.id === moment) : null;
  const momentLabel = moment
    ? (getCategoryDisplayName(momentOption) || momentOption?.name || moment)
    : '';
  const momentTheme = moment
    ? getThemeForMomentId(moment, momentOptions)
    : getThemeForMomentId(momentOptions[0]?.id ?? '', momentOptions);
  const lang = usePreferredLanguage();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');
  const [selectedCloseness, setSelectedCloseness] = useState<ClosenessFilter>('all');
  const [isClosenessMenuOpen, setIsClosenessMenuOpen] = useState(false);

  const translateX = useSharedValue(0);

  const filteredQuestions = useMemo(() => {
    if (!moment) return [];
    return questions.filter((q) => {
      if (!q.moment.includes(moment)) return false;
      if (selectedCloseness === 'all') return true;
      return q.closenessLevel === selectedCloseness;
    });
  }, [questions, moment, selectedCloseness]);

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

  const currentQuestion =
    shuffledQuestions.length > 0
      ? shuffledQuestions[questionIndex % shuffledQuestions.length]
      : undefined;

  useEffect(() => {
    if (currentQuestion) {
      setCurrentQuestionId(currentQuestion.id);
      analytics.questionViewed(currentQuestion.id);
    }
  }, [currentQuestion]);

  useEffect(() => {
    setQuestionIndex(0);
  }, [selectedCloseness]);

  const handleNext = () => {
    if (filteredQuestions.length === 0) return;
    setIsClosenessMenuOpen(false);
    setQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setIsClosenessMenuOpen(false);
    setQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleFavorite = async () => {
    if (currentQuestion) await toggleFavorite(currentQuestion.id);
  };

  const handleSelectCloseness = (value: ClosenessFilter) => {
    setSelectedCloseness(value);
    setIsClosenessMenuOpen(false);
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
            <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
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
            <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
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
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backLabel}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {momentLabel}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.cardWrap}>
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                styles.card,
                animatedCardStyle,
                { backgroundColor: momentTheme.bg },
              ]}
            >
              <View style={styles.cardInner}>
                <Animated.View
                  key={currentQuestion?.id ?? 'empty'}
                  style={styles.cardContentWrap}
                  entering={FadeIn.duration(260)}
                  exiting={FadeOut.duration(200)}
                >
                  <View style={styles.categoryPillWrap}>
                    <Pressable
                      style={[styles.categoryPill, { borderColor: LEVEL_DROPDOWN_TEXT_COLOR }]}
                      onPress={() => setIsClosenessMenuOpen((prev) => !prev)}
                    >
                      <Text style={[styles.categoryPillText, { color: LEVEL_DROPDOWN_TEXT_COLOR }]}>
                        {selectedCloseness === 'all'
                          ? currentQuestion
                          ? getClosenessLabel(currentQuestion.closenessLevel)
                          : getClosenessLabel(1)
                          : CLOSENESS_FILTER_LABELS[selectedCloseness]}
                      </Text>
                      <Text style={[styles.categoryPillArrow, { color: LEVEL_DROPDOWN_TEXT_COLOR }]}>
                        {isClosenessMenuOpen ? '▲' : '▼'}
                      </Text>
                    </Pressable>
                    {isClosenessMenuOpen && (
                      <View style={styles.closenessMenu}>
                        {CLOSENESS_FILTER_OPTIONS.map((option) => {
                          const isActive = selectedCloseness === option;
                          return (
                            <Pressable
                              key={String(option)}
                              style={[
                                styles.closenessMenuOption,
                                isActive && styles.closenessMenuOptionActive,
                              ]}
                              onPress={() => handleSelectCloseness(option)}
                            >
                              <Text
                                style={[
                                  styles.closenessMenuText,
                                  { color: LEVEL_DROPDOWN_TEXT_COLOR },
                                  isActive && styles.closenessMenuTextActive,
                                ]}
                              >
                                {CLOSENESS_FILTER_LABELS[option]}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  </View>
                  <View style={styles.questionBlock}>
                    <Text
                      style={[
                        styles.questionText,
                        { color: momentTheme.text },
                      ]}
                    >
                      {currentQuestion
                        ? getQuestionText(currentQuestion, lang, questionTextByLocale)
                        : ''}
                    </Text>
                  </View>
                </Animated.View>
                <Pressable
                  style={styles.favBtn}
                  onPress={handleFavorite}
                  hitSlop={12}
                >
                  <Ionicons
                    name={isFavorite(currentQuestionId) ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={isFavorite(currentQuestionId) ? '#1C1C1E' : '#C7C7CC'}
                  />
                </Pressable>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>{t('questions.hint')}</Text>
          <View style={styles.footerButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.iosBtn,
                styles.iosBtnSecondary,
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
                  questionIndex === 0 && styles.iosBtnDisabledLabel,
                ]}
              >
                {t('questions.previous')}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.iosBtn,
                styles.iosBtnPrimary,
                pressed && styles.iosBtnPressed,
              ]}
              onPress={handleNext}
              hitSlop={12}
            >
              <Text style={styles.iosBtnPrimaryLabel}>
                {t('questions.next')}
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
    backgroundColor: '#F2F2F7',
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
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  headerRight: {
    width: 44,
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  card: {
    flex: 1,
    width: '100%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardInner: {
    flex: 1,
    padding: SPACING.xl,
  },
  cardContentWrap: {
    flex: 1,
  },
  categoryPillWrap: {
    position: 'absolute',
    top: SPACING.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  categoryPill: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  categoryPillText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
  },
  categoryPillArrow: {
    fontSize: 10,
    fontFamily: FONTS.inter.regular,
  },
  closenessMenu: {
    marginTop: SPACING.sm,
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  closenessMenuOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderRadius: 8,
  },
  closenessMenuOptionActive: {
    backgroundColor: '#F2F2F7',
  },
  closenessMenuText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
  },
  closenessMenuTextActive: {
    fontWeight: '600',
  },
  questionBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  questionText: {
    fontSize: 26,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
    lineHeight: 38,
  },
  favBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.sm,
  },
  footer: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: SPACING['2xl'],
    paddingTop: SPACING.lg,
  },
  hint: {
    fontSize: 13,
    fontFamily: FONTS.inter.regular,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  // Base iOS-style button (44pt min height, 10pt radius)
  iosBtn: {
    minHeight: 44,
    minWidth: 120,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Previous: iOS secondary (gray fill)
  iosBtnSecondary: {
    backgroundColor: '#E5E5EA',
  },
  iosBtnSecondaryLabel: {
    fontSize: 17,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  // Next: iOS primary (system blue fill)
  iosBtnPrimary: {
    backgroundColor: '#007AFF',
  },
  iosBtnPrimaryLabel: {
    fontSize: 17,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iosBtnPressed: {
    opacity: 0.8,
  },
  iosBtnDisabled: {
    opacity: 0.45,
  },
  iosBtnDisabledLabel: {
    color: '#8E8E93',
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
    color: '#8E8E93',
    textAlign: 'center',
  },
});
