import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return <PlaceholderPage title="Terms of use" description="The terms governing use of the Talvanta Africa website will be published after approved policy content is available." futureContent="This Sprint 1 placeholder does not create or replace final legal terms. Reviewed content will be added in a later sprint." />;
}
