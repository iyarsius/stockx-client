import dayjs from "dayjs";
import { StockxScraper } from "..";
import { Condition, IImage, IListing, IUpdateListingData } from "../types/Listing";

export class Listing implements IListing {
    id: string;
    status: "ACTIVE" | "SOLD" | "DRAFT";
    images: IImage[];
    sku: string;
    title: string;
    size: string;
    brand: string;
    condition: Condition;
    price: number;
    created_at: number;
    updated_at: number;

    constructor(public client: StockxScraper, data: IListing) {
        Object.assign(this, data);
    };

    async update(data: IUpdateListingData) {
        const market = await this.client.markets.search(this.sku);

        if (!market) throw new Error("Product not found");

        await market.fetch();
        if (market.locked) throw new Error("Product is locked");

        const variant = market.variants.find(v => v.sizeEU === this.size);

        const ask = await this.client.request.post('https://gateway.stockx.com/api/v1/portfolio?a=ask', {
            "PortfolioItem": {
                "localAmount": Math.round(data.price || this.price),
                "expiresAt": dayjs().add(1, "month").format("YYYY-MM-DDTHH:mm:ssZ"),
                "localCurrency": "EUR",
                "productId": variant.id,
                "statusMessage": "",
                "skuUuid": variant.id,
                chainId: this.id
            },
            "action": "ask"
        }).then(res => res.data.PortfolioItem);

        Object.assign(this, {
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

    async delete() {
        return await this.client.request.delete(`https://gateway.stockx.com/api/v1/portfolio/${this.id}`, {
            data: {
                "chain_id": this.id,
                "notes": "Customer Removed"
            }
        });
    };
};