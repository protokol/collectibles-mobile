import styled from 'styled-components';
import { IonTitle } from '@ionic/react';
import { FontSize } from '../../constants/font-size';
import { FontWeight } from '../../constants/font-weight';
import { Styles } from '../../utils/styles';

const Title = styled(IonTitle)<{
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  noWrap?: boolean;
}>`
  ${({ fontSize }) => Styles.serializeFontSize(fontSize)}
  ${({ fontWeight }) => Styles.serializeFontWeight(fontWeight)}
  ${({ noWrap }) =>
    noWrap
      ? `
      overflow: visible;
      text-overflow: unset;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      word-break: break-all;
     `
      : ''}
`;

export default Title;
