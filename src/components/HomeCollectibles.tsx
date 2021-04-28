import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import {
  isPlatform,
  IonCol,
  IonFooter,
  IonGrid,
  IonRow,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import Card from './Card';
import Button from './ionic/Button';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import useMediaQuery from '../hooks/use-media-query';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectiblesLoadAction } from '../store/actions/collections';
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

const HomeCollectibles: FC = () => {  
  const history = useHistory();
  const isMedium = useMediaQuery('(min-height: 992px)');
  const isLarge = useMediaQuery('(min-height: 1200px)');
  const { isError, error, isLoading, assets, isLastPage, query } = useSelector(
    collectionSelector,
    shallowEqual
  );

  const AddNewCard = () => {  
    if (isPlatform("cordova")){
      history.push('/home/scan-qr');
    }else{
      const randomCollections = [
        '35c20e153ea2532cbecae087dee0d68964091caa1a7b043568c38e877f355e08',
        '64c6ee0e50e860cdd928b70f1dc25dc5f367b5292eb198998445acc44d362b77', 
        'b725c6c140d6a3f7c6c185380fec56b7edf645a6a086d3553c26901c03e31817'
      ];
      let randomCollection = randomCollections[~~(randomCollections.length * Math.random())];
      history.push(`/home/collect-card/${randomCollection}`);
    }
  }

  const dispatch = useDispatch();
  const {
    session: { publicKey },
  } = useContext(AuthLoginContext);

  const publicKeyIn = publicKey;  

  const isMounted = useIsMounted();
  useEffect(() => {
    if (publicKeyIn && isMounted) {
      dispatch(CollectiblesLoadAction(publicKeyIn!));
    }
  }, [isMounted, dispatch, publicKeyIn]);

  const loadNextPage = useCallback(() => {
    if (publicKeyIn) {
      const { page } = query ?? { page: 1 };
      dispatch(
        CollectiblesLoadAction(publicKeyIn!, {
          ...query,
          page: page! + 1,
        })
      );
    }
  }, [query, dispatch, publicKeyIn]);

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
              {flatAssets.map(({ id, attributes }) => {
                const {
                  title,
                  subtitle,                  
                  ipfsHashImageFront,
                  tags,
                } = attributes as any;

                //console.log(attributes);

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
                <br/>
                {publicKey}
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
            onClick={AddNewCard}
          >
            Add new card
          </Button>
        </IonToolbar>
      </Footer>
    </>
  );
};

export default HomeCollectibles;
