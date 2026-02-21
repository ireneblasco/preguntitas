import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
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
} from 'react-native-reanimated';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useQuestions } from '@/contexts/QuestionsContext';
import { useFavorites } from '@/utils/useFavorites';
import { usePreferredLanguage, getQuestionText } from '@/utils/usePreferredLanguage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const CARD_MARGIN = SPACING.md;

/** Misma paleta que home por categoría */
const CARD_THEMES = [
  { bg: '#BEE656', text: '#3C6112' },
  { bg: '#EAC1CC', text: '#6B2A2D' },
  { bg: '#3E614A', text: '#BEE656' },
  { bg: '#FDCF42', text: '#6B2A2D' },
] as const;

export default function Questions() {
  const params = useLocalSearchParams<{ moment?: string; selectedmoment?: string }>();
  const moment =
    (typeof params.moment === 'string' ? params.moment : null) ??
    (typeof (params as Record<string, unknown>).selectedmoment === 'string'
      ? ((params as Record<string, unknown>).selectedmoment as string)
      : undefined);
  const router = useRouter();
  const { questions, momentOptions } = useQuestions();
  const { toggleFavorite, isFavorite } = useFavorites();

  const momentLabel = moment
    ? (momentOptions.find((m) => m.id === moment)?.name ?? moment)
    : '';
  const momentThemeIndex = moment
    ? momentOptions.findIndex((m) => m.id === moment)
    : -1;
  const momentTheme =
    momentThemeIndex >= 0
      ? CARD_THEMES[momentThemeIndex % CARD_THEMES.length]
      : CARD_THEMES[0];
  const lang = usePreferredLanguage();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');

  const translateX = useSharedValue(0);

  const filteredQuestions = useMemo(() => {
    if (!moment) return [];
    return questions.filter((q) => q.moment.includes(moment));
  }, [questions, moment]);

  const [shuffledQuestions, setShuffledQuestions] = useState(() => {
    return [...filteredQuestions].sort(() => Math.random() - 0.5);
  });

  const currentQuestion = shuffledQuestions[questionIndex % shuffledQuestions.length];

  useEffect(() => {
    if (currentQuestion) setCurrentQuestionId(currentQuestion.id);
  }, [currentQuestion]);

  useEffect(() => {
    setShuffledQuestions([...filteredQuestions].sort(() => Math.random() - 0.5));
    setQuestionIndex(0);
  }, [filteredQuestions]);

  const handleNext = () => {
    if (filteredQuestions.length === 0) return;
    setQuestionIndex((prev) => prev + 1);
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
        translateX.value = withTiming(
          event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { duration: 180 },
          () => {
            runOnJS(handleNext)();
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
            <Text style={styles.emptyText}>Select a moment from home to start</Text>
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
            <Text style={styles.emptyText}>No questions for this moment</Text>
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
                <View style={[styles.categoryPill, { borderColor: momentTheme.text }]}>
                  <Text style={[styles.categoryPillText, { color: momentTheme.text }]}>
                    {momentLabel}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.questionText,
                    { color: momentTheme.text },
                  ]}
                >
                  {currentQuestion
                    ? getQuestionText(currentQuestion, lang)
                    : ''}
                </Text>
                <Pressable
                  style={styles.favBtn}
                  onPress={handleFavorite}
                  hitSlop={12}
                >
                  <Text
                    style={[
                      styles.favIcon,
                      !isFavorite(currentQuestionId) && styles.favIconInactive,
                    ]}
                  >
                    {isFavorite(currentQuestionId) ? '♥' : '♡'}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>Swipe or tap Next</Text>
          <Pressable
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: momentTheme.text },
              pressed && styles.nextBtnPressed,
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.nextBtnLabel, { color: momentTheme.bg }]}>
              Next
            </Text>
          </Pressable>
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
    paddingTop: SPACING['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPill: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginBottom: SPACING.xl,
  },
  categoryPillText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
  },
  questionText: {
    fontSize: 26,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
    lineHeight: 38,
    paddingHorizontal: SPACING.md,
  },
  favBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.sm,
  },
  favIcon: {
    fontSize: 24,
    color: '#FF3B30',
  },
  favIconInactive: {
    color: '#C7C7CC',
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
  nextBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnPressed: {
    opacity: 0.85,
  },
  nextBtnLabel: {
    fontSize: 17,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
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
