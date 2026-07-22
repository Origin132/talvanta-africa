import { CTASection } from "@/components/ui/cta-section";

export function HomepageCTA() {
  return (
    <CTASection
      heading="Ready to take the next step?"
      supportingText="Whether you are building a team or exploring your next career opportunity, Talvanta Africa provides a clear starting point."
      primaryAction={{ label: "Hire Talent", href: "/hire-talent" }}
      secondaryAction={{ label: "Explore Jobs", href: "/jobs" }}
      variation="dark"
    />
  );
}
