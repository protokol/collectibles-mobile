import { RootState } from '../types';

export const baseUrlSelector = (state: RootState) => state.app.baseUrl;
export const encodedUserPrivateKeySelector = (state: RootState) =>
  state.app.userPrivateKey;
export const usernameSelector = (state: RootState) => state.app.username;
