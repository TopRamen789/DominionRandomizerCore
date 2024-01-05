import _cards from './data/cards';
import ICard from './types/ICard';
import ICardUtilities from './types/ICardUtilities';

class CardUtilities implements ICardUtilities {
	constructor() { }
	
	shuffle<T>(array: T[]) {
		let currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}

	getKingdomSupplyCards(cardSet: ICard[]) {
		const eventCards = this.getEventCards();
		const projectCards = this.getProjectCards();
		const landmarkCards = this.getLandmarkCards();
		const wayCards  = this.getWayCards();
		const artifactCards = this.getArtifactCards();

		const nonKingdomCards = [...eventCards, ...projectCards, ...landmarkCards, ...wayCards, ...artifactCards];

		const filteredTypes = this.filterByNotType(
			cardSet.filter((c) => !nonKingdomCards.includes(c)),
			[
				"Ruins", 
				"Shelter", 
				"Hex", 
				"State", 
				"Boon", 
				"Heirloom", 
				"Prize", 
				"Zombie", 
				"Spirit"
			]
		);	

		const filteredByNames = this.filterByNotNames(
			filteredTypes, 
			[
				"Copper", 
				"Silver", 
				"Gold", 
				"Platinum", 
				"Estate", 
				"Duchy", 
				"Province", 
				"Colony", 
				"Curse",
				"Soldier",
				"Fugitive",
				"Disciple",
				"Teacher",
				"Treasure Hunter",
				"Warrior",
				"Hero",
				"Champion"
			]
		);

		const customTypeRules = this.filterByNotType(
			filteredByNames,
			["Castle"]
		);

		const customNameRules = this.filterByNotNames(
			customTypeRules,
			[
				"Island", 
				"Distant Lands", 
				"Silk Road", 
				"Feodum", 
				"Garden", 
				"Potion",
				"Mill"
			]
		);
		return customNameRules;
	}

	pickRandomCardsFromCardSet(cardSet: ICard[], numberOfCards: number) {
		let randomCards = [];
		while(randomCards.length < numberOfCards) {
			cardSet = this.shuffle(cardSet);
			randomCards.push(cardSet.pop());
		}
		return randomCards;
	}

	filterByNames(cardSet: ICard[], names: string[]) {
		return cardSet.filter((card) => {
			return names.includes(card.name);
		});
	}

	filterByNotNames(cardSet: ICard[], names: string[]) {
		return cardSet.filter((card) => {
			return !(names.includes(card.name));
		});
	}

	filterBySet(cardSet: ICard[], set: ICard[]) {
		let setNames = set.map(card => card.name);
		return this.filterByNotNames(cardSet, setNames);
	}

	filterByTavern(cardSet: ICard[]) {
		return cardSet.filter((card) => {
			return card.useTavern;
		});
	}

	filterByVillagersAndCoffers(cardSet: ICard[]) {
		return cardSet.filter((card) => {
			return card.useVillagers || card.useCoffers;
		});
	}

	filterByVillagers(cardSet: ICard[]) {
		return cardSet.filter((card) => {
			return card.useVillagers;
		});
	}

	filterByCoffers(cardSet: ICard[]) {
		return cardSet.filter((card) => {
			return card.useCoffers;
		})
	}

	filterByCardDraw(cardSet: ICard[], cardDraw: number) {
		return cardSet.filter((card) => {
			if(!card.cards) return false;
			return card.cards >= cardDraw;
		});
	}

	filterByCardDrawCount(cardSet: ICard[], cardCount: number) {
		return cardSet.filter((card) => {
			return card.cards == cardCount;
		});
	}

	filterByGreaterThanActionCount(cardSet: ICard[], actionCount: number) {
		return cardSet.filter((card) => {
			if(!card.actions) return false;
			return card.actions >= actionCount;
		});
	}

	filterByActionCount(cardSet: ICard[], actionCount: number) {
		return cardSet.filter((card) => {
			return card.actions == actionCount;
		});
	}

	filterByTypes(cardSet: ICard[], filterTypes: string[]) {
		return cardSet.filter((card) => {
			let types = card.types.split(" - ");
			return types.filter(type => filterTypes.includes(type)).length > 0;
		});
	}

	filterByNotType(cardSet: ICard[], filterTypes: string[]) {
		return cardSet.filter((card) => {
			const types = card.types
				.split(" - ")
				.filter(type => filterTypes.includes(type));
			return !(types.length > 0);
		});
	}

	filterByCost(cardSet: ICard[], cost: number) {
		return cardSet.filter((card) => {
			return card.cost === cost;
		});
	}

	filterByTrashCount(cardSet: ICard[], trashCount: number) {
		return cardSet.filter((card) => {
			if(!card.trash) return false;
			return card.trash >= trashCount;
		});
	}

	filterByBuyCount(cardSet: ICard[], buyCount: number) {
		return cardSet.filter((card) => {
			if(!card.buys) return false;
			return card.buys >= buyCount;
		});	
	}

	filterSetByEverythingElse(currentSet: ICard[]) {
		let biasedSet = currentSet.slice();
		let attackTypes = this.filterByTypes(currentSet, ['Attack']);
		biasedSet = biasedSet.filter(card => {
			return !attackTypes.includes(card);
		});
		let trashCount = this.filterByTrashCount(currentSet, 1);
		biasedSet = biasedSet.filter(card => {
			return !trashCount.includes(card);
		});
		let durationTypes = this.filterByTypes(currentSet, ['Duration']);
		biasedSet = biasedSet.filter(card => {
			return !durationTypes.includes(card);
		});
		let buyCount = this.filterByBuyCount(currentSet, 1);
		biasedSet = biasedSet.filter(card => {
			return !buyCount.includes(card);
		});
		let nightTypes = this.filterByTypes(currentSet, ['Night']);
		biasedSet = biasedSet.filter(card => {
			return !nightTypes.includes(card);
		});
		let tavern = this.filterByTavern(currentSet);
		biasedSet = biasedSet.filter(card => {
			return !tavern.includes(card);
		});
		let villagers = this.filterByVillagers(currentSet);
		biasedSet = biasedSet.filter(card => {
			return !villagers.includes(card);
		});
		let coffers = this.filterByCoffers(currentSet);
		biasedSet = biasedSet.filter(card => {
			return !coffers.includes(card);
		});
		return biasedSet;
	}

	filterByExpansions(cardSet: ICard[], sets: string[]) {
		return cardSet.filter((card) => {
			return sets.includes(card.set);
		});
	}

	filterByOtherCardSet(cardSet: ICard[], otherSet: ICard[]) {
		let names = otherSet.map(card => card.name);
		return cardSet.filter(card => !names.includes(card.name));
	}

	sortByCost(cardSet: ICard[]) {
		return cardSet.sort((a,b) => {
			if(a.cost && b.cost) {
				if(a.cost < b.cost)
					return -1;
				if(a.cost > b.cost)
					return 1;
			}
			return 0;
		});
	}

	getDistinctArrayValues<T>(array: T[]) {
		return array.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
	}

	getDistinctCardTypes(cardSet: ICard[]) {
		let types = cardSet
			.map(card => card.types.split(" - "))
			.reduce((acc, value) => {
				return acc.concat(value);
			}, []);
		return this.getDistinctArrayValues(types);
	}

	getCardsWithCostInSets(sets: string[], cost: number) {
		return _cards.filter(card => card.cost).filter((card) => {
			return card.cost === cost && sets.includes(card.set);
		});
	}

	getSelectedCards(selectedCards: string[]) {
		return _cards.filter((card) => {
			return selectedCards.includes(card.name);
		});
	}

	// // IDEA GET!
	// // So first, you need to fix the dual supply piles, where they have 2 differently named cards take up the same pile.
	// // You can fix this by having them display together all the time in the way the Dominion rules expect:
	// // One card type is pointing horizontally underneath the other card type.
	// buildCardSetUI(cardSet, cardsDiv) {
	// 	cardSet.forEach((card) => {
	// 		if(card == null || card.image == null)
	// 			return;
	// 		let image = Utilities.img();
	// 		image.alt = card.image;
	// 		image.src = card.image.indexOf("wiki") > -1 ? card.image : `src/cards/${card.image}`;
	// 		image.height = 200;
	// 		image.className = "card-thumbnail";
	// 		image.id = card.name;
	// 		let onclick = (currentCard) => {
	// 			// TODO: Clean this up....
	// 			let availableCards = validation.validateCardSet(_cards);
	// 			availableCards = this.filterByOtherCardSet(availableCards, cardSet);
	// 			availableCards = this.filterByCost(availableCards, currentCard.cost);
	// 			availableCards = this.shuffle(availableCards);
	// 			let namesToFilter = [currentCard.name];
	// 			namesToFilter = currentCard.topPile != null ? namesToFilter.concat([currentCard.topPile]) : namesToFilter;
	// 			namesToFilter = currentCard.bottomPile != null ? namesToFilter.concat([currentCard.bottomPile]) : namesToFilter;
	// 			availableCards = CardUtilities.filterByNotNames(availableCards, namesToFilter);
	// 			let newCard = availableCards.pop();
	// 			cardSet.splice(cardSet.map(c => c.name).indexOf(currentCard.name), 1);
	// 			cardSet.push(newCard);
	// 			let shouldRebuildCard = false;
	// 			if(currentCard.bottomPile != null || currentCard.topPile != null) {
	// 				let bottomPile = document.getElementById(currentCard?.bottomPile);
	// 				if(bottomPile != null) {
	// 					bottomPile.parentElement.remove();
	// 				} else {
	// 					document.getElementById(currentCard?.topPile).parentElement.remove();
	// 				}
	// 				let image = Utilities.img();
	// 				image.src = newCard.image;
	// 				image.height = 200;
	// 				image.id = newCard.name;
	// 				shouldRebuildCard = true;
	// 			}
	// 			if(newCard.bottomPile != null) {
	// 				cardsDiv.appendChild(this.buildSplitPileBottom(image, newCard, onclick));
	// 			} else if(newCard.topPile != null) {
	// 				document.getElementById(currentCard.name).remove();
	// 				cardsDiv.appendChild(this.buildSplitPileTop(image, newCard, onclick));
	// 			} else {
	// 				image.className = "card-thumbnail";
	// 				image.src = newCard.image;
	// 				image.onclick = () => { onclick.call(this, newCard); };
	// 			}
	// 			if(shouldRebuildCard) {
	// 				cardsDiv.appendChild(image);
	// 			}
				
	// 		};
	// 		if(card.topPile != null) {
	// 			cardsDiv.appendChild(this.buildSplitPileTop(image, card, onclick));
	// 		} else if (card.bottomPile != null) {
	// 			cardsDiv.appendChild(this.buildSplitPileBottom(image, card, onclick));
	// 		} else {
	// 			image.onclick = () => { onclick.call(this, card); };
	// 			cardsDiv.appendChild(image);
	// 		}
	// 	});
	// }

	// buildRandomizedCardSetUI(cardSet) {
	// 	let cardsDiv = document.querySelector("#randomizedCards");
	// 	this.buildCardSetUI(cardSet, cardsDiv);
	// }

	// clearCardData() {
	// 	let cardsDiv = document.querySelector("#randomizedCards");
	// 	Utilities.disposeChildren(cardsDiv);
	// }

	// buildSelectedCardSet(cardSet) {
	// 	this.clearCardData();
	// 	this.buildRandomizedCardSetUI(cardSet);
	// }

	// buildSelectedSideboard(sideboard) {
	// 	let sideboardDiv = document.querySelector("#sideboard");
	// 	Utilities.disposeChildren(sideboardDiv);
	// 	sideboard.forEach((card) => {
	// 		let sideboardCard = Utilities.img();
	// 		sideboardCard.src = card.image.indexOf('wiki') > -1 ? card.image : `src/cards/${card.image}`;
	// 		sideboardCard.height = 125;
	// 		sideboardCard.className = "sideboard-thumbnail";
	// 		sideboardCard.onclick = () => {
	// 			// filter by expansions, then pick new card.
	// 			let availableCards = this.filterByExpansions(_cards, card.set);
	// 			availableCards = this.filterByTypes(availableCards, card.types);
	// 			availableCards = this.filterByOtherCardSet(availableCards, sideboard);
	// 			availableCards = this.shuffle(availableCards);
	// 			let newCard = availableCards.pop();
	// 			sideboardCard.src = newCard.image;
	// 		};
	// 		sideboardDiv.appendChild(sideboardCard);
	// 	});
	// }

	fillCardProperties = (card: ICard) => {
		const filledCard: ICard = {
			name :  card.name || "",
			set :  card.set || "",
			types :  card.types || "",
			cost:  card.cost,
			text :  card.text || "",
			actions:  card.actions,
			cards:  card.cards,
			buys:  card.buys,
			coins :  card.coins || "  ",
			trash:  card.trash,
			junk :  card.junk || "  ",
			gain:  card.gain,
			points:  card.points,
			useTavern:  card.useTavern,
			useVillagers:  card.useVillagers,
			image:  card.image,
		};
		return filledCard;
	}

	getDistinctCardCosts = (cardSet: ICard[]) => {
		return cardSet.filter(c => c.cost != null || c.debt != null).map(c => c.cost != null ? c.cost : c.debt).filter((val, index, self) => {
			return self.indexOf(val) === index;
		});
	}

	getEventCards = () => {
		return this.filterByTypes(_cards, ["Event"]);
	}

	getProjectCards = () => {
		return this.filterByTypes(_cards, ["Project"]);
	}

	getLandmarkCards = () => {
		return this.filterByTypes(_cards, ["Landmark"]);
	}

	getWayCards = () => {
		return this.filterByTypes(_cards, ["Way"]);
	}	

	getArtifactCards = () => {
		return this.filterByTypes(_cards, ["Artifact"]);
	}
}

export default CardUtilities;