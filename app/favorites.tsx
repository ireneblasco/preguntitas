import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useMemo } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, getThemeForMomentId, getCategoryDisplayName } from '../constants';
import { useQuestions, type Question } from '../contexts/QuestionsContext';
import { useFavorites } from '../utils/useFavorites';
import { usePreferredLanguage, getQuestionText } from '../utils/usePreferredLanguage';
import { useTranslation } from '../hooks/useTranslation';
import { MainTabBar, mainTabBarBottomInset } from '../components/MainTabBar';

export default function Favorites() {
  const insets = useSafeAreaInsets();
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

  const tabInset = mainTabBarBottomInset(insets.bottom);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[COLORS.background.white, COLORS.background.white]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerSide} />
            <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
            <View style={styles.headerSide} />
          </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t('favorites.savedQuestions')}</Text>
          <Text style={styles.sectionCount}>
            {favoriteQuestions.length}
          </Text>
        </View>

        {favoriteQuestions.length === 0 ? (
          <View style={[styles.emptyWrap, { paddingBottom: tabInset }]}>
            <Text style={styles.emptyText}>
              {t('favorites.emptyHint')}
            </Text>
          </View>
        ) : (
          <FlatList
            style={styles.listFlex}
            data={favoriteQuestions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, { paddingBottom: tabInset + SPACING.lg }]}
            showsVerticalScrollIndicator={false}
          />
        )}
        </SafeAreaView>
      </LinearGradient>
      <MainTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
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
  headerSide: { width: 44, height: 44 },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
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
  listFlex: { flex: 1 },
  listContent: {
    paddingHorizontal: SPACING.lg,
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
