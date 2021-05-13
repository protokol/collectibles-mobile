import { FC, useMemo, useState, useCallback } from 'react';
import { arrowBackOutline } from 'ionicons/icons';
import { CalendarOutline } from 'react-ionicons'
import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { InputChangeEventDetail } from '@ionic/core';
import styled from 'styled-components';
import { Styles } from '../utils/styles';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import FormInputError from '../components/ionic/ErrorMessage';
import Title from '../components/ionic/Title';
import Button from '../components/ionic/Button';
import { JSX } from '@ionic/core';

import {
  IonList,
  IonButton,
  IonItem,
  IonFooter,
  IonToolbar,
  IonInput,
  IonLabel,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonIcon,
  IonSpinner,
  IonDatetime,
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

const AmountIonInput = styled(IonInput)<{
  fontSize?: FontSize;
}>`
  ${({ fontSize }) => Styles.serializeFontSize(fontSize)} 
  font: normal normal bold 21px/28px Open Sans;
  letter-spacing: 0px;
  color: #F8C938;
  opacity: 1;
`;

const FooterButton = styled(Button)`
  &.ion-color-auction {
    --ion-color-base: var(--ion-color-auction-base);
    --ion-color-base-rgb: var(--ion-color-warning-rgb);
    --ion-color-contrast: var(--ion-color-auction-tint);
    --ion-color-contrast-rgb: var(--ion-color-auction-tint);
    --ion-color-shade: var(--ion-color-warning-shade);
    --ion-color-tint: var(--ion-color-auction-tint);
  }
`;

const AmountIonLabel = styled(IonLabel)`
  text-align: center;
  font: italic normal normal 12px/17px Open Sans;
  letter-spacing: 0px;
  color: #707070;
  opacity: 1;
`;

const CardIonDatetime = styled(IonDatetime)`
  text-align: left;
  font: normal normal bold 14px/19px Open Sans;
  letter-spacing: 0px;
  color: #F8C938;
  opacity: 1;
  width: 90%;   
`;

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
  height:75px;
  background:#E6E6E6;
  margin-top: 15px;
  margin-bottom: 15px;
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

const d = new Date();
const dateDefault = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
const datePlaceHolder = (d.getMonth()+1) + " / " + d.getDate() + " / " + d.getFullYear();

let initialValues = {
  minimumbid: "",
  minimumincrement: "",
  finalbiddingdate: dateDefault,
}

interface stateData{
  minimumbid?: string;
  minimumincrement?: string;
  finalbiddingdate?: string;
}

const CardStartAuction: FC = () => {
  
  const [data, setStateData] = useState<stateData>(initialValues);
  const { control, handleSubmit, formState, errors } = useForm({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });  

  const onIonChange = (event) => {    
    event.preventDefault();
    event.stopPropagation();    
    setStateData({...data, [event.target.name] : event.target.value});
  }

  const history = useHistory();
 
  const submitForm = useCallback(
    ({ minimumbid, minimumincrement, finalbiddingdate }: stateData) => {
      if (!formState.isValid) {
        return;
      }      
      setStateData({ minimumbid, minimumincrement, finalbiddingdate });      
      console.log("submitted:" + JSON.stringify(data, null, 2));    
      //history.push(`/home/card/startauctionaction/${assetId}/${data.minimumbid}/${data.minimumincrement}/${data.finalbiddingdate?.replaceAll('/','-')}`);
    },
    [formState.isValid, setStateData, data]
  );
  
  const { assetId } = useParams<{ assetId: string }>();  
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
    issuedDate
  } = attributes as any;

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
            <IonCol className="ion-text-center" >              
              <IonList no-lines lines="none">
                <IonItem className="ion-text-center" no-lines>     
                  <Controller
                    render={({ onChange }) => (
                      <AmountIonInput
                        type="text"
                        name="minimumbid"                        
                        inputmode="numeric"                        
                        placeholder="$0.00"
                        onIonInput={onIonChange} 
                        onIonChange={({
                          detail: { value },
                        }: CustomEvent<InputChangeEventDetail>) =>
                          onChange(value)
                        }
                      />
                    )}
                    control={control}
                    name="minimumbid"
                    rules={{
                      required: 'Minimum Bid is required!',
                      pattern: {
                        value: /^[0-9]/,
                        message: 'Minimum Bid should be a number',
                      },
                      validate: (value) => value > 0 || 'Minimum Bid should to be higher than 0',                        
                    }}
                  />                            
                </IonItem>
                <FormInputError errors={errors} name="minimumbid" />                
              </IonList>
              <AmountIonLabel position="stacked">Set Minimum Bid</AmountIonLabel> 
            </IonCol>
            <VerticalLine/>
            <IonCol className="ion-text-center" >              
              <IonList no-lines lines="none">
                <IonItem className="ion-text-center" no-lines>
                <Controller
                    render={({ onChange }) => (
                      <AmountIonInput
                        type="text"
                        name="minimumincrement"                        
                        inputmode="numeric"                        
                        placeholder="$0.00"
                        value="5"
                        disabled={true}
                        onIonInput={onIonChange} 
                        onIonChange={({
                          detail: { value },
                        }: CustomEvent<InputChangeEventDetail>) =>
                          onChange(value)
                        }
                      />
                    )}
                    control={control}
                    name="minimumincrement"
                    rules={{
                      required: 'Minimum Increment is required!',
                      pattern: {
                        value: /^[0-9]/,
                        message: 'Minimum Increment should be a number',
                      },
                      validate: (value) => value > 0 || 'Minimum Increment should to be higher than 0',                        
                    }}
                  />                                                                  
                </IonItem>
                <FormInputError errors={errors} name="minimumincrement" />
              </IonList>
              <AmountIonLabel position="stacked">Set Minimum Increment</AmountIonLabel> 
            </IonCol>            
          </IonRow>
          <HorizontalLine/>
          <IonRow style={{marginTop:"10px"}}>
            <IonCol size="10" offset="1">              
              <AmountIonLabel position="stacked" style={{marginLeft:"30px"}}>Set Final Bidding Date</AmountIonLabel> 
              <IonList no-lines>
                <IonItem style={{border:"1px solid #F8C938"}} className="ion-text-center">              
                  <Controller
                      as={
                        <CardIonDatetime value={data.finalbiddingdate} onIonChange={onIonChange} color="auctiondatetime" className="ion-text-left" displayFormat="MM / DD / YYYY" placeholder={datePlaceHolder} max="2100" min={new Date().toISOString()}/>              
                      }
                      control={control}
                      name="finalbiddingdate"      
                  />                                     
                  <CalendarOutline color={'#F8C938'} title="Final Bidding Date"/>
                </IonItem>                
              </IonList>
            </IonCol>
          </IonRow>             
        </IonGrid>
        <Footer className="ion-no-border">
          <IonToolbar>
            <FooterButton
              color="auction"
              size="large"
              type="submit"
              className="ion-text-uppercase ion-no-margin"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              radius={false}
              expand="block"   
              disabled={formState.isValid === false}           
            >
              Start Auction
            </FooterButton>
          </IonToolbar>
        </Footer>  
        </form>
      </IonContent>
    </IonPage>    
  );
};

export default CardStartAuction;
