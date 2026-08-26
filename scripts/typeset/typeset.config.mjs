/**
 * Per-article galley settings.
 *
 *   runhead   — right-hand side of the running head (AUTHOR · SHORT TITLE).
 *   firstPage — folio printed on the galley's first page. Seeded to 1 for every
 *               article; issue integration edits these once the issue is
 *               paginated continuously.
 *
 * `arenas-of-competition` is deliberately absent — it is not being re-typeset.
 */
export const TYPESET_CONFIG = {
  "neurons-to-leaders": {
    runhead: "HARDIMAN · FROM NEURONS TO LEADERS",
    firstPage: 1,
  },
  "standing-steady": {
    runhead: "OCHILLO & MA · STANDING STEADY",
    firstPage: 1,
  },
  religion: {
    runhead: "LUO · RELIGION, ETHICS, AND MEDICINE",
    firstPage: 1,
  },
  "meet-your-therapist": {
    runhead: "GAO · MEET YOUR THERAPIST",
    firstPage: 1,
  },
  "seas-sustainable": {
    runhead: "FU & FENG · MAKING OUR SEAS SUSTAINABLE",
    firstPage: 1,
  },
  "the-plastic-problem": {
    runhead: "ZHOU · THE PLASTIC PROBLEM",
    firstPage: 1,
  },
  "foul-on-the-play": {
    runhead: "SHUSTER · FOUL ON THE PLAY",
    firstPage: 1,
  },
  "friend-or-foe": {
    runhead: "SHUSTER · COMBAT SPORTS",
    firstPage: 1,
  },
  "beyond-the-fairway": {
    runhead: "XU · BEYOND THE FAIRWAY",
    firstPage: 1,
  },
  "natural-resources-economics": {
    runhead: "LEIBOWITZ · NATURAL RESOURCE ECONOMICS",
    firstPage: 1,
  },
  "the-crucible": {
    runhead: "WHEELER · THE CRUCIBLE",
    firstPage: 1,
  },
  "global-testing": {
    runhead: "TONG · THE GLOBAL TESTING BUSINESS",
    firstPage: 8,
  },
  "algorithmic-trading": {
    runhead: "ZHANG · ALGORITHMIC TRADING",
    firstPage: 16,
  },
  "bilingual-charisma": {
    runhead: "LUO · BILINGUAL, BICULTURAL, CHARISMATIC",
    firstPage: 22,
  },
  "american-lens": {
    runhead: "LE · BEYOND THE AMERICAN LENS",
    firstPage: 31,
  },
  "black-box": {
    runhead: "YANG · BEYOND THE BLACK BOX",
    firstPage: 48,
  },
};

export function getTypesetConfig(slug) {
  const config = TYPESET_CONFIG[slug];
  if (!config) {
    throw new Error(`No typeset config for "${slug}" (add it to typeset.config.mjs)`);
  }
  return config;
}

export default TYPESET_CONFIG;
