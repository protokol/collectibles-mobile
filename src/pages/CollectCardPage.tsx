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
} from '@ionic/react';
import Header from '../components/Header';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { driverHighResImage } from '../constants/images';
import useIsMounted from '../hooks/use-is-mounted';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { ClaimAssetAction } from '../store/actions/asset-claim';
import { assetClaimSelector } from '../store/selectors/asset-claim';
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

const CollectCardPage: FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const history = useHistory();
  const dispatch = useDispatch();
  const assetClaimRequest = useSelector(assetClaimSelector, shallowEqual);
  const transactions = useSelector(transactionsSelector, shallowEqual);
  const tx = useMemo(() => transactions[txUuid], [transactions]);

  const isLoading = useCallback(() => {
    return assetClaimRequest?.isLoading || tx?.isLoading;
  }, [assetClaimRequest, tx]);

  const isError = useCallback(() => {
    return assetClaimRequest?.isError || tx?.isError;
  }, [assetClaimRequest, tx]);

  const error = useCallback(() => {
    return `${assetClaimRequest?.error}${tx?.error}`;
  }, [assetClaimRequest, tx]);

  const {
    session: { address },
  } = useContext(AuthLoginContext);

  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted && collectionId && address) {
      dispatch(ClaimAssetAction(collectionId, address!, txUuid));
    }
  }, [isMounted, dispatch, collectionId, address]);

  return (
    <IonPage>
      <Header
        title="Collect Cards"
        contentId="collect-card-content"
        buttonTopLeft={
          <IonButton onClick={() => history.push('/home')}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />

      <IonContent fullscreen id="collect-card-content">
        <IonGrid className="ion-no-padding">
          <IonRow>
            <ImageBgCol size="12">
              {isLoading() && <IonSpinner color="light" />}
              {!isLoading() && isError() && (
                <>
                  <Text color="danger" fontSize={FontSize.XL}>
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
                  <Text color="success" fontSize={FontSize.XL}>
                    Hooray!
                  </Text>
                  <Text
                    className="ion-padding-top"
                    fontSize={FontSize.M}
                    color="light"
                  >
                    You just received a new hero card!
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

export default CollectCardPage;
