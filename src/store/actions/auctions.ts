import { Action } from 'redux';

// Actions
enum AuctionActions {
  START_AUCTION = '@Auctions/START_AUCTION',
  START_AUCTION_SUCCESS = '@Auctions/START_AUCTION_SUCCESS',
  START_AUCTION_ERROR = '@Auctions/START_AUCTION_ERROR',
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

export type AUCTION_ACTION_TYPES = StartAuctionActionType &
  StartAuctionSuccessActionType &
  StartAuctionErrorActionType;

export {
  AuctionActions,
  StartAuctionAction,
  StartAuctionSuccessAction,
  StartAuctionErrorAction,
};