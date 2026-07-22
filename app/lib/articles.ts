export const DOI_PREFIX = "10.67419";

export interface SiteArticle {
  id: number;
  slug: string;
  doi: string;
  title: string;
  author: string;
  school?: string;
  publishDate: string;
  category: string;
  volume: number;
  issueNumber: number;
  abstract: string;
  image?: string;
  pdfBasename: string;
  pdfPath: string;
}

const SITE_ARTICLE_SOURCE = [
  {
    id: 10,
    title: "The Next Big Arenas of Competition",
    author:
      "Chris Bradley, Michael Chui, Kevin Russell, Kweilin Ellingrud, Michael Birshan, Suhayl Chettih",
    school: "McKinsey Global Institute",
    publishDate: "2024-10-1",
    category: "Opinion Pieces",
    volume: 1,
    issueNumber: 1,
    abstract:
      "This report from the McKinsey Global Institute identifies and describes a category of industries that could account for much of the future change in the business landscape and transform the world.",
    image: "/images/optimized/arenas-1600.webp",
    pdfBasename: "Arenas of Competition",
  },
  {
    id: 1,
    title:
      "From Neurons to Leaders: A Brain-Targeted Framework for Leadership Education",
    author: "Mariale Hardiman",
    school: "Johns Hopkins University",
    publishDate: "2025-04-02",
    category: "Opinion Pieces",
    volume: 1,
    issueNumber: 1,
    abstract:
      "The rapidly evolving fields of neuroleadership and neuroeducation hold immense potential for transforming our understanding of effective leadership and learning.",
    image: "/images/optimized/leadership-800.webp",
    pdfBasename: "Neurons to Leaders",
  },
  {
    id: 2,
    title:
      "Standing Steady in Shifting Ground: Why Leadership Education Matters for International Students",
    author: "Francella Ochillo, Clara Ma",
    school: "Johns Hopkins University",
    publishDate: "2025-04-03",
    category: "Opinion Pieces",
    volume: 1,
    issueNumber: 1,
    abstract:
      "International students in U.S. higher education face increasing uncertainty due to policy shifts, xenophobia, and systemic support gaps.",
    image: "/images/optimized/neuroleadership-1600.webp",
    pdfBasename: "Standing Steady",
  },
  {
    id: 3,
    title:
      "Religion, Ethics, and Medicine at End of Life: When It Is Acceptable for Physicians to Refuse Care?",
    author: "Guanxi Adam Luo",
    publishDate: "2025-04-05",
    category: "Research Articles",
    volume: 1,
    issueNumber: 1,
    abstract:
      "This article examines physicians' right to refuse participation in medically assisted death when care conflicts with religious beliefs or moral convictions.",
    image: "/images/optimized/ethics-1600.webp",
    pdfBasename: "Religion",
  },
  {
    id: 4,
    title:
      "Meet Your Therapist: Exploring the Promise and Drawbacks of AI for Treating Digital Addictive Behavior among Adolescents",
    author: "Ray Gao",
    publishDate: "2025-04-08",
    category: "Research Articles",
    volume: 1,
    issueNumber: 1,
    abstract:
      "This paper reviews the potential and limits of AI-assisted interventions for adolescent digital addiction and mental health support.",
    image: "/images/optimized/therapy-800.webp",
    pdfBasename: "Meet Your Therapist",
  },
  {
    id: 5,
    title:
      "Making Our Seas Sustainable: Examining Iceland’s Maritime Sector through a Commercial, Legal, and Ethical Lens",
    author: "Jiahong Julia Fu, Siyi Lisa Feng",
    publishDate: "2025-04-10",
    category: "Research Articles",
    volume: 1,
    issueNumber: 1,
    abstract:
      "This article evaluates Iceland's fishing sector through commercial, legal, and ethical dimensions to surface transferable sustainability lessons.",
    image: "/images/optimized/iceland-1600.webp",
    pdfBasename: "Seas Sustainable",
  },
  {
    id: 6,
    title:
      "The Plastic Problem: The Ecological and Epidemiological Implications of Bacteria-Plastic Relationships",
    author: "Albert Zhou",
    publishDate: "2025-04-15",
    category: "Research Articles",
    volume: 1,
    issueNumber: 1,
    abstract:
      "A literature review of bacteria-plastic interactions and their ecological and public health implications across the plastic pollution crisis.",
    image: "/images/optimized/bacteria-1600.webp",
    pdfBasename: "The Plastic Problem",
  },
  {
    id: 7,
    title:
      "Foul on the Play: Legal Discretion in Cases Brought Against Professional Athletes",
    author: "Cole Shuster",
    publishDate: "2026-01-07",
    category: "Research Articles",
    volume: 2,
    issueNumber: 1,
    abstract:
      "A comparative analysis of prominent athlete criminal cases examining how status, institutions, and media can shape legal outcomes.",
    image: "/images/optimized/basketball-800.webp",
    pdfBasename: "Foul on the Play",
  },
  {
    id: 8,
    title:
      "Combat Sports: Friend or Foe to Youth’s Socioemotional and Physical Development?",
    author: "Shane Shuster",
    publishDate: "2026-01-07",
    category: "Research Articles",
    volume: 2,
    issueNumber: 1,
    abstract:
      "This article surveys mixed evidence on youth combat sports and offers recommendations to improve outcomes while reducing harm.",
    image: "/images/optimized/boxing-800.webp",
    pdfBasename: "Friend or Foe",
  },
  {
    id: 9,
    title:
      "Beyond the Fairway: Access, Equity, and Inclusion in the New Golf Economy",
    author: "Aaron Xu",
    publishDate: "2026-01-22",
    category: "Research Articles",
    volume: 2,
    issueNumber: 1,
    abstract:
      "An analysis of golf's changing business model and whether growth can expand equitable access without intentional inclusion strategies.",
    image: "/images/optimized/golf-1600.webp",
    pdfBasename: "Beyond the Fairway",
  },
  {
    id: 11,
    title:
      "A Quantitative Analysis of Natural Resource Economics on Global Wealth",
    author: "Andrew Leibowitz",
    school: "Cornell University",
    publishDate: "2026-01-07",
    category: "Research Articles",
    volume: 2,
    issueNumber: 1,
    abstract:
      "A cross-country quantitative analysis of natural resource rents, depletion, and GDP per capita from 1970 to 2022.",
    image: "/images/optimized/agri-1600.webp",
    pdfBasename: "Natural Resources Economics",
  },
  {
    id: 12,
    title:
      "Lessons from Arthur Miller's The Crucible: The Consequences of Merging Government and Religion",
    author: "Kate Wheeler",
    publishDate: "2026-04-28",
    category: "Research Articles",
    volume: 2,
    issueNumber: 2,
    abstract:
      "A perspective piece using The Crucible and contemporary case studies to argue that merging religious doctrine with government authority undermines due process and democratic principles.",
    image: "/images/optimized/crucible-1600.webp",
    pdfBasename: "The Crucible",
  },
] as const;

function toArticleSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const SITE_ARTICLES: SiteArticle[] = SITE_ARTICLE_SOURCE.map(
  (article) => ({
    ...article,
    slug: toArticleSlug(article.pdfBasename),
    doi: `${DOI_PREFIX}/jyi.v${article.volume}i${article.issueNumber}.${article.id}`,
    pdfPath: `/articles/${article.pdfBasename}.pdf`,
  }),
);

const SITE_ARTICLE_BY_SLUG = new Map(
  SITE_ARTICLES.map((article) => [article.slug, article]),
);

const SITE_ARTICLE_BY_TITLE = new Map(
  SITE_ARTICLES.map((article) => [article.title, article]),
);

const SITE_ARTICLE_BY_PDF_BASENAME = new Map(
  SITE_ARTICLES.map((article) => [article.pdfBasename, article]),
);

export function getSiteArticleFromSlug(slug: string) {
  const decoded = safeDecodeURIComponent(slug).trim();

  return (
    SITE_ARTICLE_BY_SLUG.get(decoded.toLowerCase()) ??
    SITE_ARTICLE_BY_PDF_BASENAME.get(decoded) ??
    SITE_ARTICLE_BY_TITLE.get(decoded) ??
    null
  );
}

export function getSiteArticleFromPdfPath(pdfPath: string) {
  const match = pdfPath.match(/^\/articles\/(.+)\.pdf$/i);
  if (!match) return null;

  const basename = safeDecodeURIComponent(match[1].trim());
  return SITE_ARTICLE_BY_PDF_BASENAME.get(basename) ?? null;
}
