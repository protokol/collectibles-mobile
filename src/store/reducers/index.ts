import {combineReducers} from 'redux';
import network from './network';
import app from './app';
import {RootState} from "../types";

export default combineReducers<RootState>({
    app,
    network
});
