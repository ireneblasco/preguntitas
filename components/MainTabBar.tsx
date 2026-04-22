import { View, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { SPACING } from '../constants';

const IOS_LINK = '#007AFF';
const IOS_TAB_INACTIVE = '#8E8E93';

/** Altura fija de la fila de iconos (sin safe area inferior). */
export const MAIN_TAB_BAR_ROW = 56;

export function mainTabBarBottomInset(safeBottom: number): number {
  return MAIN_TAB_BAR_ROW + Math.max(safeBottom, 10);
}

const shadowTab = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 8,
} as const;

export function MainTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const isHome = pathname === '/home';
  const isFavorites = pathname === '/favorites';
  const isSettings = pathname === '/settings';

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Pressable
        style={styles.tabItem}
        onPress={() => router.replace('/favorites')}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFavorites }}
        accessibilityLabel={t('home.tabSaved')}
      >
        <View style={styles.tabIconSlot}>
          {isFavorites ? (
            <View style={styles.tabActiveIcon}>
              <Ionicons name="heart" size={22} color="#FFFFFF" />
            </View>
          ) : (
            <Ionicons name="heart-outline" size={24} color={IOS_TAB_INACTIVE} />
          )}
        </View>
        <Text style={[styles.tabLabel, isFavorites && styles.tabLabelActive]}>{t('home.tabSaved')}</Text>
      </Pressable>

      <Pressable
        style={styles.tabItem}
        onPress={() => router.replace('/home')}
        accessibilityRole="tab"
        accessibilityState={{ selected: isHome }}
        accessibilityLabel={t('home.tabHome')}
      >
        <View style={styles.tabIconSlot}>
          {isHome ? (
            <View style={styles.tabActiveIcon}>
              <Ionicons name="home" size={22} color="#FFFFFF" />
            </View>
          ) : (
            <Ionicons name="home-outline" size={24} color={IOS_TAB_INACTIVE} />
          )}
        </View>
        <Text style={[styles.tabLabel, isHome && styles.tabLabelActive]}>{t('home.tabHome')}</Text>
      </Pressable>

      <Pressable
        style={styles.tabItem}
        onPress={() => router.replace('/settings')}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSettings }}
        accessibilityLabel={t('home.tabSettings')}
      >
        <View style={styles.tabIconSlot}>
          {isSettings ? (
            <View style={styles.tabActiveIcon}>
              <Ionicons name="settings" size={22} color="#FFFFFF" />
            </View>
          ) : (
            <Ionicons name="settings-outline" size={24} color={IOS_TAB_INACTIVE} />
          )}
        </View>
        <Text style={[styles.tabLabel, isSettings && styles.tabLabelActive]}>{t('home.tabSettings')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: SPACING.sm,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8ED',
    ...shadowTab,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  tabIconSlot: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActiveIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IOS_LINK,
  },
  tabLabel: {
    fontSize: 11,
    color: IOS_TAB_INACTIVE,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: IOS_LINK,
    fontWeight: '600',
  },
});
