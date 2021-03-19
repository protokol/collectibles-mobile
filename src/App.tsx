import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Plugins } from '@capacitor/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import ProtectedRoute from './components/ProtectedRoute';
import useIsMounted from './hooks/use-is-mounted';
import CollectCardPage from './pages/CollectCardPage';
import HomePage from './pages/HomePage';
import PasscodePage from './pages/PasscodePage';
import PassphrasePage from './pages/PassphrasePage';
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
      dispatch(SetBaseUrlAppAction('https://explorer.protokol.sh'));
    }
  }, [isMounted, dispatch]);

  return (
    <IonApp>
      <AuthLoginContextProvider>
        <AuthRegisterContextProvider>
          <IonReactHashRouter>
            <Switch>
              <Route path="/qr/:id" component={QrCodeGeneratorPage} exact />
              <Route path="/welcome" component={WelcomePage} exact />
              <Route
                path="/login/passphrase"
                component={PassphrasePage}
                exact
              />
              <Route path="/register/username" component={UsernamePage} exact />
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
                  requiresCordova={true}
                  path="/home/scan-qr"
                  component={ScanQRPage}
                  exact
                />
                <ProtectedRoute
                  path="/home/collect-card/:collectionId"
                  component={CollectCardPage}
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
