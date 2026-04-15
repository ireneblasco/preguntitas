import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, getThemeForMomentId, getCategoryDisplayName } from '../constants';
import { useQuestions, type Question } from '../contexts/QuestionsContext';
import { useFavorites } from '../utils/useFavorites';
import { usePreferredLanguage, getQuestionText } from '../utils/usePreferredLanguage';
import { useTranslation } from '../hooks/useTranslation';

export default function Favorites() {
  const router = useRouter();
  const { t } = useTranslation();
  const { questions, momentOptions, questionTextByLocale } = useQuestions();
  const { favorites, removeFavorite } = useFavorites();
  const lang = usePreferredLanguage();

  const favoriteQuestions = useMemo(() => {
    return favorites
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is Question => q != null);
  }, [favorites, questions]);

  const renderRightActions = (questionId: string) => (
    <View style={styles.deleteWrap}>
      <Pressable
        style={styles.deleteButton}
        onPress={() => removeFavorite(questionId)}
      >
        <Text style={styles.deleteText}>{t('favorites.remove')}</Text>
      </Pressable>
    </View>
  );

  const renderItem = ({ item }: { item: Question }) => {
    const momentId = item.moment[0] ?? '';
    const theme = getThemeForMomentId(momentId, momentOptions);
    const momentOption = momentOptions.find((m) => m.id === momentId);
    const momentLabel = getCategoryDisplayName(momentOption) || momentOption?.name || momentId;

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        overshootRight={false}
      >
        <View style={[styles.card, { backgroundColor: theme.bg }]}>
          <View style={[styles.pill, { borderColor: theme.text }]}>
            <Text style={[styles.pillText, { color: theme.text }]}>{momentLabel}</Text>
          </View>
          <Text style={[styles.questionText, { color: theme.text }]} numberOfLines={3}>
            {getQuestionText(item, lang, questionTextByLocale)}
          </Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.background.white, COLORS.background.primary]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backLabel}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t('favorites.savedQuestions')}</Text>
          <Text style={styles.sectionCount}>
            {favoriteQuestions.length}
          </Text>
        </View>

        {favoriteQuestions.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              {t('favorites.emptyHint')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteQuestions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    minHeight: 44,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    fontSize: 32,
    fontWeight: '300',
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  headerRight: { width: 44 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
  },
  sectionCount: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
    gap: SPACING.md,
  },
  card: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  pillText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
  },
  questionText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.regular,
    lineHeight: FONT_SIZES.lg * 1.45,
  },
  deleteWrap: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: SPACING.sm,
    marginBottom: SPACING.md,
  },
  deleteButton: {
    backgroundColor: '#6B2A2D',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    minHeight: 80,
  },
  deleteText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: '#F8F5EE',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.lg * 1.5,
  },
});
