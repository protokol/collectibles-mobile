import React, { useCallback, useContext } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import Passphrase from '../components/Passphrase';
import Button from '../components/ionic/Button';
import FormInputError from '../components/ionic/ErrorMessage';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { AuthRegisterContext } from '../providers/AuthRegisterProvider';
import { CryptoUtils } from '../utils/crypto-utils';

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
`;

const FormBackground = styled.div`
  border-radius: 0.25rem;
  background-color: var(--app-color-gray);
`;

interface PassphraseForm extends FieldValues {
  passphrase: string;
}

const PassphrasePage: React.FC = () => {
  const history = useHistory();
  const { setPassphrase } = useContext(AuthRegisterContext);

  const { control, handleSubmit, errors } = useForm<PassphraseForm>({
    defaultValues: {
      passphrase: '',
    },
    mode: 'onSubmit',
  });

  const submitForm = useCallback(
    ({ passphrase }: PassphraseForm) => {
      setPassphrase(passphrase);

      history.push('/register/passcode');
    },
    [setPassphrase, history]
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
                Sign in with your recovery phrase
              </Text>
              <Text
                className="ion-margin-top"
                fontSize={FontSize.SM}
                color="light"
              >
                Restore your account with the <b>12 word phrase</b>, that you
                were given when you created your account. <b>Make sure</b> that
                they are in the correct order!
              </Text>
            </IonCol>
            <IonCol size="12" className="ion-padding">
              <FormBackground className="ion-padding">
                <form onSubmit={handleSubmit(submitForm)}>
                  <Controller
                    render={({ onChange }) => (
                      <IonRow>
                        <Passphrase onChange={onChange} />
                      </IonRow>
                    )}
                    control={control}
                    name="passphrase"
                    rules={{
                      required: 'Passphrase is required!',
                      pattern: {
                        value: /^(\w+\s){11}(\w+)$/,
                        message:
                          'Passphrase should be 12 words long. Fill out remaining fields!',
                      },
                      validate: (value) =>
                        CryptoUtils.isValidPassphrase(value) ||
                        'Invalid passphrase!',
                    }}
                  />
                </form>
              </FormBackground>
            </IonCol>
            <IonCol size="12" className="ion-padding-horizontal">
              <FormInputError errors={errors} name="passphrase" />
            </IonCol>
            <IonCol className="ion-padding-horizontal" size="12">
              <Button
                size="large"
                expand="block"
                className="ion-text-uppercase ion-no-margin ion-margin-top"
                color="tertiary"
                fontSize={FontSize.SM}
                fontWeight={FontWeight.BOLD}
                onClick={handleSubmit(submitForm)}
              >
                Restore wallet
              </Button>
            </IonCol>
            <IonCol className="ion-padding-horizontal" size="12">
              <Button
                size="large"
                expand="block"
                fill="clear"
                className="ion-text-capitalize ion-no-margin"
                color="light"
                fontSize={FontSize.SM}
                onClick={() => history.push('/welcome')}
              >
                Back
              </Button>
            </IonCol>
          </IonRow>
        </IonGrid>
      </Content>
    </IonPage>
  );
};

export default PassphrasePage;
