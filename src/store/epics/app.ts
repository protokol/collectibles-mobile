import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import {
  distinctUntilChanged,
  first,
  ignoreElements,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { StorageKeys } from '../../constants/storage';
import {
  AppActions,
  SetEncodedUserPrivateKeyAction,
  SetEncodedUserPrivateKeyActionType,
  SetUsernameAction,
  SetUsernameActionType,
} from '../actions/app';
import {
  encodedUserPrivateKeySelector,
  usernameSelector,
} from '../selectors/app';
import { RootEpic } from '../types';

const persistUserPrivateKeyInStorageEpic: RootEpic = (
  action$,
  state$,
  { storage }
) =>
  action$.pipe(
    ofType(AppActions.SET_ENCODED_USER_PRIVATE_KEY),
    withLatestFrom(
      state$.pipe(map(encodedUserPrivateKeySelector), distinctUntilChanged())
    ),
    tap(([{ payload }, encodedUserPrivateKey]) => {
      const {
        saveToStorage,
      } = payload as SetEncodedUserPrivateKeyActionType['payload'];
      if (saveToStorage) {
        storage.set(StorageKeys.PRIVATE_KEY, encodedUserPrivateKey);
      }
    }),
    ignoreElements()
  );

const restoreUserPrivateKeyFromStorageEpic: RootEpic = (
  action$,
  _,
  { storage }
) =>
  action$.pipe(
    first(),
    switchMap(() => {
      const userPrivateKey = storage.get<string>(StorageKeys.PRIVATE_KEY);
      if (userPrivateKey) {
        return of(SetEncodedUserPrivateKeyAction(userPrivateKey, false));
      }
      return of(SetEncodedUserPrivateKeyAction(null, false));
    })
  );

const persistUsernameInStorageEpic: RootEpic = (action$, state$, { storage }) =>
  action$.pipe(
    ofType(AppActions.SET_USERNAME),
    withLatestFrom(state$.pipe(map(usernameSelector), distinctUntilChanged())),
    tap(([{ payload }, username]) => {
      const { saveToStorage } = payload as SetUsernameActionType['payload'];
      if (saveToStorage) {
        storage.set(StorageKeys.USERNAME, username);
      }
    }),
    ignoreElements()
  );

const restoreUsernameFromStorageEpic: RootEpic = (action$, _, { storage }) =>
  action$.pipe(
    first(),
    switchMap(() => {
      const username = storage.get<string>(StorageKeys.USERNAME);
      if (username) {
        return of(SetUsernameAction(username, false));
      }
      return of(SetUsernameAction(null, false));
    })
  );

const epics = [
  persistUserPrivateKeyInStorageEpic,
  restoreUserPrivateKeyFromStorageEpic,
  persistUsernameInStorageEpic,
  restoreUsernameFromStorageEpic,
];

export default epics;
