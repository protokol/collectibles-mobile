import { STORAGE_PREFIX, StorageKeys } from '../constants/storage';

const storage = (storage = localStorage) => {
  const set = <T = any>(key: StorageKeys, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      storage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
    } catch (error) {
      throw new Error(`Failed to serialize value for key: "${key}"`);
    }
  };

  const get = <T = any>(key: StorageKeys): T | undefined => {
    try {
      const serializedValue = storage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!serializedValue) {
        return;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      throw new Error(`Failed to deserialize value for key: "${key}"`);
    }
  };

  const removeItem = (key: StorageKeys) => {
    storage.removeItem(`${STORAGE_PREFIX}${key}`);
  };

  const clear = () => {
    storage.clear();
  };

  return {
    set,
    get,
    removeItem,
    clear,
  };
};

export default storage;
