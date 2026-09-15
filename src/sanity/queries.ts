import { client } from "./client";

export type SanityImage = {
  asset?: { _ref: string; _type: "reference" };
  alt?: string;
};

export type Service = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  warranty: { label: string; detail: string };
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: SanityImage;
};

export type Project = {
  slug: string;
  title: string;
  location: string;
  category: string;
  image: SanityImage;
  gallery?: SanityImage[];
  summary?: string;
  body?: unknown;
  featured?: boolean;
};

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  image?: SanityImage;
};

export type JournalArticle = {
  slug: string;
  title: string;
  image: SanityImage;
  excerpt?: string;
  body?: unknown;
  publishedAt?: string;
};

export type HeroSlide = {
  image: SanityImage;
  alt: string;
  tag: string;
  title: string;
  caption: string;
};

export type ExpertiseArea = {
  number: string;
  title: string;
  description: string;
  image: SanityImage;
};

export type SiteSettings = {
  email: string;
  phones?: { label: string; number: string }[];
  offices?: { name: string; address: string }[];
  socials?: { platform: string; url: string }[];
};

const SERVICE_PROJECTION = `{
  "slug": slug.current,
  name,
  summary,
  description,
  warranty
}`;

const PROJECT_PROJECTION = `{
  "slug": slug.current,
  title,
  location,
  category,
  image,
  gallery,
  summary,
  body,
  featured
}`;

const JOURNAL_PROJECTION = `{
  "slug": slug.current,
  title,
  image,
  excerpt,
  body,
  publishedAt
}`;

export async function getServices(): Promise<Service[]> {
  return client.fetch(
    `*[_type == "service"] | order(order asc) ${SERVICE_PROJECTION}`,
    {},
    { next: { tags: ["service"] } },
  );
}

export async function getService(slug: string): Promise<Service | null> {
  return client.fetch(
    `*[_type == "service" && slug.current == $slug][0] ${SERVICE_PROJECTION}`,
    { slug },
    { next: { tags: ["service"] } },
  );
}

export async function getTeam(): Promise<TeamMember[]> {
  return client.fetch(
    `*[_type == "teamMember"] | order(order asc) { name, role, bio, photo }`,
    {},
    { next: { tags: ["teamMember"] } },
  );
}

export async function getProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(order asc) ${PROJECT_PROJECTION}`,
    {},
    { next: { tags: ["project"] } },
  );
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(order asc) ${PROJECT_PROJECTION}`,
    {},
    { next: { tags: ["project"] } },
  );
}

export async function getProject(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] ${PROJECT_PROJECTION}`,
    { slug },
    { next: { tags: ["project"] } },
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(
    `*[_type == "testimonial"] | order(order asc) { quote, author, role, image }`,
    {},
    { next: { tags: ["testimonial"] } },
  );
}

export async function getJournalArticles(): Promise<JournalArticle[]> {
  return client.fetch(
    `*[_type == "journalArticle"] | order(order asc) ${JOURNAL_PROJECTION}`,
    {},
    { next: { tags: ["journalArticle"] } },
  );
}

export async function getJournalArticle(
  slug: string,
): Promise<JournalArticle | null> {
  return client.fetch(
    `*[_type == "journalArticle" && slug.current == $slug][0] ${JOURNAL_PROJECTION}`,
    { slug },
    { next: { tags: ["journalArticle"] } },
  );
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return client.fetch(
    `*[_type == "heroSlide"] | order(order asc) { image, alt, tag, title, caption }`,
    {},
    { next: { tags: ["heroSlide"] } },
  );
}

export async function getExpertiseAreas(): Promise<ExpertiseArea[]> {
  return client.fetch(
    `*[_type == "expertiseArea"] | order(order asc) { number, title, description, image }`,
    {},
    { next: { tags: ["expertiseArea"] } },
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings"][0] { email, phones, offices, socials }`,
    {},
    { next: { tags: ["siteSettings"] } },
  );
}
