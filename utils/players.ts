import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_PLAYERS_KEY = 'game_players';

export async function getGamePlayers(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(GAME_PLAYERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  } catch (error) {
    console.error('Error reading game players:', error);
    return [];
  }
}

export async function setGamePlayers(names: string[]): Promise<void> {
  try {
    const cleaned = names.map((n) => n.trim()).filter((n) => n.length > 0);
    await AsyncStorage.setItem(GAME_PLAYERS_KEY, JSON.stringify(cleaned));
  } catch (error) {
    console.error('Error saving game players:', error);
  }
}

export async function clearGamePlayers(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GAME_PLAYERS_KEY);
  } catch (error) {
    console.error('Error clearing game players:', error);
  }
}
