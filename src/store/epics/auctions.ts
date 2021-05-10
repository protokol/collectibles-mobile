import { defer, merge, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Container } from "@arkecosystem/core-kernel";
import {
  ApiResponse,
  CreateTransactionApiResponse,
} from '@arkecosystem/client';
import {
    AuctionActions,
    StartAuctionSuccessAction,
    StartAuctionErrorAction,
    StartAuctionActionType,
    CollectiblesOnAuctionLoadActionType,
    CollectiblesOnAuctionLoadErrorAction,
    CollectiblesOnAuctionLoadSuccessAction,
} from '../actions/auctions';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';
import { Builders, Transactions as NFTTransactions } from "@protokol/nft-exchange-crypto";
import { Transactions, Interfaces, Utils } from "@arkecosystem/crypto";
import { CryptoUtils } from '../../utils/crypto-utils';
import { TransactionWaitForConfirmAction } from '../actions/transaction';

const fetchCardsOnAuctionEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { body, query },
      } = action as CollectiblesOnAuctionLoadActionType;   

      return defer(() =>
        connection(stateBaseUrl!).NFTExchangeApi("auctions").searchByAsset(body!, query)
      ).pipe(
        map(({ body: { data, errors } }) => {
          if (errors) {
            return CollectiblesOnAuctionLoadErrorAction(errors);
          }
          /*
          const q = query || {
            page: 1,
            limit: 100,
          };
          */
          return CollectiblesOnAuctionLoadSuccessAction(body!, data, true /*data.length < q.limit!*/);
        }),
        catchError((err) => of(CollectiblesOnAuctionLoadErrorAction(err)))
      );
    })
);

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

        //TODO Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAuctionTransaction);
        //const lastBlock: Interfaces.IBlock = app.get<any>(Container.Identifiers.StateStore).getLastBlock();
        //obtain blocktime from https://explorer.protokol.sh/api/node/configuration
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
                    blockHeight: 10000000,
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

const epics = [fetchCardsOnAuctionEpic, startAuctionEpic];

export default epics;