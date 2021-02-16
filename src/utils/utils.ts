let uniqueIdIdentifier = 0;

export abstract class Utils {
  static uniqueId(prefix = '') {
    uniqueIdIdentifier += 1;
    return prefix.toString() + uniqueIdIdentifier;
  }
}
