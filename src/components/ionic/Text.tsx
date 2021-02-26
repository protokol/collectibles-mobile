import styled from 'styled-components';
import { IonText } from '@ionic/react';
import { FontSize } from '../../constants/font-size';
import { FontWeight } from '../../constants/font-weight';
import { Styles } from '../../utils/styles';

const Text = styled(IonText)<{ fontSize?: FontSize; fontWeight?: FontWeight }>`
  display: inline-block;
  ${({ fontSize }) => Styles.serializeFontSize(fontSize)}
  ${({ fontWeight }) => Styles.serializeFontWeight(fontWeight)}
`;

export default Text;
