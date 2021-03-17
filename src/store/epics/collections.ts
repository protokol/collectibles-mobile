import { defer, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  CollectionsActions,
  CollectionsLoadActionType,
  CollectionsLoadErrorAction,
  CollectionsLoadSuccessAction,
} from '../actions/collections';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';

const fetchWalletCollectionsEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(CollectionsActions.COLLECTIONS_LOAD).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { pubKey, query },
      } = action as CollectionsLoadActionType;

      return defer(() =>
        connection(stateBaseUrl!)
          .NFTBaseApi('assets')
          .walletAssets(pubKey, query)
      ).pipe(
        map(({ body: { data, errors } }) => {
          if (errors) {
            return CollectionsLoadErrorAction(errors);
          }
          return CollectionsLoadSuccessAction(
            query ?? { page: 1, limit: 100 },
            data,
            data.length === 0
          );
        }),
        catchError((err) => of(CollectionsLoadErrorAction(err)))
      );
    })
  );

const epics = [fetchWalletCollectionsEpic];

export default epics;
