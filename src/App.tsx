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
import CardDetailsPage from './pages/CardDetailsPage';
import CardCollectingAndConfirmationPage from './pages/CardCollectingAndConfirmationPage';
import HomePage from './pages/HomePage';
import PasscodePage from './pages/PasscodePage';
import PassphrasePage from './pages/PassphrasePage';
import StartAuctionPage from './pages/AuctionCreationAndConfirmationPage';
import AuctionCreateNewPage from './pages/AuctionCreateNewPage';
import AuctionCancelFinalizationPage from './pages/AuctionCancelFinalizationPage';
import AuctionCancelConfirmationPage from './pages/AuctionCancelConfirmationPage';
import AuctionMyAuctionViewPage from './pages/AuctionMyAuctionViewPage';
import AuctionMyAuctionExpiredAndAcceptOfferViewPage from './pages/AuctionMyAuctionExpiredAndAcceptOfferViewPage';
import AuctionsMyAuctionsPage from './pages/AuctionsMyAuctionsPage';
import AuctionMyBiddedCardsPage from './pages/AuctionMyBiddedCardsPage';
import AuctionableCardsPage from './pages/AuctionableCardsPage';
import AuctionParticipateInPage from './pages/AuctionParticipateInPage';
import AuctionPlaceBidAndConfirmationPage from './pages/AuctionPlaceBidAndConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import QrCodeGeneratorPage from './pages/QrCodeGeneratorPage';
import ScanQRPage from './pages/ScanQRPage';
import UsernamePage from './pages/UsernamePage';
import WelcomePage from './pages/WelcomePage';
import AuthLoginContextProvider from './providers/AuthLoginProvider';
import AuthRegisterContextProvider from './providers/AuthRegisterProvider';
import { SetBaseUrlAppAction } from './store/actions/app';
import './theme/ionic-theme';
import AuctionPlaceBidPage from './pages/AuctionPlaceBidPage';

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

              <IonRouterOutlet>
                <ProtectedRoute path="/home" component={HomePage} exact />
                <ProtectedRoute
                  path="/home/profile"
                  component={ProfilePage}
                  exact
                />
                <ProtectedRoute
                  requiresCordova={true}
                  path="/home/scan-qr"
                  component={ScanQRPage}
                  exact
                />
                <ProtectedRoute
                  path="/home/card/:assetId"
                  component={CardDetailsPage}
                  exact
                />
                <ProtectedRoute
                  path="/market/startauction"
                  component={AuctionableCardsPage}
                  exact
                />                 
                <ProtectedRoute
                  path="/market/card/startauction/:assetId"
                  component={AuctionCreateNewPage}
                  exact
                />  
                <ProtectedRoute
                  path="/market/card/cancelauction/:auctionId"
                  component={AuctionCancelFinalizationPage}
                  exact
                />       
                <ProtectedRoute
                  path="/market/card/cancelauctionconfirm/:auctionId"
                  component={AuctionCancelConfirmationPage}
                  exact
                />                              
                <ProtectedRoute
                  path="/market/card/auctionview/:auctionId/:assetId"
                  component={AuctionMyAuctionViewPage}
                  exact
                />     
                <ProtectedRoute
                  path="/market/card/expiredauctionview/:auctionId/:assetId"
                  component={AuctionMyAuctionExpiredAndAcceptOfferViewPage}
                  exact
                />                    
                <ProtectedRoute
                  path="/market/myauctions"
                  component={AuctionsMyAuctionsPage}
                  exact
                />     
                <ProtectedRoute
                  path="/market/participateinauction"
                  component={AuctionParticipateInPage}
                  exact
                />     
                <ProtectedRoute
                  path="/market/mybids"
                  component={AuctionMyBiddedCardsPage}
                  exact
                />     
                <ProtectedRoute
                  path="/market/card/newbid/:assetId"
                  component={AuctionPlaceBidPage}
                  exact
                />                  
                <ProtectedRoute
                  path="/market/card/placenewbid/:auctionId/:bidAmount"
                  component={AuctionPlaceBidAndConfirmationPage}
                  exact
                  key={new Date().getTime()}               
                />                  
                <ProtectedRoute
                  path="/market/card/createnewauction/:cardId/:minimumBid/:minimumIncrement/:finalBiddingDate"
                  component={StartAuctionPage}
                  exact
                />                               
                <ProtectedRoute
                  path="/home/collect-card/:collectionId"
                  component={CardCollectingAndConfirmationPage}
                  exact
                />                          
              </IonRouterOutlet>
            </Switch>
          </IonReactHashRouter>
        </AuthRegisterContextProvider>
      </AuthLoginContextProvider>
    </IonApp>
  );
};

export default App;
