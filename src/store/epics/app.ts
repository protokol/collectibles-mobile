import {distinctUntilChanged, filter, first, ignoreElements, map, switchMap, tap, withLatestFrom} from "rxjs/operators";
import {RootEpic} from "../types";
import {LoadNetworkConfigurationAction} from "../actions/network";
import {baseUrlSelector, encodedUserPrivateKeySelector} from "../selectors/app";
import {ofType} from "redux-observable";
import {AppActions, SetEncodedUserPrivateKeyAction, SetEncodedUserPrivateKeyActionType} from "../actions/app";
import {of} from "rxjs";

const onInitLoadNetworkEpic: RootEpic = ((action$, state$) =>
        state$.pipe(
            map(baseUrlSelector),
            distinctUntilChanged(),
            filter(baseUrl => !!baseUrl),
            map(LoadNetworkConfigurationAction)
        )
)

const persistUserPrivateKeyInStorageEpic: RootEpic = (
    action$,
    state$,
    {storage}
) =>
    action$.pipe(
        ofType(AppActions.SET_ENCODED_USER_PRIVATE_KEY),
        withLatestFrom(state$.pipe(map(encodedUserPrivateKeySelector))),
        tap(([{payload}, encodedUserPrivateKey]) => {
            const {saveToStorage} = payload as SetEncodedUserPrivateKeyActionType["payload"];
            if (saveToStorage) {
                storage.set('pk', encodedUserPrivateKey);
            }
        }),
        ignoreElements()
    );

const restoreUserPrivateKeyFromStorageEpic: RootEpic = (
    (action$, state$, {storage}) =>
    action$.pipe(
        first(),
        switchMap(() => {
            const userPrivateKey = storage.get<string>('pk');
            if (userPrivateKey) {
                return of(SetEncodedUserPrivateKeyAction(userPrivateKey, false));
            }
            return of().pipe(ignoreElements());
        })
    )
)

export default [
    onInitLoadNetworkEpic,
    persistUserPrivateKeyInStorageEpic,
    restoreUserPrivateKeyFromStorageEpic
];