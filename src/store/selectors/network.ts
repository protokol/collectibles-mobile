import { RootState } from '../types';

export const nodeCryptoConfigurationSelector = (state: RootState) =>
  state.network.nodeCryptoConfiguration;
