import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  getCategoryDisplayName,
  getMomentBannerTheme,
  getMomentEmblemSource,
} from '../constants';
import { useQuestions } from '../contexts/QuestionsContext';
import { useTranslation } from '../hooks/useTranslation';
import { formatTranslation } from '../utils/formatTranslation';
import { getGamePlayers, setGamePlayers, clearGamePlayers } from '../utils/players';

const MIN_SLOTS = 1;
const DEFAULT_SLOTS = 2;
const MAX_PLAYERS = 12;

const AVATAR_PALETTE = [
  { bg: 'rgba(45, 90, 71, 0.12)', fg: COLORS.brand.forest },
  { bg: 'rgba(194, 70, 81, 0.12)', fg: COLORS.brand.terracotta },
  { bg: 'rgba(242, 153, 93, 0.16)', fg: COLORS.brand.orange },
  { bg: 'rgba(217, 237, 130, 0.45)', fg: '#5A6B2E' },
  { bg: 'rgba(90, 169, 230, 0.14)', fg: '#2E6B9A' },
  { bg: 'rgba(242, 189, 205, 0.35)', fg: '#9E4A62' },
] as const;

function firstParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return undefined;
}

function normalizeSlots(names: string[]): string[] {
  const trimmed = names.map((n) => n.trim());
  const filled = trimmed.filter((n) => n.length > 0);
  if (filled.length >= MIN_SLOTS) return trimmed;
  const slots = [...trimmed];
  while (slots.length < MIN_SLOTS) slots.push('');
  return slots;
}

function playerInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase();
}

export default function SetupPlayers() {
  const router = useRouter();
  const params = useLocalSearchParams<{ moment?: string }>();
  const moment = firstParam(params.moment);
  const { t } = useTranslation();
  const { momentOptions } = useQuestions();
  const [names, setNames] = useState<string[]>(() => Array.from({ length: DEFAULT_SLOTS }, () => ''));
  const [loaded, setLoaded] = useState(false);

  const momentOption = moment ? momentOptions.find((m) => m.id === moment) : null;
  const momentLabel = moment
    ? getCategoryDisplayName(momentOption) || momentOption?.name || moment
    : '';
  const momentEmoji = momentOption?.emoji ?? '✨';
  const momentBanner = useMemo(() => {
    const key = moment ?? momentOption?.name ?? '';
    return getMomentBannerTheme(key);
  }, [moment, momentOption?.name]);
  const momentEmblem = useMemo(() => {
    if (!moment) return undefined;
    return getMomentEmblemSource(moment) ?? getMomentEmblemSource(momentOption?.name);
  }, [moment, momentOption?.name]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await getGamePlayers();
      if (cancelled) return;
      if (saved.length > 0) {
        setNames(normalizeSlots(saved));
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filledCount = useMemo(
    () => names.map((n) => n.trim()).filter((n) => n.length > 0).length,
    [names]
  );
  const canStart = filledCount > 0;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const updateName = useCallback((index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const addSlot = useCallback(() => {
    setNames((prev) => (prev.length >= MAX_PLAYERS ? prev : [...prev, '']));
  }, []);

  const removeSlot = useCallback((index: number) => {
    setNames((prev) => {
      if (prev.length > MIN_SLOTS) {
        const next = prev.filter((_, i) => i !== index);
        return next.length > 0 ? next : [''];
      }
      const next = [...prev];
      next[index] = '';
      return next;
    });
  }, []);

  const goToQuestions = useCallback(
    async (withPlayers: boolean) => {
      if (!moment) {
        router.back();
        return;
      }
      if (withPlayers) {
        const cleaned = names.map((n) => n.trim()).filter((n) => n.length > 0);
        if (cleaned.length === 0) return;
        await setGamePlayers(cleaned);
      } else {
        await clearGamePlayers();
      }
      router.replace({ pathname: '/questions', params: { moment } });
    },
    [moment, names, router]
  );

  if (!moment) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
              <Text style={styles.backLabel}>‹</Text>
            </Pressable>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={12}
            accessibilityRole="button"
          >
            <Text style={styles.backLabel}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {momentLabel}
          </Text>
          <Pressable
            style={styles.skipHeaderBtn}
            onPress={() => goToQuestions(false)}
            hitSlop={12}
            accessibilityRole="button"
          >
            <Text style={styles.skipHeaderText}>{t('players.skip')}</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={12}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.momentChipOuter,
                { borderColor: momentBanner.borderColor },
              ]}
            >
              <View style={[styles.momentChip, { backgroundColor: momentBanner.bg }]}>
                <View style={styles.momentEmblemTile}>
                  {momentEmblem ? (
                    <Image
                      source={momentEmblem}
                      style={styles.momentEmblemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.momentEmoji}>{momentEmoji}</Text>
                  )}
                </View>
                <View style={styles.momentChipCopy}>
                  <Text style={[styles.momentChipLabel, { color: momentBanner.labelColor }]}>
                    {t('players.momentLabel')}
                  </Text>
                  <Text
                    style={[styles.momentChipTitle, { color: momentBanner.titleColor }]}
                    numberOfLines={2}
                  >
                    {momentLabel}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.headline}>{t('players.title')}</Text>
            <Text style={styles.subtitle}>{t('players.subtitle')}</Text>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('players.sectionLabel')}</Text>
              {filledCount > 0 ? (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {formatTranslation(t('players.count'), { count: String(filledCount) })}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.groupCard}>
              {names.map((name, index) => {
                const palette = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
                const initial = playerInitial(name);
                const canRemoveRow = names.length > MIN_SLOTS;
                const canClearName = initial.length > 0;
                const showRemove = canRemoveRow || canClearName;
                const isLast = index === names.length - 1;
                const showAddRow = names.length < MAX_PLAYERS;
                return (
                  <View
                    key={`player-${index}`}
                    style={[
                      styles.playerRow,
                      (!isLast || showAddRow) && styles.playerRowBorder,
                    ]}
                  >
                    <View style={styles.avatarColumn}>
                      <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
                        {initial ? (
                          <Text style={[styles.avatarText, { color: palette.fg }]}>
                            {initial}
                          </Text>
                        ) : (
                          <Ionicons
                            name="person-outline"
                            size={22}
                            color={palette.fg}
                            style={styles.avatarPlaceholderIcon}
                          />
                        )}
                      </View>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={(value) => updateName(index, value)}
                      placeholder={formatTranslation(t('players.namePlaceholder'), {
                        n: String(index + 1),
                      })}
                      placeholderTextColor={COLORS.text.light}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="next"
                      editable={loaded}
                      accessibilityLabel={formatTranslation(t('players.namePlaceholder'), {
                        n: String(index + 1),
                      })}
                    />
                    {showRemove ? (
                      <Pressable
                        style={({ pressed }) => [
                          styles.removeBtn,
                          pressed && styles.pressed,
                        ]}
                        onPress={() => removeSlot(index)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={t('players.remove')}
                        accessibilityHint={
                          canRemoveRow ? t('players.removeHint') : t('players.clearHint')
                        }
                      >
                        <Ionicons
                          name={canRemoveRow ? 'trash-outline' : 'close'}
                          size={18}
                          color={canRemoveRow ? COLORS.brand.terracotta : COLORS.text.light}
                        />
                      </Pressable>
                    ) : (
                      <View style={styles.removePlaceholder} />
                    )}
                  </View>
                );
              })}

              {names.length < MAX_PLAYERS ? (
                <Pressable
                  style={({ pressed }) => [pressed && styles.pressed]}
                  onPress={addSlot}
                  accessibilityRole="button"
                  accessibilityLabel={t('players.addPlayer')}
                >
                  <View style={[styles.playerRow, styles.addRow]}>
                    <View style={styles.avatarColumn}>
                      <View style={[styles.avatar, styles.addAvatar]}>
                        <Ionicons name="add" size={22} color="#FFFFFF" />
                      </View>
                    </View>
                    <Text style={styles.addRowText}>{t('players.addPlayer')}</Text>
                    <View style={styles.removePlaceholder} />
                  </View>
                </Pressable>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                !canStart && styles.primaryBtnDisabled,
                pressed && canStart && styles.pressedScale,
              ]}
              onPress={() => goToQuestions(true)}
              disabled={!canStart}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canStart }}
            >
              <Text style={styles.primaryBtnText}>{t('players.start')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
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
    color: COLORS.brand.forest,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xs,
  },
  headerRight: {
    width: 44,
  },
  skipHeaderBtn: {
    minWidth: 44,
    maxWidth: 110,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  skipHeaderText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    fontWeight: '600',
    color: COLORS.brand.forest,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  momentChipOuter: {
    borderRadius: BORDER_RADIUS['2xl'],
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  momentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  momentEmblemTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentEmblemImage: {
    width: '100%',
    height: '100%',
  },
  momentEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  momentChipCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  momentChipLabel: {
    fontSize: 10,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  momentChipTitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '600',
    lineHeight: 22,
  },
  headline: {
    fontSize: FONT_SIZES['2xl'],
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    lineHeight: 24,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(45, 90, 71, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 71, 0.12)',
  },
  countBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    color: COLORS.brand.forest,
    letterSpacing: 0.2,
  },
  groupCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    borderWidth: 1,
    borderColor: '#ECECF0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    minHeight: 64,
  },
  playerRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border.light,
  },
  avatarColumn: {
    width: 40,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  avatarPlaceholderIcon: {
    opacity: 0.42,
  },
  addAvatar: {
    backgroundColor: COLORS.brand.forest,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 0,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(36, 61, 51, 0.06)',
  },
  removePlaceholder: {
    width: 32,
    height: 32,
  },
  addRow: {
    backgroundColor: 'rgba(217, 237, 130, 0.22)',
  },
  addRowText: {
    flex: 1,
    flexShrink: 1,
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
    color: COLORS.brand.forest,
    letterSpacing: 0.1,
    lineHeight: 22,
    textAlignVertical: 'center',
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
    paddingTop: SPACING.md,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.interactive.active,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
    shadowColor: COLORS.brand.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.42,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.bold,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  pressedScale: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
