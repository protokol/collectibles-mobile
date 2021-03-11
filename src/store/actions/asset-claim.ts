import { Action } from 'redux';

// Actions
enum AssetClaimActions {
  CLAIM_ASSET = '@AssetClaim/CLAIM_ASSET',
  CLAIM_ASSET_SUCCESS = '@AssetClaim/CLAIM_ASSET_SUCCESS',
  CLAIM_ASSET_ERROR = '@AssetClaim/CLAIM_ASSET_ERROR',
}

export interface ClaimAssetActionType
  extends Action<AssetClaimActions.CLAIM_ASSET> {
  payload: {
    collectionId: string;
    recipientId: string;
    txUuid: string;
  };
}

export interface ClaimAssetSuccessActionType
  extends Action<AssetClaimActions.CLAIM_ASSET_SUCCESS> {
  payload: {
    txId: string;
  };
}

export interface ClaimAssetErrorActionType
  extends Action<AssetClaimActions.CLAIM_ASSET_ERROR> {
  payload: {
    error: Error;
  };
}

// Action creators
const ClaimAssetAction = (
  collectionId: string,
  recipientId: string,
  txUuid: string
): ClaimAssetActionType => ({
  type: AssetClaimActions.CLAIM_ASSET,
  payload: {
    collectionId,
    recipientId,
    txUuid,
  },
});

const ClaimAssetSuccessAction = (
  txId: string
): ClaimAssetSuccessActionType => ({
  type: AssetClaimActions.CLAIM_ASSET_SUCCESS,
  payload: {
    txId,
  },
});

const ClaimAssetErrorAction = (error: Error): ClaimAssetErrorActionType => ({
  type: AssetClaimActions.CLAIM_ASSET_ERROR,
  payload: {
    error,
  },
});

export type CLAIM_ASSET_ACTION_TYPES = ClaimAssetActionType &
  ClaimAssetSuccessActionType &
  ClaimAssetErrorActionType;

export {
  AssetClaimActions,
  ClaimAssetAction,
  ClaimAssetSuccessAction,
  ClaimAssetErrorAction,
};
