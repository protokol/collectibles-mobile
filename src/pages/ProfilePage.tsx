import { FC, useContext, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from '@ionic/react';
import { DetailCard, DetailCardsStyled } from '../components/DetailCards';
import Header from '../components/Header';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { WalletsLoadAction } from '../store/actions/wallets';
import { walletsSelector } from '../store/selectors/wallets';

const ProfilePage: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    session: { publicKey, username },
  } = useContext(AuthLoginContext);

  const wallets = useSelector(walletsSelector, shallowEqual);

  const { isLoading, wallet, isError, error } = useMemo(
    () =>
      wallets.hasOwnProperty(publicKey!)
        ? wallets[publicKey!]
        : {
            isLoading: true,
            isError: false,
            error: null,
            wallet: null,
          },
    [wallets, publicKey]
  );

  const isMounted = useIsMounted();
  useEffect(() => {
    if (publicKey && isMounted) {
      dispatch(WalletsLoadAction(publicKey!));
    }
  }, [isMounted, dispatch, publicKey]);

  const cardsLength = useMemo(() => {
    if (wallet?.attributes?.nft?.base?.tokenIds) {
      return Object.keys(wallet?.attributes?.nft?.base?.tokenIds).length;
    }
    return 0;
  }, [wallet]);

  const walletUsername = useMemo(
    () => wallet?.attributes?.nameservice?.name || undefined,
    [wallet]
  );

  return (
    <IonPage>
      <Header title="My profile" contentId="profile-content" />

      <IonContent fullscreen id="profile-content">
        <IonGrid>
          <IonRow>
            {!isLoading && isError && (
              <IonCol size="12" class="ion-text-center ion-padding-top">
                <Text color="danger" fontSize={FontSize.XXL}>
                  Something went wrong!
                </Text>
                <Text
                  className="ion-padding-top"
                  fontSize={FontSize.SM}
                  color="light"
                >
                  {error?.toString()}
                </Text>
              </IonCol>
            )}
            {isLoading && (
              <IonCol size="12" class="ion-text-center ion-padding-top">
                <IonSpinner color="primary" />
              </IonCol>
            )}

            {!isLoading && !isError && (
              <IonCol size="12" className="ion-text-center ion-padding">
                <Text
                  className="ion-text-capitalize"
                  fontSize={FontSize.L}
                  fontWeight={FontWeight.BOLD}
                >
                  Hi {walletUsername || username || '----'}!
                </Text>
              </IonCol>
            )}
          </IonRow>
          {!isLoading && !isError && (
            <DetailCardsStyled>
              <DetailCard
                isGrayBg={true}
                size="4"
                title="COLLECTED CARDS"
                subtitle={cardsLength.toString()}
              />
              <DetailCard
                isGrayBg={true}
                size="4"
                title="SINGED CARDS"
                subtitle="0"
              />
              <DetailCard
                isBlueBg={true}
                size="4"
                title="ADD NEW CARD"
                subtitle="+"
                onClick={() => history.replace('/home/scan-qr')}
              />
            </DetailCardsStyled>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
