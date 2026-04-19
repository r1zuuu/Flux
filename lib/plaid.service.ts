import { plaidClient } from "./plaid";

export const exchangePublicToken = async (publicToken: string) => {
    const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
    });
    return response.data;
};

export const fetchAccounts = async (accessToken: string) => {
    const response = await plaidClient.accountsGet({ access_token: accessToken });
    return response.data.accounts;
};