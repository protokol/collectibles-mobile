import { defer, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';
import {
  CollectionsActions,
  CollectiblesLoadActionType,
  CollectiblesLoadErrorAction,
  CollectiblesLoadSuccessAction,
  CollectiblesOnAuctionLoadActionType,
  CollectiblesOnAuctionLoadErrorAction,
  CollectiblesOnAuctionLoadSuccessAction,
} from '../actions/collections';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';
import { BaseResourcesTypes } from '@protokol/client';

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
/*
  const fetchCardsOnAuctionEpic: RootEpic = (
    action$,
    state$,
    { connection }
  ) =>
    action$.ofType(CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD).pipe(
      withLatestFrom(state$.pipe(map(baseUrlSelector))),
      switchMap(([action, stateBaseUrl]) => {        
        const {
          payload: { pubKey, query, ownAuctions },
        } = action as CollectiblesOnAuctionLoadActionType;
  
        return forkJoin([
          defer(() =>
            (ownAuctions)?connection(stateBaseUrl!).NFTExchangeApi("auctions").searchByAsset({senderPublicKey:pubKey}, undefined):
            connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllAuctions()
          ),
          defer(() =>
            connection(stateBaseUrl!).NFTBaseApi('assets').walletAssets(pubKey, query)
          ),
          fromFetch(`${stateBaseUrl}/api/node/configuration`),
          defer(() => connection(stateBaseUrl!).api("blocks").last())          
        ]).pipe(
          map(([auctionsResponse, assetsResponse, confResponse, blockResponse]) => {
            if (auctionsResponse?.body?.errors) {
              return CollectiblesOnAuctionLoadErrorAction(auctionsResponse?.body?.errors);
            }
            if (assetsResponse?.body?.errors) {
              return CollectiblesOnAuctionLoadErrorAction(assetsResponse?.body?.errors);
            }
            if (blockResponse?.body?.errors) {
              return CollectiblesOnAuctionLoadErrorAction(blockResponse?.body?.errors);
            }         
            
            // const conf = confResponse.json() as unknown as ConfigurationResponse;         
            // const blockTime = conf.data.constants.blocktime;          

            let blockTime = 5;            
            confResponse.json().then((body) => blockTime=body?.data?.constants?.blocktime)
            const currentBlock = blockResponse.body?.data?.height;                                  
            
            new Promise<BaseResourcesTypes.Assets[]>((resolve, reject) => {
              let data:BaseResourcesTypes.Assets[] = [];
              for(let auction of auctionsResponse.body.data){              
                connection(stateBaseUrl!).NFTExchangeApi('bids').searchByBid({auctionId:auction.id}).then((bids)=>{
                  if (bids?.body?.errors){
                    reject(bids?.body?.errors.message);                    
                  }
                  let currentBid = 0;
                  let myBid = 0;
                  if (bids?.body?.meta?.count > 0){
                    for(let bid of bids?.body?.data){     
                      const bAmt = Number(bid.nftBid.bidAmount);
                      if (bAmt > currentBid){
                        currentBid = bAmt;
                      }
                      if (!ownAuctions && bAmt > myBid && bid.senderPublicKey===pubKey){
                        myBid = bAmt
                      }
                    }
                  }              
                  for(let nftId of auction.nftAuction.nftIds){
                    for(let asset of assetsResponse.body.data){   
                      const now = new Date(currentBlock/blockTime).getTime();
                      const fbd = new Date(auction.nftAuction.expiration.blockHeight);                    
                      const fbdMilli = fbd.getTime()
                      const total = Math.abs(fbdMilli - now);
                      //const seconds = Math.floor( (total/1000) % 60 );
                      const minutes = Math.floor( (total/1000/60) % 60 );
                      const hours = Math.floor( (total/(1000*60*60)) % 24 );
                      const days = Math.floor( total/(1000*60*60*24) );
    
                      asset.attributes = { ...asset.attributes, 
                          minimumBid: auction.nftAuction.startAmount, 
                          finalBiddingDate: fbd.toISOString(),
                          timeRemaining: days + "d" + hours + "h" + minutes + "m",
                          currentBid: currentBid,
                      };
                      if (!ownAuctions){
                        asset.attributes = { ...asset.attributes, 
                          yourBid: myBid                        
                        };
                      }
                      if (nftId===asset.id){
                          data.push(asset);
                      }
                    }
                  }})
                }
                resolve(data);
            }).then((data)=>{
              return CollectiblesOnAuctionLoadSuccessAction(data, query, true);
            }).catch((errmessage)=> {
              return CollectiblesOnAuctionLoadErrorAction({name:"Error getting Assets", message:errmessage});
            });
            // return CollectiblesOnAuctionLoadErrorAction({name:"Error ASYNCING", message:"ASYNC ERROR"});
          }),
          catchError((err) => of(CollectiblesOnAuctionLoadErrorAction(err)))
        );
      })
  );  
*/

const fetchCardsOnAuctionEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {        
      const {
        payload: { pubKey, query, ownAuctions },
      } = action as CollectiblesOnAuctionLoadActionType;

      return forkJoin([
        defer(() =>
          (ownAuctions)?connection(stateBaseUrl!).NFTExchangeApi("auctions").searchByAsset({senderPublicKey:pubKey}, undefined):
          connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllAuctions()
        ),
        defer(() =>
          connection(stateBaseUrl!).NFTBaseApi('assets').walletAssets(pubKey, query)
        ),
      ]).pipe(
        map(([auctionsResponse, assetsResponse]) => {
          if (auctionsResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(auctionsResponse?.body?.errors);
          }
          if (assetsResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(assetsResponse?.body?.errors);
          }
          let data:BaseResourcesTypes.Assets[] = [];
          for(let auction of auctionsResponse.body.data){
            for(let nftId of auction.nftAuction.nftIds){
              for(let asset of assetsResponse.body.data){   
                 asset.attributes = { ...asset.attributes, 
                    auctionId: auction.id,
                    minimumBid: auction.nftAuction.startAmount, 
                    finalBiddingDate: "05/12/2022",
                    timeRemaining: "12d5h6m",
                    currentBid: 999,
                };
                if (!ownAuctions){
                  asset.attributes = { ...asset.attributes, 
                    yourBid: 888
                  };
                }
                if (nftId===asset.id){
                    data.push(asset);
                }
              }
            }
          }  
          return CollectiblesOnAuctionLoadSuccessAction(data, query, true);
        }),
        catchError((err) => of(CollectiblesOnAuctionLoadErrorAction(err)))
      );
    })
);  


const epics = [fetchWalletCollectionsEpic, fetchCardsOnAuctionEpic];

export default epics;
