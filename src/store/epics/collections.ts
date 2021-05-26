import { defer, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
// eslint-disable-next-line
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
import { BaseResourcesTypes, ExchangeResourcesTypes } from '@protokol/client';

const fetchWalletCollectionsEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(CollectionsActions.COLLECTIBLES_LOAD).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const {
        payload: { pubKey, includeInAuctionAssets, query },
      } = action as CollectiblesLoadActionType;   

      if (includeInAuctionAssets){
        return defer(() =>
          connection(stateBaseUrl!).NFTBaseApi('assets').walletAssets(pubKey, query)
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
      }else{
        return forkJoin([
          connection(stateBaseUrl!).NFTBaseApi('assets').walletAssets(pubKey, query),
          connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllAuctions(),
          connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllCanceledAuctions()
        ]).pipe(  
          map(([assetsResponse, allAuctionsResponse, cancelledAuctionsResponse]) => {
            if (assetsResponse?.body?.errors) {
              return CollectiblesLoadErrorAction(assetsResponse?.body?.errors);
            }
            if (allAuctionsResponse?.body?.errors) {
              return CollectiblesLoadErrorAction(allAuctionsResponse?.body?.errors);
            }            
            if (cancelledAuctionsResponse?.body?.errors) {
              return CollectiblesLoadErrorAction(cancelledAuctionsResponse?.body?.errors);
            }            
            const q = query || {
              page: 1,
              limit: 100,
            };
            let data:BaseResourcesTypes.Assets[] = [];
            let activeAuctions:ExchangeResourcesTypes.Auctions[] = allAuctionsResponse.body.data.filter(a => cancelledAuctionsResponse.body.data.filter(ac => ac.nftAuctionCancel.auctionId === a.id));
            for(let asset of assetsResponse.body.data){
              const auctionIn = activeAuctions.findIndex(a => a.nftAuction.nftIds.find(as => as === asset.id));
              if (auctionIn !== -1){
                const assetPlus = asset;
                assetPlus.attributes = { ...assetPlus.attributes, 
                  auctionId: activeAuctions[auctionIn].id
                }
                data.push(assetPlus);
              }
            }
            return CollectiblesLoadSuccessAction(q, data, data.length < q.limit!);
          }),
          catchError((err) => of(CollectiblesLoadErrorAction(err)))
        );            
      }
    })
  );


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
          fromFetch(`${stateBaseUrl}/api/node/configuration`).pipe(mergeMap(response => response.json())),
          connection(stateBaseUrl!).api("blocks").last(),
          (ownAuctions)?connection(stateBaseUrl!).NFTExchangeApi("auctions").searchByAsset({senderPublicKey:pubKey}, undefined):connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllAuctions(),
          connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllCanceledAuctions(),        
          (ownAuctions)?connection(stateBaseUrl!).NFTBaseApi('assets').walletAssets(pubKey, query):connection(stateBaseUrl!).NFTBaseApi('assets').all(),
          connection(stateBaseUrl!).NFTExchangeApi('bids').getAllBids()
      ]).pipe(
        map(([confResponse, blockResponse, auctionsResponse, cancelledAuctionsResponse, assetsResponse, bidsResponse]) => {
          if (!confResponse.data) {
            return CollectiblesOnAuctionLoadErrorAction({name:"Error", message:"Error reading node configuration"});
          }
          if (blockResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(blockResponse?.body?.errors);
          }          
          if (auctionsResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(auctionsResponse?.body?.errors);
          }
          if (cancelledAuctionsResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(cancelledAuctionsResponse?.body?.errors);
          }          
          if (assetsResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(assetsResponse?.body?.errors);
          }
          if (bidsResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(bidsResponse?.body?.errors);
          }

          let data:BaseResourcesTypes.Assets[] = [];

          const blockTime = confResponse.data?.constants?.blocktime;
          const currentBlock = blockResponse.body?.data?.height;
          const now = new Date(currentBlock/blockTime).getTime();

          for(let auction of auctionsResponse.body.data){            
            //console.log(ownAuctions + "  " + auction.senderPublicKey + "  " + pubKey);
            if (cancelledAuctionsResponse.body.data.some(a => a.nftAuctionCancel.auctionId === auction.id)) continue;
            if (!ownAuctions && auction.senderPublicKey === pubKey) continue;
            // TODO const maxBid = bidsResponse.body.data.data
            const maxBid = 999;
            const myBid = 888; 

            for(let nftId of auction.nftAuction.nftIds){
              for(let asset of assetsResponse.body.data){                
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
                    currentBid: maxBid,
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
