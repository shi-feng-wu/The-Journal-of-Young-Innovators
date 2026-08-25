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
  pageCount: number;
  firstPage: number;
  lastPage: number;
  pdfPath: string;
  legacyPdfPath: string;
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
      "This report from the McKinsey Global Institute investigates \"arenas of competition,\" a category of industries distinguished by two attributes: capture of an outsize share of economic growth and unusually large shifts in market share among their participants. Drawing on a customized data set of the world's 3,000 largest companies by market capitalization, reclassified into 57 competitive categories, the authors identify twelve arenas that formed between 2005 and 2020 and quantify how they diverged from other industries, including a 10 percent revenue compound annual growth rate against 4 percent elsewhere, a rise from 9 to 49 percent of global economic profit, greater openness to new entrants, and stronger international reach. The analysis attributes arena formation to a three-part \"potion\" of technology or business model step changes, escalatory investment incentives, and large or growing addressable markets. Applying these criteria prospectively, the authors identify eighteen candidate future arenas that could produce $29 trillion to $48 trillion in revenues by 2040.",
    image: "/images/optimized/arenas-1600.webp",
    pdfBasename: "Arenas of Competition",
    pageCount: 213,
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
      "The rapidly evolving fields of neuroleadership and neuroeducation share a common aim of translating neuroscience research into practical strategies for human development, yet they have evolved largely independently. This opinion piece argues for their integration and proposes a unified framework that aligns the Brain-Targeted Teaching model with established leadership theories, including emotional intelligence, transformational, supportive, servant, adaptive, and authentic leadership. After reviewing traditional neuroleadership research on the neural correlates of leadership behavior and the role of neuroplasticity, the article examines each of the model's six brain targets in turn: emotional climate, physical environment, learning design, teaching for mastery, teaching for application, and evaluating learning. For each target, it identifies conditions that undermine learning and performance in organizational settings and offers research-based leadership practices to address them. The author concludes that this holistic, neuroscience-grounded approach enables leaders to cultivate cultures of continuous learning, well-being, and innovation.",
    image: "/images/optimized/leadership-800.webp",
    pdfBasename: "Neurons to Leaders",
    pageCount: 12,
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
      "International students in United States higher education increasingly confront visa revocations, suspended interviews, expanded vetting, and rising anti-immigrant sentiment, compounded by the retreat of institutional diversity and support structures. This opinion piece argues that leadership education, far from being an extracurricular luxury, constitutes core curriculum for such students. Drawing on a personal narrative from a women's leadership conference, recent United States immigration policy developments in spring 2025, and Thompson's concept of a global moral compass, the authors identify three capacities international students require: resilience to remain grounded within systems that pressure them toward invisibility, creativity to imagine futures beyond institutional prescription, and ethical clarity to choose integrity over assimilation. Because these students routinely reconcile conflicting cultural norms, institutional rules, and personal values, ethical reflection functions as a daily necessity rather than abstract theory. The authors conclude that institutions must embed leadership development across disciplines, preparing students for cross-border leadership whether they remain or return home.",
    image: "/images/optimized/neuroleadership-1600.webp",
    pdfBasename: "Standing Steady",
    pageCount: 6,
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
      "This review article examines whether physicians may permissibly refuse to participate in end-of-life care involving medically assisted death on religious or moral grounds. Noting that scholarship on religion and end-of-life care has centered on patients while neglecting providers' own convictions, the author asks to what extent clinicians should receive the same protections patients enjoy. The article traces the historical entanglement of religion and medicine from ancient Egyptian priest-healers through early Christian hospitals to contemporary religiously affiliated healthcare, then analyzes landmark Right-to-Die cases involving Quinlan, Cruzan, Schiavo, and Maynard, alongside shifting terminology from physician-assisted suicide to medical aid in dying. Drawing on the Hippocratic tradition, cross-religious prohibitions against killing, and the conscientious-objection literature, the author argues that providers are moral agents entitled to refuse. It concludes that referral to a willing provider preserves both parties' free will while preventing systemic abandonment of terminally ill patients.",
    image: "/images/optimized/ethics-1600.webp",
    pdfBasename: "Religion",
    pageCount: 15,
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
      "Adolescent addiction to digital technologies, including excessive video gaming, social media misuse, and online gambling, has emerged as a significant public health concern, yet conventional therapeutic responses remain difficult for many young people to obtain. This literature review synthesizes existing research to define behavioral addiction, document its neurological and psychosocial effects on youth aged nine to eighteen, and evaluate whether artificial intelligence can address the shortcomings of traditional treatment. The review identifies cost, clinician shortages and long wait times, and gender- and culture-inflected stigma as the principal barriers to care, and argues that natural language processing, machine learning, and conversational agents mitigate each through affordability, continuous availability, anonymity, objective screening, and personalized engagement. It further examines drawbacks including data privacy risks, algorithmic bias from unrepresentative training data, and the inability of machines to replicate empathy. The paper concludes that artificial intelligence should supplement rather than replace human clinicians within a hybrid model of care.",
    image: "/images/optimized/therapy-800.webp",
    pdfBasename: "Meet Your Therapist",
    pageCount: 17,
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
      "This article examines Iceland's fishing industry as a case study in sustainable commerce, developing a tri-part framework that treats sustainability through commercial, legal, and ethical lenses. Motivated by widespread consumer confusion over eco-labels and by the projected expansion of seafood as a lower-impact alternative to land-based meat, the authors argue that Iceland offers an instructive model because its fisheries are economically central, culturally embedded, and organized around environmental, social, and governance principles. Commercially, the sector maximizes resource efficiency through value-added byproducts and protects workers through crew certification and federal labor law; legally, an individual transferable quota system and third-party ecolabeling such as Marine Stewardship Council certification constrain overfishing and secure export advantages; ethically, bycatch mitigation and aquaculture reforms address animal welfare. The authors also identify shortcomings, notably quota concentration that excludes smaller and younger fishers, and conclude that Iceland's lessons should be adapted, not replicated wholesale.",
    image: "/images/optimized/iceland-1600.webp",
    pdfBasename: "Seas Sustainable",
    pageCount: 19,
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
      "Plastic pollution has become a pervasive environmental and public health concern, yet its epidemiological and ecological dimensions are typically examined in isolation. This review adopts an adapted PRISMA protocol, searching PubMed, Web of Science, ScienceDirect, and Google Scholar for English-language literature published between 2000 and 2024, and synthesizes the findings narratively to examine the relationship between bacteria and microplastics. The analysis finds that microplastics are associated with disruption of the human gut microbiome, damage to the intestinal epithelium, and endocrine interference, and that microplastic surfaces support biofilms that can harbor pathogenic and antibiotic-resistant bacteria, functioning as mobile disease vectors. Ecologically, microplastics reduce soil microbial diversity, alter soil structure and nutrient cycling, and depress crop performance. The review evaluates plastic-degrading bacteria, antimicrobial polymers, and plant-based alternatives such as hemp and bamboo, noting concerns about byproducts, biocontainment, scalability, and regulation, and argues for an integrated framework linking human and ecological health.",
    image: "/images/optimized/bacteria-1600.webp",
    pdfBasename: "The Plastic Problem",
    pageCount: 33,
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
      "This article examines how legal discretion operates in criminal cases brought against professional athletes, asking whether justice is genuinely blind when fame, wealth, and perceived social value are involved. Employing a qualitative comparative case-study design with purposively sampled cases selected against six criteria, it analyzes the prosecutions of football players Henry Ruggs III and Rashee Rice and Olympic wrestler Kyle Snyder using a five-part framework attending to the nature of the offense, legal proceedings, resource access, media framing, and institutional response. The comparison reveals a spectrum of legal elasticity in which the severity of resulting harm constrains leniency while financial and social capital consistently shape procedural outcomes, and in which sports leagues and governing bodies function as a parallel, largely opaque punitive system. The article concludes by recommending greater procedural transparency, standardized institutional disciplinary guidelines, improved public media literacy, and future research incorporating race.",
    image: "/images/optimized/basketball-800.webp",
    pdfBasename: "Foul on the Play",
    pageCount: 27,
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
      "Combat sports such as wrestling, boxing, and jiu-jitsu have grown in popularity among young people, yet scholarly assessments of their developmental impact remain divided. This article employs a narrative, interdisciplinary literature review, drawing on peer-reviewed research in sports medicine, developmental and educational psychology, pediatrics, and public health, alongside institutional position statements, to evaluate how participation shapes youth socioemotional and physical development. The review finds that combat sports cultivate humility, self-regulation, and perseverance, which function protectively against bullying, strengthen interpersonal relationships, and predict improved academic and professional outcomes into adulthood. Countervailing evidence indicates that weight-class structures implicitly encourage rapid weight loss, producing dehydration, impaired growth and bone development, heightened injury risk, diminished executive functioning, and body-image disturbance. Concluding that the effects are mixed, the article recommends standardized regulatory oversight of weight certification, comprehensive risk education for athletes and parents, and coach training in risk recognition and intervention.",
    image: "/images/optimized/boxing-800.webp",
    pdfBasename: "Friend or Foe",
    pageCount: 20,
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
      "Golf has expanded into an $88 billion global industry, yet its participant base remains narrow. This article examines the structural barriers that continue to restrict access to the sport along four intersecting dimensions: socioeconomic status, race, gender, and ability. Employing an interdisciplinary literature review drawing on sports sociology, disability studies, and labor economics, it analyzes peer-reviewed scholarship alongside government documents, legal mandates, and industry data. The review finds that private club initiation fees, equipment costs, dress codes, legacy membership systems, irregular low-wage work schedules, course siting in affluent suburbs, historical and informal racial exclusion, gendered wage gaps, and inaccessible course design jointly reproduce privilege and limit upward mobility through golf's networking function. It also identifies countervailing developments, including entertainment golf venues, publicly subsidized courses, school-based instruction, adaptive technologies, and adaptive tournaments, concluding that these intervention points must be scaled and paired with diverse leadership to convert symbolic inclusion into genuine inclusion.",
    image: "/images/optimized/golf-1600.webp",
    pdfBasename: "Beyond the Fairway",
    pageCount: 20,
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
      "This paper presents a quantitative observational study of the relationship between natural resource economics and national wealth across the period 1970 to 2022. Drawing on World Bank data for a random sample of eighteen countries, the author compares total natural resource rents as a percentage of gross domestic product and natural resource depletion as a percentage of gross national income against gross domestic product per capita, fitting logarithmic regression models in R and evaluating them through coefficients of determination and residual plots. Mean R-squared values of approximately 0.183 for rents and 0.240 for depletion, with medians below 0.10, fall well beneath the conventional 0.3 threshold, and most residual plots display clumping and non-random patterns. The results therefore support the null hypothesis of no significant logarithmic correlation, underscoring the heterogeneity of global economic conditions and the need for more granular data, additional trials, and more complex nonlinear models.",
    image: "/images/optimized/agri-1600.webp",
    pdfBasename: "Natural Resources Economics",
    pageCount: 28,
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
      "This perspective piece examines the implications of merging religious doctrine with governmental authority, using Arthur Miller's The Crucible as an interpretive lens for contemporary church-state relations. Combining literary analysis of the play's depiction of Puritan Salem with three illustrative case studies, the paper traces a spectrum ranging from constitutional separation to full theocracy. Stone v. Graham demonstrates judicial enforcement of First Amendment neutrality by striking down a Kentucky law mandating Ten Commandments displays in public-school classrooms. Taliban-governed Afghanistan, where religious law constitutes state law, illustrates the severe curtailment of women's education, employment, and freedom of movement that follows from theocratic rule. Project 2025 occupies an intermediate position, reflecting indirect yet consequential religious influence on proposed United States policy. The analysis argues that theological influence over legal systems incites fear, erodes due process, and produces systemic injustice, concluding that clear church-state separation is essential to democratic principles, individual rights, and equitable governance.",
    image: "/images/optimized/crucible-1600.webp",
    pdfBasename: "The Crucible",
    pageCount: 10,
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
  (article) => {
    const slug = toArticleSlug(article.pdfBasename);
    return {
      ...article,
      slug,
      doi: `${DOI_PREFIX}/jyi.v${article.volume}i${article.issueNumber}.${article.id}`,
      firstPage: 1,
      lastPage: article.pageCount,
      // Google Scholar requires the PDF to live in the same subdirectory as
      // the HTML abstract page (/issues/articles/<slug>).
      pdfPath: `/issues/articles/${slug}.pdf`,
      legacyPdfPath: `/articles/${article.pdfBasename}.pdf`,
    };
  },
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
  const match = pdfPath.match(/^(?:\/issues)?\/articles\/(.+)\.pdf$/i);
  if (!match) return null;

  const name = safeDecodeURIComponent(match[1].trim());
  return (
    SITE_ARTICLE_BY_PDF_BASENAME.get(name) ??
    SITE_ARTICLE_BY_SLUG.get(name.toLowerCase()) ??
    null
  );
}
