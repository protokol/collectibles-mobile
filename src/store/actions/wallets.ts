import { Action } from 'redux';
import { Wallet } from '@arkecosystem/client';

// Actions
enum WalletsActions {
  WALLETS_LOAD = '@Wallets/WALLETS_LOAD',
  WALLETS_LOAD_SUCCESS = '@Wallets/WALLETS_LOAD_SUCCESS',
  WALLETS_LOAD_ERROR = '@Wallets/WALLETS_LOAD_ERROR',
}

export interface WalletsLoadActionType
  extends Action<WalletsActions.WALLETS_LOAD> {
  payload: {
    pubKey: string;
  };
}

export interface WalletsLoadSuccessActionType
  extends Action<WalletsActions.WALLETS_LOAD_SUCCESS> {
  payload: {
    pubKey: string;
    wallet: Wallet | null;
  };
}

export interface WalletsLoadErrorActionType
  extends Action<WalletsActions.WALLETS_LOAD_ERROR> {
  payload: {
    pubKey: string;
    error: Error;
  };
}

// Action creators
const WalletsLoadAction = (pubKey: string): WalletsLoadActionType => ({
  type: WalletsActions.WALLETS_LOAD,
  payload: {
    pubKey,
  },
});

const WalletsLoadSuccessAction = (
  pubKey: string,
  wallet: Wallet | null
): WalletsLoadSuccessActionType => ({
  type: WalletsActions.WALLETS_LOAD_SUCCESS,
  payload: {
    pubKey,
    wallet,
  },
});

const WalletsLoadErrorAction = (
  pubKey: string,
  error: Error
): WalletsLoadErrorActionType => ({
  type: WalletsActions.WALLETS_LOAD_ERROR,
  payload: {
    pubKey,
    error,
  },
});

export type WALLETS_ACTION_TYPES = WalletsLoadActionType &
  WalletsLoadSuccessActionType &
  WalletsLoadErrorActionType;

export {
  WalletsActions,
  WalletsLoadAction,
  WalletsLoadSuccessAction,
  WalletsLoadErrorAction,
};
