import { IProduct } from "./products";

export interface ICatalog {
    id: number;
    localizeInfos?: {
        title?: string;
    };
    catalogProducts: {
        items: IProduct[];
    };
}