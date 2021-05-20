import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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
import { cardsOnAuctionSelector } from '../store/selectors/collections';
import { auctionBalloonImage } from '../constants/images';

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

const CollectablesIonRow = styled(IonRow)`
  overflow: auto;
  max-height: calc(100vh - 92px - 4.8rem);
`;

const AuctionBuyView: FC = () => {    
    const history = useHistory();
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
      
  return (
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
            Find your new favourite card…
          </Label>
          <br />
          <Text
            style={{maxWidth:"256px"}}
            className="ion-margin-vertical"
            color="light"
            fontSize={FontSize.XS}
          >
            Discover the latest auction cards, pick your favourite, 
            and let the bidding war begin!
          </Text>                      
        </ImageBgCol>
        <br />
          <IonGrid class="ion-justify-content-center">
            <IonRow class="ion-justify-content-center">              
              <IonCol class="ion-align-self-center">
                <BiddedCardsButton
                  className="ion-float-right"
                  fill="clear"
                  fontSize={FontSize.SM}
                  color="warning"
                  fontWeight={FontWeight.BOLD}
                  onClick={() => history.push("/market/mybids")}
                >
                  Bidded Cards
                </BiddedCardsButton>                   
              </IonCol>              
            </IonRow>
          </IonGrid>             
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
                  <>
                    <CardOnAuction
                      id={id}
                      title={title}
                      imgIpfsHash={ipfsHashImageFront}
                      type={type}
                      linkto={"/market/editbid/"+id}  
                      timeRemaining={timeRemaining}                   
                      currentBid={currentBid}
                      yourBid={yourBid}
                    />
                  </>
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

export default AuctionBuyView;