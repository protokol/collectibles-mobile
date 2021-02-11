import React, { useCallback, useContext } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { RouterProps } from 'react-router';
import styled from 'styled-components';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import Keypad from '../components/Keypad';
import FormInputError from '../components/ionic/ErrorMessage';
import Input from '../components/ionic/Input';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { AuthRegisterContext } from '../providers/AuthRegisterProvider';

const Content = styled(IonContent)`
  --background: var(--app-color-charade);

  & > ion-grid > ion-row {
    > ion-col {
      &:nth-child(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 40vh;
        padding: 2rem;
        text-align: center;
      }
    }
  }

  .form-input-pin {
    width: 80%;
    --padding-start: 2.375rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    letter-spacing: 1rem;
  }
`;

interface PasscodeForm extends FieldValues {
  passcode: string;
}

const PasscodePage: React.FC<RouterProps> = ({ history }) => {
  const { setPin } = useContext(AuthRegisterContext);

  const {
    formState,
    control,
    handleSubmit,
    errors,
    watch,
  } = useForm<PasscodeForm>({
    defaultValues: {
      passcode: '',
    },
    mode: 'onSubmit',
  });

  const { passcode } = watch();

  const submitForm = useCallback(
    ({ passcode }: PasscodeForm) => {
      if (!formState.isValid) {
        return;
      }
      setPin(passcode);
      history.push('/welcome');
    },
    [formState.isValid, setPin, history]
  );

  return (
    <IonPage>
      <Content fullscreen>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="12">
              <Text
                className="ion-margin-bottom"
                fontSize={FontSize.L}
                color="light"
                fontWeight={FontWeight.BOLD}
              >
                Create your passcode
              </Text>
              <Text
                className="ion-margin-top"
                fontSize={FontSize.SM}
                color="light"
              >
                Create your <b>passcode</b>. Make sure that you{' '}
                <b>Store it somewhere safely</b>, since we are unable to restore
                any lost passcodes!
              </Text>
            </IonCol>
            <IonCol size="8" offset="2">
              <form onSubmit={handleSubmit(submitForm)}>
                <Controller
                  render={({ onChange }) => (
                    <IonRow>
                      <IonCol size="12">
                        <Input
                          type="password"
                          value={passcode}
                          className="form-input-pin"
                          fontSize={FontSize.M}
                          readonly
                        />
                      </IonCol>
                      <Keypad
                        onChange={onChange}
                        onEnter={handleSubmit(submitForm)}
                      />
                    </IonRow>
                  )}
                  control={control}
                  name="passcode"
                  rules={{
                    required: 'Passcode is required!',
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: 'Passcode should be 4-digit number',
                    },
                  }}
                />
                <div className="ion-text-center">
                  <FormInputError errors={errors} name="passcode" />
                </div>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </Content>
    </IonPage>
  );
};

export default PasscodePage;
