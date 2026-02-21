import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslation } from '../hooks/useTranslation';
import {
  SETTINGS_MENU_LOCALES,
  LOCALE_DISPLAY_NAMES,
  getSettingsMenuLocale,
  type Locale,
} from '../i18n';

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const closeDropdown = () => setLanguageDropdownOpen(false);
  const selectLocale = (loc: Locale) => {
    setLocale(loc);
    closeDropdown();
  };

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.warm, COLORS.background.cool]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backLabel}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
        </ScrollView>
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
