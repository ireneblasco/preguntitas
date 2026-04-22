import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useLocale } from '../contexts/LocaleContext';
import { useQuestions } from '../contexts/QuestionsContext';
import { useTranslation } from '../hooks/useTranslation';
import {
  SETTINGS_MENU_LOCALES,
  LOCALE_DISPLAY_NAMES,
  getSettingsMenuLocale,
  type Locale,
} from '../i18n';
import * as onboardingUtils from '../utils/onboarding';
import { MainTabBar, mainTabBarBottomInset } from '../components/MainTabBar';

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

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { lastFetchedAt, refetch } = useQuestions();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const closeDropdown = () => setLanguageDropdownOpen(false);
  const selectLocale = (loc: Locale) => {
    setLocale(loc);
    closeDropdown();
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
          { text: t('dev.fetchLatest'), onPress: fetchLatest },
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
            <Text style={styles.headerTitle}>{t('settings.title')}</Text>
            <View style={styles.headerSide} />
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset + SPACING.lg }]}
            showsVerticalScrollIndicator={false}
          >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
            <Pressable
              style={styles.dropdownTrigger}
              onPress={() => setLanguageDropdownOpen(true)}
            >
              <Text style={styles.dropdownTriggerText}>
                {LOCALE_DISPLAY_NAMES[getSettingsMenuLocale(locale)]}
              </Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </Pressable>

            <Modal
              visible={languageDropdownOpen}
              transparent
              animationType="fade"
              onRequestClose={closeDropdown}
            >
              <View style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={closeDropdown} />
                <View style={styles.dropdownPanel}>
                  <ScrollView
                    style={styles.dropdownScroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                  >
                    {SETTINGS_MENU_LOCALES.map((loc) => {
                      const isSelected = getSettingsMenuLocale(locale) === loc;
                      return (
                        <Pressable
                          key={loc}
                          style={[
                            styles.dropdownOption,
                            isSelected && styles.dropdownOptionActive,
                          ]}
                          onPress={() => selectLocale(loc)}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              isSelected && styles.dropdownOptionTextActive,
                            ]}
                          >
                            {LOCALE_DISPLAY_NAMES[loc]}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>

          {__DEV__ && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('dev.menuTitle')}</Text>
              <Pressable style={styles.dropdownTrigger} onPress={handleDevMenu}>
                <Text style={styles.dropdownTriggerText}>{t('dev.devMenu')}</Text>
                <Text style={styles.dropdownChevron}>›</Text>
              </Pressable>
            </View>
          )}
          </ScrollView>
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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.background.primary,
  },
  dropdownTriggerText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
  },
  dropdownChevron: {
    fontSize: 10,
    color: COLORS.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dropdownPanel: {
    maxHeight: '70%',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownOption: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border.light,
  },
  dropdownOptionActive: {
    backgroundColor: COLORS.accent.primary,
    borderBottomColor: COLORS.accent.primary,
  },
  dropdownOptionText: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.inter.regular,
    color: COLORS.text.primary,
  },
  dropdownOptionTextActive: {
    color: '#F8F5EE',
  },
});
