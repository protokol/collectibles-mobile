import { Reducer } from 'redux';
import { NodeCryptoConfiguration } from '@arkecosystem/client/dist/resourcesTypes/node';
import { NETWORK_ACTION_TYPES, NetworkActions } from '../actions/network';

export interface NetworkState {
  isLoading: boolean;
  isError: boolean;
  nodeCryptoConfiguration?: NodeCryptoConfiguration;
  error?: Error;
}

const initialState: NetworkState = {
  isLoading: false,
  isError: false,
};

const reducer: Reducer<NetworkState, NETWORK_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case NetworkActions.LOAD_NETWORK_CONFIGURATION: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case NetworkActions.NETWORK_CONFIGURATION_SUCCESS: {
      const {
        payload: { nodeCryptoConfiguration },
      } = action;
      return {
        ...state,
        isLoading: false,
        nodeCryptoConfiguration,
      };
    }
    case NetworkActions.NETWORK_CONFIGURATION_ERROR: {
      const {
        payload: { error },
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: false,
        error,
      };
    }
    default:
      return state;
  }
};

export default reducer;
