const STORAGE_VERSION = process.env.STORAGE_VERSION || 0;
const STORAGE_PREFIX = `collectibles-mobile-v${STORAGE_VERSION}::`;

enum StorageKeys {
  STORAGE_PK_KEY = 'pk',
  STORAGE_PIN_KEY = 'pin',
}

export { STORAGE_PREFIX, StorageKeys };
