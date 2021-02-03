import {
    LoadNetworkConfigurationActionType,
    NetworkActions,
    NetworkConfigurationErrorAction,
    NetworkConfigurationSuccessAction
} from "../actions/network";
import {catchError, map, switchMap, withLatestFrom} from "rxjs/operators";
import {defer, of} from "rxjs";
import {RootEpic} from "../types";
import {baseUrlSelector} from "../selectors/app";

const fetchUserEpic: RootEpic = (action$, state$, {connection}) =>
    action$
        .ofType(NetworkActions.LOAD_NETWORK_CONFIGURATION)
        .pipe(
            withLatestFrom(state$.pipe(map(baseUrlSelector))),
            switchMap(([action, stateBaseUrl]) => {
                    const {payload} = action as LoadNetworkConfigurationActionType;

                    return defer(() =>
                        connection(payload.baseUrl || stateBaseUrl!)
                            .api('node')
                            .crypto()
                    ).pipe(
                        map(response => NetworkConfigurationSuccessAction(response?.body?.data)),
                        catchError(err => of(NetworkConfigurationErrorAction(err)))
                    );
                }
            )
        )


export default [
    fetchUserEpic
];