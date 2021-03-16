import { defer, of } from 'rxjs';
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
import { ArkCrypto, NameserviceCrypto, NftCrypto } from '../services/crypto';
import { RootEpic } from '../types';

const arkCryptoEpic: RootEpic = (action$) =>
  action$.ofType(NetworkActions.NETWORK_CONFIGURATION_SUCCESS).pipe(
    tap((action) => {
      const {
        payload: { nodeCryptoConfiguration },
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
      ArkCrypto.Managers.configManager.setHeight(2);

      // Register custom transaction types
      ArkCrypto.Transactions.TransactionRegistry.registerTransactionType(
        NameserviceCrypto.Transactions.NameserviceTransaction
      );
      ArkCrypto.Transactions.TransactionRegistry.registerTransactionType(
        NftCrypto.Transactions.NFTRegisterCollectionTransaction
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

      return defer(() =>
        connection(payload.baseUrl || stateBaseUrl!)
          .api('node')
          .crypto()
      ).pipe(
        map((response) =>
          NetworkConfigurationSuccessAction(response?.body?.data)
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
