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
        payload: { 
          pubKey, 
          includeInAuctionAssets,           
          query 
        },
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
          connection(stateBaseUrl!).api("blocks").last(),
          connection(stateBaseUrl!).NFTBaseApi('assets').walletAssets(pubKey, query),
          connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllAuctions(),
          connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllCanceledAuctions(),          
        ]).pipe(  
          map(([blockResponse, assetsResponse, allAuctionsResponse, cancelledAuctionsResponse]) => {
            if (blockResponse?.body?.errors) {
              return CollectiblesLoadErrorAction(blockResponse?.body?.errors);
            }                 
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
            
            //Cards on expired auctions (not cancelled) could be waiting for cancellation or accepting offer, is for that next two lines are commented and not filtering them
            //const currentBlock = blockResponse.body?.data?.height;     
            //activeAuctions = activeAuctions.filter(a => a.nftAuction.expiration.blockHeight < currentBlock); // Remove expired auctions from active auctions

            for(let asset of assetsResponse.body.data){
              const auctionIn = activeAuctions.findIndex(a => a.nftAuction.nftIds.find(as => as === asset.id));
              if (auctionIn === -1){                                
                //asset.attributes = { ...asset.attributes, 
                //  auctionId: activeAuctions[auctionIn].id
                //}                
                data.push(asset);
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
        payload: { pubKey, query, onlyOwnAuctions, onlyBiddedAuctions, includeExpiredAuctions },
      } = action as CollectiblesOnAuctionLoadActionType;

      return forkJoin([
          fromFetch(`${stateBaseUrl}/api/node/configuration`).pipe(mergeMap(response => response.json())),
          connection(stateBaseUrl!).api("blocks").last(),
          (onlyOwnAuctions)?connection(stateBaseUrl!).NFTExchangeApi("auctions").searchByAsset({senderPublicKey:pubKey}, undefined):connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllAuctions(),
          connection(stateBaseUrl!).NFTExchangeApi('auctions').getAllCanceledAuctions(),        
          (onlyOwnAuctions)?connection(stateBaseUrl!).NFTBaseApi('assets').walletAssets(pubKey, query):connection(stateBaseUrl!).NFTBaseApi('assets').all(),
          connection(stateBaseUrl!).NFTExchangeApi('bids').getAllBids(),
          connection(stateBaseUrl!).NFTExchangeApi('bids').getAllCanceledBids()
      ]).pipe(
        map(([confResponse, blockResponse, auctionsResponse, cancelledAuctionsResponse, assetsResponse, bidsResponse, cancelledBidsResponse]) => {
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
          if (cancelledBidsResponse?.body?.errors) {
            return CollectiblesOnAuctionLoadErrorAction(cancelledBidsResponse?.body?.errors);
          }          

          let data:BaseResourcesTypes.Assets[] = [];

          const blockTime = confResponse.data?.constants?.blocktime;
          const currentBlock = blockResponse.body?.data?.height;
          //const currentMs = blockResponse.body?.data?.timestamp?.unix * 1000;
          const nowMs = new Date().getTime();

          for(let auction of auctionsResponse.body.data){    
            if (cancelledAuctionsResponse.body.data.some(a => a.nftAuctionCancel.auctionId === auction.id)) continue;
            if (!onlyOwnAuctions && auction.senderPublicKey === pubKey) continue;
            if (!includeExpiredAuctions && auction.nftAuction.expiration.blockHeight < currentBlock) continue;
            if (onlyBiddedAuctions)
            {              
              const biddedIn = bidsResponse.body.data.findIndex(b => b.nftBid.auctionId === auction.id && b.senderPublicKey === pubKey);
              if (biddedIn === -1) continue;
            }            
            let bidsResp = bidsResponse.body.data.filter(b => b.nftBid.auctionId === auction.id);
            let allBids:ExchangeResourcesTypes.Bids[] = [];
            for(let bid of bidsResp){  
              if (cancelledBidsResponse.body.data.some(b => b.nftBidCancel.bidId === bid.id)) continue;
              allBids.push(bid);
            }                         
            //const allMyBids = bidsResponse.body.data.filter(b => b.nftBid.auctionId === auction.id && b.senderPublicKey === pubKey);
            const allMyBids = allBids.filter(b => b.senderPublicKey === pubKey);
            const maxBid = (allBids.length === 0) ? 0 : Number(allBids.reduce((prev, curr) => (Number(prev.nftBid.bidAmount)>Number(curr.nftBid.bidAmount))?prev:curr).nftBid.bidAmount);
            const myBid = (allMyBids.length === 0) ? 0 : Number(allMyBids.reduce((prev, curr) => (Number(prev.nftBid.bidAmount)>Number(curr.nftBid.bidAmount))?prev:curr).nftBid.bidAmount);
            const myBidId = (allMyBids.length === 0) ? 0 : allMyBids.reduce((prev, curr) => (Number(prev.nftBid.bidAmount)>Number(curr.nftBid.bidAmount))?prev:curr).id;
            const highestBidId = (allBids.length === 0) ? 0 : allBids.reduce((prev, curr) => (Number(prev.nftBid.bidAmount)>Number(curr.nftBid.bidAmount))?prev:curr).id;            
            for(let nftId of auction.nftAuction.nftIds){
              const asset = assetsResponse.body.data.find(a => a.id===nftId);
              if (asset === undefined) continue;
              const remainingBlocks = auction.nftAuction.expiration.blockHeight - currentBlock;
              const remainingMs = remainingBlocks * blockTime * 1000;
              //const seconds = Math.floor( (total/1000) % 60 );
              const minutes = Math.floor( (remainingMs/1000/60) % 60 );
              const hours = Math.floor( (remainingMs/(1000*60*60)) % 24 );
              const days = Math.floor( remainingMs/(1000*60*60*24) );                                    
              const humanExpirationDate = new Date(nowMs + remainingMs);

              /*
              // Debug block              
              const humanSystemDate = new Date(nowMs);
              const humanBlockDate = new Date(currentMs);              
              //console.log("currentBlock:" + currentBlock + " currentMs:" + currentMs);
              console.log("remainingBlocks:" + remainingBlocks + "  remainingMs:" + remainingMs);              
              console.log("humanSystemDate:" + humanSystemDate + "  humanBlockDate:" + humanBlockDate + "  humanExpirationDate:" + humanExpirationDate);
              console.log("humanSystemDate:" + humanSystemDate.toDateString() + "  humanBlockDate:" + humanBlockDate.toDateString() + " humanExpirationDate:" + humanExpirationDate.toDateString());
              console.log("timeRemaining:" + days + "d" + hours + "h" + minutes + "m");
              */
              asset.attributes = { ...asset.attributes, 
                  auctionId: auction.id,
                  minimumBid: auction.nftAuction.startAmount, 
                  finalBiddingDate: humanExpirationDate.toISOString(),
                  startedBiddingDate: auction.timestamp.human,
                  timeRemaining: days + "d" + hours + "h" + minutes + "m",
                  highestBidId: highestBidId,                  
                  currentBid: maxBid,
              };
              if (!onlyOwnAuctions){
                if (myBid > 0){
                  asset.attributes = { ...asset.attributes, 
                    yourBid: myBid,
                    bidId: myBidId,
                  };         
                }       
              }
              data.push(asset);       
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
