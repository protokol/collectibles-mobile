import { Epic } from 'redux-observable';
import {
  SetBaseUrlAppActionType,
  SetEncodedUserPrivateKeyActionType,
} from './actions/app';
import {
  LoadNetworkConfigurationActionType,
  NetworkConfigurationErrorActionType,
  NetworkConfigurationSuccessActionType,
} from './actions/network';
import { AppState } from './reducers/app';
import { NetworkState } from './reducers/network';
import * as storage from './services/local-storage-service';
import connection from './services/protokol-connection';

export type RootActions =
  | LoadNetworkConfigurationActionType
  | NetworkConfigurationSuccessActionType
  | NetworkConfigurationErrorActionType
  | SetBaseUrlAppActionType
  | SetEncodedUserPrivateKeyActionType;
export type RootState = {
  app: AppState;
  network: NetworkState;
};
export type RootDependencies = {
  connection: typeof connection;
  storage: typeof storage;
};
export type RootEpic = Epic<
  RootActions,
  RootActions,
  RootState,
  RootDependencies
>;
