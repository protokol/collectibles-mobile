import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import {
  IonCol,
  IonGrid,
  IonRow,
  IonSpinner,
  IonSlide,
  IonSlides,
  IonLabel,
  IonCard  
} from '@ionic/react';
import Card from './Card';
import { FontSize } from '../constants/font-size';
import useIsMounted from '../hooks/use-is-mounted';
import useMediaQuery from '../hooks/use-media-query';
import { AuthLoginContext } from '../providers/AuthLoginProvider';
import { CollectionsLoadAction } from '../store/actions/collections';
import { collectionSelector } from '../store/selectors/collections';
import { CardTagType } from './CardTag';
import Text from './ionic/Text';
import Label from '../components/ionic/Label';
import { FontWeight } from '../constants/font-weight';
import { flagImage } from '../constants/images';
import ErrorBoundary from './ErrorBoundary';

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
    background-image: url('${flagImage.src}');
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
  flex: 1 1 auto;
`;

const CollectablesIonGrid = styled(IonGrid)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CollectablesIonCardTyped = styled(IonCard)`  
  width: 114px;
  height: auto;
  border-radius: 0px;
  -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
  border: 0px solid black;
`;

const CollectablesIonCard = styled(IonCard)`  
  width: 114px;
  height: 129px;
  border-radius: 0px;
  -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
  border: 0px solid black;
  padding: 0px;
  margin: 0px;
`;

const CollectablesIonMarketLabel = styled(IonLabel)`
  width: 100%;
  justify-content: center;  
  color: white;
  font-size:14px;
  font-family: Open Sans;
`;

const CollectionIonSlide = styled(IonSlide)`
  background: transparent;
  width: 114px !important;
  height: 129px;
  margin: 0px 0px 0px 10px;
  padding: 0px;
`;

const IonSlideBuy = styled(IonSlide)`
  background: #8AC827;
  width: 114px;
  height: 86px;
  margin: 0px 0px 0px 28px;  
`;

const IonSlideSell = styled(IonSlide)`
  background: #E4002B;
  width: 114px;
  height: 86px;
  margin: 0px 0px 0px 28px;  
`;

const IonSlideAuction = styled(IonSlide)`
  background: #FCCF45;
  width: 114px;
  height: 86px;
  margin: 0px 0px 0px 28px;  
`;

const Img = styled.img`  
  width: 114px !important;
  height: 86px !important;
  object-fit: contain;
  background: black;
  overflow: hidden;
  border: 1px green;
`;

const slideOpts = {
  grabCursor: true,
  slidesPerView: 4,  
  centeredSlides: false
};

const addIPFSGatewayPrefix = (ipfsHash: string) => `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

const HomeMarketBuy: FC = () => {
  const isMedium = useMediaQuery('(min-height: 992px)');
  const isLarge = useMediaQuery('(min-height: 1200px)');
  const { isError, error, isLoading, assets, /* isLastPage, query */ } = useSelector(
    collectionSelector,
    shallowEqual
  );
  const dispatch = useDispatch();
  const {
    session: { publicKey },
  } = useContext(AuthLoginContext);

  const isMounted = useIsMounted();  

  useEffect(() => {
    
    // Nascar Hero Cards Collection https://explorer.protokol.sh/api/nft/collections/40c39739c6030d266cdafe3ca07b2888c982ad5954744eb68ff53254e49465bc/assets
    // const publicKeyIn = publicKey;
    // TBR
    const publicKeyIn = "02cb8f39ec7962ff009626f53326d93bdbb866383f027159a1c63845606f02d31d"; 

    if (publicKeyIn && isMounted) {
      dispatch(CollectionsLoadAction(publicKeyIn!));
      console.log("TBR Hello, passing here! is mounted?: " + JSON.stringify(isMounted));      
    }
  }, [isMounted, dispatch, publicKey]);

  /*
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
  */

  const flatAssets = useMemo(() => assets.flat(), [assets]);  

  /*
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
  */

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
        {!isLoading && isError && isMounted && (
          <IonSlides options={slideOpts} style={{marginTop: "56px"}}>
          <IonSlideBuy>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#8AC827"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Buy Cards</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>
          </IonSlideBuy>          
          <IonSlide>
            <CollectablesIonCard>
                <CollectablesIonGrid style={{color:"#8AC827"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                  <Text color="danger" fontSize={FontSize.XXL}>
                    Something went wrong loading cards!
                  </Text>
                  <Text
                    className="ion-padding-top"
                    fontSize={FontSize.SM}
                    color="light"
                  >
                    {error}
                  </Text>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCard>   
          </IonSlide>
          </IonSlides>
        )}
        {!isLoading && !!flatAssets.length && !isError && isMounted &&  (
          <>
          <IonSlides options={slideOpts} style={{marginTop: "56px"}}>          
            <IonSlideBuy>
                <CollectablesIonCardTyped style={{}}>
                    <CollectablesIonGrid style={{background:"#8AC827"}}>
                      <CollectablesIonRow className="ion-align-items-center">
                          <CollectablesIonMarketLabel>Buy Cards</CollectablesIonMarketLabel>
                      </CollectablesIonRow>
                    </CollectablesIonGrid>                  
                </CollectablesIonCardTyped>   
            </IonSlideBuy>          
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

              console.log("TBR Returning assets!");

              return (
                <CollectionIonSlide>    
                  <CollectablesIonCard>
                    <IonGrid style={{margin:"0px", padding:"0px"}}>
                    {/*
                    <CardContainer key={id} size={cardColSize().toString()}>
                      <Card
                        id={id}
                        title={title}
                        subtitle={subtitle}
                        imgIpfsHash={ipfsHashImageFront}
                        type={type}
                      />
                    </CardContainer>     
                    */}  
                    <Img src={addIPFSGatewayPrefix(ipfsHashImageFront)} />                 
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px",fontWeigth:"bold", fontFamily:"Open Sans",color:"#000000"}}>Corey Lajoie</IonLabel>                                               
                    </IonRow>
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px",fontFamily:"Open Sans",color:"#494D5C"}}>Go Fas Racing</IonLabel>
                    </IonRow>
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px", fontStyle: 'italic', fontFamily:"Open Sans",color:"#8AC827"}}>10/100 Cards Available</IonLabel>
                    </IonRow>
                    </IonGrid>        
                  </CollectablesIonCard> 
                </CollectionIonSlide>                  
              );
            })}
            </IonSlides>
          </>
        )}
        {!isLoading && !flatAssets.length && !isError && isMounted &&  (
          <IonSlides options={slideOpts} style={{marginTop: "56px"}}>
            <IonSlideBuy>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#8AC827"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Buy Cards</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>   
          </IonSlideBuy>            
          <IonSlide>
          <CollectablesIonCard>
              <CollectablesIonGrid style={{background:"#f5f5f5"}}>
                <CollectablesIonRow className="ion-align-items-center">
                    <CollectablesIonMarketLabel>No collectibles for sale yet!</CollectablesIonMarketLabel>
                </CollectablesIonRow>
              </CollectablesIonGrid>                  
          </CollectablesIonCard>
          </IonSlide>
          </IonSlides>
        )}
        {isLoading && !flatAssets.length && isMounted &&  (
          <IonSlides options={slideOpts} style={{marginTop: "56px"}}>
            <IonSlideBuy>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#8AC827"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Buy Cards</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>   
            </IonSlideBuy>            
            <IonSlide>
            <CollectablesIonCard>
                <CollectablesIonGrid style={{background:"#f5f5f5"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                    <IonSpinner color="primary" />
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCard>
            </IonSlide>                      
          </IonSlides>
        )}        
    </>
  );
};

const HomeMarketSell: FC = () => {
  const isMedium = useMediaQuery('(min-height: 992px)');
  const isLarge = useMediaQuery('(min-height: 1200px)');
  const { isError, error, isLoading, assets, /* isLastPage, query */ } = useSelector(
    collectionSelector,
    shallowEqual
  );
  const dispatch = useDispatch();
  const {
    session: { publicKey },
  } = useContext(AuthLoginContext);

  const isMounted = useIsMounted();  

  useEffect(() => {
    
    // Nascar Hero Cards Collection https://explorer.protokol.sh/api/nft/collections/40c39739c6030d266cdafe3ca07b2888c982ad5954744eb68ff53254e49465bc/assets
    // const publicKeyIn = publicKey;
    // TBR
    var publicKeyIn = "02cb8f39ec7962ff009626f53326d93bdbb866383f027159a1c63845606f02d31d"; 

    if (publicKeyIn && isMounted) {
      dispatch(CollectionsLoadAction(publicKeyIn!));
      console.log("TBR Hello, passing here! is mounted?: " + JSON.stringify(isMounted));      
    }
  }, [isMounted, dispatch, publicKey]);

  /*
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
  */

  const flatAssets = useMemo(() => assets.flat(), [assets]);  

  /*
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
  */

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
        {!isLoading && isError && isMounted && (
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>
          <IonSlideSell>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#E4002B"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Sell Cards</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>
          </IonSlideSell>          
          <IonSlide>
            <CollectablesIonCard>
                <CollectablesIonGrid style={{color:"#E4002B"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                  <Text color="danger" fontSize={FontSize.XXL}>
                    Something went wrong loading cards!
                  </Text>
                  <Text
                    className="ion-padding-top"
                    fontSize={FontSize.SM}
                    color="light"
                  >
                    {error}
                  </Text>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCard>   
          </IonSlide>
          </IonSlides>
        )}
        {!isLoading && !!flatAssets.length && !isError && isMounted &&  (
          <>
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>          
            <IonSlideSell>
                <CollectablesIonCardTyped style={{}}>
                    <CollectablesIonGrid style={{background:"#E4002B"}}>
                      <CollectablesIonRow className="ion-align-items-center">
                          <CollectablesIonMarketLabel>Sell Cards</CollectablesIonMarketLabel>
                      </CollectablesIonRow>
                    </CollectablesIonGrid>                  
                </CollectablesIonCardTyped>   
            </IonSlideSell>          
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

              console.log("TBR Returning assets!");

              return (
                <CollectionIonSlide>    
                  <CollectablesIonCard>
                    <IonGrid style={{margin:"0px", padding:"0px"}}>
                    {/*
                    <CardContainer key={id} size={cardColSize().toString()}>
                      <Card
                        id={id}
                        title={title}
                        subtitle={subtitle}
                        imgIpfsHash={ipfsHashImageFront}
                        type={type}
                      />
                    </CardContainer>     
                    */}  
                    <Img src={addIPFSGatewayPrefix(ipfsHashImageFront)} />                 
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px",fontWeigth:"bold", fontFamily:"Open Sans",color:"#000000"}}>Corey Lajoie</IonLabel>                                               
                    </IonRow>
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px",fontFamily:"Open Sans",color:"#494D5C"}}>Go Fas Racing</IonLabel>
                    </IonRow>
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px", fontStyle: 'italic', fontFamily:"Open Sans",color:"#E4002B "}}>10/100 Cards Available</IonLabel>
                    </IonRow>
                    </IonGrid>        
                  </CollectablesIonCard> 
                </CollectionIonSlide>                  
              );
            })}
            </IonSlides>
          </>
        )}
        {!isLoading && !flatAssets.length && !isError && isMounted &&  (
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>
            <IonSlideSell>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#E4002B"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Sell Cards</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>   
          </IonSlideSell>            
          <IonSlide>
          <CollectablesIonCard>
              <CollectablesIonGrid style={{background:"#f5f5f5"}}>
                <CollectablesIonRow className="ion-align-items-center">
                    <CollectablesIonMarketLabel>No collectibles for sale yet!</CollectablesIonMarketLabel>
                </CollectablesIonRow>
              </CollectablesIonGrid>                  
          </CollectablesIonCard>
          </IonSlide>
          </IonSlides>
        )}
        {isLoading && !flatAssets.length && isMounted &&  (
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>
            <IonSlideSell>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#E4002B"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Sell Cards</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>   
            </IonSlideSell>            
            <IonSlide>
            <CollectablesIonCard>
                <CollectablesIonGrid style={{background:"#f5f5f5"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                    <IonSpinner color="primary" />
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCard>
            </IonSlide>                      
          </IonSlides>
        )}        
    </>
  );
};

const HomeMarketAuction: FC = () => {
  const isMedium = useMediaQuery('(min-height: 992px)');
  const isLarge = useMediaQuery('(min-height: 1200px)');
  const { isError, error, isLoading, assets, /* isLastPage, query */ } = useSelector(
    collectionSelector,
    shallowEqual
  );
  const dispatch = useDispatch();
  const {
    session: { publicKey },
  } = useContext(AuthLoginContext);

  const isMounted = useIsMounted();  

  useEffect(() => {
    
    // Nascar Hero Cards Collection https://explorer.protokol.sh/api/nft/collections/40c39739c6030d266cdafe3ca07b2888c982ad5954744eb68ff53254e49465bc/assets
    // const publicKeyIn = publicKey;
    // TBR
    var publicKeyIn = "02cb8f39ec7962ff009626f53326d93bdbb866383f027159a1c63845606f02d31d"; 

    if (publicKeyIn && isMounted) {
      dispatch(CollectionsLoadAction(publicKeyIn!));
      console.log("TBR Hello, passing here! is mounted?: " + JSON.stringify(isMounted));      
    }
  }, [isMounted, dispatch, publicKey]);

  /*
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
  */

  const flatAssets = useMemo(() => assets.flat(), [assets]);  

  /*
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
  */

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
        {!isLoading && isError && isMounted && (
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>
          <IonSlideAuction>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#FCCF45 "}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Start Auction</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>
          </IonSlideAuction>          
          <IonSlide>
            <CollectablesIonCard>
                <CollectablesIonGrid style={{color:"#FCCF45 "}}>
                  <CollectablesIonRow className="ion-align-items-center">
                  <Text color="danger" fontSize={FontSize.XXL}>
                    Something went wrong loading cards!
                  </Text>
                  <Text
                    className="ion-padding-top"
                    fontSize={FontSize.SM}
                    color="light"
                  >
                    {error}
                  </Text>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCard>   
          </IonSlide>
          </IonSlides>
        )}
        {!isLoading && !!flatAssets.length && !isError && isMounted &&  (
          <>
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>          
            <IonSlideAuction>
                <CollectablesIonCardTyped style={{}}>
                    <CollectablesIonGrid style={{background:"#FCCF45 "}}>
                      <CollectablesIonRow className="ion-align-items-center">
                          <CollectablesIonMarketLabel>Start Auction</CollectablesIonMarketLabel>
                      </CollectablesIonRow>
                    </CollectablesIonGrid>                  
                </CollectablesIonCardTyped>   
            </IonSlideAuction>          
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

              console.log("TBR Returning assets!");

              return (
                <CollectionIonSlide>    
                  <CollectablesIonCard>
                    <IonGrid style={{margin:"0px", padding:"0px"}}>
                    {/*
                    <CardContainer key={id} size={cardColSize().toString()}>
                      <Card
                        id={id}
                        title={title}
                        subtitle={subtitle}
                        imgIpfsHash={ipfsHashImageFront}
                        type={type}
                      />
                    </CardContainer>     
                    */}  
                    <Img src={addIPFSGatewayPrefix(ipfsHashImageFront)} />                 
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px",fontWeigth:"bold", fontFamily:"Open Sans",color:"#000000"}}>Corey Lajoie</IonLabel>                                               
                    </IonRow>
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px",fontFamily:"Open Sans",color:"#494D5C"}}>Go Fas Racing</IonLabel>
                    </IonRow>
                    <IonRow style={{}}>
                        <IonLabel style={{fontSize:"8px", fontStyle: 'italic', fontFamily:"Open Sans",color:"#FCCF45  "}}>10/100 Cards Available</IonLabel>
                    </IonRow>
                    </IonGrid>        
                  </CollectablesIonCard> 
                </CollectionIonSlide>                  
              );
            })}
            </IonSlides>
          </>
        )}
        {!isLoading && !flatAssets.length && !isError && isMounted &&  (
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>
            <IonSlideAuction>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#FCCF45 "}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Start Auction</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>   
          </IonSlideAuction>            
          <IonSlide>
          <CollectablesIonCard>
              <CollectablesIonGrid style={{background:"#f5f5f5"}}>
                <CollectablesIonRow className="ion-align-items-center">
                    <CollectablesIonMarketLabel>No collectibles for sale yet!</CollectablesIonMarketLabel>
                </CollectablesIonRow>
              </CollectablesIonGrid>                  
          </CollectablesIonCard>
          </IonSlide>
          </IonSlides>
        )}
        {isLoading && !flatAssets.length && isMounted &&  (
          <IonSlides options={slideOpts} style={{marginTop: "28px"}}>
            <IonSlideAuction>
            <CollectablesIonCardTyped>
                <CollectablesIonGrid style={{background:"#FCCF45 "}}>
                  <CollectablesIonRow className="ion-align-items-center">
                      <CollectablesIonMarketLabel>Start Auction</CollectablesIonMarketLabel>
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCardTyped>   
            </IonSlideAuction>            
            <IonSlide>
            <CollectablesIonCard>
                <CollectablesIonGrid style={{background:"#f5f5f5"}}>
                  <CollectablesIonRow className="ion-align-items-center">
                    <IonSpinner color="primary" />
                  </CollectablesIonRow>
                </CollectablesIonGrid>                  
            </CollectablesIonCard>
            </IonSlide>                      
          </IonSlides>
        )}        
    </>
  );
};

const HomeMarket: FC = () => {  
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
              Buy, sell & trade - all at one place!
            </Label>
            <br />
            <Text
              className="ion-margin-vertical"
              color="light"
              fontSize={FontSize.XS}
            >
              Welcome to the e-market where you can buy new cards, trade them with other fans,
              or put them on an auction, and sell them to the highest bidder.
            </Text>
            <br />
          </ImageBgCol>
        </IonRow>   
        <ErrorBoundary>               
          <HomeMarketBuy/>
          <HomeMarketSell/>
          <HomeMarketAuction/>
        </ErrorBoundary>
      </IonGrid>
      
    </>
  );
};

export default HomeMarket;
