import { defer, merge, of, forkJoin } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
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

        return forkJoin([
            fromFetch(`${stateBaseUrl}/api/node/configuration`),
            defer(() => connection(stateBaseUrl!).api("blocks").last()),            
        ]).pipe(  
          switchMap(([confResponse, blockResponse]) => {
            
            if (!confResponse.ok) {
              return of(StartAuctionErrorAction({name:"Error", message:"Error reading node configuration"}));              
            }
            if (blockResponse?.body?.errors) {
              return of(StartAuctionErrorAction(blockResponse?.body?.errors));
            }
            const conf = confResponse.json() as unknown as ConfigurationResponse;         
            const blockTime = conf.data.constants.blocktime;
            const currentBlock = blockResponse.body.data.height;

            const now = new Date().getTime();
            const fbd = new Date(finalBiddingDate.replaceAll('-','/')).getTime();
            const diffSeconds = (fbd - now) / 1000;
            const addedHeight = currentBlock + Math.ceil(diffSeconds/blockTime);

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
            .nonce(CryptoUtils.getWalletNextNonce())
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

const epics = [fetchAuctionsEpic, startAuctionEpic];

export default epics;