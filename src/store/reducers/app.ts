import { Reducer } from 'redux';
import { APP_ACTION_TYPES, AppActions } from '../actions/app';

export interface AppState {
  baseUrl?: string;
  userPrivateKey?: string;
}

const initialState: AppState = {
  baseUrl: undefined,
  userPrivateKey: undefined,
};

const reducer: Reducer<AppState, APP_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case AppActions.SET_BASE_URL: {
      const {
        payload: { baseUrl },
      } = action;
      return {
        ...state,
        baseUrl,
      };
    }
    case AppActions.SET_ENCODED_USER_PRIVATE_KEY: {
      const {
        payload: { userPrivateKey },
      } = action;

      return {
        ...state,
        userPrivateKey,
      };
    }
    default:
      return state;
  }
};

export default reducer;
