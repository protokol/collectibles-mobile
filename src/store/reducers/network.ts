import {NETWORK_ACTION_TYPES, NetworkActions} from "../actions/network";
import {Reducer} from "redux";
import {NodeCryptoConfiguration} from "@arkecosystem/client/dist/resourcesTypes/node";

export interface NetworkState {
    isLoading: boolean;
    nodeCryptoConfiguration?: NodeCryptoConfiguration
}

const initialState: NetworkState = {
    isLoading: false
}

const reducer: Reducer<NetworkState, NETWORK_ACTION_TYPES> = (state = initialState, action) => {
    const {type} = action;

    switch (type) {
        case NetworkActions.LOAD_NETWORK_CONFIGURATION: {
            return {
                ...state,
                isLoading: true
            }
        }
        case NetworkActions.NETWORK_CONFIGURATION_SUCCESS: {
            const {payload: {nodeCryptoConfiguration}} = action;
            return {
                ...state,
                isLoading: false,
                nodeCryptoConfiguration
            }
        }
        default:
            return state;
    }
}

export default reducer;