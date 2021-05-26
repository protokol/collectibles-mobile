import { Action } from 'redux';
import { ExchangeResourcesTypes } from '@protokol/client';

// Actions
enum AuctionActions {
  AUCTIONS_LOAD = '@Auctions/AUCTIONS_LOAD',
  AUCTIONS_LOAD_SUCCESS = '@Auctions/AUCTIONS_LOAD_SUCCESS',
  AUCTIONS_LOAD_ERROR = '@Auctions/AUCTIONS_LOAD_ERROR',  
  START_AUCTION = '@Auctions/START_AUCTION',
  START_AUCTION_SUCCESS = '@Auctions/START_AUCTION_SUCCESS',
  START_AUCTION_ERROR = '@Auctions/START_AUCTION_ERROR',  
  CANCEL_AUCTION = '@Auctions/CANCEL_AUCTION',
  CANCEL_AUCTION_SUCCESS = '@Auctions/CANCEL_AUCTION_SUCCESS',
  CANCEL_AUCTION_ERROR = '@Auctions/CANCEL_AUCTION_ERROR',  
  PLACE_BID = '@Auctions/PLACE_BID_AUCTION',
  PLACE_BID_SUCCESS = '@Auctions/PLACE_BID_SUCCESS',
  PLACE_BID_ERROR = '@Auctions/PLACE_BID_ERROR',  
}

//Start an Auction
export interface StartAuctionActionType
  extends Action<AuctionActions.START_AUCTION> {
  payload: {
    minimumBid: number;
    minimumIncrement: number;
    finalBiddingDate: string;
    cardId: string;
    recipientId: string;
    pubKey: string;
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

//Cancel an Auction
export interface CancelAuctionActionType
  extends Action<AuctionActions.CANCEL_AUCTION> {
  payload: {
    auctionId: string;
    pubKey: string;
    passphrase: string;
    txUuid: string;
  };
}

export interface CancelAuctionSuccessActionType
  extends Action<AuctionActions.CANCEL_AUCTION_SUCCESS> {
  payload: {
    txId: string;
  };
}

export interface CancelAuctionErrorActionType
  extends Action<AuctionActions.CANCEL_AUCTION_ERROR> {
  payload: {
    error: Error;
  };
}

//Load Auctions
export interface AuctionsLoadActionType
  extends Action<AuctionActions.AUCTIONS_LOAD> {
  payload: {
    query?: ExchangeResourcesTypes.AllAuctionsQuery;
    pubKey: string;
  };
}

export interface AuctionsLoadSuccessActionType
  extends Action<AuctionActions.AUCTIONS_LOAD_SUCCESS> {
  payload: {
    query: ExchangeResourcesTypes.AllAuctionsQuery;
    assets: ExchangeResourcesTypes.Auctions[];
    isLastPage: boolean;
  };
}

export interface AuctionsLoadErrorActionType
  extends Action<AuctionActions.AUCTIONS_LOAD_ERROR> {
  payload: {
    error: Error;
  };
}

//Place new bid
export interface PlaceBidActionType
  extends Action<AuctionActions.PLACE_BID> {
  payload: {
    auctionId: string;
    bidAmount: number;
    pubKey: string;
    passphrase: string;
    txUuid: string;
  };
}

export interface PlaceBidSuccessActionType
  extends Action<AuctionActions.PLACE_BID_SUCCESS> {
  payload: {
    txId: string;
  };
}

export interface PlaceBidErrorActionType
  extends Action<AuctionActions.PLACE_BID_ERROR> {
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
  pubKey: string,
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
    pubKey,
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

const CancelAuctionAction = (
  auctionId: string,
  pubKey: string,
  passphrase: string,
  txUuid: string
): CancelAuctionActionType => ({
  type: AuctionActions.CANCEL_AUCTION,
  payload: {
    auctionId,
    pubKey,
    passphrase,
    txUuid,
  },
});

const CancelAuctionSuccessAction = (
  txId: string
): CancelAuctionSuccessActionType => ({
  type: AuctionActions.CANCEL_AUCTION_SUCCESS,
  payload: {
    txId,
  },
});

const CancelAuctionErrorAction = (error: Error): CancelAuctionErrorActionType => ({
  type: AuctionActions.CANCEL_AUCTION_ERROR,
  payload: {
    error,
  },
});



const AuctionsLoadAction = (
  pubKey: string,
  query?: ExchangeResourcesTypes.AllAuctionsQuery
): AuctionsLoadActionType => ({
  type: AuctionActions.AUCTIONS_LOAD,
  payload: {
    query,
    pubKey,
  },
});

const AuctionsLoadSuccessAction = (
  query: ExchangeResourcesTypes.AllAuctionsQuery,
  assets: ExchangeResourcesTypes.Auctions[],
  isLastPage = false
): AuctionsLoadSuccessActionType => ({
  type: AuctionActions.AUCTIONS_LOAD_SUCCESS,
  payload: {
    query,
    assets,
    isLastPage,
  },
});

const AuctionsLoadErrorAction = (
  error: Error
): AuctionsLoadErrorActionType => ({
  type: AuctionActions.AUCTIONS_LOAD_ERROR,
  payload: {
    error,
  },
});

const PlaceBidAction = (
  auctionId: string,
  bidAmount: number,
  pubKey: string,
  passphrase: string,
  txUuid: string
): PlaceBidActionType => ({
  type: AuctionActions.PLACE_BID,
  payload: {
    auctionId,
    bidAmount,
    pubKey,
    passphrase,
    txUuid,
  },
});

const PlaceBidSuccessAction = (
  txId: string
): PlaceBidSuccessActionType => ({
  type: AuctionActions.PLACE_BID_SUCCESS,
  payload: {
    txId,
  },
});

const PlaceBidErrorAction = (error: Error): PlaceBidErrorActionType => ({
  type: AuctionActions.PLACE_BID_ERROR,
  payload: {
    error,
  },
});

export type AUCTION_ACTION_TYPES = AuctionsLoadActionType &
  AuctionsLoadSuccessActionType &
  AuctionsLoadErrorActionType & 
  StartAuctionActionType &
  StartAuctionSuccessActionType &
  StartAuctionErrorActionType &
  CancelAuctionActionType &
  CancelAuctionSuccessActionType &
  CancelAuctionErrorActionType &
  PlaceBidActionType &
  PlaceBidSuccessActionType &
  PlaceBidErrorActionType
  ;

export {
  AuctionActions,
  StartAuctionAction,
  StartAuctionSuccessAction,
  StartAuctionErrorAction,
  PlaceBidAction,
  PlaceBidSuccessAction,
  PlaceBidErrorAction,
  CancelAuctionAction,
  CancelAuctionSuccessAction,
  CancelAuctionErrorAction,  
  AuctionsLoadAction,
  AuctionsLoadSuccessAction,
  AuctionsLoadErrorAction,  
};