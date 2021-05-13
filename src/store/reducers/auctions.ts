import { Reducer } from 'redux';
import { ExchangeResourcesTypes } from '@protokol/client';
import {
  AuctionActions,
  AUCTION_ACTION_TYPES,
  AuctionsLoadSuccessActionType,  
} from '../actions/auctions';

export interface AuctionState {
  isLastPage?: boolean,
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  txId?: string;
  query?: ExchangeResourcesTypes.AllAuctionsQuery;
  auctions?: ExchangeResourcesTypes.Auctions[][];
}

const initialState: AuctionState = {
  isLastPage: false,
  isLoading: false,
  isError: false,  
  auctions: [],
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
    case AuctionActions.AUCTIONS_LOAD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case AuctionActions.AUCTIONS_LOAD_SUCCESS: {
      const {
        payload: { assets, query, isLastPage },
      } = action as AuctionsLoadSuccessActionType;
      const { page } = query;
      return {
        ...state,
        isLoading: false,
        query,
        assets: [          
          ...state.auctions!.slice(0, page! - 1),
          assets,
          ...state.auctions!.slice(page!),
        ],
        isLastPage,
        isError: false,
        error: undefined,
      };
    }
    case AuctionActions.AUCTIONS_LOAD_ERROR: {
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