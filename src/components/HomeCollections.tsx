import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import {
  IonCol,
  IonFooter,
  IonGrid,
  IonRow,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import Card from '../components/Card';
import SortBy from '../components/SortBy';
import Button from '../components/ionic/Button';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectionsLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
import Text from './ionic/Text';

const CardContainer = styled(IonCol)`
  padding: 1.375rem;

  &:nth-child(odd) {
    padding-left: 0.6875rem;
  }
  &:nth-child(even) {
    padding-right: 0.6875rem;
  }
`;

const Footer = styled(IonFooter)`
  position: fixed;
  bottom: 0;
`;

const CollectablesIonRow = styled(IonRow)`
  margin-bottom: 5rem;
`;

const HomeCollections: FC = () => {
  const history = useHistory();
  const { isError, error, isLoading, assets, isLastPage, query } = useSelector(
    collectionSelector,
    shallowEqual
  );
  const dispatch = useDispatch();
  const {
    session: { publicKey },
  } = useContext(AuthLoginContext);

  const isMounted = useIsMounted();
  useEffect(() => {
    if (publicKey && isMounted) {
      dispatch(CollectionsLoadAction(publicKey!));
    }
  }, [isMounted, dispatch, publicKey]);

  const loadNextPage = useCallback(() => {
    if (publicKey && !isLastPage) {
      const { page } = query ?? { page: 0 };
      dispatch(
        CollectionsLoadAction(publicKey!, {
          ...query,
          page: page! + 1,
        })
      );
    }
  }, [query, dispatch, publicKey, isLastPage]);

  const flatAssets = useMemo(() => assets.flat(), [assets]);

  return (
    <>
      <IonGrid className="ion-no-padding">
        <CollectablesIonRow>
          {!isLoading && isError && (
            <IonCol size="12" class="ion-text-center ion-padding-top">
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
            </IonCol>
          )}
          {!isLoading && !!flatAssets.length && !isError && (
            <>
              <IonCol size="12" className="ion-margin-bottom">
                <SortBy options={['All', 'Newest', 'Name', 'Team', 'Race']} />
              </IonCol>
              {flatAssets.map(({ id, attributes }) => (
                <CardContainer key={id} size="6">
                  {console.log('attributes', attributes)}
                  <Card title="Title" subtitle="Subtitle" />
                </CardContainer>
              ))}
            </>
          )}
          {!isLoading && !flatAssets.length && !isError && (
            <IonCol size="12" class="ion-text-center">
              <Text
                className="ion-padding-top"
                fontSize={FontSize.M}
                color="primary"
              >
                No collectables yet!
              </Text>
            </IonCol>
          )}
          {isLoading && (
            <IonCol size="12" class="ion-text-center ion-padding-top">
              <IonSpinner color="primary" />
            </IonCol>
          )}
        </CollectablesIonRow>
      </IonGrid>
      <Footer className="ion-no-border">
        <IonToolbar>
          <Button
            color="primary"
            size="large"
            className="ion-text-uppercase ion-no-margin"
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
            radius={false}
            expand="block"
            onClick={() => {
              loadNextPage();
              // history.push('/home/collect-card');
              console.log(history);
            }}
          >
            Add new card
          </Button>
        </IonToolbar>
      </Footer>
    </>
  );
};

export default HomeCollections;
