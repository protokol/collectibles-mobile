import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import WelcomePage from './pages/WelcomePage';
import { SetBaseUrlAppAction } from './store/actions/app';
import './theme/ionic-theme';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetBaseUrlAppAction('https://proto-devnet.protokol.sh'));
  }, [dispatch]);

  return (
    <IonApp>
      <IonReactHashRouter>
        <IonRouterOutlet>
          <Route path="/welcome" component={WelcomePage} exact={true} />
          <Route
            path="/"
            render={() => <Redirect to="/welcome" />}
            exact={true}
          />
        </IonRouterOutlet>
      </IonReactHashRouter>
    </IonApp>
  );
};

export default App;
