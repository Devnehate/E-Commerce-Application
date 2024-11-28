"use server"

import { fetchAPiClient } from "@/lib/oneentry"

export const getProductDetails = async (productId: number) => {
    const apiClient = await fetchAPiClient();

    if (!productId) {
        throw new Error("product id id required.");
    }

    try {
        const product = await apiClient.Products.getProductById(productId, "en_US");
        return product;
    } catch (error) {
        console.error("Failed to fetch products: ", error);
        throw new Error("Failed to fetch products.")
        
    }

}