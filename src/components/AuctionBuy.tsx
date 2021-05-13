import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  IonCol,  
  IonGrid,
  IonRow,
  IonSpinner,
} from '@ionic/react';
import Card from './Card';
import Label from './ionic/Label';
import Text from './ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import useMediaQuery from '../hooks/use-media-query';
import { CardTagType } from './CardTag';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
import { cardsOnAuctionSelector } from '../store/selectors/collections';
import { auctionImage } from '../constants/images';

const ImageBgCol = styled(IonCol)`
  position: relative;
  padding: 3.5rem 2.05rem 1.85rem 1.5rem;
  overflow: hidden;
  z-index: 2;
  height: 229px !important;

  &:before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.8;
    background-image: url('${auctionImage.src}');
    background-size: cover;    
    background-repeat: no-repeat;
    background-position: 50% 0;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

const CardContainer = styled(IonCol)` 
  padding: 1.375rem;

  &:nth-child(odd) {
    padding-left: 0.6875rem;
  }
  &:nth-child(even) {
    padding-right: 0.6875rem;
  }
`;

const CollectablesIonRow = styled(IonRow)`
  overflow: auto;
  max-height: calc(100vh - 92px - 4.8rem);
`;

const AuctionBuy: FC = () => {    
    const isMedium = useMediaQuery('(min-height: 992px)');
    const isLarge = useMediaQuery('(min-height: 1200px)');
    const { isError, error, isLoading, assets, isLastPage /*, query*/ } = useSelector(
      cardsOnAuctionSelector,
      shallowEqual
    );

    const dispatch = useDispatch();
    const {
      session: { publicKey },
    } = useContext(AuthLoginContext);
  
 
    const isMounted = useIsMounted();
    useEffect(() => {
      if (publicKey && isMounted) {
          dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, undefined));
      }
    }, [isMounted, dispatch, publicKey]);
  
    const loadNextPage = useCallback(() => {
      if (publicKey) {
        //const { page } = query ?? { page: 1 };
        dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, undefined));
      }
    }, [/*query,*/ dispatch, publicKey]);
  
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
      <IonRow>
        <ImageBgCol size="12">
          <Label
            color="light"
            fontSize={FontSize.L}
            fontWeight={FontWeight.BOLD}
          >
            Pick a card and participate in the auction...
          </Label>
          <br />
          <Text
            className="ion-margin-vertical"
            color="light"
            fontSize={FontSize.XS}
          >
            ...start bidding on your favourite cards. 
            Make sure to follow up with your cards, 
            since some disappear at a racing speed!
          </Text>                      
        </ImageBgCol>
      </IonRow>
    </IonGrid>    
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
                      linkto={"/home/card/startauction/"+id}
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
                No available auctions yet!
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
    </>
  );
};

export default AuctionBuy;