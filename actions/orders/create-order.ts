"use server"
import { fetchAPiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IOrderData } from "oneentry/dist/orders/ordersInterfaces";
//@ts-ignore
export default async function createOrders(orderData: IOrderData): Promise<string> {
    const apiClient = await fetchAPiClient();

    if (!apiClient) {
        throw new Error("Unable to retrieve API instance.");
    }

    const accessToken = cookies().get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Missing access Token.");
    }

    try {
        const createdOrder = await apiClient.Orders.setAccessToken(accessToken).createOrder("orders", orderData);

        if (!createdOrder?.id) {
            throw new Error("order creation was unsuccessfull.")
        }

        const paymentSession = await apiClient.Payments.setAccessToken(accessToken).createSession(createdOrder?.id, "session");

        if (!paymentSession.paymentUrl) {
            throw new Error("Failed to generate payment session URL.");
        }
            return paymentSession.paymentUrl;
        
        

    } catch (error) {
        console.error("Error during order and payment processing: ", error);
        // throw new Error(`Order or payment session creation failed. ${error instanceof Error ? error.message : "Unknown error occurred."}`)

    }
}