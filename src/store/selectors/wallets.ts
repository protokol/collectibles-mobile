import { RootState } from '../types';

export const walletsSelector = ({ wallets: { wallets } }: RootState) => wallets;
