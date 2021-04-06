import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import BackButton from '../components/BackButton';
import Keypad from '../components/Keypad';
import FormInputError from '../components/ionic/ErrorMessage';
import Input from '../components/ionic/Input';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import {
  AuthLoginContext,
  AuthLoginState,
} from '../providers/AuthLoginProvider';
import { AuthRegisterContext } from '../providers/AuthRegisterProvider';

const Content = styled(IonContent)`
  --background: var(--app-color-charade);

  & > ion-grid {
    display: flex;
    align-items: flex-end;
    height: 100vh;
    padding-bottom: 2rem;
  }

  & > ion-grid > ion-row {
    > ion-col {
      &:nth-child(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
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

enum PasscodeSteps {
  Passcode,
  ConfirmPasscode,
}

interface PasscodeForm extends FieldValues {
  passcode: string;
  confirmPasscode?: string;
}

const PasscodePage: FC<{
  withConfirm?: boolean;
}> = ({ withConfirm = false }) => {
  const history = useHistory();
  const { session, setPin: loginSetPin } = useContext(AuthLoginContext);
  const { setPin } = useContext(AuthRegisterContext);
  const { state } = session;

  const [step, setStep] = useState<PasscodeSteps>(PasscodeSteps.Passcode);

  const {
    control,
    handleSubmit,
    errors,
    watch,
    register,
    clearErrors,
  } = useForm<PasscodeForm>({
    defaultValues: {
      passcode: '',
      confirmPasscode: '',
    },
    mode: 'onSubmit',
  });

  const { passcode, confirmPasscode } = watch();

  useEffect(() => {
    if (
      session &&
      !session.error &&
      session.state === AuthLoginState.LoggedIn
    ) {
      history.replace('/home');
    }
  }, [session, history]);

  const submitForm = useCallback(
    ({ passcode }: PasscodeForm) => {
      if (withConfirm && step === PasscodeSteps.Passcode) {
        register('confirmPasscode', {
          required: 'Passcode is required!',
          pattern: {
            value: /^[0-9]{4}$/,
            message: 'Passcode should be 4-digit number',
          },
          validate: (value) => value === passcode || 'Passcodes do not match',
        });
        setStep(PasscodeSteps.ConfirmPasscode);
        clearErrors(['passcode', 'confirmPasscode']);
      } else {
        if (withConfirm) {
          setPin(passcode);
        } else {
          loginSetPin(passcode);
        }
      }
    },
    [setPin, register, withConfirm, clearErrors, step, loginSetPin]
  );

  const getTitle = useCallback(() => {
    if (!withConfirm) {
      return 'Safety First!';
    }

    switch (step) {
      case PasscodeSteps.ConfirmPasscode:
        return 'Confirm your passcode';
      case PasscodeSteps.Passcode:
      default:
        return 'Create your passcode';
    }
  }, [step, withConfirm]);

  const getSubTitle = useCallback(() => {
    if (!withConfirm) {
      return (
        <>
          Insert your <b>passcode, that you chose</b> when creating your
          account! Don’t forget to store it somewhere safe, since we are unable
          to restore any lost passcodes! Learn more
        </>
      );
    }

    switch (step) {
      case PasscodeSteps.ConfirmPasscode:
        return (
          <>
            Please <b>confirm</b> your <b>passcode</b>. Don’t forget to store it
            somewhere safe, since we are unable to restore any lost passcodes!
          </>
        );
      case PasscodeSteps.Passcode:
      default:
        return (
          <>
            Create your <b>passcode</b>. Make sure that you&nbsp;
            <b>Store it somewhere safely</b>, since we are unable to restore any
            lost passcodes!
          </>
        );
    }
  }, [step, withConfirm]);

  return (
    <IonPage>
      <Content fullscreen>
        {withConfirm && <BackButton />}
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="12">
              <Text
                className="ion-margin-bottom"
                fontSize={FontSize.XL}
                color="light"
                fontWeight={FontWeight.BOLD}
              >
                {getTitle()}
              </Text>
              <Text
                className="ion-margin-top"
                fontSize={FontSize.SM}
                color="light"
              >
                {getSubTitle()}
              </Text>
            </IonCol>
            <IonCol size="8" offset="2">
              <form onSubmit={handleSubmit(submitForm)}>
                <Controller
                  render={({ onChange }) => (
                    <IonRow hidden={step !== PasscodeSteps.Passcode}>
                      <IonCol size="12">
                        <Input
                          type="password"
                          value={passcode}
                          className="form-input-pin"
                          fontSize={FontSize.L}
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
                <Controller
                  render={({ onChange }) => (
                    <IonRow hidden={step !== PasscodeSteps.ConfirmPasscode}>
                      <IonCol size="12">
                        <Input
                          type="password"
                          value={confirmPasscode}
                          className="form-input-pin"
                          fontSize={FontSize.L}
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
                  name="confirmPasscode"
                />
                <div className="ion-text-center">
                  <FormInputError errors={errors} name="passcode" />
                  <FormInputError errors={errors} name="confirmPasscode" />

                  {state === AuthLoginState.Error && (
                    <>
                      <br />
                      <Text
                        className="ion-padding-top"
                        fontSize={FontSize.SM}
                        color="danger"
                      >
                        Invalid PIN!
                      </Text>
                    </>
                  )}
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
