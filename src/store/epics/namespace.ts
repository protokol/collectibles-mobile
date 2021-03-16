import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { CryptoUtils } from '../../utils/crypto-utils';
import {
  NamespaceActions,
  NamespaceRegisterActionType,
} from '../actions/namespace';
import { TransactionSubmitAction } from '../actions/transaction';
import { baseUrlSelector } from '../selectors/app';
import { ArkCrypto, NameserviceCrypto } from '../services/crypto';
import { RootEpic } from '../types';
import { getWallet } from './helpers';

const namespaceRegisterEpic: RootEpic = (action$, state$) =>
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
        map((wallet) => {
          const transaction = new NameserviceCrypto.Builders.NameserviceBuilder()
            .Nameservice({
              name,
            })
            .nonce(CryptoUtils.getNextWalletNonce(wallet))
            .sign(passphrase);

          console.log('name', name);

          /*const transaction = new NftCrypto.Builders.NFTRegisterCollectionBuilder()
            .NFTRegisterCollectionAsset({
              name: 'Nascar Hero Cards',
              description: 'Nascar Hero Cards collection',
              maximumSupply: 10000,
              jsonSchema: {
                type: 'object',
                additionalProperties: false,
                required: [
                  'ipfsHashImageFront',
                  'issuedDate',
                  'issuedLocation',
                  'signed',
                ],
                properties: {
                  ipfsHashImageFront: {
                    type: 'string',
                    maxLength: 120,
                    minLength: 1,
                  },
                  ipfsHashImageBack: {
                    type: 'string',
                    maxLength: 120,
                    minLength: 1,
                  },
                  issuedDate: {
                    format: 'date',
                  },
                  issuedLocation: {
                    type: 'string',
                    maxLength: 255,
                    minLength: 1,
                  },
                  signed: {
                    type: 'boolean',
                  },
                  tags: {
                    type: 'array',
                    maxItems: 12,
                    minItems: 1,
                    additionalItems: false,
                    uniqueItems: true,
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            })
            .nonce(CryptoUtils.getNextWalletNonce(wallet))
            .sign(passphrase);*/

          return TransactionSubmitAction(txUuid, {
            transactions: [transaction.getStruct()],
          });
        })
      );
    })
  );

const epics = [namespaceRegisterEpic];

export default epics;
