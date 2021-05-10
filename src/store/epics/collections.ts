import { defer, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  CollectionsActions,
  CollectiblesLoadActionType,
  CollectiblesLoadErrorAction,
  CollectiblesLoadSuccessAction,
} from '../actions/collections';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';

const fetchWalletCollectionsEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(CollectionsActions.COLLECTIBLES_LOAD).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { pubKey, query },
      } = action as CollectiblesLoadActionType;
      
      console.log("Collections Epic connection: " + JSON.stringify(connection));

      return defer(() =>
        connection(stateBaseUrl!)
          .NFTBaseApi('assets')
          .walletAssets(pubKey, query)
      ).pipe(
        map(({ body: { data, errors } }) => {
          if (errors) {
            return CollectiblesLoadErrorAction(errors);
          }

          const q = query || {
            page: 1,
            limit: 100,
          };

          return CollectiblesLoadSuccessAction(q, data, data.length < q.limit!);
        }),
        catchError((err) => of(CollectiblesLoadErrorAction(err)))
      );
    })
  );

const epics = [fetchWalletCollectionsEpic];

export default epics;
