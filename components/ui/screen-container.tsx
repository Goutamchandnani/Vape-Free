import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

export interface ScreenContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  isScrollable?: boolean;
}

/**
 * Root screen wrapper with safe areas and container padding from the design system.
 * Avoids fixed text heights so layouts remain usable at 200 percent font scaling.
 *
 * @param props - Screen content and optional ScrollView passthrough props.
 * @returns Safe, padded screen container.
 */
export function ScreenContainer({
  children,
  isScrollable = true,
  contentContainerStyle,
  ...rest
}: ScreenContainerProps) {
  if (!isScrollable) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-container-padding py-stack-md">{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        {...rest}
        contentContainerStyle={[{ paddingBottom: 32 }, contentContainerStyle]}
        className="flex-1 px-container-padding py-stack-md"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
