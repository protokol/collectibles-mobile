let uniqueIdIdentifier = 0;

export abstract class Utils {
  static uniqueId(prefix = '') {
    uniqueIdIdentifier += 1;
    return prefix.toString() + uniqueIdIdentifier;
  }

  static wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
