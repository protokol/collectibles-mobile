import { combineReducers, ReducersMapObject } from 'redux';
import { RootState } from '../types';
import app from './app';
import assetClaim from './asset-claim';
import startAuction from './auctions';
import collections from './collections';
import cardsOnAuction from './collections';
import network from './network';
import transaction from './transaction';
import wallets from './wallets';

export default combineReducers<RootState>({
  app,
  network,
  assetClaim,
  startAuction,
  transaction,
  collections,
  cardsOnAuction,
  wallets,
} as ReducersMapObject<RootState>);
