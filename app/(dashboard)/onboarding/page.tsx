import createPlaidLinkToken from "@/app/actions/plaid-actions";
import OnboardingClient from "@/app/(dashboard)/onboarding/onboarding-client";
export default async function OnboardingPage() {
    const { linkToken } = await createPlaidLinkToken();

    return <OnboardingClient linkToken={linkToken} />;
}