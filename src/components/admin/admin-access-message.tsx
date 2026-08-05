import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ButtonLink } from "@/components/ui/button";

export function AdminAccessMessage({ status }: { status: "forbidden" | "error" }) {
  const forbidden = status === "forbidden";
  return (
    <AccountPage
      eyebrow="Administration"
      title="Administration access unavailable"
      intro={
        forbidden
          ? "You do not have permission to access recruitment administration."
          : "We could not verify recruitment administration access. Please try again."
      }
    >
      <AccountCard>
        <ButtonLink href="/account" variant="outline">
          Return to Your Account
        </ButtonLink>
      </AccountCard>
    </AccountPage>
  );
}
