import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useQuestions } from '@/contexts/QuestionsContext';
import { useMemo } from 'react';
import * as onboardingUtils from '@/utils/onboarding';

/** Paleta "Crafting a Better World": fondos y texto con buen contraste */
const CARD_THEMES = [
  { bg: '#BEE656', text: '#3C6112' },   // Ethical: lima / verde bosque
  { bg: '#EAC1CC', text: '#6B2A2D' },   // Sophisticated: rosa polvo / burdeos
  { bg: '#3E614A', text: '#BEE656' },   // Transformative: verde bosque / lima
  { bg: '#FDCF42', text: '#6B2A2D' },   // Nature-inspired: amarillo dorado / burdeos
] as const;

function formatLastFetched(iso: string | null): string {
  if (!iso) return 'Using bundled questions';
  try {
    const d = new Date(iso);
    return `Last updated: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return 'Last updated: ' + iso;
  }
}

type MomentOption = { id: string; name: string; emoji: string };

export default function Home() {
  const router = useRouter();
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
    router.push({ pathname: '/questions', params: { moment: momentId } });
  };

  const handleFavorites = () => {
    router.push('/favorites');
  };

  const handleDevMenu = () => {
    const message = formatLastFetched(lastFetchedAt);
    const fetchLatest = () => {
      refetch()
        .then((fetchedAt) => {
          if (fetchedAt == null) {
            Alert.alert('Not configured', 'Add NOTION_API_KEY and NOTION_DATABASE_ID to .env');
          } else {
            Alert.alert('Questions updated', formatLastFetched(fetchedAt));
          }
        })
        .catch((e: Error) => {
          Alert.alert('Error', e?.message ?? 'Fetch failed');
        });
    };

    if (Platform.OS === 'ios') {
      Alert.alert(
        'Developer Menu',
        message,
        [
          {
            text: 'Fetch latest questions',
            onPress: fetchLatest,
          },
          {
            text: 'Reset Onboarding',
            onPress: async () => {
              await onboardingUtils.resetOnboarding();
              router.replace('/');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        'Developer Menu',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Fetch latest questions', onPress: fetchLatest },
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
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.appName}>Shallow</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.lastUpdated} numberOfLines={2}>
                {formatLastFetched(lastFetchedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>
              What's the moment?
            </Text>
            <Pressable onPress={handleFavorites} style={({ pressed }) => pressed && { opacity: 0.7 }}>
              <Text style={styles.seeAll}>My favorites</Text>
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
              <Text style={styles.devButtonText}>Dev Menu</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const CARD_HEIGHT = 112;

function MomentCard({
  option,
  theme,
  questionCount,
  isExpanded,
  onPress,
  onStart,
}: {
  option: MomentOption;
  theme: { bg: string; text: string };
  questionCount: number;
  isExpanded: boolean;
  onPress: () => void;
  onStart: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: theme.bg,
          height: CARD_HEIGHT,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={isExpanded ? 2 : 1}
        >
          {option.name}
        </Text>
        <View style={styles.tagsRow}>
          <View style={[styles.tagPill, { borderColor: theme.text }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>
              {option.emoji} {option.name}
            </Text>
          </View>
          <View style={[styles.tagPill, styles.countPill, { borderColor: theme.text }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>
              {questionCount}
            </Text>
          </View>
        </View>
        {isExpanded && (
          <View style={styles.cardExpanded}>
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: theme.text },
                pressed && styles.startButtonPressed,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              <Text style={[styles.startButtonText, { color: theme.bg }]}>
                Start →
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
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
  headerRight: { maxWidth: '50%' },
  appName: {
    fontSize: FONT_SIZES['3xl'],
    fontFamily: FONTS.playfair.bold,
    color: COLORS.text.primary,
  },
  lastUpdated: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'right',
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
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  card: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.playfair.bold,
    marginBottom: SPACING.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  tagPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  countPill: {
    minWidth: 28,
    alignItems: 'center',
  },
  tagText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
  },
  cardExpanded: {
    marginTop: SPACING.sm,
    alignItems: 'flex-end',
  },
  startButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
  },
  startButtonPressed: { opacity: 0.9 },
  startButtonText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
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
