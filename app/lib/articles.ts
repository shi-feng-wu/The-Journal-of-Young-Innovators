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
      "McKinsey Global Institute researchers define arenas of competition as industries that capture an outsize share of economic growth while market share inside them changes hands at unusually high rates. The report reclassifies the world's 3,000 largest companies by market capitalization into 57 competitive categories and identifies twelve arenas that formed between 2005 and 2020. Those industries grew revenue at a 10 percent compound annual rate against 4 percent elsewhere, and their slice of global economic profit rose from 9 to 49 percent. They were also more open to new entrants and more international than their peers. The authors trace arena formation to three ingredients: a step change in technology or business model, an escalatory pattern of investment, and a large or growing addressable market. Applying the same criteria forward, the report names eighteen candidate arenas that could produce $29 trillion to $48 trillion in revenues by 2040.",
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
      "Neuroleadership and neuroeducation both try to turn neuroscience research into practical strategies for human development, yet the two fields have grown up with little reference to each other. This opinion piece proposes joining them through the Brain-Targeted Teaching model, which the author aligns with emotional intelligence theory and with transformational, supportive, servant, adaptive, and authentic leadership. The article first reviews neuroleadership research on the neural correlates of leadership behavior and on neuroplasticity. It then works through the model's six brain targets, from emotional climate and physical environment through learning design, mastery, application, and evaluation, and for each target pairs conditions that undermine learning and performance in organizations with research-based leadership practices that counter them. Leaders who attend to how brains actually learn, the author argues, are better placed to build workplaces where continuous learning, well-being, and innovation become ordinary.",
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
      "International students in United States higher education faced a hard spring in 2025: visa revocations, suspended interviews, expanded vetting, and a broader anti-immigrant turn, at the same time as many institutions were dismantling diversity and support programs. Against that backdrop, the authors argue that leadership education belongs in the core curriculum for these students. The argument draws on a personal narrative from a women's leadership conference and on Thompson's idea of a global moral compass. Three capacities matter most, the authors contend. Students need resilience to stay grounded inside systems that pressure them toward invisibility, creativity to imagine futures their institutions have not prescribed, and ethical clarity for the moments when integrity and assimilation pull in different directions. Because such students reconcile competing cultural norms, institutional rules, and personal values every day, ethical reflection is for them a working skill. The piece closes by urging institutions to embed leadership development across disciplines, since these students will lead across borders whether they stay or return home.",
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
      "Whether physicians may refuse on religious or moral grounds to take part in medically assisted death is the central question of this review. Scholarship on religion at the end of life has concentrated on patients; this article turns toward providers and asks how far their convictions deserve the protections patients already enjoy. It traces the long entanglement of religion and medicine, from Egyptian priest-healers and early Christian hospitals to today's religiously affiliated health systems, and revisits the right-to-die cases of Karen Ann Quinlan, Nancy Cruzan, Terri Schiavo, and Brittany Maynard along with the shift in terminology from physician-assisted suicide to medical aid in dying. On the strength of the Hippocratic tradition, prohibitions against killing shared across major religions, and the conscientious-objection literature, the author argues that clinicians are moral agents with a right to refuse. Referral to a willing provider, the review concludes, protects the physician's conscience without abandoning the patient.",
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
      "Many adolescents who compulsively game, scroll, or gamble online never receive treatment. Therapy is expensive, clinicians are scarce and waitlisted, and stigma weighs differently on boys and girls and across cultures. This literature review defines behavioral addiction, documents its neurological and psychosocial effects on youth aged nine to eighteen, and asks whether artificial intelligence can close the treatment gap. The evidence reviewed suggests that natural language processing, machine learning, and conversational agents answer the barriers point by point: they cost little, are available at any hour, preserve anonymity, screen objectively, and can personalize engagement. The review weighs those advantages against data privacy risks, algorithmic bias inherited from unrepresentative training data, and the plain fact that a machine cannot feel empathy. The paper concludes that artificial intelligence works best as a supplement to human clinicians within a hybrid model of care.",
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
      "Consumers who want sustainable seafood face a wall of eco-labels they mostly do not understand, even as seafood is projected to expand as a lower-impact alternative to land-based meat. This article treats Iceland's fishing industry as a case study in how sustainable commerce can be organized, examining the sector through the commercial, legal, and ethical lenses of a three-part framework. Iceland makes an instructive model because fishing is central to both its economy and its culture. Commercially, the industry extracts value from byproducts and protects its workers, foreign and temporary crews included, through certification requirements and federal labor law. Legally, individual transferable quotas and third-party ecolabels such as Marine Stewardship Council certification hold overfishing in check while securing export advantages. Ethically, bycatch mitigation and aquaculture reform address animal welfare. The model has flaws, and the clearest is quota concentration that shuts out smaller and younger fishers. Other nations, the authors argue, should adapt Iceland's lessons to their own circumstances instead of copying them outright.",
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
      "Research on plastic pollution tends to split its epidemiological consequences from its ecological ones. This review reads the two literatures together. Following an adapted PRISMA protocol, it searches PubMed, Web of Science, ScienceDirect, and Google Scholar for English-language studies published between 2000 and 2024 and synthesizes the findings narratively. In the human body, microplastics are associated with disruption of the gut microbiome, damage to the intestinal epithelium, and endocrine interference. Their surfaces also carry biofilms in which pathogenic and antibiotic-resistant bacteria can travel, so the particles themselves become mobile disease vectors. In soil, microplastics reduce microbial diversity and alter both structure and nutrient cycling; crop performance suffers as a result. The review then evaluates candidate responses, among them plastic-degrading bacteria, antimicrobial polymers, and plant-based alternatives such as hemp and bamboo, and it flags unresolved problems with byproducts, biocontainment, scalability, and regulation. The case made throughout is for a single framework that ties human health to ecological health.",
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
      "Is justice blind when the defendant is famous? This article studies how legal discretion operates in criminal cases brought against professional athletes, using a qualitative comparative design with cases purposively sampled against six criteria. The prosecutions of football players Henry Ruggs III and Rashee Rice and of Olympic wrestler Kyle Snyder are analyzed through a five-part framework covering the offense itself, the legal proceedings, access to resources, media framing, and institutional response. What emerges is a spectrum of legal elasticity. Severe harm limits how much leniency money can buy, but financial and social capital shape procedural outcomes in every case examined, and leagues and governing bodies run what amounts to a parallel disciplinary system with little transparency. The article closes with recommendations: publish and standardize institutional disciplinary guidelines, open the procedural record, invest in public media literacy, and bring race into future research designs.",
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
      "Wrestling, boxing, and jiu-jitsu keep drawing more young athletes, and researchers keep disagreeing about what the sports do to them. This narrative review reads across sports medicine, developmental and educational psychology, pediatrics, and public health, together with institutional position statements, to weigh the evidence on both sides. Participation builds self-regulation, humility, and perseverance, and those traits appear to protect against bullying and to predict stronger relationships and better academic and professional outcomes well into adulthood. The costs cluster around weight. Weight-class structures push athletes toward rapid weight cutting, and the documented consequences include dehydration, impaired growth and bone development, more injuries, weaker executive functioning, and disturbed body image. Given evidence this mixed, the article calls for standardized oversight of weight certification and comprehensive risk education for athletes and parents, and it asks that coaches be trained to recognize danger signs and step in.",
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
      "Golf now anchors an $88 billion global economy. Its player base has not widened to match. Through an interdisciplinary review spanning sports sociology, disability studies, and labor economics, read alongside government documents, legal mandates, and industry data, this article maps the barriers that still decide who plays: initiation fees and equipment costs, dress codes, legacy and referral membership systems, irregular low-wage work schedules, courses sited in affluent suburbs, a history of formal and informal racial exclusion, gendered wage gaps, and course designs that exclude players with disabilities. Because so much professional networking happens on the course, the same barriers also limit upward mobility. The article weighs countervailing developments too, among them entertainment golf venues, publicly subsidized courses, school-based instruction, adaptive equipment, the Americans with Disabilities Act, and adaptive tournaments. Whether those interventions amount to more than symbolism, it concludes, will depend on scale and on who ends up leading the institutions of the sport.",
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
      "This study asks whether natural resource wealth predicts national wealth. It puts the question to World Bank data for a random sample of eighteen countries over the period 1970 to 2022, comparing total natural resource rents as a share of gross domestic product, and natural resource depletion as a share of gross national income, against GDP per capita. Logarithmic regressions fitted in R are evaluated through coefficients of determination and residual plots. The models perform poorly. Mean R-squared values reach only about 0.183 for rents and 0.240 for depletion, the medians fall below 0.10, and most residual plots show clumping and other non-random patterns. The results therefore support the null hypothesis of no significant logarithmic correlation. Global economic conditions are too heterogeneous for so simple a relationship, the author suggests, and progress on the question will require finer-grained data, repeated trials, and nonlinear models.",
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
      "Arthur Miller's The Crucible dramatizes what happens when a government's authority and a church's doctrine become one, and this perspective piece uses the play to read contemporary church-state relations. Literary analysis of Puritan Salem is set beside three case studies arranged along a spectrum that runs from constitutional separation to theocracy. At one end, Stone v. Graham shows a court enforcing First Amendment neutrality by striking down Kentucky's mandate that public-school classrooms display the Ten Commandments. At the other, Taliban-governed Afghanistan shows religious law operating as state law, with severe limits on women's education, employment, and movement. Project 2025 sits between the two, an instance of indirect but consequential religious influence on proposed United States policy. Across the play and the cases the paper finds the same pattern: when theology steers the legal system, fear spreads, due process erodes, and injustice becomes systemic. Separating church from state, the author concludes, is what keeps governance equitable and individual rights secure.",
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
