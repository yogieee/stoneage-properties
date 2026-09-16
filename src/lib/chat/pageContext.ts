import "server-only";
import { getService, getSiteSettings } from "@/sanity/queries";

export type PageContext = {
  label: string;
  /** Injected into the chat system prompt to focus the model on this page. */
  systemContext: string;
  /** Shown as the widget's opening message, before the visitor types anything. */
  greeting: string;
  /** Quick-reply chips shown alongside the greeting. */
  suggestions: string[];
};

async function getContactLine(): Promise<string> {
  const settings = await getSiteSettings();
  const phone = settings?.phones?.[0]?.number;
  const email = settings?.email;
  const parts = [phone && `calling ${phone}`, email && `emailing ${email}`].filter(
    Boolean,
  );
  return parts.length > 0 ? parts.join(" or ") : "contacting the team directly";
}

export async function buildPageContext(
  rawPath: string | null | undefined,
): Promise<PageContext> {
  const path = rawPath || "/";
  const contactLine = await getContactLine();

  const serviceMatch = path.match(/^\/services\/([^/?#]+)/);
  if (serviceMatch) {
    const service = await getService(serviceMatch[1]);
    if (service) {
      return {
        label: service.name,
        systemContext: `The visitor is currently viewing the "${service.name}" service page. Service summary: ${service.summary}. Proactively ask about their project (space, scope, timeline) in relation to this service, answer their questions, and work the conversation toward submitting a Spatial Brief via the contact form, or ${contactLine}.`,
        greeting: `Thinking about a ${service.name.toLowerCase()} project? I can walk you through what's involved, typical timelines, or help you take the next step.`,
        suggestions: [
          `What's involved in a ${service.name}?`,
          "How long does a project like this usually take?",
          "I'd like to get started",
        ],
      };
    }
  }

  if (path.startsWith("/services")) {
    return {
      label: "Services",
      systemContext: `The visitor is browsing the Services overview page. Help them identify the right service for their project, answer their questions, and work the conversation toward submitting a Spatial Brief via the contact form, or ${contactLine}.`,
      greeting:
        "Exploring our services? Tell me a bit about your project and I'll point you to the right one.",
      suggestions: [
        "What services do you offer?",
        "Which service fits a renovation?",
        "I want to start a project",
      ],
    };
  }

  if (path.startsWith("/projects")) {
    return {
      label: "Projects",
      systemContext: `The visitor is browsing the project portfolio. Answer questions about our work in general terms, and work the conversation toward submitting a Spatial Brief for their own project, or ${contactLine}.`,
      greeting:
        "Browsing our portfolio? Happy to talk through the kind of work we do, or help you start your own project.",
      suggestions: [
        "Tell me about your recent projects",
        "Can you do something similar for me?",
        "I want to start a project",
      ],
    };
  }

  if (path.startsWith("/journal")) {
    return {
      label: "Journal",
      systemContext: `The visitor is reading the Journal (articles and insights). Answer relevant questions and work the conversation toward Stoneage's services and a Spatial Brief submission, or ${contactLine}.`,
      greeting:
        "Reading up on design and construction? Ask me anything, or let me know if you have a project in mind.",
      suggestions: [
        "What services do you offer?",
        "I have a project in mind",
        "How do I get started?",
      ],
    };
  }

  if (path.startsWith("/contact")) {
    return {
      label: "Contact",
      systemContext: `The visitor is on the Contact page. Help them decide the best way to reach out — the Spatial Brief form on this page, or ${contactLine} — and answer any last questions before they submit.`,
      greeting:
        "Ready to get in touch? I can answer a quick question, or help you fill out the Spatial Brief.",
      suggestions: [
        "What happens after I submit the form?",
        "How fast will someone respond?",
        "What info should I include?",
      ],
    };
  }

  return {
    label: "Home",
    systemContext: `The visitor is on the homepage. Help them understand what Stoneage Properties does, identify the right service for them, and work the conversation toward a Spatial Brief submission, or ${contactLine}.`,
    greeting:
      "Welcome to Stoneage Properties. Ask me about our services, our process, or a project you have in mind.",
    suggestions: [
      "What services do you offer?",
      "How does the process work?",
      "I'd like to start a project",
    ],
  };
}
