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

const HomeMarket: FC = () => {
  const history = useHistory();

  return (
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
        <BannerCol>
          <BannerText fontSize={FontSize.L} fontWeight={FontWeight.BOLD}>
            Today I
            <br />
            want to...
          </BannerText>
        </BannerCol>
        <IonCol size="12">
          <ActionButton
            expand="block"
            className="ion-text-uppercase ion-no-margin bg-gray"
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
            onClick={() => history.push('/home/scan-qr')}
          >
            Buy cards
          </ActionButton>
          <ActionButton
            expand="block"
            className="ion-text-uppercase ion-no-margin bg-dark-blue-magenta"
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
            onClick={() => history.push('/home/scan-qr')}
          >
            Sell cards
          </ActionButton>
          <ActionButton
            expand="block"
            className="ion-text-uppercase ion-no-margin bg-charade"
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
          >
            Trade cards
          </ActionButton>
          <ActionButton
            expand="block"
            className="ion-text-uppercase ion-no-margin bg-gray"
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
          >
            Start an auction
          </ActionButton>
          <ActionButton
            expand="block"
            className="ion-text-uppercase ion-no-margin bg-dark-blue-magenta"
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
          >
            Participate in an auction
          </ActionButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default HomeMarket;
