import { Reducer } from 'redux';
import { ExchangeResourcesTypes } from '@protokol/client';
import {
  AuctionActions,
  AUCTION_ACTION_TYPES,
} from '../actions/auctions';

export interface AuctionState {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  txId?: string;
  auctions?: ExchangeResourcesTypes.Auctions;
}

const initialState: AuctionState = {
  isLoading: false,
  isError: false,
};

const reducer: Reducer<AuctionState, AUCTION_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case AuctionActions.START_AUCTION: {
      return {
        ...initialState,
        isLoading: true,
      };
    }
    case AuctionActions.START_AUCTION_SUCCESS: {
      const {
        payload: { txId },
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: false,
        txId,
      };
    }
    case AuctionActions.START_AUCTION_ERROR: {
      const {
        payload: { error },
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };
    }
    case AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD: {
      return {
        ...initialState,
        isLoading: true,
      };
    }
    case AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS: {
      const {
        payload: { auctions },
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: false,
        auctions: auctions
      };
    }
    case AuctionActions.COLLECTIBLES_ON_AUCTION_LOAD_ERROR: {
      const {
        payload: { error },
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };
    }
    default:
      return state;
  }
};

export default reducer;