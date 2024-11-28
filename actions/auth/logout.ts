"use server"

import { fetchAPiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";

interface IErrorResponse {
    statuscode: number;
    message: string;
}

export default async function logoutAction() {
    const cookieStore = cookies();
    const refreshToken = cookies().get("refresh_token")?.value;
    const accessToken = cookies().get("access_token")?.value;

    const apiClient = fetchAPiClient();

    if (!refreshToken || !accessToken) {
        return {
            message: "You are not currently logged In."
        };
    }

    try {
        const logoutResponse = (await apiClient).AuthProvider.setAccessToken(accessToken).logout("email", refreshToken)
        if (typeof logoutResponse !== "boolean") {
            const errorResponse = logoutResponse as unknown as IErrorResponse;
            return {
                message:errorResponse.message,
            }
        }

        cookieStore.delete("refresh_token");
        cookieStore.delete("access_token");

        cookieStore.set("refresh_token","",{maxAge:0});
        cookieStore.set("access_token", "", { maxAge: 0 });

        return { message: "Logout Successfull." };
    } catch (error) {
        console.error("Error durong logout: ", error);
        throw new Error("An error occured while logging out. Please try again.");  
    }
}