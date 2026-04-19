import { AccountBase } from 'plaid';
import db from './db';

export const createBankConnection = async (
    userId: string,
    accessToken: string,
    itemId: string,
    accounts: AccountBase[]
) => {
    return await db.$transaction(async (tx) => {

        // KROK 1: Tworzymy rekord połączenia z bankiem (PlaidItem)
        // Musimy to zrobić najpierw, żeby dostać ID tego połączenia
        const plaidItem = await tx.plaidItem.create({
            data: {
                accessToken: accessToken,
                itemId: itemId,
                userId: userId,
            },
        });

        // KROK 2: Przygotowujemy dane kont finansowych
        // Mapujemy tablicę z Plaid na format Twojej bazy danych
        const accountsData = accounts.map((account) => ({
            plaidAccountId: account.account_id,
            name: account.name,
            type: account.type ?? "depository",
            subtype: account.subtype ?? "checking",
            mask: account.mask ?? "0000",
            // Salda mogą być nullami w API, więc dajemy fallback na 0
            currentBalance: account.balances.current ?? 0,
            availableBalance: account.balances.available ?? 0,
            userId: userId,
            plaidItemId: plaidItem.id, // Tu łączymy konto z "rodzicem" (PlaidItem)
        }));

        // KROK 3: Masowy zapis wszystkich kont do bazy
        await tx.financialAccount.createMany({
            data: accountsData,
        });

        return plaidItem;
    });
};