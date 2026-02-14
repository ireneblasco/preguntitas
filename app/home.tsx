import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { MomentType } from '@/data/questions';
import * as onboardingUtils from '@/utils/onboarding';

const momentOptions = [
  { value: 'date-night', label: '💕 Date night' },
  { value: 'deep-talk', label: '🌙 Deep talk' },
  { value: 'chill-night', label: '🍷 Friends night' },
  { value: 'random-fun', label: '🎲 Fun' },
  { value: 'too-many-hours-on-road', label: '🏠 Family' },
  { value: 'birthday', label: '🎂 Birthday' },
  { value: 'work-icebreakers', label: '💼 Work Icebreakers' },
  { value: 'reflections', label: '✨ Self reflections' },
];

export default function Home() {
  const router = useRouter();
  const [selectedMoment, setSelectedMoment] = useState<MomentType>('chill-night');

  const isDevelopment = __DEV__;

  const handleStart = () => {
    router.push(`/questions/${selectedMoment}`);
  };

  const handleRandom = () => {
    router.push('/silly');
  };

  const handleFavorites = () => {
    router.push('/favorites');
  };

  const handleDevMenu = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Developer Menu',
        'Choose an action',
        [
          {
            text: 'Reset Onboarding',
            onPress: async () => {
              await onboardingUtils.resetOnboarding();
              router.replace('/');
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } else {
      // Android uses a different Alert style
      Alert.alert(
        'Developer Menu',
        'Choose an action',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Reset Onboarding',
            onPress: async () => {
              await onboardingUtils.resetOnboarding();
              router.replace('/');
            },
          },
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Question Spot</Text>
          <Text style={styles.subtitle}>Where conversations begin</Text>
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.label}>What's the moment?</Text>
          <MomentSelector value={selectedMoment} onChange={setSelectedMoment} />
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonPrimary,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleStart}
          >
            <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Start</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonYellow,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleRandom}
          >
            <Text style={[styles.buttonText, styles.buttonTextDark]}>Random</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonPink,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleFavorites}
          >
            <Text style={[styles.buttonText, styles.buttonTextDark]}>My favorites</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Floating Dev Button - only visible in development */}
      {isDevelopment && (
        <Pressable
          style={({ pressed }) => [
            styles.devButton,
            pressed && styles.devButtonPressed,
          ]}
          onPress={handleDevMenu}
        >
          <Text style={styles.devBadge}>DEV</Text>
          <Text style={styles.devButtonText}>Dev Menu</Text>
        </Pressable>
      )}
    </LinearGradient>
  );
}

function MomentSelector({
  value,
  onChange,
}: {
  value: MomentType;
  onChange: (value: MomentType) => void;
}) {
  return (
    <View style={styles.chipContainer}>
      {momentOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
              pressed && styles.chipPressed,
            ]}
            onPress={() => onChange(option.value as MomentType)}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.playfair.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  selectorContainer: {
    marginBottom: SPACING['3xl'],
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  chipSelected: {
    backgroundColor: COLORS.accent.primary,
    ...SHADOWS.sm,
  },
  chipUnselected: {
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
  },
  chipTextSelected: {
    color: COLORS.text.white,
  },
  chipTextUnselected: {
    color: COLORS.text.primary,
  },
  buttonsContainer: {
    gap: SPACING.md,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  buttonPrimary: {
    backgroundColor: COLORS.accent.primary,
  },
  buttonYellow: {
    backgroundColor: COLORS.splash.yellow,
  },
  buttonPink: {
    backgroundColor: COLORS.accent.secondary,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
  },
  buttonTextPrimary: {
    color: COLORS.text.white,
  },
  buttonTextDark: {
    color: COLORS.text.primary,
  },
  // Dev Button
  devButton: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
    gap: SPACING.xs,
    zIndex: 100,
  },
  devButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  devBadge: {
    fontSize: 10,
    fontFamily: FONTS.inter.bold,
    color: COLORS.text.secondary,
    letterSpacing: 0.5,
  },
  devButtonText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
});
