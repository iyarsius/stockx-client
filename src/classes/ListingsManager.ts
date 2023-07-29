import dayjs from "dayjs";
import { StockxScraper } from "../index.js";
import { ICreateListingData } from "../types/Listing.js";
import { FetchSearchResults } from "../queries/index.js";

export class ListingsManager {
    constructor(public client: StockxScraper) {
    };

    async create(data: ICreateListingData) {
        const market = await this.client.markets.search(data.sku);

        const res = await this.client.request.post('https://gateway.stockx.com/api/v1/portfolio?a=ask', {
            "PortfolioItem": {
                "localAmount": Math.round(data.price),
                "expiresAt": dayjs().add(1, "month").format("YYYY-MM-DDTHH:mm:ssZ"),
                "localCurrency": "EUR",
                "productId": "3cc750cf-95e1-42ef-b5af-32ffa6ce933f",
                "statusMessage": "",
                "skuUuid": "3cc750cf-95e1-42ef-b5af-32ffa6ce933f"
            },
            "action": "ask"
        })
    };

    async get() {
    };

    async list() {
    };
};