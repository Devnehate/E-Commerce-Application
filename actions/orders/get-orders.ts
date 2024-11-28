"use server"

import { fetchAPiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";

export const getOrders = async () => {
    try {
        const apiClient = await fetchAPiClient();

        const accessToken = cookies().get("access_token")?.value;

        if (!accessToken) {
            throw new Error("Missing access Token.");
        }

        const orders = await apiClient.Orders.setAccessToken(accessToken).getAllOrdersByMarker("orders");
        return orders;

    } catch (error) {
        console.log(error);
    }
}