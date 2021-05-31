import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  IonCol,  
  IonGrid,
  IonRow,
  IonSpinner,
} from '@ionic/react';
import Card from '../components/Card';
import Button from '../components/ionic/Button';
import { JSX } from '@ionic/core';
import Label from '../components/ionic/Label';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import useMediaQuery from '../hooks/use-media-query';
import { CardTagType } from '../components/CardTag';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
import { auctionBalloonImage } from '../constants/images';
import AuctionMyBiddedCardsPage from './AuctionMyBiddedCardsPage';

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
    background-image: url('${auctionBalloonImage.src}');
    background-size: cover;    
    background-repeat: no-repeat;
    background-position: 50% 0;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

const BiddedCardsButton = styled(Button)<JSX.IonButton>`
  text-decoration: underline;
  text-transform: uppercase;
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

const AuctionParticipateInPage: FC = () => {    
    const isMedium = useMediaQuery('(min-height: 992px)');
    const isLarge = useMediaQuery('(min-height: 1200px)');
    const { isError, error, isLoading, assets, isLastPage /*, query*/ } = useSelector(collectionSelector, shallowEqual); 

    const [navToMyBiddedCards, setNavToMyBiddedCards] = useState(false);

    const navigateMyBids = () => {    
      setNavToMyBiddedCards(true);   
    }    


    const dispatch = useDispatch();
    const {
      session: { publicKey },
    } = useContext(AuthLoginContext);
  
 
    const isMounted = useIsMounted();
    useEffect(() => {
      if (publicKey && isMounted) {
          dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, false, false, undefined));
      }
    }, [isMounted, dispatch, publicKey]);
  
    const loadNextPage = useCallback(() => {
      if (publicKey) {
        //const { page } = query ?? { page: 1 };
        dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, false, false, undefined));
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
    {navToMyBiddedCards && (
      <AuctionMyBiddedCardsPage />
    )}  
    {!navToMyBiddedCards && (      
    <>
    <IonGrid className="ion-no-padding">
      <IonRow>
        <ImageBgCol size="12">
          <Label
            style={{maxWidth:"256px"}}
            color="light"
            fontSize={FontSize.L}
            fontWeight={FontWeight.BOLD}
          >
            Are you still the highest bidder?
          </Label>
          <br />
          <Text
            style={{maxWidth:"256px"}}
            className="ion-margin-vertical"
            color="light"
            fontSize={FontSize.XS}
          >
            Keep an eye on all your bids, and 
            make sure you don’t loose your cards.
          </Text>    
          <br />
          <IonGrid class="ion-justify-content-center">
            <IonRow class="ion-justify-content-center">              
              <IonCol class="ion-align-self-center">
                <BiddedCardsButton
                  className="ion-float-right"
                  fill="clear"
                  fontSize={FontSize.SM}
                  color="light"
                  fontWeight={FontWeight.BOLD}
                  onClick={() => {
                      dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, true, true, undefined));
                      navigateMyBids();
                    }
                  }
                >
                  My Bids
                </BiddedCardsButton>                   
              </IonCol>              
            </IonRow>
          </IonGrid>                             
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
                      linkto={"/market/card/newbid/"+id}
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
    )} 
    </>
  );
};

export default AuctionParticipateInPage;
