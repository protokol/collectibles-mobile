import { RootState } from '../types';

export const transactionsSelector = ({
  transaction: { transactions },
}: RootState) => transactions;
