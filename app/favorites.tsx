import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { questions } from '@/data/questions';
import { useFavorites } from '@/utils/useFavorites';
import { usePreferredLanguage, getQuestionText } from '@/utils/usePreferredLanguage';

export default function Favorites() {
  const router = useRouter();
  const { favorites, removeFavorite, loading } = useFavorites();
  const lang = usePreferredLanguage();

  const favoriteQuestions = useMemo(() => {
    return favorites
      .map((id) => questions.find((q) => q.id === id))
      .filter(Boolean) as typeof questions;
  }, [favorites]);

  const renderRightActions = (questionId: string) => {
    return (
      <View style={styles.deleteContainer}>
        <Pressable
          style={styles.deleteButton}
          onPress={() => removeFavorite(questionId)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    );
  };

  const renderItem = ({ item }: { item: typeof questions[0] }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
    >
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{getQuestionText(item, lang)}</Text>
        <Text style={styles.categoryText}>
          {item.moment.join(' • ')}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Favorites</Text>
          <Text style={styles.subtitle}>
            {favoriteQuestions.length === 0
              ? 'No favorites yet'
              : `${favoriteQuestions.length} question${favoriteQuestions.length !== 1 ? 's' : ''} saved`}
          </Text>
        </View>

        {favoriteQuestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Save questions that inspire you by tapping the heart
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
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.playfair.regular,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  questionCard: {
    backgroundColor: COLORS.card.background,
    borderRadius: BORDER_RADIUS['3xl'],
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...SHADOWS.sm,
  },
  questionText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
    lineHeight: FONT_SIZES.lg * 1.5,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: SPACING.lg,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.white,
  },
  emptyContainer: {
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
