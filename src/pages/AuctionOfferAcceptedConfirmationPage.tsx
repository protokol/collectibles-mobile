import { arrowBackOutline } from 'ionicons/icons';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import {AcceptBidAction } from '../store/actions/auctions';
import AuctionsMyAuctionsPage from './AuctionsMyAuctionsPage';
import { auctionSelector } from '../store/selectors/auctions';
import { CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
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
  --background: var(--app-color-green-bg);
  background: var(--app-color-green-bg);
`;

const txUuid = uuid();

const AuctionOfferAcceptedConfirmationPage: FC = () => {    

  const { auctionId, bidId } = useParams<{ auctionId: string, bidId: string}>();
  const history = useHistory();
  const dispatch = useDispatch();

  const acceptOfferRequest = useSelector(auctionSelector, shallowEqual);
  const transactions = useSelector(transactionsSelector, shallowEqual);
  const tx = useMemo(() => transactions[txUuid], [transactions]);

  const [navToMyAuctions, setNavToMyAuctions] = useState(false);

  const navigateMyAuctions = () => {    
    setNavToMyAuctions(true);   
  }     

  const isLoading = useCallback(() => {
    return acceptOfferRequest?.isLoading || tx?.isLoading;
  }, [acceptOfferRequest, tx]);

  const isError = useCallback(() => {
    return acceptOfferRequest?.isError || tx?.isError;
  }, [acceptOfferRequest, tx]);

  const error = useCallback(() => {    
    return (acceptOfferRequest?.isError)? `${acceptOfferRequest?.error}`:`${tx?.error?.message}`;
  }, [acceptOfferRequest, tx]);

  const {
    session: { passphrase, publicKey },
  } = useContext(AuthLoginContext);    

  const isMounted = useIsMounted();  
  useEffect(() => {        
    if (isMounted && bidId && auctionId && publicKey) {     
      //console.log("txUuid:" + txUuid);
      dispatch(AcceptBidAction(auctionId, bidId, publicKey!, passphrase!, txUuid));
    }
  }, [isMounted, dispatch, bidId, auctionId, publicKey, passphrase]);  

  return (
    <>
    {navToMyAuctions && (
      <AuctionsMyAuctionsPage />
    )} 
    {!navToMyAuctions && ( 
    <IonPage>
      <Header 
        title="Accept Bid Offer"
        buttonTopLeft={
          <IonButton onClick={() => history.goBack()}>
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
                    Nice!
                  </Text>
                  <Text
                    className="ion-padding"
                    fontSize={FontSize.L}
                    color="light"
                  >
                    You <b>successfully accepted the highest offer</b>. 
                    The value for the card will soon appear in your wallet.
                    TODO: Social sharing icons
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
              onClick={() => {
                  dispatch(CollectiblesOnAuctionLoadAction(publicKey!, true, false, true, undefined));
                  navigateMyAuctions();
                }
              } 
            >
              View Your Open Auctions
            </ViewCardButton>
          </IonToolbar>
        </Footer>
      )}
    </IonPage>
    )}  
    </>    
  );
};

export default AuctionOfferAcceptedConfirmationPage;
