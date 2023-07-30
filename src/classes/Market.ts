import { StockxScraper } from "..";
import { FetchStandardProduct } from "../queries/index.js";
import { IMarketProduct, IMarketVariant } from "../types/Market";

export class Market {
    locked: boolean = false;
    variants: IMarketVariant[] = [];

    constructor(public client: StockxScraper, public product: IMarketProduct) { }

    async fetch() {
        const data = await this.client.request.post('https://gateway.stockx.com/api/graphql', {
            query: FetchStandardProduct,
            variables: {
                productId: this.product.id,
                skipFavoriting: false,
                currencyCode: "EUR",
                countryCode: "FR",
                marketName: "FR"
            }
        }).then(res => res.data.data.product);

        if (data.lockSelling) this.locked = true;

        this.variants = data.variants.filter(v => !v.hidden).map(variant => ({
            id: variant.id,
            sizeEU: variant.sizeChart.displayOptions.find(o => o.type === "eu")?.size.replace("EU ", "").trim() || null,
            sizeUS: variant.sizeChart.displayOptions.find(o => o.type === "us m")?.size.replace("US M ", "").trim() || null,
            sizeUK: variant.sizeChart.displayOptions.find(o => o.type === "uk")?.size.replace("UK ", "").trim() || null,
            lowestAsk: variant.market.bidAskData.lowestAsk,
            highestBid: variant.market.bidAskData.highestBid,
        } as IMarketVariant));
    }
}