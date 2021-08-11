import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { sadOutline } from 'ionicons/icons';
import styled from 'styled-components';
import {
  IonCol,  
  IonGrid,
  IonRow,
  IonIcon,
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
import { CollectiblesLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
import { auctionImage } from '../constants/images';
import AuctionsMyAuctions from './AuctionsMyAuctions';

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

const CardsOnAuctionButton = styled(Button)<JSX.IonButton>`
  text-decoration: underline;
  text-transform: uppercase;
`;

const CollectablesIonRow = styled(IonRow)`
  overflow: auto;
  max-height: calc(100vh - 92px - 4.8rem);
`;

const AuctionableCards: FC = () => {
    const isMedium = useMediaQuery('(min-height: 992px)');
    const isLarge = useMediaQuery('(min-height: 1200px)');
    
    const { isError, error, isLoading, assets, isLastPage, query } = useSelector(
      collectionSelector,
      shallowEqual
    );
    const [navToMyAuctions, setNavToMyAuctions] = useState(false);

    const navigateMyAuctions = () => {    
      setNavToMyAuctions(true);   
    }        

    const dispatch = useDispatch();
    const {
      session: { publicKey },
    } = useContext(AuthLoginContext);
  
    const isMounted = useIsMounted();
    useEffect(() => {
      if (publicKey && isMounted) {
          dispatch(CollectiblesLoadAction(publicKey!, false));
      }
    }, [isMounted, dispatch, publicKey]);
  
    const loadNextPage = useCallback(() => {
      if (publicKey) {
        const { page } = query ?? { page: 1 };
        dispatch(
          CollectiblesLoadAction(publicKey!, false, {
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
    {navToMyAuctions && (
      <AuctionsMyAuctions />
    )}
    {!navToMyAuctions && (
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
            Pick a card and start an auction...
          </Label>
          <br />
          <Text
            style={{maxWidth:"256px"}}
            className="ion-margin-vertical"
            color="light"
            fontSize={FontSize.XS}
          >
            This is your auction screen. Simply click on a card that you want to put on offer, 
            or check in with your current open auctions.
          </Text>
          <br />
          <IonGrid class="ion-justify-content-center">
            <IonRow class="ion-justify-content-center">             
              <IonCol class="ion-align-self-center">
                <CardsOnAuctionButton
                  className="ion-float-right"                  
                  fill="clear"
                  fontSize={FontSize.SM}      
                  color="light"
                  fontWeight={FontWeight.BOLD}
                  onClick={() => {
                      //dispatch(CollectiblesOnAuctionLoadAction(publicKey!, true, false, false, undefined));
                      navigateMyAuctions();
                      //history.replace("/market/myauctions");
                    }
                  }
                >
                  My Open Auctions
                </CardsOnAuctionButton>             
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
                  tags
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
                      linkto={"/market/card/startauction/"+id}                      
                    />    
                  </CardContainer>     
                );
              })}
            </>
          )}
          {!isLoading && !flatAssets.length && !isError && (
            <IonCol size="12" class="ion-text-center">
              <br/><br/><br/><br/>
              <Text className="ion-padding-top" color="medium" fontSize={FontSize.XXL} fontWeight={FontWeight.BOLD}>
                Oh no!
              </Text>
              <Text
                className="ion-padding"
                fontSize={FontSize.L}
                color="medium"
              >
                Looks like there are no hero cards available to auction!
              </Text>
              <IonCol><IonIcon color="medium" size="large" icon={sadOutline} /></IonCol>   
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

export default AuctionableCards;
