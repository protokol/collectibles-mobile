import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Plugins } from '@capacitor/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import MainMenu from './components/MainMenu';
import ProtectedRoute from './components/ProtectedRoute';
import useIsMounted from './hooks/use-is-mounted';
import { MarketContentSelector } from './components/Tabs';
import CardDetailsPage from './pages/CardDetailsPage';
import CardCollectingAndConfirmationPage from './pages/CardCollectingAndConfirmationPage';
import HomePage from './pages/HomePage';
import HomeMarketPage from './pages/HomeMarketPage';
import PasscodePage from './pages/PasscodePage';
import PassphrasePage from './pages/PassphrasePage';
import AuctionCreationAndConfirmationPage from './pages/auctions/AuctionCreationAndConfirmationPage';
import AuctionCreateNewPage from './pages/auctions/AuctionCreateNewPage';
import AuctionCancelConfirmationPage from './pages/auctions/AuctionCancelConfirmationPage';
import AuctionCancelFinalizationPage from './pages/auctions/AuctionCancelFinalizationPage';
import AuctionRetractBidConfirmationPage from './pages/auctions/AuctionRetractBidConfirmationPage';
import AuctionRetractBidFinalizationPage from './pages/auctions/AuctionRetractBidFinalizationPage';
import AuctionPlaceOrRetractBidPage from './pages/auctions/AuctionPlaceOrRetractBidPage';
import AuctionMyAuctionViewPage from './pages/auctions/AuctionMyAuctionViewPage';
import AuctionMyAuctionExpiredAndAcceptOfferViewPage from './pages/auctions/AuctionMyAuctionExpiredAndAcceptOfferViewPage';
import AuctionPlaceBidAndConfirmationPage from './pages/auctions/AuctionPlaceBidAndConfirmationPage';
import AuctionOfferAcceptedConfirmationPage from './pages/auctions/AuctionOfferAcceptedConfirmationPage'; 
import GotPaperCoinsPage from './pages/GotPaperCoinsPage'; 
import ProfilePage from './pages/ProfilePage';
import QrCodeGeneratorPage from './pages/QrCodeGeneratorPage';
import ScanQRPage from './pages/ScanQRPage';
import UsernamePage from './pages/UsernamePage';
import WelcomePage from './pages/WelcomePage';
import AuthLoginContextProvider from './providers/AuthLoginProvider';
import AuthRegisterContextProvider from './providers/AuthRegisterProvider';
import { SetBaseUrlAppAction } from './store/actions/app';
import './theme/ionic-theme';

const { SplashScreen } = Plugins;

const App: FC = () => {
  const dispatch = useDispatch();

  const isMounted = useIsMounted();
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lock(
        ScreenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    };

    if (isMounted) {
      if (isPlatform('capacitor')) {
        lockOrientation();
        SplashScreen.hide();
      }
      dispatch(SetBaseUrlAppAction('https://nascar-explorer.protokol.sh'));
    }
  }, [isMounted, dispatch]);

  return (
    <IonApp>
      <AuthLoginContextProvider>
        <AuthRegisterContextProvider>
          <IonReactHashRouter>
            <MainMenu />
            <Switch>
              <Route path="/qr/:id" component={QrCodeGeneratorPage} exact />
              <Route path="/welcome" component={WelcomePage} exact />
              <Route
                path="/login/username"
                exact
                render={(props) => (
                  <UsernamePage navigateTo="/login/passphrase" {...props} />
                )}
              />
              <Route
                path="/login/passphrase"
                component={PassphrasePage}
                exact
              />
              <Route
                path="/register/username"
                exact
                render={(props) => (
                  <UsernamePage navigateTo="/register/passcode" {...props} />
                )}
              />
              <Route
                path="/register/passcode"
                exact
                render={(props) => <PasscodePage withConfirm {...props} />}
              />
              <Route
                path="/passcode"
                exact
                render={(props) => (
                  <PasscodePage withConfirm={false} {...props} />
                )}
              />
             
              <Redirect path="/" exact to="/home" />

              {/* Notice: history.push only works when target is an <IonPage/> root element component */}
              <IonRouterOutlet>
                <ProtectedRoute path="/home" component={HomePage} exact />
                <ProtectedRoute path="/home/profile" component={ProfilePage} exact />
                <ProtectedRoute requiresCordova={true} path="/home/scan-qr" component={ScanQRPage} exact/>
                <ProtectedRoute path="/home/card/:assetId" component={CardDetailsPage} exact />
                <ProtectedRoute path="/home/collect-card/:collectionId" component={CardCollectingAndConfirmationPage} exact />                                
                <ProtectedRoute path="/home/profile/getpapercoins" component={GotPaperCoinsPage} exact />                
                <ProtectedRoute path="/market/card/startauction/:assetId" component={AuctionCreateNewPage} exact />  
                <ProtectedRoute path="/market/card/cancelauction/:auctionId" component={AuctionCancelFinalizationPage} exact />       
                <ProtectedRoute path="/market/card/cancelauctionconfirm/:auctionId" component={AuctionCancelConfirmationPage} exact />                              
                <ProtectedRoute path="/market/card/auctionview/:auctionId/:assetId" component={AuctionMyAuctionViewPage} exact />     
                <ProtectedRoute path="/market/card/expiredauctionview/:auctionId/:assetId" component={AuctionMyAuctionExpiredAndAcceptOfferViewPage} exact/>
                <ProtectedRoute path="/market/card/acceptoffer/:auctionId/:bidId" component={AuctionOfferAcceptedConfirmationPage} exact />     
                <ProtectedRoute path="/market/myauctionablecards" component={()=>(<HomeMarketPage menu={MarketContentSelector.ContentAuctionableCards}/>)} exact/>               
                <ProtectedRoute path="/market/myauctions" component={()=>(<HomeMarketPage menu={MarketContentSelector.ContentAuctionsMyAuctions}/>)} exact />     
                <ProtectedRoute path="/market/participateinauction" component={()=>(<HomeMarketPage menu={MarketContentSelector.ContentAuctionParticipateIn}/>)} exact />     
                <ProtectedRoute path="/market/mybids" component={()=>(<HomeMarketPage menu={MarketContentSelector.ContentAuctionMyBiddedCards}/>)} exact />                  
                <ProtectedRoute path="/market/card/newbid/:assetId" component={AuctionPlaceOrRetractBidPage} exact />                  
                <ProtectedRoute path="/market/card/placenewbid/:auctionId/:bidAmount" component={AuctionPlaceBidAndConfirmationPage} exact />    
                <ProtectedRoute path="/market/card/retractbid/:bidId" component={AuctionRetractBidConfirmationPage} exact />     
                <ProtectedRoute path="/market/card/retractbidconfirmation/:bidId" component={AuctionRetractBidFinalizationPage} exact />                                            
                <ProtectedRoute path="/market/card/createnewauction/:cardId/:minimumBid/:minimumIncrement/:finalBiddingDate" component={AuctionCreationAndConfirmationPage} exact />                                         
              </IonRouterOutlet>
            </Switch>
          </IonReactHashRouter>
        </AuthRegisterContextProvider>
      </AuthLoginContextProvider>
    </IonApp>
  );
};

export default App;
