import { Store } from '@tauri-apps/plugin-store';
import type { Storage } from 'redux-persist';

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

let storePromise: Promise<Store> | null = null;

function getTauriStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = Store.load('redux-persist.json');
  }
  return storePromise;
}

const localStorageAdapter: Storage = {
  getItem: (key) =>
    typeof localStorage !== 'undefined'
      ? Promise.resolve(localStorage.getItem(key))
      : Promise.resolve(null),
  setItem: (key, value) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export const tauriStorage: Storage = {
  async getItem(key) {
    if (!isTauri()) return localStorageAdapter.getItem(key);
    const store = await getTauriStore();
    return (await store.get<string>(key)) ?? null;
  },
  async setItem(key, value) {
    if (!isTauri()) return localStorageAdapter.setItem(key, value);
    const store = await getTauriStore();
    await store.set(key, value);
    await store.save();
  },
  async removeItem(key) {
    if (!isTauri()) return localStorageAdapter.removeItem(key);
    const store = await getTauriStore();
    await store.delete(key);
    await store.save();
  },
};
