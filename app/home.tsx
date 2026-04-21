import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, CARD_THEMES, sortMomentOptions, getCategoryDisplayName } from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { MomentCard } from '../components/MomentCard';
import { AppLogo } from '../components/AppLogo';
import { analytics } from '../utils/analytics';

/** Short emotional/experiential label per category (no counts). Fallback for unknown categories. */
const MOMENT_LABELS: Record<string, string> = {
  'Deep Stuff 🧠': 'Deep · Reflective',
  'Deep Talk 🧠': 'Deep · Reflective',
  'Ikigai 🌸': 'Purpose · Values',
  'Date Night 🌙': 'Emotional · Intimate',
  'Con mi abuela': 'Stories · Family',
  'Con mi abuela 👵': 'Stories · Family',
  'With Grandparents 💌': 'Stories · Family',
  'Road Trip 🚗': 'Fun · Stories · Meaningful',
  'Drinks with Friends 🍸': 'Social · Personal',
  'Table Talks 🍷': 'Social · Personal',
  'Break the Ice 🧊': 'Light · Easy',
};
const DEFAULT_MOMENT_LABEL = 'Meaningful';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { momentOptions } = useQuestions();
  const orderedOptions = useMemo(() => sortMomentOptions(momentOptions), [momentOptions]);
  const [expandedId, setExpandedId] = useState<string | null>(orderedOptions[0]?.id ?? null);

  const handleStart = (momentId: string) => {
    const categoryName = momentOptions.find((m) => m.id === momentId)?.name ?? momentId;
    analytics.categoryOpened(categoryName);
    router.push({ pathname: '/questions', params: { moment: momentId } });
  };

  return (
    <LinearGradient
      colors={[COLORS.background.white, COLORS.background.primary]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
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
          </View>

          <View style={styles.cardList}>
            {orderedOptions.map((option, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              return (
                <MomentCard
                  key={option.id}
                  option={{ ...option, name: getCategoryDisplayName(option) || option.name }}
                  theme={theme}
                  subtitleLabel={MOMENT_LABELS[option.id] ?? MOMENT_LABELS[option.name] ?? DEFAULT_MOMENT_LABEL}
                  isExpanded={expandedId === option.id}
                  onStart={() => handleStart(option.id)}
                />
              );
            })}
          </View>
        </ScrollView>
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
    fontFamily: FONTS.brasikaDisplay,
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
  cardList: {
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
});
