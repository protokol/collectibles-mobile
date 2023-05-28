import { Identities, Transactions, Utils } from "@arkecosystem/crypto";
import { CryptoUtils } from '../../utils/crypto-utils';
import { defer, merge, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  WalletsActions,
  WalletsLoadActionType,
  WalletsLoadErrorAction,
  WalletsLoadSuccessAction,
  FaucetSendTokensActionType,
  FaucetSendTokensSuccessAction,
  FaucetSendTokensErrorAction,  
} from '../actions/wallets';
import { TransactionWaitForConfirmAction } from '../actions/transaction';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';
import { Wallet, ApiResponse, CreateTransactionApiResponse } from '@arkecosystem/client';

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

const faucetSendTokensEpic: RootEpic = (action$, state$, { connection }) =>
  action$.ofType(WalletsActions.FAUCET_SEND_TOKENS).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { 
          senderPassphrase,
          recipientAddress,
          pubKey,
          amount,
          txUuid
        },
      } = action as FaucetSendTokensActionType;

      return defer(() =>
        connection(stateBaseUrl!).api("wallets").get(Identities.Address.fromPassphrase(senderPassphrase))

      ).pipe(
       switchMap(({ body: { data, errors } }: ApiResponse<Wallet>) => {
          if (errors) {
            return of(FaucetSendTokensErrorAction(pubKey, errors));
          }      
        
          const transaction = Transactions.BuilderFactory.transfer()
          .recipientId(recipientAddress)
          .amount(Utils.BigNumber.make(amount * 10 ** Number(process.env.REACT_APP_TOKEN_DECIMALS)).toFixed())
          .nonce(CryptoUtils.getWalletNextNonce(data))
          .sign(senderPassphrase);        

          //return of(FaucetSendTokensErrorAction(pubKey, errors));
          
          return defer(() => 
            connection(stateBaseUrl!).api("transactions").create({ transactions: [transaction.getStruct()] }))
          .pipe(              
            switchMap(
              ({ body: { data, errors } }: ApiResponse<CreateTransactionApiResponse>) => {
                const [accepted] = data.accept;
                if (!!accepted) {
                  return merge(
                    of(FaucetSendTokensSuccessAction(accepted)),
                    of(TransactionWaitForConfirmAction(txUuid, accepted))
                  );
                }
                const [invalid] = data.invalid;
                const err = errors[invalid].message;
                return of(FaucetSendTokensErrorAction(pubKey, err));
              }
            ),
            catchError((err) => of(FaucetSendTokensErrorAction(pubKey, err)))
          );
          
        }),
        catchError((err) => {
          const { message } = err;
          if (message === '404') {
            return of(FaucetSendTokensSuccessAction(pubKey));
          }
          return of(FaucetSendTokensErrorAction(pubKey, err));
        })
      );
    })
  );  

const epics = [fetchWalletEpic, faucetSendTokensEpic];

export default epics;
