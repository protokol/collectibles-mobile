import { combineEpics } from 'redux-observable';
import appEpics from './app';
import networkEpics from './network';

export default combineEpics(...appEpics, ...networkEpics);
