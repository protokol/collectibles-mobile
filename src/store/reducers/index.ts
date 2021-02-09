import { combineReducers } from 'redux';
import { RootState } from '../types';
import app from './app';
import network from './network';

export default combineReducers<RootState>({
  app,
  network,
});
