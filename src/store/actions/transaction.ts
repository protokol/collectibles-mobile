import { Action } from 'redux';
import { ArkCrypto } from '../services/crypto';

// Actions
enum TransactionActions {
  TRANSACTION_WAIT_FOR_CONFIRM = '@Transaction/TRANSACTION_WAIT_FOR_CONFIRM',
  TRANSACTION_CONFIRM_SUCCESS = '@Transaction/TRANSACTION_CONFIRM_SUCCESS',
  TRANSACTION_CONFIRM_ERROR = '@Transaction/TRANSACTION_CONFIRM_ERROR',
  TRANSACTION_SUBMIT = '@Transaction/TRANSACTION_SUBMIT',
}

export interface TransactionWaitForConfirmActionType
  extends Action<TransactionActions.TRANSACTION_WAIT_FOR_CONFIRM> {
  payload: {
    txUuid: string;
    txId: string;
  };
}

export interface TransactionConfirmSuccessActionType
  extends Action<TransactionActions.TRANSACTION_CONFIRM_SUCCESS> {
  payload: {
    txUuid: string;
  };
}

export interface TransactionConfirmErrorActionType
  extends Action<TransactionActions.TRANSACTION_CONFIRM_ERROR> {
  payload: {
    txUuid: string;
    error: Error;
  };
}

export interface TransactionSubmitActionType
  extends Action<TransactionActions.TRANSACTION_SUBMIT> {
  payload: {
    txUuid: string;
    transactions: {
      transactions: (
        | ArkCrypto.Interfaces.ITransactionJson
        | ArkCrypto.Interfaces.ITransactionData
      )[];
    } & Record<string, any>;
  };
}

// Action creators
const TransactionWaitForConfirmAction = (
  txUuid: string,
  txId: string
): TransactionWaitForConfirmActionType => ({
  type: TransactionActions.TRANSACTION_WAIT_FOR_CONFIRM,
  payload: {
    txUuid,
    txId,
  },
});

const TransactionConfirmSuccessAction = (
  txUuid: string
): TransactionConfirmSuccessActionType => ({
  type: TransactionActions.TRANSACTION_CONFIRM_SUCCESS,
  payload: {
    txUuid,
  },
});

const TransactionConfirmErrorAction = (
  txUuid: string,
  error: Error
): TransactionConfirmErrorActionType => ({
  type: TransactionActions.TRANSACTION_CONFIRM_ERROR,
  payload: {
    txUuid,
    error,
  },
});

const TransactionSubmitAction = (
  txUuid: string,
  transactions: {
    transactions: (
      | ArkCrypto.Interfaces.ITransactionJson
      | ArkCrypto.Interfaces.ITransactionData
    )[];
  } & Record<string, any>
): TransactionSubmitActionType => ({
  type: TransactionActions.TRANSACTION_SUBMIT,
  payload: {
    txUuid,
    transactions,
  },
});

export type TRANSACTION_ACTION_TYPES = TransactionWaitForConfirmActionType &
  TransactionConfirmSuccessActionType &
  TransactionConfirmErrorActionType;

export {
  TransactionActions,
  TransactionWaitForConfirmAction,
  TransactionConfirmSuccessAction,
  TransactionConfirmErrorAction,
  TransactionSubmitAction,
};
