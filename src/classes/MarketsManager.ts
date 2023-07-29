import { StockxScraper } from "..";
import { FetchSearchResults } from "../queries/index.js";
import { Market } from "./Market.js";

export class MarketsManager {
    constructor(public client: StockxScraper) { };

    async search(query: string): Promise<Market> {
        const product = await this.client.request.post('https://gateway.stockx.com/api/graphql', {
            query: FetchSearchResults,
            variables: {
                "query": query,
                "filtersVersion": 4,
                "staticRanking": true,
                "sort": {
                    "order": "DESC",
                    "id": "featured"
                }
            }
        }).then(res => res.data.data.browse.results.edges[0].node);

        return new Market({
            id: product.id,
            sku: product.styleId,
            name: `${product.primaryTitle} ${product.secondaryTitle}`,
            image: product.media.smallImageUrl
        })
    }
}