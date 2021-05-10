import { combineReducers, ReducersMapObject } from 'redux';
import { RootState } from '../types';
import app from './app';
import assetClaim from './asset-claim';
import startAuction from './auctions';
import cardsOnAuction from './auctions';
import collections from './collections';
import network from './network';
import transaction from './transaction';
import wallets from './wallets';

export default combineReducers<RootState>({
  app,
  network,
  assetClaim,
  startAuction,
  cardsOnAuction,
  transaction,
  collections,
  wallets,
} as ReducersMapObject<RootState>);
