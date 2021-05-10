import { arrowBackOutline } from 'ionicons/icons';
import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
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
import { StartAuctionAction } from '../store/actions/auctions';
import { startAuctionSelector } from '../store/selectors/auctions';
import { transactionsSelector } from '../store/selectors/transaction';
import { min } from 'rxjs/operators';
import { ClaimAssetAction } from '../store/actions/asset-claim';

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

const StartAuctionPage: FC = () => {  

  const { cardId, minimumBid, minimumIncrement, finalBiddingDate } = useParams<{ cardId: string, minimumBid: string, minimumIncrement: string, finalBiddingDate: string}>();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    session: { publicKey },
  } = useContext(AuthLoginContext);

  const startAuctionRequest = useSelector(startAuctionSelector, shallowEqual);
  const transactions = useSelector(transactionsSelector, shallowEqual);
  const tx = useMemo(() => transactions[txUuid], [transactions]);

  const isLoading = useCallback(() => {
    return startAuctionRequest?.isLoading || tx?.isLoading;
  }, [startAuctionRequest, tx]);

  const isError = useCallback(() => {
    return startAuctionRequest?.isError || tx?.isError;
  }, [startAuctionRequest, tx]);

  const error = useCallback(() => {
    return `${startAuctionRequest?.error}${tx?.error}`;
  }, [startAuctionRequest, tx]);

  const {
    session: { address, passphrase },
  } = useContext(AuthLoginContext);  

  const isMounted = useIsMounted();  
  useEffect(() => {        
    if (isMounted && minimumBid && minimumIncrement && finalBiddingDate && cardId && address) {            
      dispatch(StartAuctionAction(Number(minimumBid), Number(minimumIncrement), finalBiddingDate, cardId, address!, passphrase!, txUuid));
    }
  }, [isMounted, dispatch, minimumBid, minimumIncrement, finalBiddingDate, cardId, address, passphrase]);  

  return (
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
                  {error}
                  </Text>
                </>
              )}
              {!isLoading() && !isError() && (
                <>
                  <Text color="success" fontSize={FontSize.XXL}>
                    Hooray!
                  </Text>
                  <Text
                    className="ion-padding-top"
                    fontSize={FontSize.L}
                    color="light"
                  >
                    You just started a card auction!
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
                const { txId } = tx;
                //dispatch(CollectiblesLoadAction(publicKey!));
                history.push(`/home/auction/${txId}`);
              }}              
            >
              View Auction
            </ViewCardButton>
          </IonToolbar>
        </Footer>
      )}
    </IonPage>
  );
};

export default StartAuctionPage;
