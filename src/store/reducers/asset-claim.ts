import { Reducer } from 'redux';
import {
  AssetClaimActions,
  CLAIM_ASSET_ACTION_TYPES,
} from '../actions/asset-claim';

export interface AssetClaimState {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  txId?: string;
}

const initialState: AssetClaimState = {
  isLoading: false,
  isError: false,
};

const reducer: Reducer<AssetClaimState, CLAIM_ASSET_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case AssetClaimActions.CLAIM_ASSET: {
      return {
        ...initialState,
        isLoading: true,
      };
    }
    case AssetClaimActions.CLAIM_ASSET_SUCCESS: {
      const {
        payload: { txId },
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: false,
        txId,
      };
    }
    case AssetClaimActions.CLAIM_ASSET_ERROR: {
      const {
        payload: { error },
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };
    }
    default:
      return state;
  }
};

export default reducer;
