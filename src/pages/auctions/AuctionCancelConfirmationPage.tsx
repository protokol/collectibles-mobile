import { arrowBackOutline } from 'ionicons/icons';
import { FC } from 'react';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import Button from '../../components/ionic/Button';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,  
  IonIcon,
  IonButton,
  IonToolbar,
  IonFooter,
  IonRouterLink
} from '@ionic/react';
import Header from '../../components/Header';
import Text from '../../components/ionic/Text';
import { FontSize } from '../../constants/font-size';
import { FontWeight } from '../../constants/font-weight';
import { driverHighResImage } from '../../constants/images';

const ImageBgCol = styled(IonCol)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  overflow: hidden;
  z-index: 3;
  text-align: center;

  &:before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100vh;
    height: 100vh;
    z-index: 1;
    background-image: url('${driverHighResImage.src}');
    background-size: 100vh auto;
    background-repeat: no-repeat;
    background-position: 0 -70%;
    transform: rotate(-90deg);
  }

  &:after {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    opacity: 0.75;
    background-color: var(--app-color-black);
  }

  > * {
    z-index: 3;
  }
`;

const Footer = styled(IonFooter)`
  position: fixed;
  bottom: 0;
`;

const ViewCardButton = styled(Button)`
  --background: var(--app-color-yellow-bg);
  background: var(--app-color-yellow-bg);
  color: white;
`;

const IonRouterLinkStyled = styled(IonRouterLink)`
  text-decoration: underline;
  font-weight: bold;  
`;

const AuctionCancelConfirmationPage: FC = () => {  

  const { auctionId } = useParams<{ auctionId: string}>();
  const history = useHistory();

  return (
    <IonPage>
      <Header 
        title="Cancel Auction"
        buttonTopLeft={
          <IonButton onClick={() => history.push('/market/myauctions')}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />

      <IonContent fullscreen>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <ImageBgCol size="12">
                <Text color="warning" fontSize={FontSize.XXL} fontWeight={FontWeight.BOLD}>
                  Steady ...
                </Text>
                <Text
                  className="ion-padding"
                  fontSize={FontSize.L}
                  color="light"                  
                >
                  Canceling the auction means that <b>you will loose all the current offers</b>, 
                  and won’t be able to restore them, if you change your mind. 
                  <br/><br/>Are you sure <b>you want to cancel it?</b>
                  <br/>
                  <br/>                                    
                </Text>
                <Text fontSize={FontSize.M} color="light" >
                  No way, <IonRouterLinkStyled color="light" onClick={() => history.push('/market/myauctions')}>I don't want to cancel</IonRouterLinkStyled> the auction!
                </Text>
            </ImageBgCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <Footer className="ion-no-border">
        <IonToolbar>
          <ViewCardButton
            size="large"
            className="ion-text-uppercase ion-no-margin"
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
            radius={false}
            expand="block"
            onClick={ () => history.push(`/market/card/cancelauction/${auctionId}`) }           
          >
            YES, IM SURE I WANT TO CANCEL THE AUCTION!
          </ViewCardButton>
        </IonToolbar>
      </Footer>
    </IonPage>    
  );
};

export default AuctionCancelConfirmationPage;
