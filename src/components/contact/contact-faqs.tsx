import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

const items = [
  {
    question: "Which form should employers use?",
    answer: <>Use the <Link className="font-bold text-green underline" href="/hire-talent">Hire Talent form</Link> when you have a recruitment requirement. Use the contact form for general questions.</>,
  },
  {
    question: "Which form should job seekers use?",
    answer: <>Use the <Link className="font-bold text-green underline" href="/candidate-registration">Candidate Registration form</Link> to share professional information for human review.</>,
  },
  {
    question: "Does submitting an enquiry guarantee a response or outcome?",
    answer: <>No. Submission does not guarantee a response time, service acceptance, shortlisting, placement, or employment.</>,
  },
] as const;

export function ContactFaqs() {
  return (
    <section className="bg-white" aria-labelledby="contact-faq-heading">
      <PageContainer className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 id="contact-faq-heading" className="text-3xl font-extrabold text-navy sm:text-4xl">
            Frequently asked contact questions
          </h2>
          <div className="mt-8 divide-y divide-border-grey border-y border-border-grey">
            {items.map((item) => (
              <details key={item.question} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-heading font-extrabold text-navy focus-visible:outline-3 focus-visible:outline-gold">
                  {item.question}
                  <span aria-hidden="true" className="text-2xl text-green group-open:rotate-45">+</span>
                </summary>
                <div className="max-w-3xl pb-5 leading-7 text-slate">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
