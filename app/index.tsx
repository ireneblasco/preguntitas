import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES } from '@/constants';
import * as onboardingUtils from '@/utils/onboarding';

export default function Index() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  // Animation values
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.95);
  const textY = useSharedValue(10);

  useEffect(() => {
    // Entry animation for text
    textOpacity.value = withTiming(1, {
      duration: 700,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    textScale.value = withTiming(1, {
      duration: 700,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    textY.value = withTiming(0, {
      duration: 700,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Exit after 2 seconds
    const timer = setTimeout(async () => {
      setIsExiting(true);

      // Exit animations
      textOpacity.value = withTiming(0, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      textScale.value = withTiming(0.95, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      textY.value = withTiming(-10, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      containerOpacity.value = withTiming(0, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      containerScale.value = withTiming(1.05, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Navigate after animation
      setTimeout(async () => {
        const hasSeenOnboarding = await onboardingUtils.hasSeenOnboarding();
        if (hasSeenOnboarding) {
          router.replace('/home');
        } else {
          router.replace('/onboarding');
        }
      }, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { scale: textScale.value },
      { translateY: textY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={[
          COLORS.splash.blue,
          COLORS.splash.yellow,
          COLORS.splash.pink,
          COLORS.splash.green,
          COLORS.splash.blue,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.Text style={[styles.title, textStyle]}>
          Question Spot
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.playfair.bold,
    color: COLORS.text.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});
