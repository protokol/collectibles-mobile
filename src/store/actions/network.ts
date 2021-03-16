import { Action } from 'redux';
import { NodeCryptoConfiguration } from '@arkecosystem/client';

// Actions
enum NetworkActions {
  LOAD_NETWORK_CONFIGURATION = '@Network/LOAD_NETWORK_CONFIGURATION',
  NETWORK_CONFIGURATION_SUCCESS = '@Network/NETWORK_CONFIGURATION_SUCCESS',
  NETWORK_CONFIGURATION_ERROR = '@Network/NETWORK_CONFIGURATION_ERROR',
}

export interface LoadNetworkConfigurationActionType
  extends Action<NetworkActions.LOAD_NETWORK_CONFIGURATION> {
  payload: {
    baseUrl?: string;
  };
}

export interface NetworkConfigurationSuccessActionType
  extends Action<NetworkActions.NETWORK_CONFIGURATION_SUCCESS> {
  payload: {
    nodeCryptoConfiguration: NodeCryptoConfiguration;
  };
}

export interface NetworkConfigurationErrorActionType
  extends Action<NetworkActions.NETWORK_CONFIGURATION_ERROR> {
  payload: {
    error: Error;
  };
}

// Action creators
const LoadNetworkConfigurationAction = (
  baseUrl?: string
): LoadNetworkConfigurationActionType => ({
  type: NetworkActions.LOAD_NETWORK_CONFIGURATION,
  payload: {
    baseUrl,
  },
});

const NetworkConfigurationSuccessAction = (
  nodeCryptoConfiguration: NodeCryptoConfiguration
): NetworkConfigurationSuccessActionType => ({
  type: NetworkActions.NETWORK_CONFIGURATION_SUCCESS,
  payload: {
    nodeCryptoConfiguration,
  },
});

const NetworkConfigurationErrorAction = (
  error: Error
): NetworkConfigurationErrorActionType => ({
  type: NetworkActions.NETWORK_CONFIGURATION_ERROR,
  payload: {
    error,
  },
});

export type NETWORK_ACTION_TYPES = LoadNetworkConfigurationActionType &
  NetworkConfigurationSuccessActionType &
  NetworkConfigurationErrorActionType;

export {
  NetworkActions,
  LoadNetworkConfigurationAction,
  NetworkConfigurationSuccessAction,
  NetworkConfigurationErrorAction,
};
