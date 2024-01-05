import ICard from "./ICard";

export default interface ICardUtilities {
	shuffle: <T>(array: T[]) => T[];
	getKingdomSupplyCards: (cardSet: ICard[]) => ICard[];
	pickRandomCardsFromCardSet: (cardSet: ICard[], numberOfCards: number) => void;
	filterByNames: (cardSet: ICard[], names: string[]) => void;
	filterByNotNames: (cardSet: ICard[], names: string[]) => void;
	filterBySet: (cardSet: ICard[], set: ICard[]) => void;
	filterByTavern: (cardSet: ICard[]) => void;
	filterByVillagersAndCoffers: (cardSet: ICard[]) => void;
	filterByVillagers: (cardSet: ICard[]) => void;
	filterByCoffers: (cardSet: ICard[]) => void;
	filterByCardDraw: (cardSet: ICard[], cardDraw: number) => void;
	filterByCardDrawCount: (cardSet: ICard[], cardCount: number) => void;
	filterByGreaterThanActionCount: (cardSet: ICard[], actionCount: number) => void;
	filterByActionCount: (cardSet: ICard[], actionCount: number) => void;
	filterByTypes: (cardSet: ICard[], filterTypes: string[]) => void;
	filterByNotType: (cardSet: ICard[], filterTypes: string[]) => void;
	filterByCost: (cardSet: ICard[], cost: number) => void;
	filterByTrashCount: (cardSet: ICard[], trashCount: number) => void;
	filterByBuyCount: (cardSet: ICard[], buyCount: number) => void;
	filterSetByEverythingElse: (currentSet: ICard[]) => void;
	filterByExpansions: (cardSet: ICard[], sets: string[]) => void;
	filterByOtherCardSet: (cardSet: ICard[], otherSet: ICard[]) => void;
	sortByCost: (cardSet: ICard[]) => void;
	getDistinctArrayValues: <T>(array: T[]) => void;
	getDistinctCardTypes: (cardSet: ICard[]) => void;
	getCardsWithCostInSets: (sets: string[], cost: number) => void;
	getSelectedCards: (selectedCards: string[]) => void;
	fillCardProperties: (card: ICard) => void;
	getDistinctCardCosts: (cardSet: ICard[]) => void;
	getEventCards: () => void;
	getProjectCards: () => void;
	getLandmarkCards: () => void;
	getWayCards: () => void;	
}