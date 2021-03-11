import { Reducer } from 'redux';
import { AssetClaimActions } from '../actions/asset-claim';
import {
  TRANSACTION_ACTION_TYPES,
  TransactionActions,
} from '../actions/transaction';

export interface TxState {
  txId: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  isConfirmed: boolean;
}

export interface TransactionState {
  transactions: {
    [txUuid: string]: TxState;
  };
}

const initialState: TransactionState = {
  transactions: {},
};

const reducer: Reducer<TransactionState, TRANSACTION_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case TransactionActions.TRANSACTION_WAIT_FOR_CONFIRM: {
      const {
        payload: { txId, txUuid },
      } = action;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [txUuid]: {
            txId,
            isLoading: true,
            isConfirmed: false,
            isError: false,
          },
        },
      };
    }
    case TransactionActions.TRANSACTION_CONFIRM_SUCCESS: {
      const {
        payload: { txUuid },
      } = action;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [txUuid]: {
            ...state.transactions[txUuid],
            isError: false,
            isLoading: false,
            isConfirmed: true,
          },
        },
      };
    }
    case AssetClaimActions.CLAIM_ASSET_ERROR: {
      const {
        payload: { txUuid, error },
      } = action;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [txUuid]: {
            ...state.transactions[txUuid],
            isError: true,
            error,
            isLoading: false,
            isConfirmed: false,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
