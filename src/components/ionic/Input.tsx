import styled from 'styled-components';
import { IonInput } from '@ionic/react';
import { FontSize } from '../../constants/font-size';
import { Styles } from '../../utils/styles';

const Input = styled(IonInput)<{
  fontSize?: FontSize;
}>`
  --color: var(--ion-color-light);
  --placeholder-color: var(--ion-color-light);
  --background: var(--app-color-charade);
  --padding-start: 1.375rem;
  --padding-end: 1.375rem;
  --padding-top: 1.1875rem;
  --padding-bottom: 1.1875rem;

  border: 1px solid var(--ion-color-light);

  ${({ fontSize }) => Styles.serializeFontSize(fontSize)}

  &.form-input- {
    &prefix-username {
      &:before {
        content: '@';
        position: absolute;
        left: 0.65rem;
      }
    }
  }
`;

export default Input;
