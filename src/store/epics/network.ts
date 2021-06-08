import { defer, forkJoin, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  LoadNetworkConfigurationAction,
  LoadNetworkConfigurationActionType,
  NetworkActions,
  NetworkConfigurationErrorAction,
  NetworkConfigurationSuccessAction,
  NetworkConfigurationSuccessActionType,
} from '../actions/network';
import { baseUrlSelector } from '../selectors/app';
import { ArkCrypto, NameserviceCrypto } from '../services/crypto';
import { RootEpic } from '../types';
import { Transactions as NFTTransactions } from "@protokol/nft-exchange-crypto";
import { Transactions } from "@arkecosystem/crypto";

const arkCryptoEpic: RootEpic = (action$) =>
  action$.ofType(NetworkActions.NETWORK_CONFIGURATION_SUCCESS).pipe(
    tap((action) => {
      const {
        payload: { nodeCryptoConfiguration, height },
      } = action as NetworkConfigurationSuccessActionType;

      const { network, exceptions, milestones } = nodeCryptoConfiguration;

      // Set network
      ArkCrypto.Managers.configManager.setConfig({
        network,
        milestones,
        genesisBlock: ArkCrypto.Managers.configManager.getPreset('devnet')
          .genesisBlock,
        exceptions,
      } as ArkCrypto.Interfaces.NetworkConfig);

      // Set height
      ArkCrypto.Managers.configManager.setHeight(height);

      // Register custom transaction types
      ArkCrypto.Transactions.TransactionRegistry.registerTransactionType(
        NameserviceCrypto.Transactions.NameserviceTransaction
      );
    }),
    ignoreElements()
  );

const fetchNetworkConfigurationEpic: RootEpic = (
  action$,
  state$,
  { connection }
) =>
  action$.ofType(NetworkActions.LOAD_NETWORK_CONFIGURATION).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, stateBaseUrl]) => {
      const { payload } = action as LoadNetworkConfigurationActionType;

      Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAcceptTradeTransaction);   
      Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAuctionCancelTransaction);   
      Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTBidTransaction);         
      Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTBidCancelTransaction);   
      Transactions.TransactionRegistry.registerTransactionType(NFTTransactions.NFTAuctionTransaction);     

      return forkJoin([
        defer(() =>
          connection(payload.baseUrl || stateBaseUrl!)
            .api('node')
            .crypto()
        ),
        defer(() =>
          connection(payload.baseUrl || stateBaseUrl!)
            .api('blocks')
            .last()
        ),
      ]).pipe(
        map(([cryptoResponse, blockResponse]) =>
          NetworkConfigurationSuccessAction(
            cryptoResponse?.body?.data,
            blockResponse?.body?.data?.height
          )
        ),
        catchError((err) => of(NetworkConfigurationErrorAction(err)))
      );
    })
  );

const onInitLoadNetworkEpic: RootEpic = (_, state$) =>
  state$.pipe(
    map(baseUrlSelector),
    distinctUntilChanged(),
    filter((baseUrl) => !!baseUrl),
    map(LoadNetworkConfigurationAction)
  );

const epics = [
  arkCryptoEpic,
  fetchNetworkConfigurationEpic,
  onInitLoadNetworkEpic,
];

export default epics;
