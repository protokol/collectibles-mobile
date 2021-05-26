import { Action } from 'redux';
import { BaseResourcesTypes } from '@protokol/client';

// Actions
enum CollectionsActions {
  COLLECTIBLES_LOAD = '@Collections/COLLECTIBLES_LOAD',
  COLLECTIBLES_LOAD_SUCCESS = '@Collections/COLLECTIBLES_LOAD_SUCCESS',
  COLLECTIBLES_LOAD_ERROR = '@Collections/COLLECTIBLES_LOAD_ERROR',
  COLLECTIBLES_ON_AUCTION_LOAD = '@Collections/COLLECTIBLES_ON_AUCTION_LOAD',
  COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS = '@Collections/COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS',
  COLLECTIBLES_ON_AUCTION_LOAD_ERROR = '@Collections/COLLECTIBLES_ON_AUCTION_LOAD_ERROR',  
}

export interface CollectiblesLoadActionType
  extends Action<CollectionsActions.COLLECTIBLES_LOAD> {
  payload: {
    pubKey: string;
    includeInAuctionAssets: boolean;
    query?: BaseResourcesTypes.AllAssetsQuery;    
  };
}

export interface CollectiblesLoadSuccessActionType
  extends Action<CollectionsActions.COLLECTIBLES_LOAD_SUCCESS> {
  payload: {
    query: BaseResourcesTypes.AllAssetsQuery;
    assets: BaseResourcesTypes.Assets[];
    isLastPage: boolean;
  };
}

export interface CollectiblesLoadErrorActionType
  extends Action<CollectionsActions.COLLECTIBLES_LOAD_ERROR> {
  payload: {
    error: Error;
  };
}

export interface CollectiblesOnAuctionLoadActionType
  extends Action<CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD> {
    payload: {
      pubKey: string;
      ownAuctions: boolean;     
      biddedAuctions: boolean; 
      query?: BaseResourcesTypes.AllAssetsQuery;
    };
}

export interface CollectiblesOnAuctionLoadSuccessActionType
  extends Action<CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS> {
    payload: {
      query?: BaseResourcesTypes.AllAssetsQuery;
      assets: BaseResourcesTypes.Assets[];
      isLastPage: boolean;
    };
}

export interface CollectiblesOnAuctionLoadErrorActionType
  extends Action<CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD_ERROR> {
  payload: {
    error: Error;
  };
}

// Action creators
const CollectiblesLoadAction = (
  pubKey: string,
  includeInAuctionAssets: boolean,
  query?: BaseResourcesTypes.AllAssetsQuery,  
): CollectiblesLoadActionType => ({
  type: CollectionsActions.COLLECTIBLES_LOAD,
  payload: {
    query,
    includeInAuctionAssets,
    pubKey,    
  },
});

const CollectiblesLoadSuccessAction = (
  query: BaseResourcesTypes.AllAssetsQuery,
  assets: BaseResourcesTypes.Assets[],
  isLastPage = false
): CollectiblesLoadSuccessActionType => ({
  type: CollectionsActions.COLLECTIBLES_LOAD_SUCCESS,
  payload: {
    query,
    assets,
    isLastPage,
  },
});

const CollectiblesLoadErrorAction = (
  error: Error
): CollectiblesLoadErrorActionType => ({
  type: CollectionsActions.COLLECTIBLES_LOAD_ERROR,
  payload: {
    error,
  },
});

const CollectiblesOnAuctionLoadAction = (
  pubKey: string,
  ownAuctions: boolean,
  biddedAuctions: boolean,  
  query?: BaseResourcesTypes.AllAssetsQuery
): CollectiblesOnAuctionLoadActionType => ({
  type: CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD,
  payload: {
    query,
    ownAuctions,
    biddedAuctions,
    pubKey,
  },
});

const CollectiblesOnAuctionLoadSuccessAction = (  
  assets: BaseResourcesTypes.Assets[],
  query?: BaseResourcesTypes.AllAssetsQuery,
  isLastPage = false
): CollectiblesOnAuctionLoadSuccessActionType => ({
  type: CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS,
  payload: {
    assets,
    query,    
    isLastPage,
  },
});

const CollectiblesOnAuctionLoadErrorAction = (
  error: Error
): CollectiblesOnAuctionLoadErrorActionType => ({
  type: CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD_ERROR,
  payload: {
    error,
  },
});

export type COLLECTIONS_ACTION_TYPES = CollectiblesLoadActionType &
  CollectiblesLoadSuccessActionType &
  CollectiblesLoadErrorActionType & 
  CollectiblesOnAuctionLoadActionType &
  CollectiblesOnAuctionLoadSuccessActionType &
  CollectiblesOnAuctionLoadErrorActionType
  ;

export {
  CollectionsActions,
  CollectiblesLoadAction,
  CollectiblesLoadSuccessAction,
  CollectiblesLoadErrorAction,
  CollectiblesOnAuctionLoadAction,
  CollectiblesOnAuctionLoadSuccessAction,
  CollectiblesOnAuctionLoadErrorAction
};
