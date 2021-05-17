import { defer, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
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
                      startAmount: auction.nftAuction.startAmount, 
                      finalBiddingDate: auction.nftAuction.expiration.blockHeight,
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
