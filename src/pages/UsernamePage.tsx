import { FC, useCallback, useContext } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { InputChangeEventDetail } from '@ionic/core';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import Button from '../components/ionic/Button';
import FormInputError from '../components/ionic/ErrorMessage';
import Input from '../components/ionic/Input';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { AuthRegisterContext } from '../providers/AuthRegisterProvider';

const Content = styled(IonContent)`
  --background: var(--app-color-charade);

  ion-row {
    ion-col {
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

interface UsernameForm extends FieldValues {
  username: string;
}

const UsernamePage: FC = () => {
  const history = useHistory();
  const { setUsername } = useContext(AuthRegisterContext);

  const { formState, control, handleSubmit, errors } = useForm<UsernameForm>({
    defaultValues: {
      username: '',
    },
    mode: 'onChange',
  });

  const submitForm = useCallback(
    ({ username }: UsernameForm) => {
      if (!formState.isValid) {
        return;
      }
      setUsername(username);
      history.push('/register/passcode');
    },
    [formState.isValid, setUsername, history]
  );

  return (
    <IonPage>
      <Content fullscreen>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="12">
              <Text
                className="ion-margin-bottom"
                fontSize={FontSize.XL}
                color="light"
                fontWeight={FontWeight.BOLD}
              >
                Pick your username
              </Text>
              <Text
                className="ion-margin-top"
                fontSize={FontSize.SM}
                color="light"
              >
                Collecting digital hero cards is easy! Make it even easier for
                other collectors to find you, and star collecting your favourite
                cards!
              </Text>
            </IonCol>
            <IonCol size="12" className="ion-padding">
              <form onSubmit={handleSubmit(submitForm)}>
                <Controller
                  render={({ onChange }) => (
                    <Input
                      type="text"
                      className="form-input-prefix-username ion-margin-bottom"
                      fontSize={FontSize.SM}
                      placeholder="Pick username..."
                      onIonChange={({
                        detail: { value },
                      }: CustomEvent<InputChangeEventDetail>) =>
                        onChange(value)
                      }
                    />
                  )}
                  control={control}
                  name="username"
                  rules={{
                    required: 'Username is required!',
                  }}
                />
                <FormInputError errors={errors} name="username" />
                <Button
                  type="submit"
                  size="large"
                  expand="block"
                  className="ion-text-uppercase ion-no-margin ion-margin-top"
                  color="tertiary"
                  fontSize={FontSize.SM}
                  fontWeight={FontWeight.BOLD}
                  disabled={!formState.isValid}
                >
                  Register username
                </Button>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </Content>
    </IonPage>
  );
};

export default UsernamePage;
