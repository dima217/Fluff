import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const SEARCH_HISTORY_KEY = "search_history";
const LAST_VISITED_KEY = "last_visited_recipes";
const MAX_HISTORY_ITEMS = 10;
const MAX_LAST_VISITED = 10;

export const searchStorage = {
  // Search history
  getSearchHistory(): string[] {
    try {
      const history = storage.getString(SEARCH_HISTORY_KEY);
      if (history) {
        return JSON.parse(history) as string[];
      }
    } catch (error) {
      console.error("Error reading search history:", error);
    }
    return [];
  },

  addToSearchHistory(query: string): void {
    if (!query || query.trim().length === 0) return;

    const history = this.getSearchHistory();
    // Remove duplicate and add to beginning
    const filtered = history.filter(
      (item) => item.toLowerCase() !== query.toLowerCase()
    );
    const updated = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    try {
      storage.set(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  },

  clearSearchHistory(): void {
    storage.delete(SEARCH_HISTORY_KEY);
  },

  // Last visited recipes
  getLastVisited(): number[] {
    try {
      const visited = storage.getString(LAST_VISITED_KEY);
      if (visited) {
        return JSON.parse(visited) as number[];
      }
    } catch (error) {
      console.error("Error reading last visited:", error);
    }
    return [];
  },

  addToLastVisited(recipeId: number): void {
    if (!recipeId) return;

    const visited = this.getLastVisited();
    // Remove duplicate and add to beginning
    const filtered = visited.filter((id) => id !== recipeId);
    const updated = [recipeId, ...filtered].slice(0, MAX_LAST_VISITED);

    try {
      storage.set(LAST_VISITED_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving last visited:", error);
    }
  },

  clearLastVisited(): void {
    storage.delete(LAST_VISITED_KEY);
  },
};
