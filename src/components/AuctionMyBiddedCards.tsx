import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  IonCol,  
  IonGrid,
  IonRow,
  IonSpinner,
} from '@ionic/react';
import CardOnAuction from './CardOnAuction';
import { JSX } from '@ionic/core';
import Button from './ionic/Button';
import Label from './ionic/Label';
import Text from './ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import { CardTagType } from './CardTag';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
import { auctionBalloonImage } from '../constants/images';
import AuctionParticipateIn from './AuctionParticipateIn';

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

const HorizontalLine = styled.div`
  width:1px;
  height:1px;
  width: 80%;
  margin-left: 10%;  
  background:#E6E6E6;
  position: relative;
`;

const BiddedCardsButton = styled(Button)<JSX.IonButton>`
  text-decoration: underline;
  text-transform: uppercase;
`;

const CollectablesIonRow = styled(IonRow)`
  overflow: auto;
  max-height: calc(100vh - 92px - 4.8rem);
`;

const AuctionMyBiddedCards: FC = () => {

    const { isError, error, isLoading, assets, isLastPage /*, query*/ } = useSelector(collectionSelector);

    const [navToNewBid, setNavToNewBid] = useState(false);

    const navigateNewBid = () => {    
      setNavToNewBid(true);   
    }    

    const dispatch = useDispatch();
    const {
      session: { publicKey },
    } = useContext(AuthLoginContext);
  
 
    const isMounted = useIsMounted();
    useEffect(() => {
      if (publicKey && isMounted) {
          dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, true, true, undefined));
      }
    }, [isMounted, dispatch, publicKey]);
  
    const loadNextPage = useCallback(() => {
      if (publicKey) {
        //const { page } = query ?? { page: 1 };
        dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, true, true, undefined));
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
      
  return (
    <>
    {navToNewBid && (
      <AuctionParticipateIn />
    )}  
    {!navToNewBid && (      
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
                      dispatch(CollectiblesOnAuctionLoadAction(publicKey!, false, false, false, undefined));
                      navigateNewBid();
                    }
                  }
                >
                  Start a new bid
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
                  ipfsHashImageFront,
                  tags,
                  timeRemaining,
                  currentBid,
                  yourBid                  
                } = attributes as any;

                const type = 
                  Array.isArray(tags) && tags.length
                    ? tags[0]
                    : CardTagType.None;

                return (
                  <IonCol size="12" key={id}>
                    <CardOnAuction
                      id={id}
                      title={title}
                      imgIpfsHash={ipfsHashImageFront}
                      type={type}
                      linkto={"/market/card/newbid/" + id}  
                      timeRemaining={timeRemaining}                   
                      currentBid={currentBid}
                      yourBid={yourBid}
                    />
                    <HorizontalLine/>
                  </IonCol>
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
                You don't have bids yet!
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

export default AuctionMyBiddedCards;
