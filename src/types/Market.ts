export interface IMarketProduct {
    id: string;
    sku: string;
    brand: string;
    name: string;
    image: string
};

export interface IMarketVariant {
    id: string;
    sizeEU: string;
    sizeUS: string;
    sizeUK: string;
    lowestAsk: number;
    highestBid: number;
};