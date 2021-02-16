import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import storage from '../utils/storage-service';
import rootEpic from './epics';
import rootReducer from './reducers';
import connection from './services/protokol-connection';
import { RootActions, RootDependencies, RootState } from './types';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const epicMiddleware = createEpicMiddleware<
  RootActions,
  RootActions,
  RootState,
  RootDependencies
>({
  dependencies: {
    connection,
    storage: storage(),
  },
});

export default function configureStore() {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);
  return store;
}
