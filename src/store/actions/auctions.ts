import { Action } from 'redux';
import { BaseResourcesTypes, ExchangeResourcesTypes } from '@protokol/client';

// Actions
enum AuctionActions {
  START_AUCTION = '@Auctions/START_AUCTION',
  START_AUCTION_SUCCESS = '@Auctions/START_AUCTION_SUCCESS',
  START_AUCTION_ERROR = '@Auctions/START_AUCTION_ERROR',
  COLLECTIBLES_ON_AUCTION_LOAD = '@Collections/COLLECTIBLES_ON_AUCTION_LOAD',
  COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS = '@Collections/COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS',
  COLLECTIBLES_ON_AUCTION_LOAD_ERROR = '@Collections/COLLECTIBLES_ON_AUCTION_LOAD_ERROR',
}

export interface StartAuctionActionType
  extends Action<AuctionActions.START_AUCTION> {
  payload: {
    minimumBid: number;
    minimumIncrement: number;
    finalBiddingDate: string;
    cardId: string;
    recipientId: string;
    passphrase: string;
    txUuid: string;
  };
}

export interface StartAuctionSuccessActionType
  extends Action<AuctionActions.START_AUCTION_SUCCESS> {
  payload: {
    txId: string;
  };
}

export interface StartAuctionErrorActionType
  extends Action<AuctionActions.START_AUCTION_ERROR> {
  payload: {
    error: Error;
  };
}

export interface CollectiblesOnAuctionLoadActionType
  extends Action<AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD> {
  payload: {
    body?: ExchangeResourcesTypes.SearchAuctionsApiBody,
    query?: ExchangeResourcesTypes.SearchAuctionsApiQuery,
  };
}

export interface CollectiblesOnAuctionLoadSuccessActionType
  extends Action<AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS> {
  payload: {
    body: ExchangeResourcesTypes.SearchAuctionsApiBody,
    auctions: ExchangeResourcesTypes.Auctions[],
    isLastPage: boolean;
  };
}

export interface CollectiblesOnAuctionLoadErrorActionType
  extends Action<AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD_ERROR> {
  payload: {
    error: Error;
  };
}

// Action creators
const StartAuctionAction = (
  minimumBid: number,
  minimumIncrement: number,
  finalBiddingDate: string,
  cardId: string,
  recipientId: string,
  passphrase: string,
  txUuid: string
): StartAuctionActionType => ({
  type: AuctionActions.START_AUCTION,
  payload: {
    minimumBid,
    minimumIncrement,
    finalBiddingDate,
    cardId,
    recipientId,
    passphrase,
    txUuid,
  },
});

const StartAuctionSuccessAction = (
  txId: string
): StartAuctionSuccessActionType => ({
  type: AuctionActions.START_AUCTION_SUCCESS,
  payload: {
    txId,
  },
});

const StartAuctionErrorAction = (error: Error): StartAuctionErrorActionType => ({
  type: AuctionActions.START_AUCTION_ERROR,
  payload: {
    error,
  },
});

const CollectiblesOnAuctionLoadAction = (
  body?: ExchangeResourcesTypes.SearchAuctionsApiBody,
  query?: ExchangeResourcesTypes.SearchAuctionsApiQuery
): CollectiblesOnAuctionLoadActionType => ({
  type: AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD,
  payload: {
    body,
    query,
  },
});

const CollectiblesOnAuctionLoadSuccessAction = (
  body: ExchangeResourcesTypes.SearchAuctionsApiBody,
  auctions: ExchangeResourcesTypes.Auctions[],
  isLastPage = false
): CollectiblesOnAuctionLoadSuccessActionType => ({
  type: AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS,
  payload: {
    body,
    auctions,
    isLastPage,
  },
});

const CollectiblesOnAuctionLoadErrorAction = (
  error: Error
): CollectiblesOnAuctionLoadErrorActionType => ({
  type: AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD_ERROR,
  payload: {
    error,
  },
});

export type AUCTION_ACTION_TYPES = StartAuctionActionType &
  StartAuctionSuccessActionType &
  StartAuctionErrorActionType & 
  CollectiblesOnAuctionLoadActionType &
  CollectiblesOnAuctionLoadSuccessActionType &
  CollectiblesOnAuctionLoadErrorActionType
  ;

export {
  AuctionActions,
  StartAuctionAction,
  StartAuctionSuccessAction,
  StartAuctionErrorAction,
  CollectiblesOnAuctionLoadAction,
  CollectiblesOnAuctionLoadSuccessAction,
  CollectiblesOnAuctionLoadErrorAction
};