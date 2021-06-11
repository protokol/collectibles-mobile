import { FC, useContext, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonLabel,
  IonToolbar,
  IonFooter,
  IonRow,
  IonCol,
  IonItem,
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
import styled from 'styled-components';
import Button from '../components/ionic/Button';

const Footer = styled(IonFooter)`
  position: fixed;
  bottom: 0;
`;

const FooterButton = styled(Button)`
  &.ion-color-auction {
    --ion-color-base: var(--ion-color-auction-base);
    --ion-color-base-rgb: var(--ion-color-warning-rgb);
    --ion-color-contrast: var(--ion-color-auction-tint);
    --ion-color-contrast-rgb: var(--ion-color-auction-tint);
    --ion-color-shade: var(--ion-color-warning-shade);
    --ion-color-tint: var(--ion-color-auction-tint);
  }
`;

const IonLabelStyled = styled(IonLabel)`
  font-size: 30px;
`;

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
      <Header title="My profile" />

      <IonContent fullscreen id="main-content">
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
            <>
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
            <IonItem lines="none" class="ion-align-center">
              <IonLabel>Balance </IonLabel>
              <IonLabelStyled color="success">{"$" + (Number(wallet?.balance)/10**8).toFixed(2) + " NASCAR"}</IonLabelStyled>  
            </IonItem>
            </>
          )}
        </IonGrid>
        <Footer className="ion-no-border">
          <IonToolbar>
            <FooterButton
              color="auction"
              size="large"
              type="submit"
              className="ion-text-uppercase ion-no-margin"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              radius={false}
              expand="block"
            >
              Get some NASCAR paper coins
            </FooterButton>
          </IonToolbar>
        </Footer>          
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
