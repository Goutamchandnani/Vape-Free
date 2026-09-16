import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';

/**
 * Reflects the user's reduced motion accessibility preference.
 *
 * @returns True when animations should be minimised.
 */
export function useReducedMotion(): boolean {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (isMounted) {
        setIsReducedMotionEnabled(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setIsReducedMotionEnabled(enabled);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return isReducedMotionEnabled;
}

/**
 * Chooses whether UI transitions should animate based on reduced motion.
 *
 * @param isReducedMotionEnabled - User preference from useReducedMotion.
 * @returns False when motion should be reduced.
 */
export function shouldAnimateTransitions(isReducedMotionEnabled: boolean): boolean {
  return !isReducedMotionEnabled;
}
