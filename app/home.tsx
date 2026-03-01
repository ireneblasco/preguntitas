import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useMemo } from 'react';
import * as onboardingUtils from '../utils/onboarding';
import { useTranslation } from '../hooks/useTranslation';
import { MomentCard } from '../components/MomentCard';
import { AppLogo } from '../components/AppLogo';
import { analytics } from '../utils/analytics';

/** Paleta "Crafting a Better World": fondos y texto con buen contraste */
const CARD_THEMES = [
  { bg: '#BEE656', text: '#3C6112' },   // Ethical: lima / verde bosque
  { bg: '#EAC1CC', text: '#6B2A2D' },   // Sophisticated: rosa polvo / burdeos
  { bg: '#3E614A', text: '#BEE656' },   // Transformative: verde bosque / lima
  { bg: '#FDCF42', text: '#6B2A2D' },   // Nature-inspired: amarillo dorado / burdeos
] as const;

function formatLastFetched(iso: string | null, t: (key: string) => string): string {
  if (!iso) return t('dev.usingBundled');
  try {
    const d = new Date(iso);
    const label = t('dev.lastUpdatedLabel');
    return `${label}: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return t('dev.lastUpdatedLabel') + ': ' + iso;
  }
}

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { momentOptions, questions, lastFetchedAt, refetch } = useQuestions();
  const [expandedId, setExpandedId] = useState<string | null>(momentOptions[0]?.id ?? null);

  const questionCountByMoment = useMemo(() => {
    const count: Record<string, number> = {};
    momentOptions.forEach((m) => {
      count[m.id] = questions.filter((q) => q.moment.includes(m.id)).length;
    });
    return count;
  }, [momentOptions, questions]);

  const isDevelopment = __DEV__;

  const handleStart = (momentId: string) => {
    const categoryName = momentOptions.find((m) => m.id === momentId)?.name ?? momentId;
    analytics.categoryOpened(categoryName);
    router.push({ pathname: '/questions', params: { moment: momentId } });
  };

  const handleFavorites = () => {
    router.push('/favorites');
  };

  const handleDevMenu = () => {
    const message = formatLastFetched(lastFetchedAt, t);
    const fetchLatest = () => {
      refetch()
        .then((fetchedAt) => {
          if (fetchedAt == null) {
            Alert.alert(t('alerts.notConfigured'), t('alerts.notConfiguredMessage'));
          } else {
            Alert.alert(t('alerts.questionsUpdated'), formatLastFetched(fetchedAt, t));
          }
        })
        .catch((e: Error) => {
          Alert.alert(t('alerts.error'), e?.message ?? t('alerts.fetchFailed'));
        });
    };

    if (Platform.OS === 'ios') {
      Alert.alert(
        t('dev.menuTitle'),
        message,
        [
          {
            text: t('dev.fetchLatest'),
            onPress: fetchLatest,
          },
          {
            text: t('dev.resetOnboarding'),
            onPress: async () => {
              await onboardingUtils.resetOnboarding();
              router.replace('/');
            },
          },
          { text: t('dev.cancel'), style: 'cancel' },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        t('dev.menuTitle'),
        message,
        [
          { text: t('dev.cancel'), style: 'cancel' },
          { text: t('dev.fetchLatest'), onPress: fetchLatest },
          {
            text: t('dev.resetOnboarding'),
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
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.appName}>{t('home.appName')}</Text>
            </View>
            <View style={styles.headerRight}>
              <Pressable
                onPress={() => router.push('/settings')}
                style={({ pressed }) => pressed && { opacity: 0.7 }}
              >
                <AppLogo size={40} withCircle />
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>
              {t('home.sectionTitle')}
            </Text>
            <Pressable onPress={handleFavorites} style={({ pressed }) => pressed && { opacity: 0.7 }}>
              <Text style={styles.seeAll}>{t('home.myFavorites')}</Text>
            </Pressable>
          </View>

          <View style={styles.cardList}>
            {momentOptions.map((option, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              return (
                <MomentCard
                  key={option.id}
                  option={option}
                  theme={theme}
                  questionCount={questionCountByMoment[option.id] ?? 0}
                  isExpanded={expandedId === option.id}
                  onPress={() => setExpandedId(expandedId === option.id ? null : option.id)}
                  onStart={() => handleStart(option.id)}
                />
              );
            })}
          </View>
        </ScrollView>

        {isDevelopment && (
          <View style={styles.devButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.devButton,
                pressed && styles.devButtonPressed,
              ]}
              onPress={handleDevMenu}
            >
              <Text style={styles.devBadge}>DEV</Text>
              <Text style={styles.devButtonText}>{t('dev.devMenu')}</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  headerLeft: { flex: 1 },
  headerRight: { justifyContent: 'flex-end' },
  appName: {
    fontSize: FONT_SIZES['3xl'],
    fontFamily: FONTS.playfair.bold,
    color: COLORS.text.primary,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
  },
  seeAll: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.accent.primary,
  },
  cardList: {
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  devButtonContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 200,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#E9F0F7',
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
  },
  devButtonPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.95 }],
  },
  devBadge: {
    fontSize: 10,
    fontFamily: FONTS.inter.regular,
    color: '#4A4A4A',
    marginRight: 6,
  },
  devButtonText: {
    fontSize: 12,
    fontFamily: FONTS.inter.regular,
    color: '#4A4A4A',
  },
});
