import { defer, merge, of, forkJoin, scheduled } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  Wallet,
  ApiResponse,
  CreateTransactionApiResponse,
} from '@arkecosystem/client';
import {
    AuctionActions,
    StartAuctionSuccessAction,
    StartAuctionErrorAction,
    StartAuctionActionType,
    CancelAuctionSuccessAction,
    CancelAuctionErrorAction,
    CancelAuctionActionType,
    AuctionsLoadSuccessAction,
    AuctionsLoadErrorAction,      
    AuctionsLoadActionType,
} from '../actions/auctions';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';
import { Builders, Transactions as NFTTransactions } from "@protokol/nft-exchange-crypto";
import { Transactions, Utils } from "@arkecosystem/crypto";
import { CryptoUtils } from '../../utils/crypto-utils';
import { TransactionWaitForConfirmAction } from '../actions/transaction';

class ConfigurationConstants {  
  height: number;
  reward: string;
  activeDelegates: number;
  blocktime: number;
  block: any;
  epoch: string;
  fees: any;
  vendorFieldLength: number;
  multiPaymentLimit: number;
  aip11: boolean; 

  constructor(height: number, reward: string, activeDelegates: number, blocktime: number, block: any, 
              epoch: string, fees: any, vendorFieldLength: number, multiPaymentLimit: number, aip11: boolean){
    this.height = height;
    this.reward = reward;
    this.activeDelegates = activeDelegates;
    this.blocktime = blocktime;
    this.block = block;
    this.epoch = epoch;
    this.fees = fees;
    this.vendorFieldLength = vendorFieldLength;
    this.multiPaymentLimit = multiPaymentLimit;
    this.aip11 = aip11;
  }
}

class ConfigurationData {  
  core: any;
  nethash: string;
  slip44: number;
  wif: number;
  token: string;
  symbol: string;
  explorer: string;
  version: number;
  ports: any;
  constants: ConfigurationConstants;
  transactionPool: any;

  constructor(core: any, nethash: string, slip44: number, wif: number, token: string, symbol: string, explorer: string, version: number, ports: any, constants: ConfigurationConstants, transactionPool: any){
    this.core = core;
    this.nethash = nethash;
    this.slip44 = slip44;
    this.wif = wif;
    this.token = token;
    this.symbol = symbol;
    this.explorer = explorer;
    this.version = version;
    this.ports = ports;
    this.constants =  constants;
    this.transactionPool = transactionPool;
  }  
}

class ConfigurationResponse{
  data: ConfigurationData;

  constructor(data: ConfigurationData){
    this.data = data;
  }
}

const fetchAuctionsEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(AuctionActions.AUCTIONS_LOAD).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { query },
      } = action as AuctionsLoadActionType;          

      return defer(() =>
        connection(stateBaseUrl!)
          .NFTExchangeApi('auctions')
          .getAllAuctions()          
      ).pipe(
        map(({ body: { data, errors } }) => {
          if (errors) {
            return AuctionsLoadErrorAction(errors);
          }
          const q = query || {
            page: 1,
            limit: 100,
          };
          return AuctionsLoadSuccessAction(q, data, data.length < q.limit!);
        }),
        catchError((err) => of(AuctionsLoadErrorAction(err)))
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
                /*minimumIncrement,*/
                finalBiddingDate,
                cardId,
                /*recipientId,*/
                passphrase,
                txUuid
            },
        } = action as StartAuctionActionType;              
    
/*
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
            */
        /*
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
        */
        console.log("Passing test 1.");

        return forkJoin([
            fromFetch(`${stateBaseUrl}/api/node/configuration`),
            defer(() => connection(stateBaseUrl!).api("blocks").last()),            
        ]).pipe(  
          switchMap(([confResponse, blockResponse]) => {
            
            console.log("Passing test 2");

            if (!confResponse.ok) {
              return of(StartAuctionErrorAction({name:"Error", message:"Error reading node configuration"}));              
            }
            if (blockResponse?.body?.errors) {
              return of(StartAuctionErrorAction(blockResponse?.body?.errors));
            }

            console.log("Passing test 3");

            // const conf = confResponse.json() as unknown as ConfigurationResponse;         
            // const blockTime = conf.data.constants.blocktime;
            let blockTime = 5;

            console.log(JSON.stringify(confResponse));

            confResponse.json().then((body) => blockTime=body?.data?.constants?.blocktime)
            const currentBlock = blockResponse.body?.data?.height;

            console.log("Passing test 4");
            const now = new Date().getTime();
            const fbd = new Date(finalBiddingDate.replaceAll('-','/')).getTime();
            const diffSeconds = Math.abs(fbd - now) / 1000;
            const addedHeight = currentBlock + Math.ceil(diffSeconds/blockTime);

            console.log(blockTime + "   " + now + "   " +  fbd + "   " + diffSeconds + "   " + currentBlock + "   " + addedHeight);

            // For debug purposes:
            // return of(StartAuctionErrorAction({name:"Test", message:"Testing exit"}));

            const nextNonce = CryptoUtils.getWalletNextNonce();
            Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAuctionTransaction);   
            const transaction = new Builders.NFTAuctionBuilder()
            .NFTAuctionAsset({
                startAmount: Utils.BigNumber.make(minimumBid),                
                expiration: {
                    blockHeight: addedHeight,
                },
                nftIds: [cardId],
            }) 
            //.fee("0")                   
            .nonce((nextNonce==="1")?"2":nextNonce)
            .sign(passphrase);
            
            return defer(() => 
              connection(stateBaseUrl!).api("transactions").create({ transactions: [transaction.getStruct()] }))
            .pipe(              
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
              catchError((err) => of(StartAuctionErrorAction(err)))
            );               
          }),
          catchError((err) => of(StartAuctionErrorAction(err)))
        );
    })
  );

  const cancelAuctionEpic: RootEpic = (
    action$,
    state$,
    { connection }
  ) =>  
  action$.ofType(AuctionActions.CANCEL_AUCTION).pipe(    
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
        const {
            payload: {             
                auctionId,
                pubKey,
                passphrase,
                txUuid
            },
        } = action as CancelAuctionActionType;                      
        
        return defer(() =>
          connection(stateBaseUrl!).api("wallets").get(pubKey)
        ).pipe(
           switchMap(({ body: { data, errors } }: ApiResponse<Wallet>) => {
                console.log(JSON.stringify(data, null, 4));
                console.log(JSON.stringify(errors, null, 4));
                if (errors){
                  return of(CancelAuctionErrorAction({name:"Error getting wallet", message: errors.message}));
                }
                // return of(CancelAuctionSuccessAction(txUuid));                              

                Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAuctionCancelTransaction);   
                const transaction = new Builders.NFTAuctionCancelBuilder()
                    .NFTAuctionCancelAsset({
                        auctionId: auctionId,
                    })
                    //.fee("0")
                    .nonce(CryptoUtils.getWalletNextNonce(data))
                    .sign(passphrase);

                return defer(() =>
                  connection(stateBaseUrl!).api("transactions").create({ transactions: [transaction.getStruct()] })
                ).pipe(       
                  switchMap(
                    ({ body: { data, errors } }: ApiResponse<CreateTransactionApiResponse>) => {
                      console.log(JSON.stringify(data, null, 4));
                      console.log(JSON.stringify(errors, null, 4));
                      const [accepted] = data.accept;
                      if (!!accepted) {                                                
                        return merge(
                          of(CancelAuctionSuccessAction(accepted)),
                          of(TransactionWaitForConfirmAction(txUuid, accepted))
                        );                        
                      }
                      const [invalid] = data.invalid;
                      const err = errors[invalid].message;
                      return of(CancelAuctionErrorAction(err));                     
                    }
                  ),
                  catchError((err) => of(CancelAuctionErrorAction(err)))
                ); 
                              
        }),
        catchError((err) => of(CancelAuctionErrorAction(err))
      )    
    );         
   })
  );


const epics = [fetchAuctionsEpic, startAuctionEpic, cancelAuctionEpic];

export default epics;