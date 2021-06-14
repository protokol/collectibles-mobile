import { Reducer } from 'redux';
import { Wallet } from '@arkecosystem/client';
import { WALLETS_ACTION_TYPES, WalletsActions } from '../actions/wallets';

export interface WalletsState {
  wallets: {
    [pubKey: string]: {
      wallet: Wallet | null;
      isLoading: boolean;
      isError: boolean;
      error?: Error | null;
    };
  };
}

const initialState: WalletsState = {
  wallets: {},
};

const reducer: Reducer<WalletsState, WALLETS_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case WalletsActions.WALLETS_LOAD: 
    case WalletsActions.FAUCET_SEND_TOKENS:
    {
      const {
        payload: { pubKey },
      } = action;

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [pubKey]: {
            isLoading: true,
            isError: false,
            error: null,
            wallet: null,
          },
        },
      };
    }
    case WalletsActions.WALLETS_LOAD_SUCCESS: 
    {
      const {
        payload: { pubKey, wallet },
      } = action;

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [pubKey]: {
            isLoading: false,
            isError: false,
            error: null,
            wallet,
          },
        },
      };
    }
    case WalletsActions.FAUCET_SEND_TOKENS_SUCCESS:
    {
      const {
        payload: { pubKey },
      } = action;

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [pubKey]: {
            isLoading: false,
            isError: false,
            error: null,
          },
        },
      };
    }
    case WalletsActions.WALLETS_LOAD_ERROR: 
    case WalletsActions.FAUCET_SEND_TOKENS_ERROR:
    {
      const {
        payload: { pubKey, error },
      } = action;
      return {
        ...state,
        wallets: {
          ...state.wallets,
          [pubKey]: {
            isLoading: false,
            wallet: null,
            isError: true,
            error,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
