import { FC } from 'react';
import styled from 'styled-components';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import Button from '../components/ionic/Button';
import Img from '../components/ionic/Img';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { welcomeImage } from '../constants/images';

const Content = styled(IonContent)`
  --background: var(--app-color-charade);

  & > ion-grid {
    display: flex;
    align-items: flex-end;
    height: 100vh;
    padding-bottom: 2rem;
  }

  ion-row {
    ion-col {
      &:nth-child(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 1rem;
      }

      &:nth-child(2) {
        overflow: hidden;
        margin-bottom: 1rem;
        max-height: 25vh;
      }

      &:nth-child(3) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100vw;
        padding-bottom: 0.5rem;
      }
    }
  }

  @media screen and (min-height: 600px) {
    ion-row {
      ion-col {
        &:nth-child(1) {
          padding-bottom: 2rem;
        }

        &:nth-child(2) {
          margin-bottom: 2rem;
        }

        &:nth-child(3) {
          padding-bottom: 1rem;
        }
      }
    }
  }
`;

const WelcomePage: FC = () => {
  return (
    <IonPage>
      <Content fullscreen>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="12">
              <Text
                className="ion-text-uppercase"
                fontSize={FontSize.XL}
                color="light"
                fontWeight={FontWeight.BOLD}
              >
                Nascar
              </Text>
              <Text
                className="ion-text-capitalize"
                fontSize={FontSize.L}
                color="light"
                fontWeight={FontWeight.BOLD}
              >
                Digital Hero Cards
              </Text>
            </IonCol>
            <IonCol className="ion-no-padding" size="12">
              <Img {...welcomeImage} />
            </IonCol>
            <IonCol size="12">
              <Button
                size="large"
                expand="block"
                className="ion-text-uppercase ion-margin"
                fontSize={FontSize.SM}
                fontWeight={FontWeight.BOLD}
                routerLink="/login/passphrase"
              >
                Existing user
              </Button>
              <Button
                size="large"
                expand="block"
                className="ion-text-uppercase ion-margin"
                color="tertiary"
                fontSize={FontSize.SM}
                fontWeight={FontWeight.BOLD}
                routerLink="/register/username"
              >
                Create account
              </Button>
            </IonCol>
            <IonCol size="12" className="ion-text-center">
              <Text fontSize={FontSize.XXS} color="light">
                © Protokol, 2021
              </Text>
            </IonCol>
          </IonRow>
        </IonGrid>
      </Content>
    </IonPage>
  );
};

export default WelcomePage;
