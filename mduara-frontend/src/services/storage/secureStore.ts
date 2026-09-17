const memoryStore = new Map<string, string>();

interface WebStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getWebStorage(): WebStorage | null {
  try {
    const maybeStorage = (globalThis as { localStorage?: WebStorage } | undefined)?.localStorage;
    if (maybeStorage) return maybeStorage;
  } catch {
    // Storage can be unavailable in privacy modes or restricted webviews.
  }
  return null;
}

export async function getStoredValue(key: string): Promise<string | null> {
  const storage = getWebStorage();
  return storage ? storage.getItem(key) : memoryStore.get(key) ?? null;
}

export async function setStoredValue(key: string, value: string): Promise<void> {
  const storage = getWebStorage();
  if (storage) {
    storage.setItem(key, value);
    return;
  }
  memoryStore.set(key, value);
}

export async function removeStoredValue(key: string): Promise<void> {
  const storage = getWebStorage();
  if (storage) storage.removeItem(key);
  memoryStore.delete(key);
}

export async function clearStoredValues(keys: readonly string[]): Promise<void> {
  await Promise.all(keys.map(removeStoredValue));
}
