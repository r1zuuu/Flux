"use server"
import { auth } from "@/app/auth";
import { plaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";

export default async function createPlaidLinkToken() {
    const userSession = await auth();
    console.log("sesja:", userSession);
    if (!userSession?.user?.id) {
        throw new Error('User not authenticated');
    }
    const request = { //definicja zapytania do plaid https://plaid.com/docs/api/link/#linktokencreate 
        user: {
            client_user_id: userSession.user.id,
        },
        client_name: 'Flux Finance',
        products: ['auth', 'transactions'] as Products[],
        country_codes: ['PL'] as CountryCode[],
        language: 'pl',
    }
    try {
        const response = await plaidClient.linkTokenCreate(request);
        return { linkToken: response.data.link_token }
    } catch (error) {
        console.error('Error creating Plaid link token:', error);
        throw new Error('Failed to create Plaid link token');
    }
}