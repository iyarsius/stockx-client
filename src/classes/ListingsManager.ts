import dayjs from "dayjs";
import { StockxScraper } from "../index.js";
import { ICreateListingData } from "../types/Listing.js";
import { Listing } from "./Listing.js";
import FetchCurrentAsks from "../queries/FetchCurrentAsks.js";

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
        }).then(res => res.data.PortfolioItem);

        return new Listing(this.client, {
            id: ask.chainId,
            sku: ask.product.styleId,
            title: ask.product.title,
            size: ask.product.shoeSize,
            brand: ask.product.brand,
            price: ask.localAmount,
            images: [],
            condition: 'NEW',
            status: "ACTIVE",
            created_at: dayjs(ask.createdAt).valueOf(),
            updated_at: dayjs(ask.createdAt).valueOf(),
        });
    };

    async get() {
    };

    async list() {
        const data = await this.client.request.post('https://gateway.stockx.com/api/graphql', {
            query: FetchCurrentAsks,
            variables: {
                "currencyCode": "EUR",
                "state": "CURRENT",
                "country": "FR",
                "market": "FR",
                "first": 40,
                "sort": "LISTED_AT"
            }
        });

        console.log(data.data.data.viewer.asks.edges)

        return data.data.data.viewer.asks.edges.map(e => new Listing(this.client, {
            id: e.node.id,
            sku: e.node.productVariant.product.styleId,
            brand: e.node.productVariant.product.brand,
            title: `${e.node.productVariant.product.primaryTitle} ${e.node.productVariant.product.secondaryTitle}`,
            size: e.node.productVariant.traits.size,
            price: e.node.amount,
            condition: "NEW",
            status: "ACTIVE",
            images: [],
            created_at: dayjs(e.node.created).valueOf(),
            updated_at: dayjs(e.node.updated).valueOf(),
        }));
    };
};