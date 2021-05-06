import { defer, merge, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  DataResponse,
  ApiResponse,
  CreateTransactionApiResponse,
} from '@arkecosystem/client';
import {
    AuctionActions,
    StartAuctionSuccessAction,
    StartAuctionErrorAction,
    StartAuctionActionType
} from '../actions/auctions';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';
import { Builders, Transactions as NFTTransactions } from "@protokol/nft-exchange-crypto";
import { ErrorMessage } from '@hookform/error-message';
import { CryptoUtils } from '../../utils/crypto-utils';
import { Utils } from '@arkecosystem/crypto';
import { TransactionWaitForConfirmAction } from '../actions/transaction';

const startAuction: RootEpic = (
    action$,
    state$,
    { connection }
  ) =>  
  action$.ofType(AuctionActions.START_AUCTION).pipe(    
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
        const {
            payload: {             
                minimumBid,
                minimumIncrement,
                finalBiddingDate,
                cardId,
                recipientId,
                passphrase,
                txUuid
            },
        } = action as StartAuctionActionType;
        console.log("Entra en el Epic");

        const transaction = new Builders.NFTAuctionBuilder()
            .NFTAuctionAsset({
                startAmount: Utils.BigNumber.make(minimumBid),
                expiration: {
                    blockHeight: 1000000,
                },
                nftId: cardId,
            })
            .nonce(CryptoUtils.getWalletNextNonce())
            .sign(passphrase);

        return defer(() =>
                connection(stateBaseUrl!).api("transactions").create({ transactions: [transaction.build().toJson()] })
        ).pipe(       
            switchMap(
                ({ body: { data, errors } }: ApiResponse<CreateTransactionApiResponse>) => {
                  const [accepted] = data.accept;
                  if (!!accepted) {
                    return merge(
                      of(StartAuctionSuccessAction(accepted)),
                      of(TransactionWaitForConfirmAction(txUuid, accepted))
                    );
                  }
      
                  const [invalid] = data.invalid;
                  const err = errors[invalid].message;
      
                  return of(StartAuctionErrorAction(err));
                }
              ),
              catchError((err) => of(StartAuctionErrorAction(err)))            
            /*
            map(({ body: { data, errors } }) => {
                console.log(JSON.stringify(data, null, 4));
                console.log(JSON.stringify(ErrorMessage, null, 4));
                if (errors) {
                    return StartAuctionErrorAction(errors);
                }
                const [accepted] = data.accept;
                return StartAuctionSuccessAction(accepted);
            }),
            catchError((err) => of(StartAuctionErrorAction(err)))   
            */     
        );                      
    })
  );

const epics = [startAuction];

export default epics;