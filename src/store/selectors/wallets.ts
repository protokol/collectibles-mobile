import { RootState } from '../types';

export const walletsSelector = ({ wallets: { wallets } }: RootState) => wallets;
export const faucetSelector = ({ faucet: faucet }: RootState) => faucet;