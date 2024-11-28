"use server"

import { fetchAPiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";

interface IErrorResponse {
    statuscode: number;
    message: string;
}

export default async function getUserSession() {
    const apiClient = await fetchAPiClient();
    const accessToken = cookies().get("access_token")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const currentUser = await apiClient.Users.setAccessToken(accessToken).getUser();
        if (!currentUser || !currentUser.id) {
            throw new Error("Invalid user data or missing user Id.");
        }
        return currentUser;
    } catch (error:unknown) {
        if (error instanceof Error && (error as unknown as IErrorResponse).statuscode === 401) {
            return undefined;
        }
        console.error("Failed to retrieve user session: ",error);
        
    }
}