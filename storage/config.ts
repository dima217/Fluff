import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export abstract class BaseStorage<T> {
  constructor(protected readonly key: string) {}

  getAll(): T[] {
    try {
      const raw = storage.getString(this.key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch (e) {
      console.warn(`${this.key}.getAll error`, e);
      return [];
    }
  }

  setAll(data: T[]): void {
    try {
      storage.set(this.key, JSON.stringify(data));
    } catch (e) {
      console.warn(`${this.key}.setAll error`, e);
    }
  }

  clear(): void {
    storage.delete(this.key);
  }
}

export abstract class BaseObjectStorage<T extends object> {
  constructor(
    protected readonly key: string,
    protected readonly defaults: T,
  ) {}

  get(): T {
    try {
      const raw = storage.getString(this.key);
      if (raw) {
        return { ...this.defaults, ...(JSON.parse(raw) as Partial<T>) };
      }
    } catch (e) {
      console.warn(`${this.key}.get error`, e);
    }
    return { ...this.defaults };
  }

  set(data: Partial<T>): void {
    try {
      storage.set(this.key, JSON.stringify({ ...this.get(), ...data }));
    } catch (e) {
      console.warn(`${this.key}.set error`, e);
    }
  }

  clear(): void {
    storage.delete(this.key);
  }
}
