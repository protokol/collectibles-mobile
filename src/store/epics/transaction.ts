import addSeconds from 'date-fns/addSeconds';
import { defer, EMPTY, of, Subject, throwError, timer } from 'rxjs';
import {
  catchError,
  exhaustMap,
  ignoreElements,
  map,
  switchMap,
  takeUntil,
  timeoutWith,
  withLatestFrom,
} from 'rxjs/operators';
import {
  CreateTransactionApiResponse,
  ApiResponse,
} from '@arkecosystem/client';
import { ClaimAssetErrorAction } from '../actions/asset-claim';
import {
  TransactionActions,
  TransactionConfirmErrorAction,
  TransactionConfirmSuccessAction,
  TransactionSubmitActionType,
  TransactionWaitForConfirmAction,
  TransactionWaitForConfirmActionType,
} from '../actions/transaction';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';

const pingTransactionConfirmEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(TransactionActions.TRANSACTION_WAIT_FOR_CONFIRM).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const cancel$ = new Subject();

      const {
        payload: { txId, txUuid },
      } = action as TransactionWaitForConfirmActionType;

      return timer(0, 4000).pipe(
        takeUntil(cancel$),
        timeoutWith(
          addSeconds(Date.now(), 80 /*Wait for 10 blocks*/),
          throwError(
            'Transaction/s have not been confirmed within 10 blocks time!'
          )
        ),
        exhaustMap(() =>
          defer(() =>
            connection(stateBaseUrl!).api('transactions').get(txId)
          ).pipe(
            catchError(() => {
              return of({ body: { data: undefined } });
            }),
            switchMap(({ body: { data } }) => {
              if (data) {
                cancel$.next();
                cancel$.complete();

                return of(TransactionConfirmSuccessAction(txUuid));
              }
              return EMPTY.pipe(ignoreElements());
            })
          )
        ),
        catchError((err) => of(TransactionConfirmErrorAction(txUuid, err)))
      );
    })
  );

const transactionSubmitEpic: RootEpic = (action$, state$, { connection }) =>
  action$.ofType(TransactionActions.TRANSACTION_SUBMIT).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { transactions, txUuid },
      } = action as TransactionSubmitActionType;

      return defer(() =>
        connection(stateBaseUrl!).api('transactions').create(transactions)
      ).pipe(
        switchMap(
          ({
            body: { data, errors },
          }: ApiResponse<CreateTransactionApiResponse>) => {
            const [accepted] = data.accept;
            if (!!accepted) {
              return of(TransactionWaitForConfirmAction(txUuid, accepted));
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

const epics = [pingTransactionConfirmEpic, transactionSubmitEpic];

export default epics;
