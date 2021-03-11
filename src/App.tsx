import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
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

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetBaseUrlAppAction('https://explorer.protokol.sh'));
  }, [dispatch]);

  return (
    <IonApp>
      <AuthLoginContextProvider>
        <IonReactHashRouter>
          <IonRouterOutlet>
            <Route path="/" render={() => <Redirect to="/welcome" />} exact />
            <Route path="/qr/:id" component={QrCodeGeneratorPage} exact />
            <Route path="/welcome" component={WelcomePage} exact />
            <Route path="/home" component={HomePage} exact />
            <Route path="/home/scan-qr" component={ScanQRPage} exact />
            <Route
              path="/home/collect-card/:collectionId"
              component={CollectCardPage}
              exact
            />
            <AuthRegisterContextProvider>
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
            </AuthRegisterContextProvider>
          </IonRouterOutlet>
        </IonReactHashRouter>
      </AuthLoginContextProvider>
    </IonApp>
  );
};

export default App;
