"use client";
import { useCallback, useState } from "react";
import { PlaidLinkOnSuccess, PlaidLinkOnExit, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation";
import { exchangePublicToken } from "@/app/actions/plaid-actions"

export default function OnboardingClient({ linkToken }: { linkToken: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token, metadata) => {
        setIsLoading(true)
        try {
            const result = await exchangePublicToken(public_token)
            if (result.success) {
                router.refresh()
                router.push("/dashboard")
            } else if (result.error) {
                alert(result.error)
            }
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setIsLoading(false)
        }
    }, [router]);

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
                {isLoading ? "Ladowanie..." : "Polacz konto bankowe"}
            </button>
        </div>
    );
}
