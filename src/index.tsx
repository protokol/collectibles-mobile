import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setupConfig } from '@ionic/react';
import App from './App';
import AuthRegisterContextProvider from './providers/AuthRegisterProvider';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configure-store';

setupConfig({
  mode: 'md',
});

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AuthRegisterContextProvider>
      <App />
    </AuthRegisterContextProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
