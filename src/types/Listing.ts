export interface ICreateListingData {
    sku: string;
    name: string;
    brand: string;
    size: string;
    price: number;
    images?: Buffer[];
}