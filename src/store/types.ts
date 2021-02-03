import {Epic} from "redux-observable";
import {
    LoadNetworkConfigurationActionType,
    NetworkConfigurationErrorActionType,
    NetworkConfigurationSuccessActionType
} from "./actions/network";
import {NetworkState} from "./reducers/network";
import {AppState} from "./reducers/app";
import {SetBaseUrlAppActionType, SetEncodedUserPrivateKeyActionType} from "./actions/app";
import connection from "./services/protokol-connection";
import * as storage from './services/local-storage-service';

export type RootActions =
    | LoadNetworkConfigurationActionType
    | NetworkConfigurationSuccessActionType
    | NetworkConfigurationErrorActionType
    | SetBaseUrlAppActionType
    | SetEncodedUserPrivateKeyActionType;
export type RootState = {
    app: AppState,
    network: NetworkState
};
export type RootDependencies = {
    connection: typeof connection,
    storage: typeof storage
}
export type RootEpic = Epic<RootActions, RootActions, RootState, RootDependencies>;