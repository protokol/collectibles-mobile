import { FC } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import Button from '../components/ionic/Button';
import Label from '../components/ionic/Label';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { flagImage } from '../constants/images';

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

const BannerCol = styled(IonCol)`
  padding: 2.25rem;
  background: var(--ion-color-light);
  text-align: center;
`;

const BannerText = styled(Text)`
  color: var(--app-color-gray);
`;

const ActionButton = styled(Button)`
  border-radius: 0px !important;
  height: 3.4375rem;
  --padding-top: 1.625rem;
  --padding-bottom: 1.8125rem;

  &.bg-gray {
    --background: var(--app-color-gray);
  }

  &.bg-charade {
    --background: var(--app-color-charade);
  }

  &.bg-dark-blue-magenta {
    --background: var(--app-color-dark-blue-magenta);
  }  
`;

const AuctionSell: FC = () => {
  const history = useHistory();   
  // console.log("Loading AuctionSell");
  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <ImageBgCol size="12">
          <Label
            color="light"
            fontSize={FontSize.L}
            fontWeight={FontWeight.BOLD}
          >
            Pick a card and start an auction...
          </Label>
          <br />
          <Text
            className="ion-margin-vertical"
            color="light"
            fontSize={FontSize.XS}
          >
            ...or start bidding on your favourite cards. 
            Make sure to follow up with your cards, 
            since some disappear at a racing speed!
          </Text>
          <br />
        </ImageBgCol>
      </IonRow>
    </IonGrid>
  );
};

export default AuctionSell;
