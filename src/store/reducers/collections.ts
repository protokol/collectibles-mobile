import { Reducer } from 'redux';
import { BaseResourcesTypes } from '@protokol/client';
import {
  COLLECTIONS_ACTION_TYPES,
  CollectionsActions,
  CollectiblesLoadSuccessActionType,
} from '../actions/collections';

export interface CollectionsState {
  isLoading: boolean;
  isError: boolean;
  isLastPage: boolean;
  error?: Error;
  query?: BaseResourcesTypes.AllAssetsQuery;
  assets: BaseResourcesTypes.Assets[][];
}

const initialState: CollectionsState = {
  isLastPage: false,
  isLoading: false,
  isError: false,
  assets: [],
};

const reducer: Reducer<CollectionsState, COLLECTIONS_ACTION_TYPES> = (
  state = initialState,
  action
) => {
  const { type } = action;

  switch (type) {
    case CollectionsActions.COLLECTIBLES_LOAD:
    case CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case CollectionsActions.COLLECTIBLES_LOAD_SUCCESS: {
      const {
        payload: { assets, query, isLastPage },
      } = action as CollectiblesLoadSuccessActionType;
      const { page } = query;
      return {
        ...state,
        isLoading: false,
        query,
        assets: [          
          ...state.assets.slice(0, page! - 1),
          assets,
          ...state.assets.slice(page!),
        ],
        isLastPage,
        isError: false,
        error: undefined,
      };
    }
    case CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD_SUCCESS: {
      const {
        payload: { assets, query, isLastPage },
      } = action as CollectiblesLoadSuccessActionType;
      return {
        ...state,
        isLoading: false,
        query,
        assets: [assets],
        isLastPage,
        isError: false,
        error: undefined,
      };
    }
    case CollectionsActions.COLLECTIBLES_LOAD_ERROR:
    case CollectionsActions.COLLECTIBLES_ON_AUCTION_LOAD_ERROR: {
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
