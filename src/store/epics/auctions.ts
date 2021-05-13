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
    StartAuctionActionType,
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
                /*minimumIncrement,
                finalBiddingDate,*/
                cardId,
                /*recipientId,*/
                passphrase,
                txUuid
            },
        } = action as StartAuctionActionType;              

        Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAuctionTransaction);
        //connection(stateBaseUrl!).api("blocks").last();
        //const lastBlock: Interfaces.IBlock = app.get<any>(Container.Identifiers.StateStore).getLastBlock();
        //obtain blocktime from https://nascar-explorer.protokol.sh/api/node/configuration -->stateBaseurl mejor
        /* {"data": {
              "core": {
                  "version": "3.0.0-next.23"
              },
              "nethash": "de573f53b5037d0f6a97b540747b4742816bf8173824b7ab9662ecc3a7a90c2e",
              "slip44": 1,
              "wif": 255,
              "token": "PROTO",
              "symbol": "Þ",
              "explorer": "https://proto-devnet.protokol.sh",
              "version": 55,
              "ports": {},
              "constants": {
                  "height": 1,
                  "reward": "0",
                  "activeDelegates": 17,
                  -------------> "blocktime": 6,
        */      

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
                  console.log(JSON.stringify(data, null, 4));
                  console.log(JSON.stringify(errors, null, 4));
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