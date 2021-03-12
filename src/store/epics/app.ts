import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
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
import { LoadNetworkConfigurationAction } from '../actions/network';
import {
  baseUrlSelector,
  encodedUserPrivateKeySelector,
} from '../selectors/app';
import { RootEpic } from '../types';

const onInitLoadNetworkEpic: RootEpic = (_, state$) =>
  state$.pipe(
    map(baseUrlSelector),
    distinctUntilChanged(),
    filter((baseUrl) => !!baseUrl),
    map(LoadNetworkConfigurationAction)
  );

const persistUserPrivateKeyInStorageEpic: RootEpic = (
  action$,
  state$,
  { storage }
) =>
  action$.pipe(
    ofType(AppActions.SET_ENCODED_USER_PRIVATE_KEY),
    withLatestFrom(state$.pipe(map(encodedUserPrivateKeySelector))),
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
      return of().pipe(ignoreElements());
    })
  );

const epics = [
  onInitLoadNetworkEpic,
  persistUserPrivateKeyInStorageEpic,
  restoreUserPrivateKeyFromStorageEpic,
];

export default epics;
