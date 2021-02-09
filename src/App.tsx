import React, {useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonRouterOutlet,
} from '@ionic/react';
import {IonReactHashRouter} from '@ionic/react-router';
import {useDispatch} from "react-redux";
import {SetBaseUrlAppAction} from "./store/actions/app";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Fonts */
import './theme/fonts.css';

/* Theme variables */
import './theme/variables.css';
import WelcomePage from './pages/WelcomePage';

const App: React.FC = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(SetBaseUrlAppAction('https://proto-devnet.protokol.sh'));
    }, [dispatch]);

    return (
        <IonApp>
            <IonReactHashRouter>
                <IonRouterOutlet>
                    <Route path="/welcome" component={WelcomePage} exact={true}/>
                    <Route path="/" render={() => <Redirect to="/welcome"/>} exact={true}/>
                </IonRouterOutlet>
            </IonReactHashRouter>
        </IonApp>
    );
}

export default App;