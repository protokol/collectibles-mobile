import { combineReducers } from 'redux';
import { RootState } from '../types';
import app from './app';
import assetClaim from './asset-claim';
import network from './network';
import transaction from './transaction';

export default combineReducers<RootState>({
  app,
  network,
  assetClaim,
  transaction,
});
