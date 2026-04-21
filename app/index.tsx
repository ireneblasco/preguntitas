import { View, Text, StyleSheet, Image } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, FONT_SIZES } from '../constants';
import * as onboardingUtils from '../utils/onboarding';
import { useTranslation } from '../hooks/useTranslation';
import { analytics } from '../utils/analytics';

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const splashIcons = useMemo(
    () => [
      require('../assets/adaptive-icon.png'),
      require('../assets/favicon.png'),
      require('../assets/splash-icon.png'),
      require('../assets/app-logo.png'),
    ],
    []
  );
  const finalIcon = require('../assets/icon.png');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [showFinalIcon, setShowFinalIcon] = useState(false);

  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.9);
  const textY = useSharedValue(16);

  useEffect(() => {
    // Logo: entra con bounce
    logoScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 120 }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));

    // Texto: entra después del logo
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
    textScale.value = withDelay(600, withSpring(1, { damping: 14, stiffness: 100 }));
    textY.value = withDelay(600, withTiming(0, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));

    const iconInterval = setInterval(() => {
      setCurrentIconIndex((previous) => (previous + 1) % splashIcons.length);
    }, 160);

    const showFinalIconTimer = setTimeout(() => {
      setShowFinalIcon(true);
      clearInterval(iconInterval);
      logoScale.value = withSpring(1.05, { damping: 12, stiffness: 140 });
    }, 1100);

    const timer = setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 400 });
      logoScale.value = withTiming(0.9, { duration: 400 });
      textOpacity.value = withTiming(0, { duration: 400 });
      textScale.value = withTiming(0.95, { duration: 400 });
      textY.value = withTiming(-12, { duration: 400 });

      containerOpacity.value = withDelay(200, withTiming(0, { duration: 700, easing: Easing.inOut(Easing.cubic) }));
      containerScale.value = withDelay(200, withTiming(1.08, { duration: 700, easing: Easing.inOut(Easing.cubic) }));

      setTimeout(async () => {
        analytics.appOpen();
        const hasSeenOnboarding = await onboardingUtils.hasSeenOnboarding();
        if (hasSeenOnboarding) {
          router.replace('/home');
        } else {
          router.replace('/onboarding');
        }
      }, 720);
    }, 2400);

    return () => {
      clearInterval(iconInterval);
      clearTimeout(showFinalIconTimer);
      clearTimeout(timer);
    };
  }, [splashIcons.length]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
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
      <View style={styles.gradient}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image
            source={showFinalIcon ? finalIcon : splashIcons[currentIconIndex]}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.Text style={[styles.title, textStyle]}>
          {t('app.title')}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoWrap: {
    marginBottom: 24,
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.brasikaDisplay,
    color: COLORS.text.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});
