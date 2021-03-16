import { Action } from 'redux';
import { v4 as uuid } from 'uuid';

// Actions
enum NamespaceActions {
  NAMESPACE_REGISTER = '@Namespace/NAMESPACE_REGISTER',
}

export interface NamespaceRegisterActionType
  extends Action<NamespaceActions.NAMESPACE_REGISTER> {
  payload: {
    txUuid: string;
    name: string;
    passphrase: string;
  };
}

// Action creators
const NamespaceRegisterAction = (
  name: string,
  passphrase: string,
  txUuid: string = uuid()
): NamespaceRegisterActionType => ({
  type: NamespaceActions.NAMESPACE_REGISTER,
  payload: {
    txUuid,
    name,
    passphrase,
  },
});

export type NAMESPACE_ACTION_TYPES = NamespaceRegisterActionType;

export { NamespaceActions, NamespaceRegisterAction };
