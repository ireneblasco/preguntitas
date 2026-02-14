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

const SCREENS = [
  {
    headline: 'Questions that spark real conversations.',
    subtext: 'Discover fun, deep, and thoughtful questions in one place.',
  },
  {
    headline: 'Tap or swipe to explore.',
    subtext: 'Save favorites and enjoy conversations with whoever you want.',
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
        <View style={styles.visualContainer}>
          {index === 0 ? <CardsVisual /> : <SwipeVisual />}
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
      style={styles.container}
    >
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
    </LinearGradient>
  );
}

function PaginationDot({ index, currentIndex }: { index: number; currentIndex: number }) {
  const isActive = index === currentIndex;
  
  const animatedStyle = useAnimatedStyle(() => {
    const width = withTiming(isActive ? 32 : 4, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    return {
      width,
      backgroundColor: isActive ? COLORS.accent.primary : COLORS.border.light,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

function CardsVisual() {
  const cards = [0, 1, 2];
  
  return (
    <View style={styles.cardsContainer}>
      {cards.map((index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              top: index * 8,
              transform: [{ rotate: `${index === 0 ? 0 : index === 1 ? -3 : 3}deg` }],
              zIndex: 3 - index,
            },
          ]}
        >
          <View style={styles.cardDot} />
          <View style={styles.cardLine} />
          <View style={[styles.cardLine, { width: 128 }]} />
        </View>
      ))}
    </View>
  );
}

function SwipeVisual() {
  return (
    <View style={styles.swipeContainer}>
      <View style={styles.swipeCard}>
        <Text style={styles.swipeText}>
          What everyday object would you like to talk?
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  visualContainer: {
    height: 200,
    marginBottom: SPACING['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 400,
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
    backgroundColor: COLORS.accent.primary,
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
  // Cards Visual
  cardsContainer: {
    width: 256,
    height: 160,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.md,
    width: 256,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.accent.primary,
    marginBottom: SPACING.sm,
  },
  cardLine: {
    height: 6,
    width: 96,
    backgroundColor: COLORS.background.cool,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 4,
  },
  // Swipe Visual
  swipeContainer: {
    width: 288,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeCard: {
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    minHeight: 180,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  swipeText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.lg * 1.5,
  },
});
