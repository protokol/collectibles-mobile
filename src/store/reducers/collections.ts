import { Reducer } from 'redux';
import { BaseResourcesTypes } from '@protokol/client';
import {
  COLLECTIONS_ACTION_TYPES,
  CollectionsActions,
  CollectionsLoadSuccessActionType,
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
    case CollectionsActions.COLLECTIONS_LOAD: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case CollectionsActions.COLLECTIONS_LOAD_SUCCESS: {
      const {
        payload: { assets, query, isLastPage },
      } = action as CollectionsLoadSuccessActionType;
      const { page } = query;
      const indexPage = page!;
      return {
        ...state,
        isLoading: false,
        query,
        assets: [
          ...state.assets.slice(0, indexPage - 1),
          assets,
          ...state.assets.slice(indexPage),
        ],
        isLastPage,
        isError: false,
        error: undefined,
      };
    }
    case CollectionsActions.COLLECTIONS_LOAD_ERROR: {
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
