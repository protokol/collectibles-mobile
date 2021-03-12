import { FC } from 'react';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import styled from 'styled-components';
import { ErrorMessage } from '@hookform/error-message';
import { FontSize } from '../../constants/font-size';
import { FontWeight } from '../../constants/font-weight';
import { Styles } from '../../utils/styles';
import Text from './Text';

const ErrorMessageWrapped: FC<{
  name: string;
  errors: FieldErrors;
  className?: string;
}> = (props) => (
  <ErrorMessage
    render={({ message }) => (
      <Text className="ion-padding-top" fontSize={FontSize.SM} color="danger">
        {message}
      </Text>
    )}
    {...props}
  />
);

const FormInputError = styled(ErrorMessageWrapped)<{
  fontSize?: FontSize;
  fontWeight?: FontWeight;
}>`
  ${({ fontSize }) => Styles.serializeFontSize(fontSize)}
  ${({ fontWeight }) => Styles.serializeFontWeight(fontWeight)}
`;

export default FormInputError;
