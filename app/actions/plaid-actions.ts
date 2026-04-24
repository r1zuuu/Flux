"use server"
import { auth } from "@/app/auth";
import db from "@/lib/db";
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
        country_codes: ['US'] as CountryCode[],
        language: 'en',
    }
    try {
        const response = await plaidClient.linkTokenCreate(request);
        return { linkToken: response.data.link_token }
    } catch (error) {
        console.error('Error creating Plaid link token:', error);
        throw new Error('Failed to create Plaid link token');
    }
}


export const exchangePublicToken = async (publicToken: string) => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return { error: "Brak autoryzacji" };

    try {
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = exchangeResponse.data.access_token;
        const itemId = exchangeResponse.data.item_id;


        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accounts = accountsResponse.data.accounts;

        await db.$transaction(async (tx) => {
            const plaidItem = await tx.plaidItem.create({
                data: {
                    accessToken,
                    itemId,
                    userId,
                },
            });
            await tx.financialAccount.createMany({
                data: accounts.map((account) => ({
                    plaidAccountId: account.account_id,
                    name: account.name,
                    type: account.type,
                    subtype: account.subtype,
                    mask: account.mask,
                    currentBalance: account.balances.current || 0,
                    availableBalance: account.balances.available || 0,
                    userId: userId,
                    plaidItemId: plaidItem.id,
                })),
            });
        });

        return { success: true };
    } catch (error) {
        console.error("Błąd podczas wymiany tokena:", error);
        return { error: "Nie udało się zsynchronizować konta bankowego" };
    }
};