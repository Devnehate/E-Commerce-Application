/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { fetchAPiClient } from "@/lib/oneentry"
import { IAttributes } from "oneentry/dist/base/utils"

export const getSignupFormdata = async (): Promise<IAttributes[]> => {
    try {
        const apiClient = await fetchAPiClient();
        const response = await apiClient.Forms.getFormByMarker("sign-up");
        return response?.attributes as unknown as IAttributes[];
    } catch (error: any) {
        console.log(error);
        throw new Error("fetching form data failed.");
    }
};

export const handleSignupSubmit = async (inputvalues: {
    email: string;
    password: string;
    name: string;
}) => {
    try {
        const apiClient = await fetchAPiClient();
        const data = {
            "formIdentifier": "sign-up",
            "authData": [
                {
                    "marker": "email",
                    "value": inputvalues.email,
                },
                {
                    "marker": "password",
                    "value": inputvalues.password,
                }
            ],
            "formData": [
                {
                    "marker": "name",
                    "type": "string",
                    "value": inputvalues.name,
                }
            ],
            "notificationData": {
                "email": inputvalues.email,
                "phonePush": ["+99999999999"],
                "phoneSMS": "+99999999999",
            },
        };
        const value = await apiClient.AuthProvider.signUp("email", data);
        return value;
    } catch (error:any) {
        console.error(error);
        if (error?.statuscode === 400) {
            return { message: error?.message };
        }
        throw new Error("Accoount crreation failed, please try again later.");
        
    }
}
