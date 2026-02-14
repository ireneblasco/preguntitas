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
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useQuestions } from '@/contexts/QuestionsContext';
import { useFavorites } from '@/utils/useFavorites';
import { usePreferredLanguage, getQuestionText } from '@/utils/usePreferredLanguage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

export default function Questions() {
  const { moment: momentParam } = useLocalSearchParams<{ moment?: string }>();
  const moment = typeof momentParam === 'string' ? momentParam : undefined;
  const router = useRouter();
  const { questions } = useQuestions();
  const { toggleFavorite, isFavorite } = useFavorites();
  const lang = usePreferredLanguage();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const filteredQuestions = useMemo(() => {
    if (!moment) return [];
    return questions.filter((q) => q.moment.includes(moment));
  }, [questions, moment]);

  const [shuffledQuestions, setShuffledQuestions] = useState(() => {
    return [...filteredQuestions].sort(() => Math.random() - 0.5);
  });

  const currentQuestion = shuffledQuestions[questionIndex % shuffledQuestions.length];

  useEffect(() => {
    if (currentQuestion) {
      setCurrentQuestionId(currentQuestion.id);
    }
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
    if (currentQuestion) {
      await toggleFavorite(currentQuestion.id);
    }
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      scale.value = interpolate(
        Math.abs(event.translationX),
        [0, SWIPE_THRESHOLD],
        [1, 0.95],
        Extrapolation.CLAMP
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { duration: 200 },
          () => {
            runOnJS(handleNext)();
            translateX.value = 0;
            scale.value = 1;
          }
        );
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
        { rotateZ: `${rotate}deg` },
      ],
    };
  });

  const progress =
    filteredQuestions.length > 0
      ? Math.min(((questionIndex + 1) / filteredQuestions.length) * 100, 100)
      : 0;

  if (!moment) {
    return (
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Select a moment from home to start</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No questions found for this moment</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.categoryText}>{moment}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.card, animatedCardStyle]}>
              <Text style={styles.questionText}>
                {currentQuestion ? getQuestionText(currentQuestion, lang) : ''}
              </Text>

              <View style={styles.cardActions}>
                <Pressable style={styles.favoriteButton} onPress={handleFavorite}>
                  <Text style={styles.favoriteIcon}>
                    {isFavorite(currentQuestionId) ? '❤️' : '🤍'}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hintText}>Swipe or tap to continue</Text>
          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.text.secondary,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    marginLeft: SPACING.md,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.border.light,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS['3xl'],
    padding: SPACING.xl,
    width: '100%',
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  questionText: {
    fontSize: FONT_SIZES['2xl'],
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: FONT_SIZES['2xl'] * 1.5,
  },
  cardActions: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
  },
  favoriteButton: {
    padding: SPACING.sm,
  },
  favoriteIcon: {
    fontSize: FONT_SIZES['2xl'],
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
    alignItems: 'center',
  },
  hintText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  nextButton: {
    backgroundColor: COLORS.accent.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
  },
  nextButtonText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
