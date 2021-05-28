import { arrowBackOutline } from 'ionicons/icons';
import { FC, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSpinner,
  IonIcon,
  IonButton,
  IonToolbar,
  IonFooter,
} from '@ionic/react';
import Header from '../components/Header';
import Button from '../components/ionic/Button';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { driverHighResImage } from '../constants/images';
import useIsMounted from '../hooks/use-is-mounted';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CancelAuctionAction } from '../store/actions/auctions';
import AuctionsMyAuctionsPage from './AuctionsMyAuctionsPage';
import { auctionSelector } from '../store/selectors/auctions';
import { transactionsSelector } from '../store/selectors/transaction';

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
`;

const txUuid = uuid();

const AuctionCancelFinalizationPage: FC = () => {  

  const { auctionId } = useParams<{ auctionId: string}>();
  const history = useHistory();
  const dispatch = useDispatch();

  const cancelAuctionRequest = useSelector(auctionSelector, shallowEqual);
  const transactions = useSelector(transactionsSelector, shallowEqual);
  const tx = useMemo(() => transactions[txUuid], [transactions]);

  const [navToAuctions, setNavToAuctions] = useState(false);

  const navigateAuctions = () => {    
    setNavToAuctions(true);   
  }     

  const isLoading = useCallback(() => {
    return cancelAuctionRequest?.isLoading || tx?.isLoading;
  }, [cancelAuctionRequest, tx]);

  const isError = useCallback(() => {
    return cancelAuctionRequest?.isError || tx?.isError;
  }, [cancelAuctionRequest, tx]);

  const error = useCallback(() => {    
    return (cancelAuctionRequest?.isError)? `${cancelAuctionRequest?.error}`:`${tx?.error?.message}`;
  }, [cancelAuctionRequest, tx]);

  const {
    session: { publicKey, passphrase },
  } = useContext(AuthLoginContext);  

  const isMounted = useIsMounted();  
  useEffect(() => {        
    if (isMounted && auctionId && publicKey) {            
      dispatch(CancelAuctionAction(auctionId, publicKey, passphrase!, txUuid));
    }
  }, [isMounted, dispatch, auctionId, publicKey, passphrase]);  

  return (
    <>
    {navToAuctions && (
      <AuctionsMyAuctionsPage />
    )} 
    {!navToAuctions && (    
    <IonPage>
      <Header 
        title="Cancel Auction"
        buttonTopLeft={
          <IonButton onClick={() => history.replace('/home')}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />

      <IonContent fullscreen>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <ImageBgCol size="12">
              {isLoading() && <IonSpinner color="light" />}
              {!isLoading() && isError() && (
                <>
                  <Text color="danger" fontSize={FontSize.XXL}>
                    Something went wrong!
                  </Text>
                  <Text
                    className="ion-padding"
                    fontSize={FontSize.SM}
                    color="light"
                  >
                  {error()}
                  </Text>
                </>
              )}
              {!isLoading() && !isError() && (
                <>
                  <Text color="warning" fontSize={FontSize.XXL} fontWeight={FontWeight.BOLD}>
                    Auction<br/>
                    Cancelled
                  </Text>
                  <Text
                    className="ion-padding"
                    fontSize={FontSize.L}
                    color="light"
                  >
                    The auction is <b>cancelled</b>.
                  </Text>
                </>
              )}
            </ImageBgCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      {!isLoading() && !isError() && (
        <Footer className="ion-no-border">
          <IonToolbar>
            <ViewCardButton
              size="large"
              className="ion-text-uppercase ion-no-margin"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              radius={false}
              expand="block"
              onClick={navigateAuctions}           
            >
              View Open Auctions
            </ViewCardButton>
          </IonToolbar>
        </Footer>
      )}
    </IonPage>    
    )}  
    </>
  );
};

export default AuctionCancelFinalizationPage;