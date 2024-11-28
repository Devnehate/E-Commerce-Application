"use server"

import { fetchAPiClient } from "@/lib/oneentry"
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces";
import { getCatalog } from "./getCatalog";

export const getCatalogWithProduts = async () => {
    const apiClient = await fetchAPiClient();
    const catalogs: IPagesEntity[] = await getCatalog();
    const catalogWithProducts = [];
    if (catalogs) { 
        for (const catalog of catalogs) {
            const products = await apiClient.Products.getProductsByPageId(catalog.id, undefined, "en_US", { limit: 4 });
            catalogWithProducts.push({ ...catalog, catalogProducts: products });
        }
        return catalogWithProducts;
    }

}