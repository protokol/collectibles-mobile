import { FC, useMemo, useCallback, useState } from 'react';
import Moment from 'moment';
import { arrowBackOutline } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import Title from '../components/ionic/Title';
import Button from '../components/ionic/Button';
import { JSX } from '@ionic/core';
import {
  IonButton,
  IonFooter,
  IonToolbar,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonIcon,
  IonSpinner,  
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

const FooterButton = styled(Button)`
--background: var(--app-color-yellow-bg);
background: var(--app-color-yellow-bg);
color: white;
`;

const HorizontalLine = styled.div`
  width:1px;
  height:1px;
  width: 80%;
  margin-left: 10%;  
  background:#E6E6E6;
  position: relative;
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

const AuctionMyAuctionExpiredAndAcceptOfferViewPage: FC = () => {
  
  const { handleSubmit } = useForm();  
  const { auctionId, assetId } = useParams<{ auctionId: string, assetId: string }>();  
  const history = useHistory();
  
  const [currentBidIn, setCurrentBid] = useState(-1);
  const [bidIdIn, setBidId] = useState(-1);

  const submitForm = useCallback( 
    () => {         
      if (currentBidIn === 0){
        history.push(`/market/card/cancelauction/${auctionId}`);
      }else{
        history.push(`/market/card/acceptoffer/${auctionId}/${bidIdIn}`);
      }
    },
    [auctionId, history, currentBidIn, bidIdIn]
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
  } = asset;

  const {
    ipfsHashImageFront,
    title,
    subtitle,
    minimumBid,
    finalBiddingDate,
    startedBiddingDate,
    issuedDate,
    highestBidId,
    currentBid    
  } = attributes as any;

  if (bidIdIn === -1){
    setCurrentBid(currentBid);
    setBidId(highestBidId);
  }

  return (    
    <IonPage>
      <Header
        title={title + " Card Auction"}
        buttonTopLeft={
          <IonButton onClick={() => history.goBack()}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />
      <IonContent fullscreen>        
        <form onSubmit={handleSubmit(submitForm)}>
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
          <HorizontalLine/>          
          <IonRow>
            <IonCol className="ion-text-left ion-padding">
              <Title fontSize={FontSize.M} fontWeight={FontWeight.BOLD} style={{fontFamily:"Open Sans",color:"#707070"}}>Minimum Set Bid</Title> 
            </IonCol>
            <IonCol className="ion-text-right ion-padding">
              <Title fontSize={FontSize.M} fontWeight={FontWeight.BOLD} style={{fontFamily:"Open Sans",color:"#FCCF45"}}>${minimumBid}</Title> 
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-left ion-padding" >              
              <Title fontSize={FontSize.M} fontWeight={FontWeight.BOLD} style={{fontFamily:"Open Sans",color:"#707070"}}>Auction Started</Title> 
            </IonCol>
            <IonCol className="ion-text-right ion-padding">
              <Title fontSize={FontSize.M} style={{fontFamily:"Open Sans",color:"#252732"}}>{Moment(startedBiddingDate).format('DD/MM/YYYY')}</Title> 
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-left ion-padding" >              
              <Title fontSize={FontSize.M} fontWeight={FontWeight.BOLD} style={{fontFamily:"Open Sans",color:"#707070"}}>Auction Ended</Title> 
            </IonCol>
            <IonCol className="ion-text-right ion-padding">
              <Title fontSize={FontSize.M} style={{fontFamily:"Open Sans",color:"#252732"}}>{Moment(finalBiddingDate).format('DD/MM/YYYY')}</Title> 
            </IonCol>
          </IonRow>          
          <HorizontalLine/>
          <IonRow style={{marginTop:"10px"}}>
            <IonCol size="10" offset="1" className="ion-text-center ion-padding">              
              <Title fontSize={FontSize.XS} style={{fontFamily:"Open Sans",color:"#707070"}}>The highest received offer:</Title> 
            </IonCol>
          </IonRow>             
          <IonRow style={{marginTop:"10px"}}>
            <IonCol size="10" offset="1" className="ion-text-center">              
              <Title fontSize={FontSize.XXL} fontWeight={FontWeight.BOLD} style={{fontFamily:"Open Sans",color:"#8AC827"}}>${currentBid}</Title> 
            </IonCol>
          </IonRow>          
          <HorizontalLine/>         
        </IonGrid>
        <Footer className="ion-no-border">
          <IonToolbar>
            <FooterButton
              size="large"
              type="submit"
              className="ion-text-uppercase ion-no-margin"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              radius={false}
              expand="block"
              >
              {currentBid === 0 &&(
                "Cancel Auction"
              )}
              {currentBid > 0 &&(
                "Accept Offer"
              )}  
            </FooterButton>
          </IonToolbar>
        </Footer>  
        </form>
      </IonContent>
    </IonPage>    
  );
};

export default AuctionMyAuctionExpiredAndAcceptOfferViewPage;
