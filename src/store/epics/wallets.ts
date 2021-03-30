import { defer, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  WalletsActions,
  WalletsLoadActionType,
  WalletsLoadErrorAction,
  WalletsLoadSuccessAction,
} from '../actions/wallets';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';

const fetchWalletEpic: RootEpic = (action$, state$, { connection }) =>
  action$.ofType(WalletsActions.WALLETS_LOAD).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { pubKey },
      } = action as WalletsLoadActionType;

      return defer(() =>
        connection(stateBaseUrl!).api('wallets').get(pubKey)
      ).pipe(
        map(({ body: { data, errors } }) => {
          if (errors) {
            return WalletsLoadErrorAction(pubKey, errors);
          }

          return WalletsLoadSuccessAction(pubKey, data);
        }),
        catchError((err) => {
          const { message } = err;
          if (message === '404') {
            return of(WalletsLoadSuccessAction(pubKey, null));
          }
          return of(WalletsLoadErrorAction(pubKey, err));
        })
      );
    })
  );

const epics = [fetchWalletEpic];

export default epics;
