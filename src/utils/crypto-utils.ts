import * as bip39 from 'bip39';
import { Wallet } from '@arkecosystem/client/dist/resourcesTypes/wallets';
import { ArkCrypto } from '../store/services/crypto';

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

  static getNextWalletNonce(wallet?: Wallet) {
    return wallet
      ? ArkCrypto.Utils.BigNumber.make(wallet.nonce).plus(1).toFixed()
      : ArkCrypto.Utils.BigNumber.ONE.toFixed();
  }
}
