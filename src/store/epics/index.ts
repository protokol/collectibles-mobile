import { combineEpics } from 'redux-observable';
import appEpics from './app';
import assetClaimEpics from './asset-claim';
import collectionsEpics from './collections';
import namespaceEpics from './namespace';
import networkEpics from './network';
import transactionEpics from './transaction';
import walletEpics from './wallets';

export default combineEpics(
  ...appEpics,
  ...networkEpics,
  ...assetClaimEpics,
  ...transactionEpics,
  ...namespaceEpics,
  ...collectionsEpics,
  ...walletEpics
);
