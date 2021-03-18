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
} from '../actions/app';
import { encodedUserPrivateKeySelector } from '../selectors/app';
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
        storage.set(StorageKeys.STORAGE_PK_KEY, encodedUserPrivateKey);
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
      const userPrivateKey = storage.get<string>(StorageKeys.STORAGE_PK_KEY);
      if (userPrivateKey) {
        return of(SetEncodedUserPrivateKeyAction(userPrivateKey, false));
      }
      return of(SetEncodedUserPrivateKeyAction(null, false));
    })
  );

const epics = [
  persistUserPrivateKeyInStorageEpic,
  restoreUserPrivateKeyFromStorageEpic,
];

export default epics;
