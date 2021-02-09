// Add version for possible migrations
const version = process.env.STORAGE_VERSION || 0;
const PREFIX = `collectibles-mobile-v${version}::`;

export function set<T = any>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(`${PREFIX}${key}`, serializedValue);
  } catch (error) {
    throw new Error(`Failed to serialize value for key: "${key}"`);
  }
}

export function get<T = any>(key: string): T | undefined {
  try {
    const serializedValue = localStorage.getItem(`${PREFIX}${key}`);
    if (!serializedValue) {
      return;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    throw new Error(`Failed to deserialize value for key: "${key}"`);
  }
}
