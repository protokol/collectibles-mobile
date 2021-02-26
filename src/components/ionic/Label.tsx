import styled from 'styled-components';
import { IonLabel } from '@ionic/react';
import { FontSize } from '../../constants/font-size';
import { FontWeight } from '../../constants/font-weight';
import { Styles } from '../../utils/styles';

const Label = styled(IonLabel)<{
  fontSize?: FontSize;
  fontWeight?: FontWeight;
}>`
  ${({ fontSize }) => Styles.serializeFontSize(fontSize)}
  ${({ fontWeight }) => Styles.serializeFontWeight(fontWeight)}
`;

export default Label;
