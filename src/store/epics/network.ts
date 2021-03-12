import { defer, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  LoadNetworkConfigurationActionType,
  NetworkActions,
  NetworkConfigurationErrorAction,
  NetworkConfigurationSuccessAction,
} from '../actions/network';
import { baseUrlSelector } from '../selectors/app';
import { RootEpic } from '../types';

const fetchUserEpic: RootEpic = (action$, state$, { connection }) =>
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

const epics = [fetchUserEpic];

export default epics;
