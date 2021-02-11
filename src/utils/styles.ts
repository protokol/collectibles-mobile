import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';

export abstract class Styles {
  static serializeLineHeight(fontSize?: FontSize) {
    switch (fontSize) {
      case FontSize.SM:
        return 'line-height: 1.125rem;';
      case FontSize.L:
        return 'line-height: 2.0625rem;';
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
      font-size: ${fontSize};
    `;
  }

  static serializeFontWeight(fontWeight?: FontWeight) {
    if (!fontWeight) {
      return undefined;
    }
    return `font-weight: ${fontWeight};`;
  }
}
