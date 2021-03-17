import { Action } from 'redux';
import { BaseResourcesTypes } from '@protokol/client';

// Actions
enum CollectionsActions {
  COLLECTIONS_LOAD = '@Collections/COLLECTIONS_LOAD',
  COLLECTIONS_LOAD_SUCCESS = '@Collections/COLLECTIONS_LOAD_SUCCESS',
  COLLECTIONS_LOAD_ERROR = '@Collections/COLLECTIONS_LOAD_ERROR',
}

export interface CollectionsLoadActionType
  extends Action<CollectionsActions.COLLECTIONS_LOAD> {
  payload: {
    query?: BaseResourcesTypes.AllAssetsQuery;
    pubKey: string;
  };
}

export interface CollectionsLoadSuccessActionType
  extends Action<CollectionsActions.COLLECTIONS_LOAD_SUCCESS> {
  payload: {
    query: BaseResourcesTypes.AllAssetsQuery;
    assets: BaseResourcesTypes.Assets[];
    isLastPage: boolean;
  };
}

export interface CollectionsLoadErrorActionType
  extends Action<CollectionsActions.COLLECTIONS_LOAD_ERROR> {
  payload: {
    error: Error;
  };
}

// Action creators
const CollectionsLoadAction = (
  pubKey: string,
  query?: BaseResourcesTypes.AllAssetsQuery
): CollectionsLoadActionType => ({
  type: CollectionsActions.COLLECTIONS_LOAD,
  payload: {
    query,
    pubKey,
  },
});

const CollectionsLoadSuccessAction = (
  query: BaseResourcesTypes.AllAssetsQuery,
  assets: BaseResourcesTypes.Assets[],
  isLastPage = false
): CollectionsLoadSuccessActionType => ({
  type: CollectionsActions.COLLECTIONS_LOAD_SUCCESS,
  payload: {
    query,
    assets,
    isLastPage,
  },
});

const CollectionsLoadErrorAction = (
  error: Error
): CollectionsLoadErrorActionType => ({
  type: CollectionsActions.COLLECTIONS_LOAD_ERROR,
  payload: {
    error,
  },
});

export type COLLECTIONS_ACTION_TYPES = CollectionsLoadActionType &
  CollectionsLoadSuccessActionType &
  CollectionsLoadErrorActionType;

export {
  CollectionsActions,
  CollectionsLoadAction,
  CollectionsLoadSuccessAction,
  CollectionsLoadErrorAction,
};
