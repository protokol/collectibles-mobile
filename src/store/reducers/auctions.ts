import { Reducer } from 'redux';
import {
  AuctionActions,
  AUCTION_ACTION_TYPES,
} from '../actions/auctions';

export interface StartAuctionState {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  txId?: string;
}

const initialState: StartAuctionState = {
  isLoading: false,
  isError: false,
};

const reducer: Reducer<StartAuctionState, AUCTION_ACTION_TYPES> = (
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
    default:
      return state;
  }
};

export default reducer;