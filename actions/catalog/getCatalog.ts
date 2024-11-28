"use server"

import { fetchAPiClient } from "@/lib/oneentry";
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces"

export const getCatalog = async (): Promise<IPagesEntity[]> => {
    try {
        const apiClient = await fetchAPiClient();
        const pages = await apiClient.Pages.getRootPages("en_US");
        const catalogPages = pages.filter(page => page.type === "forCatalogPages");
        return catalogPages.length ? catalogPages : [];
        
    } catch (error) {
        console.error({ error });
        return [];
    }
};