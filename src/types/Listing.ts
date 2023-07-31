export interface ICreateListingData {
    sku: string;
    name: string;
    brand: string;
    size: string;
    price: number;
};

export interface IImage {
    id: number,
    url: string,
};

export type Condition = "DEADSTOCK" | "NEW" | "NEW_WITH_DEFECTS" | "NO_BOX" | "USED" | "VERY_USED"

export interface IListing {
    id: string,
    status: "ACTIVE" | "SOLD" | "DRAFT",
    images: IImage[],
    sku: string,
    title: string,
    size: string,
    brand: string,
    condition: Condition,
    price: number,
    created_at: number,
    updated_at: number,
}