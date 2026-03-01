import '../global.css';
import { Stack } from 'expo-router';
import { useCallback, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { QuestionsProvider } from '../contexts/QuestionsContext';
import { LocaleProvider } from '../contexts/LocaleContext';

// Prevent the splash screen from auto-hiding (avoids "Downloading 100%" staying visible)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const splashHidden = useRef(false);

  const onLayoutRootView = useCallback(async () => {
    if (splashHidden.current) return;
    splashHidden.current = true;
    try {
      await SplashScreen.hideAsync();
    } catch (_e) {
      // ignore if already hidden
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <LocaleProvider>
        <QuestionsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="home" />
          <Stack.Screen name="questions" />
          <Stack.Screen name="favorites" />
          <Stack.Screen name="settings" />
        </Stack>
        </QuestionsProvider>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
