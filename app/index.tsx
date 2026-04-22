import { View, StyleSheet, Image } from 'react-native';
import { useEffect } from 'react';
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
import { analytics } from '../utils/analytics';
import { useTranslation } from '../hooks/useTranslation';

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const logo = require('../assets/app-logo.png');

  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const nameOpacity = useSharedValue(0);
  const nameY = useSharedValue(8);

  useEffect(() => {
    // Logo: entra con bounce
    logoScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 120 }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));
    nameOpacity.value = withDelay(500, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }));
    nameY.value = withDelay(500, withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) }));

    const timer = setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 400 });
      logoScale.value = withTiming(0.9, { duration: 400 });
      nameOpacity.value = withTiming(0, { duration: 300 });
      nameY.value = withTiming(-8, { duration: 300 });

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
      clearTimeout(timer);
    };
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameY.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.gradient}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image
            source={logo}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.Text style={[styles.brandName, nameStyle]}>
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
    marginBottom: 10,
    width: 128,
    height: 128,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.brasikaDisplay,
    color: COLORS.text.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});
