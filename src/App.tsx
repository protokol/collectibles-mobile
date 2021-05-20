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
import CardDetails from './pages/CardDetails';
import AuctionCreateNewPage from './pages/AuctionCreateNewPage';
import AuctionCancellationAndConfirmationPage from './pages/AuctionCancellationAndConfirmationPage';
import CardCollectingAndConfirmationPage from './pages/CardCollectingAndConfirmationPage';
import HomePage from './pages/HomePage';
import PasscodePage from './pages/PasscodePage';
import PassphrasePage from './pages/PassphrasePage';
import StartAuctionPage from './pages/AuctionCreationAndConfirmation';
import AuctionOwnedViewPage from './pages/AuctionOwnedViewPage';
import AuctionsOwnedPage from './pages/AuctionsOwnedPage';
import AuctionableCardsPage from './pages/AuctionableCardsPage';
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
                  component={CardDetails}
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
                  component={AuctionCancellationAndConfirmationPage}
                  exact
                />                  
                <ProtectedRoute
                  path="/market/card/auctionview/:auctionId/:assetId"
                  component={AuctionOwnedViewPage}
                  exact
                />     
                <ProtectedRoute
                  path="/market/myauctions"
                  component={AuctionsOwnedPage}
                  exact
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
