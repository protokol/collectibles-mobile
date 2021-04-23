import { Action } from 'redux';
import { BaseResourcesTypes } from '@protokol/client';

// Actions
enum CollectionsActions {
  COLLECTIBLES_LOAD = '@Collections/COLLECTIBLES_LOAD',
  COLLECTIBLES_LOAD_SUCCESS = '@Collections/COLLECTIBLES_LOAD_SUCCESS',
  COLLECTIBLES_LOAD_ERROR = '@Collections/COLLECTIBLES_LOAD_ERROR',
}

export interface CollectiblesLoadActionType
  extends Action<CollectionsActions.COLLECTIBLES_LOAD> {
  payload: {
    query?: BaseResourcesTypes.AllAssetsQuery;
    pubKey: string;
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

// Action creators
const CollectiblesLoadAction = (
  pubKey: string,
  query?: BaseResourcesTypes.AllAssetsQuery
): CollectiblesLoadActionType => ({
  type: CollectionsActions.COLLECTIBLES_LOAD,
  payload: {
    query,
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

export type COLLECTIONS_ACTION_TYPES = CollectiblesLoadActionType &
  CollectiblesLoadSuccessActionType &
  CollectiblesLoadErrorActionType;

export {
  CollectionsActions,
  CollectiblesLoadAction,
  CollectiblesLoadSuccessAction,
  CollectiblesLoadErrorAction,
};
