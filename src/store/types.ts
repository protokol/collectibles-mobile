import { Epic } from 'redux-observable';
import storage from '../utils/storage-service';
import {
  SetBaseUrlAppActionType,
  SetEncodedUserPrivateKeyActionType,
} from './actions/app';
import {
  ClaimAssetActionType,
  ClaimAssetErrorActionType,
  ClaimAssetSuccessActionType,
} from './actions/asset-claim';
import {
  LoadNetworkConfigurationActionType,
  NetworkConfigurationErrorActionType,
  NetworkConfigurationSuccessActionType,
} from './actions/network';
import {
  TransactionConfirmErrorActionType,
  TransactionConfirmSuccessActionType,
  TransactionWaitForConfirmActionType,
} from './actions/transaction';
import { AppState } from './reducers/app';
import { AssetClaimState } from './reducers/asset-claim';
import { NetworkState } from './reducers/network';
import { TransactionState } from './reducers/transaction';
import connection from './services/protokol-connection';

export type RootActions =
  | LoadNetworkConfigurationActionType
  | NetworkConfigurationSuccessActionType
  | NetworkConfigurationErrorActionType
  | SetBaseUrlAppActionType
  | SetEncodedUserPrivateKeyActionType
  | ClaimAssetActionType
  | ClaimAssetSuccessActionType
  | ClaimAssetErrorActionType
  | TransactionWaitForConfirmActionType
  | TransactionConfirmSuccessActionType
  | TransactionConfirmErrorActionType;
export type RootState = {
  app: AppState;
  network: NetworkState;
  assetClaim: AssetClaimState;
  transaction: TransactionState;
};
export type RootDependencies = {
  connection: typeof connection;
  storage: ReturnType<typeof storage>;
};
export type RootEpic = Epic<
  RootActions,
  RootActions,
  RootState,
  RootDependencies
>;
