import * as bip39 from 'bip39';
import { Wallet } from '@arkecosystem/client';
import { ArkCrypto } from '../store/services/crypto';

export abstract class CryptoUtils {
  static WORDLIST_DEFAULT_LANGUAGE = 'english';

  static isValidPassphrase(passphrase: string) {
    return bip39.validateMnemonic(passphrase);
  }

  static generatePassphrase() {
    return bip39.generateMnemonic(
      undefined,
      undefined,
      bip39.wordlists[CryptoUtils.WORDLIST_DEFAULT_LANGUAGE]
    );
  }

  static getWalletNextNonce(wallet?: Wallet) {
    return wallet
      ? ArkCrypto.Utils.BigNumber.make(wallet.nonce).plus(1).toFixed()
      : ArkCrypto.Utils.BigNumber.ONE.toFixed();
  }

  static suggestWords(word: string): string[] {
    if(!word && word.length === 0) {
      return [];
    }

    const dictionary = bip39.wordlists[CryptoUtils.WORDLIST_DEFAULT_LANGUAGE];
    return dictionary.filter(
      (w) =>
        w.startsWith(word) && w !== word
    ).slice(0, 12);
  }
}
