import { View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';

/** Fallback screen for unknown routes. */
export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Page not found' }} />
      <ScreenContainer isScrollable={false}>
        <View className="flex-1 justify-center gap-stack-md">
          <AppText variant="headlineMd" accessibilityRole="header">
            This screen does not exist.
          </AppText>
          <Button
            label="Go to home"
            accessibilityLabel="Go to home screen"
            onPress={() => router.replace('/')}
          />
        </View>
      </ScreenContainer>
    </>
  );
}
