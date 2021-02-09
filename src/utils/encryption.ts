import { ModeOfOperation, utils } from 'aes-js';
import SHA256 from 'sha256';

export abstract class Encryption {
  static hash(pin: string) {
    return utils.hex.fromBytes(SHA256(pin, { asBytes: true }));
  }

  static encode(toEncode: string, hash: string) {
    const encodedBytes = new ModeOfOperation.ctr(
      utils.hex.toBytes(hash)
    ).encrypt(utils.utf8.toBytes(toEncode));
    return utils.hex.fromBytes(encodedBytes);
  }

  static decode(toDecode: string, hash: string) {
    const decodedBytes = new ModeOfOperation.ctr(
      utils.hex.toBytes(hash)
    ).decrypt(utils.hex.toBytes(toDecode));
    return utils.utf8.fromBytes(decodedBytes);
  }
}
