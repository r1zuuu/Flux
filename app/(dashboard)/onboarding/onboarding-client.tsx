"use client";
import { useCallback } from "react";
import { PlaidLinkOnSuccess, PlaidLinkOnExit, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";

export default function OnboardingClient({ linkToken }: { linkToken: string }) {

    const onSuccess = useCallback<PlaidLinkOnSuccess>((public_token, metadata) => {
        console.log("Public Token:", public_token);
        console.log("Metadata:", metadata);
        // TODO: wyslac public token do serwera i otrzymac z a to acces token
    }, []);

    const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
        console.log("Exit Error:", error);
        console.log("Exit Metadata:", metadata);
    }, []);

    const config: PlaidLinkOptions = {
        token: linkToken,
        onSuccess,
        onExit,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <div>
            <h1>Onboarding</h1>
            <button onClick={() => open()} disabled={!ready}>
                Połącz konto bankowe
            </button>
        </div>
    );
}
