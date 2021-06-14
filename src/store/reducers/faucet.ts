import { Reducer } from 'redux';
import { WALLETS_ACTION_TYPES, WalletsActions } from '../actions/wallets';

export interface FaucetState {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

const initialState: FaucetState = {
  isLoading: true, isError: false
};

const reducer: Reducer<FaucetState, WALLETS_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case WalletsActions.FAUCET_SEND_TOKENS:
    {
      const {
        payload: {  },
      } = action;

      return {
        ...state,
        isLoading: true,
        isError: false,
        error: null,
      };
    }
    case WalletsActions.FAUCET_SEND_TOKENS_SUCCESS:
    {
      const {
        payload: { },
      } = action;

      return {
        ...state,
        isLoading: false,
        isError: false,
        error: null,
      };
    }    
    case WalletsActions.FAUCET_SEND_TOKENS_ERROR:
    {
      const {
        payload: { error },
      } = action;
      return {
        ...state,
        isLoading: false,
        wallet: null,
        isError: true,
        error,
      };
    }
    default:
      return state;
  }
};

export default reducer;
