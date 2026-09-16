import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScreenContainer } from '@/components/ui/screen-container';
import { pickReframeTip } from '@/constants/reframe-tips';
import { colors } from '@/constants/theme';

const JOURNAL_ROUTE = '/journal' as Href;

export interface SupportiveReframeScreenProps {
  streakDays: number;
}

/**
 * Supportive reframing screen shown after a slip-up, aligned to the Stitch wireframe.
 *
 * @param props - Current streak length for personalised copy.
 * @returns Full-screen reframing experience without tab navigation.
 */
export function SupportiveReframeScreen({ streakDays }: SupportiveReframeScreenProps) {
  const router = useRouter();
  const [tip, setTip] = useState<string | null>(null);
  const streakLabel = useMemo(() => {
    if (streakDays <= 0) {
      return 'progress so far';
    }

    return `${streakDays} clean day${streakDays === 1 ? '' : 's'}`;
  }, [streakDays]);

  return (
    <ScreenContainer contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="items-center gap-stack-lg">
        <View className="items-center gap-stack-md">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-secondary-container/30">
            <Ionicons name="leaf" size={48} color={colors.secondary} />
          </View>

          <View accessible accessibilityRole="header" className="items-center gap-stack-sm">
            <AppText variant="headlineLgMobile" color="onSurface" className="text-center">
              Every breath is a new beginning.
            </AppText>
            <AppText variant="bodyLg" color="onSurfaceVariant" className="text-center">
              One slip-up doesn&apos;t erase your progress. Your {streakLabel} are still yours.
            </AppText>
          </View>
        </View>

        <View className="w-full gap-gutter">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log and breathe. Open journal to note what happened."
            onPress={() => router.replace(JOURNAL_ROUTE)}
          >
            <Card className="gap-stack-sm">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary-container/30">
                <Ionicons name="create-outline" size={24} color={colors.secondary} />
              </View>
              <AppText variant="headlineMd" color="onSurface">
                Log &amp; Breathe
              </AppText>
              <AppText variant="bodyMd" color="onSurfaceVariant">
                Note what happened to understand your triggers, then take a deep breath.
              </AppText>
            </Card>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Get a supportive tip"
            onPress={() => setTip(pickReframeTip())}
          >
            <Card className="gap-stack-sm">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-container/30">
                <Ionicons name="heart-outline" size={24} color={colors.primary} />
              </View>
              <AppText variant="headlineMd" color="onSurface">
                Get a Tip
              </AppText>
              <AppText variant="bodyMd" color="onSurfaceVariant">
                Read a gentle, supportive tip to help you refocus your energy.
              </AppText>
            </Card>
          </Pressable>
        </View>

        {tip ? (
          <Card accessible accessibilityLabel={`Supportive tip: ${tip}`}>
            <AppText variant="bodyMd" color="onSurface">
              {tip}
            </AppText>
          </Card>
        ) : null}

        <Button
          label="I just need a moment"
          variant="ghost"
          accessibilityLabel="Dismiss supportive reframing screen"
          onPress={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}
