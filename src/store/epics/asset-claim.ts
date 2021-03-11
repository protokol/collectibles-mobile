import { merge, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  DataResponse,
  CreateTransactionApiResponse,
} from '@arkecosystem/client';
import {
  AssetClaimActions,
  ClaimAssetActionType,
  ClaimAssetErrorAction,
  ClaimAssetSuccessAction,
} from '../actions/asset-claim';
import { TransactionWaitForConfirmAction } from '../actions/transaction';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';

const postAssetClaimEpic: RootEpic = (action$, state$) =>
  action$.ofType(AssetClaimActions.CLAIM_ASSET).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { collectionId, recipientId, txUuid },
      } = action as ClaimAssetActionType;

      return fromFetch(`${stateBaseUrl}/api/nft/assets/claim`, {
        headers: {
          'Content-Type': 'application/json',
        },
        selector: (response) => response.json(),
        method: 'POST',
        body: JSON.stringify({
          collectionId,
          recipientId,
        }),
      }).pipe(
        switchMap(
          ({ data, errors }: DataResponse<CreateTransactionApiResponse>) => {
            const [accepted] = data.accept;
            if (!!accepted) {
              return merge(
                of(ClaimAssetSuccessAction(accepted)),
                of(TransactionWaitForConfirmAction(txUuid, accepted))
              );
            }

            const [invalid] = data.invalid;
            const err = errors[invalid].message;

            return of(ClaimAssetErrorAction(err));
          }
        ),
        catchError((err) => of(ClaimAssetErrorAction(err)))
      );
    })
  );

export default [postAssetClaimEpic];
