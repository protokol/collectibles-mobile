import { Action } from 'redux';

// Actions
enum AppActions {
  SET_BASE_URL = '@App/SET_BASE_URL',
  SET_ENCODED_USER_PRIVATE_KEY = '@App/SET_ENCODED_USER_PRIVATE_KEY',
  SET_USERNAME = '@App/SET_USERNAME',
}

export interface SetBaseUrlAppActionType
  extends Action<AppActions.SET_BASE_URL> {
  payload: {
    baseUrl: string;
  };
}

export interface SetEncodedUserPrivateKeyActionType
  extends Action<AppActions.SET_ENCODED_USER_PRIVATE_KEY> {
  payload: {
    userPrivateKey: string | null;
    saveToStorage?: boolean;
  };
}

export interface SetUsernameActionType extends Action<AppActions.SET_USERNAME> {
  payload: {
    username: string | null;
    saveToStorage?: boolean;
  };
}

// Action creators
const SetBaseUrlAppAction = (baseUrl: string): SetBaseUrlAppActionType => ({
  type: AppActions.SET_BASE_URL,
  payload: {
    baseUrl,
  },
});

const SetEncodedUserPrivateKeyAction = (
  userPrivateKey: string | null,
  saveToStorage = true
): SetEncodedUserPrivateKeyActionType => ({
  type: AppActions.SET_ENCODED_USER_PRIVATE_KEY,
  payload: {
    userPrivateKey,
    saveToStorage,
  },
});

const SetUsernameAction = (
  username: string | null,
  saveToStorage = true
): SetUsernameActionType => ({
  type: AppActions.SET_USERNAME,
  payload: {
    username,
    saveToStorage,
  },
});

export type APP_ACTION_TYPES = SetBaseUrlAppActionType &
  SetEncodedUserPrivateKeyActionType &
  SetUsernameActionType;

export {
  AppActions,
  SetBaseUrlAppAction,
  SetEncodedUserPrivateKeyAction,
  SetUsernameAction,
};
