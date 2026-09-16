import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Tracks whether the device currently has an internet connection.
 *
 * @returns True when the device appears online.
 */
export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void NetInfo.fetch().then((state) => {
      if (isMounted) {
        setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
      }
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return isOnline;
}
