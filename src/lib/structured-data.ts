import { absoluteUrl } from "@/lib/site-url";

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export function organisationStructuredData(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Talvanta Africa",
    url: absoluteUrl("/"),
    description:
      "Talvanta Africa is a recruitment and workforce services company connecting professional talent with growing businesses.",
  };
}

export function websiteStructuredData(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Talvanta Africa",
    url: absoluteUrl("/"),
    description: "Connecting exceptional talent with growing businesses.",
  };
}

export function serviceStructuredData(
  name: string,
  description: string,
): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: absoluteUrl("/services"),
    provider: {
      "@type": "Organization",
      name: "Talvanta Africa",
      url: absoluteUrl("/"),
    },
  };
}

export function faqStructuredData(
  items: readonly { question: string; answer: string }[],
): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
