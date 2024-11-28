"use server"

import { fetchAPiClient } from "@/lib/oneentry";

export const searchProductsAction = async (query: string) => {
    try {
        const apiClient = fetchAPiClient();
        const products = (await apiClient).Products.searchProduct(query, "en_US");
        return products || [];
    } catch (error) {
        console.error("Error searching products", error);
        throw new Error(`Product search failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        
    }
}