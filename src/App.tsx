import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import PasscodePage from './pages/PasscodePage';
import PassphrasePage from './pages/PassphrasePage';
import UsernamePage from './pages/UsernamePage';
import WelcomePage from './pages/WelcomePage';
import AuthLoginContextProvider from './providers/AuthLoginProvider';
import AuthRegisterContextProvider from './providers/AuthRegisterProvider';
import { SetBaseUrlAppAction } from './store/actions/app';
import './theme/ionic-theme';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetBaseUrlAppAction('https://proto-devnet.protokol.sh'));
  }, [dispatch]);

  return (
    <IonApp>
      <AuthLoginContextProvider>
        <IonReactHashRouter>
          <IonRouterOutlet>
            <Route path="/welcome" component={WelcomePage} exact />
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
            <Route path="/" render={() => <Redirect to="/welcome" />} exact />
          </IonRouterOutlet>
        </IonReactHashRouter>
      </AuthLoginContextProvider>
    </IonApp>
  );
};

export default App;
