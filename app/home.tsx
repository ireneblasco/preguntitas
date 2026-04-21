import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, sortMomentOptions, getCategoryDisplayName } from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { MomentCard } from '../components/MomentCard';
import { analytics } from '../utils/analytics';

/** Short emotional/experiential label per category (no counts). Fallback for unknown categories. */
const MOMENT_LABELS: Record<string, string> = {
  'Deep Stuff 🧠': 'Deep · Reflective',
  'Go Deep 🧠': 'Deep · Reflective',
  'Deep Talk 🧠': 'Deep · Reflective',
  'Ikigai 🌸': 'Purpose · Values',
  'Date Night 🌙': 'Emotional · Intimate',
  'Con mi abuela': 'Stories · Family',
  'Con mi abuela 👵': 'Stories · Family',
  'With Grandparents 💌': 'Stories · Family',
  'Road Trip 🚗': 'Fun · Stories · Meaningful',
  'On the Road 🚗': 'Fun · Stories · Meaningful',
  'Drinks with Friends 🍸': 'Social · Personal',
  'Table Talks 🍷': 'Social · Personal',
  'Break the Ice 🧊': 'Light · Easy',
};
const DEFAULT_MOMENT_LABEL = 'Meaningful';
const NEW_CATEGORY_MATCHER = /who is most likely to/i;
const BREAK_THE_ICE_MATCHER = /break the ice/i;

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { momentOptions } = useQuestions();
  const orderedOptions = useMemo(() => sortMomentOptions(momentOptions), [momentOptions]);

  const handleStart = (momentId: string) => {
    const categoryName = momentOptions.find((m) => m.id === momentId)?.name ?? momentId;
    analytics.categoryOpened(categoryName);
    router.push({ pathname: '/questions', params: { moment: momentId } });
  };

  return (
    <LinearGradient
      colors={[COLORS.background.white, COLORS.background.white]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerSide} />
            <View style={styles.headerCenter}>
              <Text style={styles.appName}>{t('home.appName')}</Text>
            </View>
            <View style={styles.headerSide}>
              <Pressable
                onPress={() => router.push('/settings')}
                style={({ pressed }) => [
                  styles.settingsButton,
                  pressed && styles.settingsButtonPressed,
                ]}
              >
                <Ionicons name="settings-outline" size={20} color={COLORS.text.primary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.cardList}>
            {orderedOptions.map((option, index) => {
              const displayName = getCategoryDisplayName(option) || option.name;
              const isNewCategory =
                NEW_CATEGORY_MATCHER.test(option.id) || NEW_CATEGORY_MATCHER.test(option.name);
              const subtitleLabel = isNewCategory
                ? 'Fun · Light'
                : MOMENT_LABELS[option.id] ?? MOMENT_LABELS[option.name] ?? DEFAULT_MOMENT_LABEL;
              const emoji = BREAK_THE_ICE_MATCHER.test(option.id) || BREAK_THE_ICE_MATCHER.test(option.name)
                ? '🧊'
                : option.emoji;

              return (
                <MomentCard
                  key={option.id}
                  option={{ ...option, name: displayName, emoji }}
                  index={index}
                  subtitleLabel={subtitleLabel}
                  badgeLabel={isNewCategory ? 'NEW' : undefined}
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
    paddingTop: SPACING.sm,
    paddingBottom: SPACING['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerSide: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFED',
  },
  settingsButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  appName: {
    fontSize: FONT_SIZES['3xl'],
    fontFamily: FONTS.brasikaDisplay,
    color: '#055361',
  },
  cardList: {
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
});
