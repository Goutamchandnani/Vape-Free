import NetInfo from '@react-native-community/netinfo';

/**
 * Resolves the current network reachability once for send-time checks.
 *
 * @returns True when the device appears online.
 */
export async function getIsNetworkOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected && state.isInternetReachable !== false);
}
