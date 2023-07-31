import { StockxScraper } from "..";
import { Condition, IImage, IListing } from "../types/Listing";

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

    async delete() {
        return await this.client.request.delete(`https://gateway.stockx.com/api/v1/portfolio/${this.id}`, {
            data: {
                "chain_id": this.id,
                "notes": "Customer Removed"
            }
        });
    };
};