import { of, merge } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { StorageKeys } from '../../constants/storage';
import { CryptoUtils } from '../../utils/crypto-utils';
import { SetUsernameAction } from '../actions/app';
import {
  NamespaceActions,
  NamespaceRegisterActionType,
} from '../actions/namespace';
import { TransactionSubmitAction } from '../actions/transaction';
import { baseUrlSelector } from '../selectors/app';
import { ArkCrypto, NameserviceCrypto } from '../services/crypto';
import { RootEpic } from '../types';
import { getWallet } from './helpers';

const namespaceRegisterEpic: RootEpic = (action$, state$, { storage }) =>
  action$.ofType(NamespaceActions.NAMESPACE_REGISTER).pipe(
    withLatestFrom(state$.pipe(map(baseUrlSelector))),
    switchMap(([action, baseUrl]) => {
      const {
        payload: { name, txUuid, passphrase },
      } = action as NamespaceRegisterActionType;

      return getWallet(
        baseUrl!,
        ArkCrypto.Identities.PublicKey.fromPassphrase(passphrase)
      ).pipe(
        tap(() => storage.set(StorageKeys.USERNAME, name)),
        switchMap((wallet) => {
          const transaction = new NameserviceCrypto.Builders.NameserviceBuilder()
            .Nameservice({
              name,
            })
            .nonce(CryptoUtils.getWalletNextNonce(wallet))
            .sign(passphrase);

          return merge(
            of(
              TransactionSubmitAction(txUuid, {
                transactions: [transaction.getStruct()],
              })
            ),
            of(SetUsernameAction(name, true))
          );
        })
      );
    })
  );

const epics = [namespaceRegisterEpic];

export default epics;
