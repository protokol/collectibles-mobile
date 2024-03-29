import { Epic } from 'redux-observable';
import storage from '../utils/storage-service';
import {
  SetBaseUrlAppActionType,
  SetEncodedUserPrivateKeyActionType,
  SetUsernameActionType,
} from './actions/app';
import {
  ClaimAssetActionType,
  ClaimAssetErrorActionType,
  ClaimAssetSuccessActionType,
} from './actions/asset-claim';

import {
  StartAuctionActionType,
  StartAuctionSuccessActionType,
  StartAuctionErrorActionType,
  CancelAuctionActionType,
  CancelAuctionSuccessActionType,
  CancelAuctionErrorActionType,
  AuctionsLoadActionType,
  AuctionsLoadSuccessActionType,
  AuctionsLoadErrorActionType,
  PlaceBidActionType,
  PlaceBidSuccessActionType,
  PlaceBidErrorActionType,
  AcceptBidActionType,
  AcceptBidSuccessActionType,
  AcceptBidErrorActionType,
  CancelBidActionType,
  CancelBidSuccessActionType,
  CancelBidErrorActionType,
} from './actions/auctions';

import {
  CollectiblesLoadActionType,
  CollectiblesLoadErrorActionType,
  CollectiblesLoadSuccessActionType,
  CollectiblesOnAuctionLoadActionType,
  CollectiblesOnAuctionLoadErrorActionType,
  CollectiblesOnAuctionLoadSuccessActionType,  
} from './actions/collections';
import { NamespaceRegisterActionType } from './actions/namespace';
import {
  LoadNetworkConfigurationActionType,
  NetworkConfigurationErrorActionType,
  NetworkConfigurationSuccessActionType,
} from './actions/network';
import {
  TransactionConfirmErrorActionType,
  TransactionConfirmSuccessActionType,
  TransactionSubmitActionType,
  TransactionWaitForConfirmActionType,
} from './actions/transaction';
import {
  WalletsLoadActionType,
  WalletsLoadErrorActionType,
  WalletsLoadSuccessActionType,
  FaucetSendTokensActionType,
  FaucetSendTokensSuccessActionType,
  FaucetSendTokensErrorActionType,  
} from './actions/wallets';
import { AppState } from './reducers/app';
import { AssetClaimState } from './reducers/asset-claim';
import { AuctionState } from './reducers/auctions';
import { CollectionsState } from './reducers/collections';
import { NetworkState } from './reducers/network';
import { TransactionState } from './reducers/transaction';
import { WalletsState } from './reducers/wallets';
import { FaucetState } from './reducers/faucet';
import connection from './services/protokol-connection';

export type RootActions =
  | LoadNetworkConfigurationActionType
  | NetworkConfigurationSuccessActionType
  | NetworkConfigurationErrorActionType
  | SetBaseUrlAppActionType 
  | SetEncodedUserPrivateKeyActionType
  | SetUsernameActionType
  | ClaimAssetActionType
  | ClaimAssetSuccessActionType
  | ClaimAssetErrorActionType
  | StartAuctionActionType
  | StartAuctionSuccessActionType
  | StartAuctionErrorActionType
  | CancelAuctionActionType
  | CancelAuctionSuccessActionType
  | CancelAuctionErrorActionType  
  | AuctionsLoadActionType
  | AuctionsLoadSuccessActionType
  | AuctionsLoadErrorActionType
  | PlaceBidActionType
  | PlaceBidSuccessActionType
  | PlaceBidErrorActionType
  | AcceptBidActionType
  | AcceptBidSuccessActionType
  | AcceptBidErrorActionType
  | CancelBidActionType
  | CancelBidSuccessActionType
  | CancelBidErrorActionType
  | CollectiblesOnAuctionLoadActionType
  | CollectiblesOnAuctionLoadSuccessActionType
  | CollectiblesOnAuctionLoadErrorActionType
  | TransactionWaitForConfirmActionType
  | TransactionConfirmSuccessActionType
  | TransactionConfirmErrorActionType
  | TransactionSubmitActionType
  | NamespaceRegisterActionType
  | CollectiblesLoadActionType
  | CollectiblesLoadSuccessActionType
  | CollectiblesLoadErrorActionType
  | WalletsLoadActionType
  | WalletsLoadSuccessActionType
  | WalletsLoadErrorActionType
  | FaucetSendTokensActionType
  | FaucetSendTokensSuccessActionType
  | FaucetSendTokensErrorActionType;
export type RootState = {
  app: AppState;
  network: NetworkState;
  assetClaim: AssetClaimState;
  auctions: AuctionState;
  cardsOnAuction: CollectionsState;
  transaction: TransactionState;
  collections: CollectionsState;
  wallets: WalletsState;
  faucet: FaucetState;
};
export type RootDependencies = {
  connection: typeof connection;
  storage: ReturnType<typeof storage>;
};
export type RootEpic = Epic<
  RootActions,
  RootActions,
  RootState,
  RootDependencies
>;
