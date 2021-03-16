import { defer, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Wallet, ApiResponse } from '@arkecosystem/client';
import connection from '../services/protokol-connection';

const getWallet = (
  baseUrl: string,
  addressOrPublicKey: string
): Observable<Wallet | undefined> =>
  defer(() => connection(baseUrl).api('wallets').get(addressOrPublicKey)).pipe(
    map<ApiResponse<Wallet>, Wallet>((response) => response?.body?.data),
    catchError((err) => {
      console.warn(err);
      return of(undefined);
    })
  );

export { getWallet };
