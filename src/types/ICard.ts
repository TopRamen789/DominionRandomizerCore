export default interface ICard {
    name: string;
    set: string;
    types: string;
    cost?: number|null;
    debt?: number|null;
    text: string;
    actions?: number|null;
    cards?: number|null;
    buys?: number|null;
    coins: string;
    trash?: number|null;
    junk: string;
    gain?: number|null;
    points?: number|null;
    useTavern?: boolean|null;
    useCoffers?: boolean|null;
    useVillagers?: boolean|null;
    image?: string|null;
}