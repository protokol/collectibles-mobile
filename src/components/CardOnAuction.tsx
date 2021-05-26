import { FC } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { addIPFSGatewayPrefix } from '../constants/images';
import CardTag, { CardTagType } from './CardTag';
import Img from './ionic/Img';
import Title from './ionic/Title';
import { IonGrid, IonCol, IonRow, IonLabel } from '@ionic/react';

const BidIonLabel = styled(IonLabel)`  
  text-align: right;
  font: normal normal normal 12px/17px Open Sans;
  letter-spacing: 0px;
  color: #252732;
  opacity: 1;
  margin-left: 5px;  
  float: right;  
  font-weight: bold;
`;

const CardStyled = styled.div`  
  overflow: visible;
  margin: 20px;  
`;

const CardTitle = styled(Title)`
  text-align: left;
  font: normal normal bold 14px/19px Open Sans;
  letter-spacing: 0px;
  color: #252732;
  margin-left: 10px;
  opacity: 1;  
`;

const CardSubTitle = styled(Title)`
  text-align: right;
  font: normal normal normal 12px/17px Open Sans;
  letter-spacing: 0px;
  color: #252732;
  opacity: 1;
  margin-left: 5px;
  max-width: 120px;  
  overflow: hidden;
  white-space: nowrap;
`;

const CardOnAuction: FC<{
  id: string;
  title: string;
  imgIpfsHash: string;
  type?: CardTagType;
  linkto: string;
  timeRemaining: string;
  currentBid: number;
  minimumBid?: number;
  yourBid?: number;
}> = ({ id, title, imgIpfsHash, type, linkto, timeRemaining, currentBid, minimumBid, yourBid }) => {
  const history = useHistory();

  const currentBidColor = (yourBid===undefined || currentBid < yourBid) ? "success" : "warning";
  const yourBidColor = (yourBid!==undefined && currentBid > yourBid) ? "danger" : "success";

  return (
    <CardStyled onClick={() => history.push(`${linkto}`)} key={id}>
      <IonGrid>
        <IonRow>
          <IonCol>
            <CardTag type={type} />
            <Img src={addIPFSGatewayPrefix(imgIpfsHash)} />
          </IonCol>
          <IonCol>
            <IonGrid>
              <IonRow className="ion-margin-bottom">
                <IonCol>
                  <CardTitle className="ion-no-padding ion-text-left" fontWeight={FontWeight.BOLD}>Card Name</CardTitle>
                </IonCol>
                <IonCol>
                  {title && (
                     <CardSubTitle className="ion-no-padding" fontSize={FontSize.SM}>{title}</CardSubTitle>
                  )}
                </IonCol>
              </IonRow>
              {minimumBid && (
              <IonRow className="ion-margin-bottom">
                <IonCol>
                <CardTitle className="ion-no-padding ion-text-left" fontWeight={FontWeight.BOLD}>Minimum Bid</CardTitle>
                </IonCol>
                <IonCol>                    
                    <BidIonLabel color="warning" className="ion-no-padding ion-text-right">${minimumBid}</BidIonLabel>
                </IonCol>
              </IonRow>
              )}               
              <IonRow className="ion-margin-bottom">
                <IonCol>
                    <CardTitle className="ion-no-padding ion-text-left" fontWeight={FontWeight.BOLD}>Current Bid</CardTitle>
                </IonCol>
                <IonCol>
                  {currentBid && (
                    <BidIonLabel color={currentBidColor} className="ion-no-padding ion-text-right">${currentBid}</BidIonLabel>
                  )}
                </IonCol>
              </IonRow>                          
              {yourBid && (
              <IonRow className="ion-margin-bottom">
                <IonCol>
                <CardTitle className="ion-no-padding ion-text-left" fontWeight={FontWeight.BOLD}>Your Bid</CardTitle>
                </IonCol>
                <IonCol>                    
                    <BidIonLabel color={yourBidColor} className="ion-no-padding ion-text-right">${yourBid}</BidIonLabel>
                </IonCol>
              </IonRow>
              )}             
              <IonRow>
                <IonCol>
                  <CardTitle className="ion-no-padding ion-text-left" fontWeight={FontWeight.BOLD}>Bidding Ends</CardTitle>
                </IonCol>
                <IonCol>
                  {timeRemaining && (
                    <CardSubTitle className="ion-no-padding" color={timeRemaining.startsWith("-")?"danger":"light"} fontSize={FontSize.SM}>{timeRemaining}</CardSubTitle>
                  )} 
                </IonCol>
              </IonRow>                                          
            </IonGrid>                                
          </IonCol>
        </IonRow>
      </IonGrid>            
    </CardStyled>
  );
};

export default CardOnAuction;
