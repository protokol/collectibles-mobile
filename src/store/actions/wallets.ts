import { Action } from 'redux';
import { Wallet } from '@arkecosystem/client';

// Actions
enum WalletsActions {
  WALLETS_LOAD = '@Wallets/WALLETS_LOAD',
  WALLETS_LOAD_SUCCESS = '@Wallets/WALLETS_LOAD_SUCCESS',
  WALLETS_LOAD_ERROR = '@Wallets/WALLETS_LOAD_ERROR',
  FAUCET_SEND_TOKENS = '@Wallets/FAUCET_SEND_TOKENS',
  FAUCET_SEND_TOKENS_SUCCESS = '@Wallets/FAUCET_SEND_TOKENS_SUCCESS',
  FAUCET_SEND_TOKENS_ERROR = '@Wallets/FAUCET_SEND_TOKENS_ERROR',  
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

export interface FaucetSendTokensActionType
  extends Action<WalletsActions.FAUCET_SEND_TOKENS> {
  payload: {
    senderPassphrase: string;
    recipientAddress: string;
    pubKey: string;
    amount: number;
    txUuid: string;
  };
}

export interface FaucetSendTokensSuccessActionType
  extends Action<WalletsActions.FAUCET_SEND_TOKENS_SUCCESS> {
  payload: {
    pubKey: string;
  };
}

export interface FaucetSendTokensErrorActionType
  extends Action<WalletsActions.FAUCET_SEND_TOKENS_ERROR> {
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

const FaucetSendTokensAction = (
  senderPassphrase: string,
  recipientAddress: string,
  pubKey: string,
  amount: number,
  txUuid: string
): FaucetSendTokensActionType => ({
  type: WalletsActions.FAUCET_SEND_TOKENS,
  payload: {
    senderPassphrase,
    recipientAddress,
    pubKey,
    amount,
    txUuid
  },
});

const FaucetSendTokensSuccessAction = (
  pubKey: string,
): FaucetSendTokensSuccessActionType => ({
  type: WalletsActions.FAUCET_SEND_TOKENS_SUCCESS,
  payload: {
    pubKey,
  },
});

const FaucetSendTokensErrorAction = (
  pubKey: string,
  error: Error
): FaucetSendTokensErrorActionType => ({
  type: WalletsActions.FAUCET_SEND_TOKENS_ERROR,
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
  FaucetSendTokensAction,
  FaucetSendTokensSuccessAction,
  FaucetSendTokensErrorAction,
};
