import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  IonCol,  
  IonGrid,
  IonRow,
  IonSpinner,
} from '@ionic/react';
import CardOnAuction from '../components/CardOnAuction';
import { JSX } from '@ionic/core';
import Button from '../components/ionic/Button';
import Label from '../components/ionic/Label';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import useIsMounted from '../hooks/use-is-mounted';
import { CardTagType } from '../components/CardTag';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
import { auctionImage } from '../constants/images';
import AuctionableCardsPage from './AuctionableCardsPage';

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

const StartAuctionButton = styled(Button)<JSX.IonButton>`  
  text-decoration: underline;
  text-transform: uppercase;
`;

const CollectablesIonRow = styled(IonRow)`
  overflow: auto;
  max-height: calc(100vh - 92px - 4.8rem);
`;

const HorizontalLine = styled.div`
  width:1px;
  height:1px;
  width: 80%;
  margin-left: 10%;  
  background:#E6E6E6;
  position: relative;
`;

const AuctionsOwnedPage: FC = () => {        
    const { isError, error, isLoading, assets, isLastPage } = useSelector(
      collectionSelector,
      shallowEqual
    );    
    const [navToStartAuction, setNavToStartAuction] = useState(false);

    const navigateStartAuction = () => {    
      setNavToStartAuction(true);   
    }    

    const dispatch = useDispatch();
    const {
      session: { publicKey },
    } = useContext(AuthLoginContext);
  
    const publicKeyIn = publicKey;    
  
    const isMounted = useIsMounted();
    useEffect(() => {
      if (publicKeyIn && isMounted) {
        dispatch(CollectiblesOnAuctionLoadAction(publicKeyIn!, true, undefined));
      }
    }, [isMounted, dispatch, publicKeyIn]);
  
    const loadNextPage = useCallback(() => {
      if (publicKeyIn) {        
        dispatch(CollectiblesOnAuctionLoadAction(publicKeyIn!, true, undefined));
      }
    }, [dispatch, publicKeyIn]);
  
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
    {navToStartAuction && (
      <AuctionableCardsPage />
    )}  
    {!navToStartAuction && (      
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
            My hero cards on auction
          </Label>
          <br />
          <Text
            style={{maxWidth:"256px"}}
            className="ion-margin-vertical"
            color="light"
            fontSize={FontSize.XS}
          >
            Follow up with your cards. You can check how high their current bid is, 
            change the auction duration or cancel it. 
            If you want, you can always start a new auction!
          </Text>
          <br />
          <IonGrid class="ion-justify-content-center">
            <IonRow class="ion-justify-content-center">
              <IonCol class="ion-align-self-center">
                <StartAuctionButton
                  className="ion-float-right"                                  
                  fill="clear"
                  fontSize={FontSize.SM}                  
                  color="light"
                  fontWeight={FontWeight.BOLD}
                  onClick={navigateStartAuction}
                >
                  Start a new Auction
                </StartAuctionButton>
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
                  minimumBid,
                  currentBid,
                  auctionId,
                  yourBid
                } = attributes as any;

                const type = 
                  Array.isArray(tags) && tags.length
                    ? tags[0]
                    : CardTagType.None;

                return (
                  <>
                    <CardOnAuction       
                      key={id}              
                      id={id}
                      title={title}
                      imgIpfsHash={ipfsHashImageFront}
                      type={type}
                      linkto={"/market/card/auctionview/" + auctionId + "/" + id}  
                      timeRemaining={timeRemaining}                   
                      minimumBid={minimumBid}
                      currentBid={currentBid}
                      yourBid={yourBid}
                    />
                    <HorizontalLine/>
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
                No auctions yet!
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

export default AuctionsOwnedPage;
