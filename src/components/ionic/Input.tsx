import styled from 'styled-components';
import { IonInput } from '@ionic/react';
import { FontSize } from '../../constants/font-size';
import { Styles } from '../../utils/styles';

const Input = styled(IonInput)<{
  fontSize?: FontSize;
}>`
  &::part(input) {
  }

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

    &transparent {
      --padding-start: 0.5rem;
      --padding-end: 0.5rem;

      --placeholder-color: transparent;
      --background: transparent;

      border: none;

      &.has-focus {
        border-bottom: 1px solid var(--ion-color-light);
      }
    }
  }

  ${() =>
    Array.from(
      { length: 12 },
      (_, index) => `
      &.form-input-prefix-number-${index + 1} {
      width: ${index + 1 >= 10 ? 'calc(100% - 2.5ch)' : 'calc(100% - 1.5ch)'};
      margin-left: ${index + 1 >= 10 ? '2ch' : '1ch'};
      
      &:before {
        content: '${index + 1}';
        position: absolute;
        left: -${index + 1 >= 10 ? '2ch' : '1ch'};
      }
    }
    `
    ).join(' ')}
`;

export default Input;
