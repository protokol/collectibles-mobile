import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setupConfig } from '@ionic/react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configure-store';


setupConfig({  
  menuType: 'overlay'  
});


/*
const getConfig = () => {
  if (isPlatform('iphone')) {
    return {
      mode: 'ios'
    }
  }

  return {    
    mode: 'md'
  }
}

setupConfig(getConfig());
*/

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
