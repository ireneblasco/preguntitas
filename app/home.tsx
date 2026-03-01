import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { MomentCard } from '../components/MomentCard';
import { AppLogo } from '../components/AppLogo';
import { analytics } from '../utils/analytics';

/** Paleta cohesiva estilo iOS: fondos y texto con buen contraste */
const CARD_THEMES = [
  { bg: '#BEE656', text: '#3C6112' },   // Deep Talk: lima / verde bosque
  { bg: '#EAC1CC', text: '#6B2A2D' },   // Ikigai: rosa polvo / burdeos
  { bg: '#3E614A', text: '#BEE656' },   // Date Night: verde bosque / lima
  { bg: '#FDCF42', text: '#6B2A2D' },   // Con mi abuela: amarillo dorado / burdeos
  { bg: '#5B9BD1', text: '#1A2E45' },   // Road Trip: azul intenso / azul oscuro (tonos fuertes, contraste)
  { bg: '#C9B8A8', text: '#3D2E28' },   // Table Talks: beige terracota / marrón
] as const;

/** Orden deseado de categorías: Deep Talk, Ikigai, Date Night, Con mi abuela, resto */
const CARD_ORDER_IDS = ['Deep Talk 🧠', 'Ikigai 🌸', 'Date Night 🌙'] as const;

function sortMomentOptions<T extends { id: string; name: string }>(options: T[]): T[] {
  const order = [...CARD_ORDER_IDS];
  const conMiAbuela = options.find((o) => o.name === 'Con mi abuela');
  const rest = options.filter(
    (o) => !order.includes(o.id as (typeof CARD_ORDER_IDS)[number]) && o.name !== 'Con mi abuela'
  );
  const ordered: T[] = [];
  for (const id of order) {
    const option = options.find((o) => o.id === id);
    if (option) ordered.push(option);
  }
  if (conMiAbuela) ordered.push(conMiAbuela);
  for (const o of rest) ordered.push(o);
  return ordered;
}

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { momentOptions, questions } = useQuestions();
  const orderedOptions = useMemo(() => sortMomentOptions(momentOptions), [momentOptions]);
  const [expandedId, setExpandedId] = useState<string | null>(orderedOptions[0]?.id ?? null);

  const questionCountByMoment = useMemo(() => {
    const count: Record<string, number> = {};
    momentOptions.forEach((m) => {
      count[m.id] = questions.filter((q) => q.moment.includes(m.id)).length;
    });
    return count;
  }, [momentOptions, questions]);

  const handleStart = (momentId: string) => {
    const categoryName = momentOptions.find((m) => m.id === momentId)?.name ?? momentId;
    analytics.categoryOpened(categoryName);
    router.push({ pathname: '/questions', params: { moment: momentId } });
  };

  const handleFavorites = () => {
    router.push('/favorites');
  };

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
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
            <Pressable onPress={handleFavorites} style={({ pressed }) => pressed && { opacity: 0.7 }}>
              <Text style={styles.seeAll}>{t('home.myFavorites')}</Text>
            </Pressable>
          </View>

          <View style={styles.cardList}>
            {orderedOptions.map((option, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              return (
                <MomentCard
                  key={option.id}
                  option={option}
                  theme={theme}
                  questionCount={questionCountByMoment[option.id] ?? 0}
                  isExpanded={expandedId === option.id}
                  onStart={() => handleStart(option.id)}
                />
              );
            })}
          </View>
        </ScrollView>
        {/* Fade inferior estilo iOS: indica que hay más categorías abajo */}
        <View style={styles.bottomFade} pointerEvents="none">
          <LinearGradient
            colors={['transparent', COLORS.background.cool]}
            style={StyleSheet.absoluteFill}
          />
        </View>
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
    color: COLORS.text.primary,
  },
  cardList: {
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
});
