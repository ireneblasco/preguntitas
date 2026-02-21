import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import * as onboardingUtils from '@/utils/onboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Misma paleta que home (categorías / preguntas) */
const CARD_THEMES = [
  { bg: '#BEE656', text: '#3C6112' },
  { bg: '#EAC1CC', text: '#6B2A2D' },
  { bg: '#3E614A', text: '#BEE656' },
  { bg: '#FDCF42', text: '#6B2A2D' },
] as const;

/** Categorías como en home (name + emoji) */
const MOMENT_OPTIONS = [
  { name: 'Date Night', emoji: '🌙' },
  { name: 'Deep Talk', emoji: '🧠' },
  { name: 'Road Trip', emoji: '🌎' },
  { name: 'Table Talks', emoji: '🍷' },
] as const;

const SCREENS = [
  {
    headline: 'Questions that spark real conversations.',
    subtext: 'Discover fun, deep, and thoughtful questions in one place.',
  },
  {
    headline: 'Questions for the moment you\'re in.',
    subtext: 'Road trip, date night, deep talk — the questions are organized by context so you always get the right ones for the situation.',
    cta: "Let's Go",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

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

  const renderItem = ({ item, index }: { item: typeof SCREENS[0]; index: number }) => {
    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        {index === 0 && <OnboardingBackgroundPreview />}
        <View style={styles.visualContainer}>
          {index === 0 ? <QuestionCardVisual /> : <MomentsVisual />}
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
      colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
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
            {currentIndex === SCREENS.length - 1 ? SCREENS[1].cta : 'Next'}
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

/** Fondo de la primera pantalla: tarjetas alineadas con colores vivos del home */
function OnboardingBackgroundPreview() {
  const cardWidth = SCREEN_WIDTH * 0.72;
  const cardHeight = 64;
  const offset = 12;
  const left = (SCREEN_WIDTH - cardWidth) / 2;
  return (
    <View style={styles.bgPreview} pointerEvents="none">
      {CARD_THEMES.map((t, i) => (
        <View
          key={i}
          style={[
            styles.bgPreviewCard,
            {
              backgroundColor: t.bg,
              top: 88 + i * offset,
              left,
              width: cardWidth,
              height: cardHeight,
              opacity: 0.72,
              zIndex: i,
            },
          ]}
        />
      ))}
    </View>
  );
}

/** Ilustración: tarjeta de pregunta con colores del home (Table Talks) */
function QuestionCardVisual() {
  const theme = CARD_THEMES[3];
  return (
    <View style={[styles.questionCardWrap, { backgroundColor: theme.bg }]}>
      <View style={[styles.questionCardPill, { borderColor: theme.text }]}>
        <Text style={[styles.questionCardPillText, { color: theme.text }]}>
          Table Talks
        </Text>
      </View>
      <Text style={[styles.questionCardText, { color: theme.text }]} numberOfLines={2}>
        How do you think people see you?
      </Text>
    </View>
  );
}

/** Ilustración: categorías del home con emoji + nombre y colores de la paleta */
function MomentsVisual() {
  return (
    <View style={styles.momentsWrap}>
      {MOMENT_OPTIONS.map((moment, i) => {
        const theme = CARD_THEMES[i];
        return (
          <View
            key={moment.name}
            style={[styles.momentCard, { backgroundColor: theme.bg }]}
          >
            <Text style={styles.momentEmoji}>{moment.emoji}</Text>
            <Text style={[styles.momentName, { color: theme.text }]} numberOfLines={1}>
              {moment.name}
            </Text>
          </View>
        );
      })}
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
  bgPreview: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  bgPreviewCard: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  visualContainer: {
    minHeight: 200,
    marginBottom: SPACING['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  questionCardWrap: {
    width: SCREEN_WIDTH - SPACING.lg * 4,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  questionCardPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  questionCardPillText: {
    fontSize: 13,
    fontFamily: FONTS.inter.regular,
  },
  questionCardText: {
    fontSize: 18,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.sm,
  },
  momentsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.sm,
    maxWidth: 320,
  },
  momentCard: {
    width: '47%',
    minWidth: 140,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    minHeight: 88,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  momentEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  momentName: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 400,
    zIndex: 1,
  },
  headline: {
    fontSize: FONT_SIZES['3xl'],
    fontFamily: FONTS.playfair.regular,
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
