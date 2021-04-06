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
import useMediaQuery from '../hooks/use-media-query';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectionsLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
import { CardTagType } from './CardTag';
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
  overflow: auto;
  max-height: calc(100vh - 92px - 4.8rem);
`;

const HomeCollections: FC = () => {
  const history = useHistory();
  const isMedium = useMediaQuery('(min-height: 992px)');
  const isLarge = useMediaQuery('(min-height: 1200px)');
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
    if (publicKey) {
      const { page } = query ?? { page: 1 };
      dispatch(
        CollectionsLoadAction(publicKey!, {
          ...query,
          page: page! + 1,
        })
      );
    }
  }, [query, dispatch, publicKey]);

  const flatAssets = useMemo(() => assets.flat(), [assets]);

  const onCardsScroll = useCallback(
    ({ target }) => {
      const isBottom =
        target.scrollHeight - target.scrollTop === target.clientHeight;
      if (isBottom && !isLastPage && !isLoading) {
        loadNextPage();
      }
    },
    [loadNextPage, isLastPage, isLoading]
  );

  const cardColSize = useCallback(() => {
    if (isLarge) {
      return 3;
    }
    if (isMedium) {
      return 4;
    }
    return 6;
  }, [isMedium, isLarge]);

  return (
    <>
      <IonGrid className="ion-no-padding">
        <CollectablesIonRow onScroll={onCardsScroll}>
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
                {error}
              </Text>
            </IonCol>
          )}
          {!isLoading && !!flatAssets.length && !isError && (
            <>
              <IonCol size="12" className="ion-margin-bottom">
                <SortBy options={['All', 'Newest', 'Name', 'Team', 'Race']} />
              </IonCol>
              {flatAssets.map(({ id, attributes }) => {
                const {
                  title,
                  subtitle,
                  ipfsHashImageFront,
                  tags,
                } = attributes as any;

                const type =
                  Array.isArray(tags) && tags.length
                    ? tags[0]
                    : CardTagType.None;

                return (
                  <CardContainer key={id} size={cardColSize().toString()}>
                    <Card
                      id={id}
                      title={title}
                      subtitle={subtitle}
                      imgIpfsHash={ipfsHashImageFront}
                      type={type}
                    />
                  </CardContainer>
                );
              })}
            </>
          )}
          {!isLoading && !flatAssets.length && !isError && (
            <IonCol size="12" class="ion-text-center">
              <Text
                className="ion-padding-top"
                fontSize={FontSize.L}
                color="primary"
              >
                No collectables yet!
              </Text>
            </IonCol>
          )}
          {isLoading && !flatAssets.length && (
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
              history.push('/home/scan-qr');
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
