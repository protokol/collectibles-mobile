import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';

export abstract class Styles {
  static serializeLineHeight(fontSize?: FontSize) {
    switch (fontSize) {
      case FontSize.XL:
        return 'line-height: 2.0625rem;';
      case FontSize.SM:
        return 'line-height: 1.125rem;';
      case FontSize.XS:
        return 'line-height: 95%;';
      default:
        return '';
    }
  }

  static serializeFontSize(fontSize?: FontSize) {
    if (!fontSize) {
      return undefined;
    }
    return `
      ${Styles.serializeLineHeight(fontSize)}
      font-size: ${fontSize} !important;
    `;
  }

  static serializeFontWeight(fontWeight?: FontWeight) {
    if (!fontWeight) {
      return undefined;
    }
    return `font-weight: ${fontWeight};`;
  }
}
