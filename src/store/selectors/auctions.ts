import { RootState } from '../types';

export const startAuctionSelector = ({ startAuction }: RootState) => startAuction;
export const cardsOnAuctionSelector = ({ cardsOnAuction }: RootState) => cardsOnAuction;
