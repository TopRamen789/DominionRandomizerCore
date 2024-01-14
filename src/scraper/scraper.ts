//@ts-nocheck
const dominion_strategy_wiki = "https://wiki.dominionstrategy.com/index.php";
const dominion_list_of_cards = "https://wiki.dominionstrategy.com/index.php/List_of_cards"

let download = (data, filename, type) => {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function buildCard(row) {
	let cells = row.children;
	let card = {};
	let costSrc = cells[3] != null ? cells[3].children.length > 0 ? cells[3].children[0].children[0].src : "" : "";
	try {
		card.image = row.querySelector("[src]").src.replace('https://cors-anywhere.herokuapp.com/', ${dominion_strategy_wiki});
	} catch {
		console.error('it didn\'t work!!!');
	}
	card.name = cells[0] != null ? cells[0].textContent.trim() : "";
	card.set = cells[1] != null ? cells[1].textContent.trim() : "";
	card.types = cells[2] != null ? cells[2].textContent.trim() : "";
	card.costSrc = costSrc;
	card.cost = costSrc != null ? parseInt(costSrc[costSrc.lastIndexOf("Coin")+4], 10) : "";
	card.text = cells[4] != null ? cells[4].textContent.trim() : "";
	card.actions = cells[5] != null ? cells[5].textContent.trim() : "";
	card.cards = cells[6] != null ? cells[6].textContent.trim() : "";
	card.buys = cells[7] != null ? cells[7].textContent.trim() : "";
	card.coins = cells[8] != null ? cells[8].textContent.trim() : "";
	card.trash = cells[9] != null ? cells[9].textContent.trim() : "";
	card.junk = cells[10] != null ? cells[10].textContent.trim() : "";
	card.gain = cells[11] != null ? cells[11].textContent.trim() : "";
	card.points = cells[12] != null ? cells[12].textContent.trim() : "";
	return card;
}

function getCards() {
	let getCardsXhr = new XMLHttpRequest();
	getCardsXhr.open("GET", `https://cors-anywhere.herokuapp.com/${dominion_list_of_cards}`);
	getCardsXhr.responseType = "document";
	getCardsXhr.onload = (document) => {
		let rows = document.srcElement.response.body.querySelectorAll("tr");
		let cards = [];
		rows.forEach((row, idx) => {
			if(idx === 0)
				return;
			const card = buildCard(row);
			cards.push(card);
		});
	};
	getCardsXhr.send();
}
// let json = JSON.stringify(cards, null, "\t");
// download(json, "DominionCards", ".json");
// document.querySelector("#data").textContent = json;

function getCardsFromExpansion(expansion) {
	let getCardsXhr = new XMLHttpRequest();
	getCardsXhr.open("GET", `https://cors-anywhere.herokuapp.com/${dominion_list_of_cards}`);
	getCardsXhr.responseType = "document";
	getCardsXhr.onload = (document) => {
		let rows = document.srcElement.response.body.querySelectorAll("tr");
		let cards = [];
		rows.forEach((row, idx) => {
			if(idx === 0)
				return;
			let cells = row.children;
			let set = cells[1] != null ? cells[1].textContent.trim() : "";
			if(set.toLowerCase() === expansion.toLowerCase() && set !== "" && set !== null) {
				const card = buildCard(card);
				cards.push(card);
			}
		});
	};
	getCardsXhr.send();
}
// let json = JSON.stringify(cards, null, "\t");
// download(json, `${expansion}-cards`, ".json");

function getCardImages() {
	let getCardsImagesXhr = new XMLHttpRequest();
	getCardsXhr.open("GET", `https://cors-anywhere.herokuapp.com/${dominion_list_of_cards}`);
	getCardsImagesXhr.responseType = "document";
	getCardsImagesXhr.onload = (document) => {
		let rows = document.srcElement.response.body.querySelectorAll("tr");
		let cardImages = [];
		rows.forEach((r,w) => {
			if(r.querySelector(".noprint [src]") != null) {
				let card = {};
				card.name = r.children[0] != null ? r.children[0].textContent.trim() : "";
				card.image = r.querySelector("[src]").src.replace('https://cors-anywhere.herokuapp.com/', 'http://wiki.dominionstrategy.com/');
				cardImages.push(card);
			}
		});
	}
	getCardsImagesXhr.send();
}
// let json = JSON.stringify(cardImages, null, "\t");
// download(json, "cardImages", ".json");

function getExpansionHrefs() {
	let getURLs = new XMLHttpRequest();
	getURLs.open("GET", `https://cors-anywhere.herokuapp.com/${dominion_strategy_wiki}/Recommended_Kingdoms`);
	getURLs.responseType = "document";
	getURLs.onload = (document) => {
		let rows = document.srcElement.response.body.querySelector('#mw-content-text').children[2].children;
		let hrefs = [];
		Array.prototype.slice.call(rows).forEach((r) => {
			hrefs.push(`http://wiki.dominionstrategy.com/${r.children[0].href.replace('https://cors-anywhere.herokuapp.com/', '')}`);
		});
		buildRecommendedPredefinedSets(hrefs);
	}
	getURLs.send();
}

function buildRecommendedPredefinedSets(hrefs) {
	hrefs.forEach((href) => {
		let getRecommendedSets = new XMLHttpRequest();
		getRecommendedSets.open("GET", `https://cors-anywhere.herokuapp.com/${href}`);
		getRecommendedSets.responseType = "document";
		getRecommendedSets.onload = (document) => {
			let rows = document.srcElement.response.body.querySelector('#content').querySelector('#bodyContent').querySelector('#mw-content-text').querySelectorAll('.wikitable');
			let predefinedSetData = [];
			rows = Array.prototype.slice.call(rows);
			rows.forEach((card) => {
				let cardText = card.textContent;
				if(cardText != null && cardText != "")
					predefinedSetData.push(cardText);
			});
		}
		getRecommendedSets.send();
	});
}
// let json = JSON.stringify(predefinedSetData, null, "\t");
// download(json, `${href}_sets_of_10`, ".json");

//getCardImages();
//getExpansionHrefs();
getCardsFromExpansion("Menagerie");
getCardsFromExpansion("Allies");
getCardsFromExpansion("Plunder");