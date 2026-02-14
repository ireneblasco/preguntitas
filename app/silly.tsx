import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
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

// Use "Table Talks" moment as the light/fun deck for random mode
const SILLY_MOMENT = 'Table Talks 🍷';

export default function Silly() {
  const router = useRouter();
  const { questions } = useQuestions();
  const { toggleFavorite, isFavorite } = useFavorites();
  const lang = usePreferredLanguage();

  const sillyQuestions = useMemo(
    () => questions.filter((q) => q.moment.includes(SILLY_MOMENT)),
    [questions]
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof sillyQuestions>(() => []);

  useEffect(() => {
    setShuffledQuestions([...sillyQuestions].sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
  }, [sillyQuestions]);

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const currentQuestion = shuffledQuestions[currentQuestionIndex % (shuffledQuestions.length || 1)];

  const handleNext = () => {
    if (sillyQuestions.length === 0) return;
    setCurrentQuestionIndex((prev) => prev + 1);
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

  if (sillyQuestions.length === 0) {
    return (
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No silly questions found</Text>
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Random ✨</Text>
        <Text style={styles.subtitle}>Random questions, zero pressure</Text>
      </View>

      <View style={styles.cardContainer}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.card, animatedCardStyle]}>
            <Text style={styles.questionText}>
              {currentQuestion ? getQuestionText(currentQuestion, lang) : ''}
            </Text>
            
            <View style={styles.cardActions}>
              <Pressable
                style={styles.favoriteButton}
                onPress={handleFavorite}
              >
                <Text style={styles.favoriteIcon}>
                  {isFavorite(currentQuestion?.id) ? '❤️' : '🤍'}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.rollButton} onPress={handleNext}>
          <Text style={styles.rollButtonText}>Roll again 🎲</Text>
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
    paddingTop: SPACING['2xl'],
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.playfair.regular,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
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
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...SHADOWS.lg,
  },
  questionText: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.xl * 1.5,
  },
  cardActions: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
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
  rollButton: {
    backgroundColor: COLORS.splash.yellow,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
  },
  rollButtonText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
});
