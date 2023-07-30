import dayjs from "dayjs";
import { StockxScraper } from "../index.js";
import { ICreateListingData } from "../types/Listing.js";
import { FetchSearchResults } from "../queries/index.js";

export class ListingsManager {
    constructor(public client: StockxScraper) {
    };

    async create(data: ICreateListingData) {
        const market = await this.client.markets.search(data.sku);

        if (!market) throw new Error("Product not found");

        await market.fetch();
        if (market.locked) throw new Error("Product is locked");

        const variant = market.variants.find(v => v.sizeEU === data.size);

        const ask = await this.client.request.post('https://gateway.stockx.com/api/v1/portfolio?a=ask', {
            "PortfolioItem": {
                "localAmount": Math.round(data.price),
                "expiresAt": dayjs().add(1, "month").format("YYYY-MM-DDTHH:mm:ssZ"),
                "localCurrency": "EUR",
                "productId": variant.id,
                "statusMessage": "",
                "skuUuid": variant.id,
            },
            "action": "ask"
        });

        return ask.data
    };

    async get() {
    };

    async list() {
    };
};