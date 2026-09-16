import '@/lib/initialize-firebase';
import '../global.css';

import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { SystemBanner } from '@/components/ui/system-banner';
import { useAnalyticsScreen } from '@/hooks/use-analytics-screen';
import { useFirebaseStatus } from '@/hooks/use-firebase-status';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

/**
 * Root layout loading brand fonts and global providers.
 */
export default function RootLayout() {
  const { status, message } = useFirebaseStatus();
  useAnalyticsScreen();
  const [hasLoadedFonts, fontError] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }
  }, [fontError]);

  useEffect(() => {
    if (hasLoadedFonts) {
      void SplashScreen.hideAsync();
    }
  }, [hasLoadedFonts]);

  if (!hasLoadedFonts) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SystemBanner status={status} message={message} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="reframe" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}

