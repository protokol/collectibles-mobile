import { RootState } from '../types';

export const collectionSelector = ({ collections }: RootState) => collections;
export const cardsOnAuctionSelector = ({ cardsOnAuction }: RootState) => cardsOnAuction;

