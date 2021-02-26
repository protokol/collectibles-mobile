import styled from 'styled-components';
import { IonTitle } from '@ionic/react';
import { FontSize } from '../../constants/font-size';
import { FontWeight } from '../../constants/font-weight';
import { Styles } from '../../utils/styles';

const Title = styled(IonTitle)<{
  fontSize?: FontSize;
  fontWeight?: FontWeight;
}>`
  ${({ fontSize }) => Styles.serializeFontSize(fontSize)}
  ${({ fontWeight }) => Styles.serializeFontWeight(fontWeight)}
`;

export default Title;
