import { arrowBackOutline } from 'ionicons/icons';
import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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
} from '@ionic/react';
import Header from '../components/Header';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { driverHighResImage } from '../constants/images';
import useIsMounted from '../hooks/use-is-mounted';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { faucetSelector } from '../store/selectors/wallets';
import { FaucetSendTokensAction } from '../store/actions/wallets';
import { WalletsLoadAction } from '../store/actions/wallets';
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

const txUuid = uuid();

const GotPaperCoinsPage: FC = () => {  

  const history = useHistory();
  const dispatch = useDispatch();

  const faucetRequest = useSelector(faucetSelector, shallowEqual);
  const transactions = useSelector(transactionsSelector, shallowEqual);
  const tx = useMemo(() => transactions[txUuid], [transactions]);

  const isLoading = useCallback(() => {
    return faucetRequest?.isLoading || tx?.isLoading;
  }, [faucetRequest, tx]);

  const isError = useCallback(() => {
    return faucetRequest?.isError || tx?.isError;
  }, [faucetRequest, tx]);

  const error = useCallback(() => {    
    return (faucetRequest?.isError)? `${faucetRequest?.error}`:`${tx?.error?.message}`;
  }, [faucetRequest, tx]);

  const {
    session: { publicKey, address },
  } = useContext(AuthLoginContext);  

  const senderPassPhrase = process.env.PAPER_COINS_FAUCET_SENDER_PASSPHRASE!; //"faculty impose century rule blood embody venue ladder clog memory cigar only";
  const senderAmount = process.env.PAPER_COINS_SEND_AMOUNT!; // 1000;

  const isMounted = useIsMounted();  
  useEffect(() => {        
    if (isMounted && publicKey) {            
      dispatch(FaucetSendTokensAction(senderPassPhrase, address!, publicKey!, Number(senderAmount), txUuid));
    }
  }, [isMounted, dispatch, senderPassPhrase, address, publicKey, senderAmount]);  

  return (   
    <IonPage>
      <Header 
        title="Get Some Paper Coins"
        buttonTopLeft={
          <IonButton onClick={() => {
                dispatch(WalletsLoadAction(publicKey!))
                history.goBack();
              }
            }>
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
                    Sent!
                  </Text>
                  <Text
                    className="ion-padding"
                    fontSize={FontSize.L}
                    color="light"
                  >
                    Sent some <b>NASCAR</b> paper coins!
                  </Text>
                </>
              )}            
            </ImageBgCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default GotPaperCoinsPage;