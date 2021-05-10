import { defer, merge, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
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
import { Transactions, Utils } from "@arkecosystem/crypto";
import { CryptoUtils } from '../../utils/crypto-utils';
import { TransactionWaitForConfirmAction } from '../actions/transaction';

const startAuctionEpic: RootEpic = (
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

        Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAuctionTransaction);

        const transaction = new Builders.NFTAuctionBuilder()
            .NFTAuctionAsset({
                startAmount: Utils.BigNumber.make(minimumBid),                
                expiration: {
                    blockHeight: 1000000,
                },
                nftIds: [cardId],
            })
            //.fee("0")
            .nonce(CryptoUtils.getWalletNextNonce())
            .sign(passphrase);

        return defer(() =>
            connection(stateBaseUrl!)
              .api("transactions")
              .create({ transactions: [transaction.getStruct()] })
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
              catchError((err) => of(StartAuctionErrorAction(err))
            )    
        );                      
    })
  );

const epics = [startAuctionEpic];

export default epics;