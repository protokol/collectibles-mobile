import { FC, useCallback, useContext, useState, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  IonCol,  
  IonGrid,
  IonRow,
  IonSpinner,
} from '@ionic/react';
import Card from './Card';
import { JSX } from '@ionic/core';
import Button from './ionic/Button';
import Label from './ionic/Label';
import Text from './ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import useMediaQuery from '../hooks/use-media-query';
import { CardTagType } from './CardTag';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectiblesLoadAction, CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
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

const StartAuctionButton = styled(Button)<JSX.IonButton>`  
  text-decoration: none;
  text-transform: capitalize;  
`;

const CardsOnAuctionButton = styled(Button)<JSX.IonButton>`
  text-decoration: none;
  text-transform: capitalize;
`;

const BiddedCardsButton = styled(Button)<JSX.IonButton>`
  text-decoration: none;
  text-transform: capitalize;
`;

const CollectablesIonRow = styled(IonRow)`
  overflow: auto;
  max-height: calc(100vh - 92px - 4.8rem);
`;

const AuctionSell: FC = () => {    
    const isMedium = useMediaQuery('(min-height: 992px)');
    const isLarge = useMediaQuery('(min-height: 1200px)');
    const { isError, error, isLoading, assets, isLastPage, query } = useSelector(
      collectionSelector,
      shallowEqual
    );
    const [submenu, setAuctionSellSubMenu] = useState(1)
    const auctionStart = submenu===1;
    const cardsOnAuction = submenu===2;
    const biddedCards = submenu===3;

    const StartAuction = () => {
      setAuctionSellSubMenu(1);
    }

    const CardsOnAuction = () => {
      setAuctionSellSubMenu(2);
    }

    const BiddedCards = () => {
      setAuctionSellSubMenu(3);
    }

    const dispatch = useDispatch();
    const {
      session: { publicKey },
    } = useContext(AuthLoginContext);
  
    const publicKeyIn = publicKey;    
  
    const isMounted = useIsMounted();
    useEffect(() => {
      if (publicKeyIn && isMounted) {
        if (auctionStart){
          dispatch(CollectiblesLoadAction(publicKeyIn!));
        }else if (cardsOnAuction){
          dispatch(CollectiblesOnAuctionLoadAction(publicKeyIn!, undefined));
        }else if (biddedCards){
          //dispatch(CollectiblesBiddedLoadAction(publicKeyIn!));
        }
      }
    }, [isMounted, dispatch, publicKeyIn, auctionStart, cardsOnAuction, biddedCards]);
  
    const loadNextPage = useCallback(() => {
      if (publicKeyIn) {
        const { page } = query ?? { page: 1 };
        if (auctionStart){
          dispatch(
            CollectiblesLoadAction(publicKeyIn!, {
              ...query,
              page: page! + 1,
            })
          );
        }else if (cardsOnAuction){
          dispatch(CollectiblesOnAuctionLoadAction(publicKeyIn!, undefined));
        }else if (biddedCards){
          /*
          dispatch(
            CollectiblesBiddedLoadAction(publicKeyIn!, {
              ...query,
              page: page! + 1,
            })
          );
          */
        }        
      }
    }, [query, dispatch, publicKeyIn, auctionStart, cardsOnAuction, biddedCards]);
  
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
            Pick a card and start an auction...
          </Label>
          <br />
          <Text
            className="ion-margin-vertical"
            color="light"
            fontSize={FontSize.XS}
          >
            ...or start bidding on your favourite cards. 
            Make sure to follow up with your cards, 
            since some disappear at a racing speed!
          </Text>
          <br />
          <IonGrid class="ion-justify-content-center">
            <IonRow class="ion-justify-content-center">
              <IonCol class="ion-align-self-center">
                <StartAuctionButton
                  className="ion-float-left"                                  
                  fill="clear"
                  fontSize={FontSize.SM}                  
                  color={(auctionStart)?"warning":"light"}
                  fontWeight={(auctionStart)?FontWeight.BOLD:FontWeight.NORMAL}
                  onClick={() => StartAuction()}
                >
                  Start Auction
                </StartAuctionButton>
              </IonCol>              
              <IonCol class="ion-align-self-center">
                <CardsOnAuctionButton
                  className="ion-float-center"                  
                  fill="clear"
                  fontSize={FontSize.SM}      
                  color={(cardsOnAuction)?"warning":"light"}
                  fontWeight={(cardsOnAuction)?FontWeight.BOLD:FontWeight.NORMAL}
                  onClick={() => CardsOnAuction()}
                >
                  Cards On Auction
                </CardsOnAuctionButton>                 
              </IonCol>              
              <IonCol class="ion-align-self-center">
                <BiddedCardsButton
                  className="ion-float-right"
                  fill="clear"
                  fontSize={FontSize.SM}
                  color={(biddedCards)?"warning":"light"}
                  fontWeight={(biddedCards)?FontWeight.BOLD:FontWeight.NORMAL}
                  onClick={() => BiddedCards()}
                >
                  Bidded Cards
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
    </>
  );
};

export default AuctionSell;
