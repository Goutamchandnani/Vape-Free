import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearOfflineChatMessages,
  getOfflineChatMessages,
  sendOfflineSupportExchange,
} from '@/lib/offline-chat-repository';

describe('offline-chat-repository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('stores an offline user and assistant exchange', async () => {
    await sendOfflineSupportExchange('user-1', 'I have a craving');
    const messages = await getOfflineChatMessages('user-1');

    expect(messages).toHaveLength(2);
    expect(messages[0]?.role).toBe('user');
    expect(messages[1]?.role).toBe('assistant');
    expect(messages[1]?.supportSource).toBe('offline_companion');
  });

  it('clears stored offline messages', async () => {
    await sendOfflineSupportExchange('user-1', 'Hello');
    await clearOfflineChatMessages('user-1');

    expect(await getOfflineChatMessages('user-1')).toEqual([]);
  });
});
