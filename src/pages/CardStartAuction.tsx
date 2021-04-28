import { format } from 'date-fns';
import GoogleMap from 'google-map-react';
import { arrowBackOutline, locationOutline } from 'ionicons/icons';
import { FC, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import {
  IonItem,
  IonItemDivider,
  IonInput,
  IonLabel,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonIcon,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import { BaseResourcesTypes } from '@protokol/client';
import Header from '../components/Header';
import Img from '../components/ionic/Img';
import { addIPFSGatewayPrefix } from '../constants/images';
import { collectionSelector } from '../store/selectors/collections';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import Title from '../components/ionic/Title';
import { JSX } from '@ionic/core';
import Button from '../components/ionic/Button';

const HorizontalLine = styled.div`
  width:1px;
  height:1px;
  width: 80%;
  margin-left: 10%;  
  background:#E6E6E6;
  position: relative;
`;

const VerticalLine = styled.div`
  width:1px;
  height:100px;
  background:#E6E6E6;
  margin-top: 15px;
  margin-bottom: 15px;
  position: relative;
  margin-left: 10%;
`;

const ViewCardIonButton = styled(Button)<JSX.IonButton>`
  text-decoration: underline;
  color: #F8C938;
  text-transform: capitalize;
`;

const CardStartAuction: FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const history = useHistory();
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
    timestamp: { unix },
  } = asset;

  const {
    ipfsHashImageFront,
    id,
    title,
    subtitle,
    carNumber,
    season,
    issuedDate,
    issuedLocation,
    issuedAddress,
    description,
    issuedLocationLng: lng,
    issuedLocationLat: lat,
  } = attributes as any;

  console.log(attributes);

  return (
    <IonPage>
      <Header
        title={title}
        buttonTopLeft={
          <IonButton onClick={() => history.replace('/home')}>
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
          <IonRow>
            <IonCol className="ion-align-self-start" style={{padding: "30px"}}>
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
                    color="yellow"                    
                    fontSize={FontSize.SM}                    
                    onClick={() => history.push(`/home/card/${assetId}`)}
                  >
                  View Full Card
              </ViewCardIonButton>               
            </IonCol>
            <IonCol className="ion-align-self-end" style={{paddingLeft: "30px", paddingBottom: "60px", textAlign:"center"}}>
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
            <IonCol className="ion-align-self-start">
              <IonItem>
                <IonInput value="0.00" clear-on-edit={true}  min="0" inputmode="numeric" color="warning"></IonInput>              
                <IonLabel position="stacked">Set Minimum Bid</IonLabel>              
              </IonItem>
            </IonCol>
            <VerticalLine/>
            <IonCol>

            </IonCol>            
          </IonRow>
          <HorizontalLine/>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CardStartAuction;
