const STORAGE_VERSION = process.env.STORAGE_VERSION || 0;
const STORAGE_PREFIX = `collectibles-mobile-v${STORAGE_VERSION}::`;

enum StorageKeys {
  PRIVATE_KEY = 'pk',
  PIN = 'pin',
  USERNAME = 'username',
}

export { STORAGE_PREFIX, StorageKeys };
