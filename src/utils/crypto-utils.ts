import * as bip39 from 'bip39';

export abstract class CryptoUtils {
  static isValidPassphrase(passphrase: string) {
    return bip39.validateMnemonic(passphrase);
  }

  static generatePassphrase() {
    return bip39.generateMnemonic(
      undefined,
      undefined,
      bip39.wordlists['english']
    );
  }
}
