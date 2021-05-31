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
import { CancelBidAction } from '../store/actions/auctions';
import { CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
import AuctionsMyBiddedCardsPage from './AuctionMyBiddedCardsPage';
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

const AuctionRetractBidFinalizationPage: FC = () => {  

  const { auctionId } = useParams<{ auctionId: string}>();
  const history = useHistory();
  const dispatch = useDispatch();

  const cancelBidRequest = useSelector(auctionSelector, shallowEqual);
  const transactions = useSelector(transactionsSelector, shallowEqual);
  const tx = useMemo(() => transactions[txUuid], [transactions]);

  const [navToBids, setNavToBids] = useState(false);

  const navigateBids = () => {    
    setNavToBids(true);   
  }     

  const isLoading = useCallback(() => {
    return cancelBidRequest?.isLoading || tx?.isLoading;
  }, [cancelBidRequest, tx]);

  const isError = useCallback(() => {
    return cancelBidRequest?.isError || tx?.isError;
  }, [cancelBidRequest, tx]);

  const error = useCallback(() => {    
    return (cancelBidRequest?.isError)? `${cancelBidRequest?.error}`:`${tx?.error?.message}`;
  }, [cancelBidRequest, tx]);

  const {
    session: { publicKey, passphrase },
  } = useContext(AuthLoginContext);  

  const isMounted = useIsMounted();  
  useEffect(() => {        
    if (isMounted && auctionId && publicKey) {            
      dispatch(CancelBidAction(auctionId, publicKey, passphrase!, txUuid));
    }
  }, [isMounted, dispatch, auctionId, publicKey, passphrase]);  

  return (
    <>
    {navToBids && (
      <AuctionsMyBiddedCardsPage />
    )} 
    {!navToBids && (    
    <IonPage>
      <Header 
        title="Start Card Auction"
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
                    className="ion-padding-top"
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
                    Your bid was<br/>retracted
                    Cancelled
                  </Text>
                  <Text
                    className="ion-padding"
                    fontSize={FontSize.L}
                    color="light"
                  >
                    You successfully <b>retracted</b> from the bidding process.
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
                  dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, true, true, undefined));
                  navigateBids();
                }
              }
            >
              View Open Bids
            </ViewCardButton>
          </IonToolbar>
        </Footer>
      )}
    </IonPage>    
    )}  
    </>
  );
};

export default AuctionRetractBidFinalizationPage;
