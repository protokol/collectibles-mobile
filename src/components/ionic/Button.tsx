import styled from 'styled-components';
import { IonButton } from '@ionic/react';
import { FontSize } from '../../constants/font-size';
import { FontWeight } from '../../constants/font-weight';
import { Styles } from '../../utils/styles';

const Button = styled(IonButton)<{
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  radius?: boolean;
}>`
  &::part(native) {
  }

  ${({ radius = true }) =>
    radius ? '--border-radius: 0.25rem;' : '--border-radius: 0;'}

  &[size='large'] {
    height: 4.8rem;
    --padding-top: 1rem;
    --padding-bottom: 1rem;
  }

  ${({ fontSize }) => Styles.serializeFontSize(fontSize)}
  ${({ fontWeight }) => Styles.serializeFontWeight(fontWeight)}
`;

export default Button;
