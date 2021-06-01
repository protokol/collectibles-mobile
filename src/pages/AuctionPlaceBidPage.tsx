import { format } from 'date-fns';
import { FC, useMemo, useState, useCallback } from 'react';
import { arrowBackOutline } from 'ionicons/icons';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import Title from '../components/ionic/Title';
import Button from '../components/ionic/Button';
import { JSX } from '@ionic/core';
import Text from '../components/ionic/Text';
import {
  DetailCard,
  DetailCards,
} from '../components/DetailCards';
import { 
  IonButton,  
  IonFooter,
  IonToolbar,
  IonLabel,  
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonIcon,
  IonSpinner,
  IonRouterLink
} from '@ionic/react';
import { BaseResourcesTypes } from '@protokol/client';
import Header from '../components/Header';
import Img from '../components/ionic/Img';
import { addIPFSGatewayPrefix } from '../constants/images';
import { collectionSelector } from '../store/selectors/collections';

const Footer = styled(IonFooter)`
  position: fixed;
  bottom: 0;
`;

const IonColCards = styled(IonCol)`
  --padding-start: 0.5rem;
  padding-top: 0.5rem;
`;

const ViewCardButton = styled(Button)`
  --background: var(--app-color-yellow-bg);
  background: var(--app-color-yellow-bg);
  color: white;
`;

const IncrementIonButton = styled(Button)`
  --background: var(--app-color-transparent-bg);
  background: var(--app-color-transparent-bg);
  border: 3px solid;  
  font-size: 20px;
  margin: 12px 0px 12px 0px;
  ${props => props.disabled ? `color: #252732;`:`color: #F8C938;`};
`;

const ViewCardIonButton = styled(Button)<JSX.IonButton>`
  text-decoration: underline;
  text-transform: capitalize;
  text-align: left;
  font: normal normal bold 12px/17px Open Sans;
  letter-spacing: 0px;
  color: #F8C938;
  opacity: 1;
  border: 0px;
  box-shadow: none !important;
`;

const HorizontalLine = styled.div`
  width:1px;
  height:1px;
  width: 80%;
  margin-left: 10%;  
  background:#E6E6E6;
  position: relative;
`;

const IonRouterLinkStyled = styled(IonRouterLink)`
  text-decoration: underline;
  font-weight: bold;  
`;

const AuctionPlaceBidPage: FC = () => {
    
  const [bidAmount, setStateData] = useState(0);
  const [auctionIdIn, setAuctionId] = useState(-1);

  const { assetId } = useParams<{ assetId: string }>();
  const history = useHistory(); 

  const increment = 5;

  const sendBid = useCallback(
    () => {        
      if (auctionIdIn && bidAmount){
        history.push(`/market/card/placenewbid/${auctionIdIn}/${bidAmount}`);
      }
    },
    [history, auctionIdIn, bidAmount]
  );  

  const { assets } = useSelector(collectionSelector, shallowEqual);
  const asset = useMemo(() => assets.flat().find(({ id }) => id === assetId), [
    assets,
    assetId,
  ]) as BaseResourcesTypes.Assets;  

  if (!asset) {
    return <IonSpinner color="light" />;
  }

  const {
    attributes,
    timestamp: { unix }
  } = asset;

  const {
    ipfsHashImageFront,
    title,
    subtitle,
    issuedDate,
    carNumber,
    season,
    auctionId,
    currentBid,
    yourBid,
    bidId,
    minimumBid
  } = attributes as any;

  //console.log(JSON.stringify(asset));

  if (auctionIdIn===-1){
    setAuctionId(auctionId);
  }

  if(bidAmount===0){
    setStateData((currentBid===0)?Number(minimumBid):currentBid+increment);
  }

  const incrementBid = () => {    
    setStateData(bidAmount + increment);
  }

  const decrementBid = () => {  
    if (currentBid === 0){
      if (bidAmount - increment >= minimumBid){
        setStateData(bidAmount - increment);
      }
    }else{
      if (bidAmount - increment >= currentBid + increment){
        setStateData(bidAmount - increment);
      }
    }
  }

  return (    
    <IonPage>
      <Header
        title={title}
        buttonTopLeft={
          <IonButton onClick={() => history.push('/market/mybids')}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />
      <IonContent fullscreen>        
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol className="ion-no-padding" size="12">
              <Img src={addIPFSGatewayPrefix(ipfsHashImageFront)} />
            </IonCol>
          </IonRow>
          <IonRow style={{marginTop:"20px"}}>
            <IonCol size="5" offset="1">
              {title && (
                <Title fontSize={FontSize.L} fontWeight={FontWeight.BOLD} style={{fontFamily:"Open Sans",color:"#252732"}}>
                  {title}
                </Title>
              )}
              {subtitle && (
                <Title fontSize={FontSize.SM} style={{fontFamily:"Open Sans",color:"#252732"}}>
                  {subtitle}
                </Title>
              )}
              {issuedDate && (
                <Title fontSize={FontSize.SM} style={{fontStyle: 'italic', fontFamily:"Open Sans",color:"#707070"}}>
                  {new Date(issuedDate).toDateString()}
                </Title>
              )}
              <ViewCardIonButton                 
                color="#F8C938"                
                fontSize={FontSize.SM}
                fontWeight={FontWeight.BOLD}
                onClick={() => history.push(`/home/card/${assetId}`)}>
                  View Full Card
              </ViewCardIonButton>               
            </IonCol>
            <IonCol size="6" style={{paddingBottom: "60px", textAlign:"center"}}>
              <Title fontSize={FontSize.XXL} style={{fontFamily:"Open Sans", color:"#F8C938", fontWeight:"bold"}}>
                  1
              </Title>
              <Title fontSize={FontSize.SM} style={{fontStyle: 'italic', fontFamily:"Open Sans",color:"#707070"}}>
                  Card Available
              </Title>              
            </IonCol>
          </IonRow>
          <IonRow>
            <IonColCards className="ion-no-padding ion-no-margin" size="12">
              <DetailCards>
                <DetailCard size="4" title="CAR NUMBER" subtitle={carNumber} />
                <DetailCard size="4" title="SEASON" subtitle={season} />
                <DetailCard
                  size="4"
                  title="COLLECTED ON"
                  subtitle={format(new Date(unix), 'MM/dd/yyyy')}
                />
              </DetailCards>
            </IonColCards>            
          </IonRow>        
          <IonRow style={{paddingLeft:"60px", paddingRight:"60px", paddingTop:"40px"}}>
            <IonCol className="ion-text-left">
                <IncrementIonButton disabled={(currentBid===0)?bidAmount-increment<minimumBid:bidAmount-increment===currentBid} onClick={decrementBid}>-</IncrementIonButton>
            </IonCol>
            <IonCol className="ion-text-center">
                <IonLabel style={{fontFamily:"Open Sans", fontSize:"40px", color:"#F8C938", fontWeight:"bold"}}>${bidAmount}</IonLabel>
            </IonCol>            
            <IonCol className="ion-text-right">
                <IncrementIonButton onClick={incrementBid}>+</IncrementIonButton>
            </IonCol>            
          </IonRow>          
          { yourBid > 0 && (
          <>
            <HorizontalLine/>
            <IonRow>
              <IonCol className="ion-text-center ion-padding-top">
                  <Text fontSize={FontSize.M} color="dark" >
                    Do you want to <IonRouterLinkStyled color="danger" onClick={() => history.replace(`/market/card/retractbid/${bidId}`)}>retract your ${yourBid} bid?</IonRouterLinkStyled>
                  </Text>                
              </IonCol>
            </IonRow>
          </>
          )}            
        </IonGrid>                   
        <Footer className="ion-no-border">
          <IonToolbar>          
            <ViewCardButton
              size="large"
              className="ion-text-uppercase ion-no-margin"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              radius={false}
              expand="block"              
              onClick={sendBid}              
            >
              Place a Bid
            </ViewCardButton>
          </IonToolbar>
        </Footer>  
      </IonContent>
    </IonPage>    
  );
};

export default AuctionPlaceBidPage;
