import { FC, useContext } from 'react';
import { useHistory } from 'react-router';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { IonLoading, isPlatform, IonToast } from '@ionic/react';
import {
  AuthLoginContext,
  AuthLoginState,
} from '../providers/AuthLoginProvider';

const ProtectedRoute: FC<any> = ({
  component: Component,
  requiresCordova,
  ...rest
}: {
  requiresCordova?: boolean;
  component: FC<RouteProps>;
}) => {
  const {
    session: { state },
  } = useContext(AuthLoginContext);
  const history = useHistory();

  if (requiresCordova && !isPlatform('cordova')) {
    return (
      <IonToast
        isOpen={true}
        onDidDismiss={() => history.replace('/')}
        message="This feature requires to be run on native platform(iOS, Android)!"
        duration={2000}
      />
    );
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        switch (state) {
          case AuthLoginState.LoggedIn:
            return <Component {...props} />;
          case AuthLoginState.NeedRegistration:
            return <Redirect to="/welcome" push={false} />;
          case AuthLoginState.PinProtected:
          case AuthLoginState.Error:
            return <Redirect to="/passcode" push={false} />;
          case AuthLoginState.Unknown:
          default:
            return <IonLoading isOpen={true} message={'Please wait...'} />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
