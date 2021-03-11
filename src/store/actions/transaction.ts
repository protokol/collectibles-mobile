import { Action } from 'redux';

// Actions
enum TransactionActions {
  TRANSACTION_WAIT_FOR_CONFIRM = '@Transaction/TRANSACTION_WAIT_FOR_CONFIRM',
  TRANSACTION_CONFIRM_SUCCESS = '@Transaction/TRANSACTION_CONFIRM_SUCCESS',
  TRANSACTION_CONFIRM_ERROR = '@Transaction/TRANSACTION_CONFIRM_ERROR',
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

export type TRANSACTION_ACTION_TYPES = TransactionWaitForConfirmActionType &
  TransactionConfirmSuccessActionType &
  TransactionConfirmErrorActionType;

export {
  TransactionActions,
  TransactionWaitForConfirmAction,
  TransactionConfirmSuccessAction,
  TransactionConfirmErrorAction,
};
