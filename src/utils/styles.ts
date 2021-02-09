import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';

export abstract class Styles {
  static serializeFontSize(fontSize?: FontSize) {
    if (!fontSize) {
      return undefined;
    }
    return `font-size: ${fontSize};`;
  }

  static serializeFontWeight(fontWeight?: FontWeight) {
    if (!fontWeight) {
      return undefined;
    }
    return `font-weight: ${fontWeight};`;
  }
}
