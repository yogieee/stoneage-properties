"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";

type Faq = { question: string; answer: string };

export function FaqAccordionClient({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-line divide-line divide-y border-t border-b">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <Typography variant="display-sm" as="span" className="text-lg sm:text-xl">
                {faq.question}
              </Typography>
              <span
                className={`text-ink-subtle shrink-0 font-mono text-xl transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <Typography variant="body" className="max-w-2xl">
                  {faq.answer}
                </Typography>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
