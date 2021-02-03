import { Action } from 'redux';

// Actions
enum AppActions {
    SET_BASE_URL = '@App/SET_BASE_URL',
    SET_ENCODED_USER_PRIVATE_KEY = '@App/SET_ENCODED_USER_PRIVATE_KEY',
}

export interface SetBaseUrlAppActionType extends Action<AppActions.SET_BASE_URL> {
    payload: {
        baseUrl: string
    }
}

export interface SetEncodedUserPrivateKeyActionType extends Action<AppActions.SET_ENCODED_USER_PRIVATE_KEY> {
    payload: {
        userPrivateKey: string,
        saveToStorage?: boolean
    }
}

// Action creators
const SetBaseUrlAppAction = (baseUrl: string): SetBaseUrlAppActionType => ({
    type: AppActions.SET_BASE_URL,
    payload: {
        baseUrl
    }
})

const SetEncodedUserPrivateKeyAction = (userPrivateKey: string, saveToStorage = true): SetEncodedUserPrivateKeyActionType => ({
    type: AppActions.SET_ENCODED_USER_PRIVATE_KEY,
    payload: {
        userPrivateKey,
        saveToStorage
    }
})

export type APP_ACTION_TYPES = SetBaseUrlAppActionType & SetEncodedUserPrivateKeyActionType;

export {
    AppActions,
    SetBaseUrlAppAction,
    SetEncodedUserPrivateKeyAction
}