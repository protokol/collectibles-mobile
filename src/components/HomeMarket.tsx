import { FC, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import Button from '../components/ionic/Button';
import Label from '../components/ionic/Label';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { flagImage } from '../constants/images';
import AuctionableCardsPage from '../pages/AuctionableCardsPage';
import AuctionsMyAuctionsPage from '../pages/AuctionsMyAuctionsPage';
import AuctionParticipateInPage from '../pages/AuctionParticipateInPage';
import { CollectiblesOnAuctionLoadAction } from '../store/actions/collections';
import { AuthLoginContext } from '../providers/AuthLoginProvider';

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
  const [submenu, setMarketSubMenu] = useState(0);
  
  const dispatch = useDispatch();
  const {
    session: { publicKey },
  } = useContext(AuthLoginContext);  

  const auctionSell = submenu===1;
  const auctionSellView = submenu===2;
  const auctionBuy = submenu===3;
 
  const auctionSellHandler = () => {    
    setMarketSubMenu(1);   
  }

  const auctionSellViewHandler = () => {    
    setMarketSubMenu(2);   
  }  

  const auctionBuyHandler = () => {    
    setMarketSubMenu(3);   
  }

  return (  
    <>
    {auctionSell && (
      <AuctionableCardsPage />
    )}  
    {auctionSellView && (
      <AuctionsMyAuctionsPage />
    )}      
    {auctionBuy && (
      <AuctionParticipateInPage/>
    )}      
    {!auctionSell && !auctionSellView && !auctionBuy && (
      <IonGrid className="ion-no-padding">
        <IonRow>
          <ImageBgCol size="12">
            <Label
              style={{maxWidth:"256px"}}
              color="light"
              fontSize={FontSize.L}
              fontWeight={FontWeight.BOLD}
            >
              Buy, sell & trade - all at one place!
            </Label>
            <br />
            <Text
              style={{maxWidth:"256px"}}
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
              Today I want to...
            </BannerText>
          </BannerCol>
          <IonCol size="12">
            <ActionButton               
              expand="block"
              radius={false}
              className="ion-text-uppercase ion-no-margin bg-gray"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              disabled={true}
              onClick={() => history.replace('/home/buycards')}
            >
              Buy cards
            </ActionButton>
            <ActionButton
              expand="full"
              radius={false}
              className="ion-text-uppercase ion-no-margin bg-dark-blue-magenta"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              disabled={true}
              onClick={() => history.replace('/home/sellcards')}
            >
              Sell cards
            </ActionButton>
            <ActionButton
              expand="full"
              radius={false}
              className="ion-text-uppercase ion-no-margin bg-charade"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              disabled={true}
              onClick={() => history.replace('/home/tradecards')}
            >
              Trade cards
            </ActionButton>
            <ActionButton
              expand="block"
              radius={false}
              className="ion-text-uppercase ion-no-margin bg-gray"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              onClick={auctionSellHandler}
            >
              Start an auction
            </ActionButton>
            <ActionButton
              expand="block"
              radius={false}
              className="ion-text-uppercase ion-no-margin bg-dark-blue-magenta"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              onClick={auctionSellViewHandler}
            >
              View my open auctions
            </ActionButton>            
            <ActionButton
              expand="block"
              radius={false}
              className="ion-text-uppercase ion-no-margin bg-dark-blue-magenta"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              onClick={() => {
                  dispatch(CollectiblesOnAuctionLoadAction(publicKey!, true, false, true, undefined));
                  auctionBuyHandler();
                }
              }
            >
              Participate in an auction
            </ActionButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      )}
    </>
  );
};

export default HomeMarket;
