import React from 'react';
import {IonCol, IonContent, IonGrid, IonPage, IonRow} from '@ionic/react';
import styled from "styled-components";
import Button from "../components/ionic/Button";
import Text from "../components/ionic/Text";
import {FontSize} from "../constants/font-size";
import {FontWeight} from "../constants/font-weight";

const Content = styled(IonContent)`
  --background: var(--app-color-charade);
`

const WelcomePage: React.FC = () => {
    return (
        <IonPage>
            <Content fullscreen>
                <IonGrid className="ion-no-padding">
                    <IonRow>
                        <IonCol size="12" className="ion-text-center">
                            <Text
                                className="ion-text-uppercase"
                                fontSize={FontSize.XL}
                                color="light"
                                fontWeight={FontWeight.BOLD}>
                                Nascar
                            </Text>
                        </IonCol>
                        <IonCol size="12" className="ion-text-center">
                            <Text
                                className="ion-text-capitalize"
                                fontSize={FontSize.L}
                                color="light"
                                fontWeight={FontWeight.BOLD}>
                                Digital Hero Cards
                            </Text>
                        </IonCol>
                        <IonCol className="ion-no-padding" size="12">
                            <img
                                srcSet="assets/images/welcome-screen.png 1x, assets/images/welcome-screen@2x.png 2x"
                                src="assets/images/welcome-screen.png"
                                alt="Welcome"
                            />
                        </IonCol>
                        <IonCol size="12">
                            <Button
                                size="large"
                                expand="full"
                                className="ion-text-uppercase ion-margin"
                                fontSize={FontSize.M}
                                fontWeight={FontWeight.BOLD}>
                                Existing user
                            </Button>
                        </IonCol>
                        <IonCol size="12">
                            <Button
                                size="large"
                                expand="block"
                                className="ion-text-uppercase ion-margin"
                                fontSize={FontSize.M}
                                fontWeight={FontWeight.BOLD}>
                                Create account
                            </Button>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </Content>
        </IonPage>
    );
};

export default WelcomePage;
