export interface Story {
  slug: string;
  kicker: string;
  title: string;
  dek: string;
  body: string[];
  personIds: string[];
  groupIds: string[];
  /** Explicit edges worth calling out, by ID. */
  edgeIds: string[];
  caveat?: string;
}

export const STORIES: Story[] = [
  {
    slug: "openai-to-anthropic",
    kicker: "2015 → 2021",
    title: "From one lab to two",
    dek: "OpenAI’s launch team and Anthropic’s eight cofounders are bridged by documented research collaborations.",
    body: [
      "OpenAI’s December 2015 announcement named its launch team, including Sam Altman, Greg Brockman, Ilya Sutskever and John Schulman.",
      "In 2021, eight people who had worked at OpenAI cofounded Anthropic, among them Dario and Daniela Amodei, Jack Clark, Chris Olah and Jared Kaplan.",
      "The strongest bridge in this dataset is scientific: OpenAI stated that Dario Amodei and Ilya Sutskever co-led its research direction, and both appear among the GPT-3 paper’s authors.",
    ],
    personIds: [
      "sam-altman",
      "greg-brockman",
      "ilya-sutskever",
      "wojciech-zaremba",
      "john-schulman",
      "andrej-karpathy",
      "dario-amodei",
      "daniela-amodei",
      "jack-clark",
      "chris-olah",
      "jared-kaplan",
      "sam-mccandlish",
      "tom-brown",
      "ben-mann",
      "amanda-askell",
      "alec-radford",
    ],
    groupIds: ["G01", "G02", "G28", "G29"],
    edgeIds: ["E003", "E038", "E001", "E002"],
    caveat:
      "Shared employment and launch membership describe documented professional ties, not coordination between the companies.",
  },
  {
    slug: "transformer-2017",
    kicker: "2017",
    title: "The Transformer coauthors",
    dek: "Eight authors of “Attention Is All You Need”, and the companies several of them later started.",
    body: [
      "All eight authors of the 2017 Transformer paper are in this dataset.",
      "Their later documented founding ties reach Cohere (Aidan Gomez), Character.AI (Noam Shazeer), Sakana AI (Llion Jones), and Adept and Essential AI (Ashish Vaswani and Niki Parmar). Lukasz Kaiser later did research at OpenAI.",
      "Because every coauthor pair is linked, a single paper creates 28 pairwise ties. That density reflects authorship lists, not influence.",
    ],
    personIds: [
      "ashish-vaswani",
      "noam-shazeer",
      "niki-parmar",
      "jakob-uszkoreit",
      "llion-jones",
      "aidan-gomez",
      "lukasz-kaiser",
      "illia-polosukhin",
      "nick-frosst",
      "ivan-zhang",
      "david-ha",
      "ren-ito",
      "daniel-de-freitas",
      "david-luan",
    ],
    groupIds: ["G03", "G05", "G06", "G12", "G13", "G14"],
    edgeIds: ["E036"],
  },
  {
    slug: "openai-governance-2023",
    kicker: "Nov 2023 → 2024",
    title: "OpenAI governance, 2023",
    dek: "The board named in November 2023, the executives at the center of the transition, and the 2024 safety committee.",
    body: [
      "OpenAI’s November 2023 announcement listed Ilya Sutskever, Adam D’Angelo, Helen Toner and Tasha McCauley as directors. Mira Murati was named interim CEO.",
      "After Sam Altman’s return, Bret Taylor became board chair. In 2024, Taylor, D’Angelo, Nicole Seligman and Altman were named to the board’s safety and security committee.",
      "Paul Christiano is named on the later board structure, but this dataset has no documented person-to-person tie for him, so he appears unconnected.",
    ],
    personIds: [
      "sam-altman",
      "mira-murati",
      "greg-brockman",
      "ilya-sutskever",
      "adam-d-angelo",
      "helen-toner",
      "tasha-mccauley",
      "bret-taylor",
      "nicole-seligman",
      "paul-christiano",
    ],
    groupIds: ["G21", "G22"],
    edgeIds: ["E011", "E012"],
    caveat:
      "Serving on the same board documents a governance relationship. It does not indicate agreement or friendship.",
  },
  {
    slug: "deepmind-to-microsoft",
    kicker: "2010 → 2024",
    title: "DeepMind → Inflection → Microsoft",
    dek: "Mustafa Suleyman’s route from DeepMind cofounder to the head of Microsoft AI.",
    body: [
      "Mustafa Suleyman cofounded DeepMind with Demis Hassabis and Shane Legg in 2010. That predates this map’s 2015 scope, so the tie is drawn as contextual.",
      "In 2022 he cofounded Inflection AI with Karén Simonyan and Reid Hoffman. Simonyan is also an AlphaGo Zero coauthor with Hassabis.",
      "In 2024 Satya Nadella announced that Suleyman and Simonyan would join the new Microsoft AI organization. Hoffman has been on Microsoft’s board since 2017.",
    ],
    personIds: [
      "mustafa-suleyman",
      "demis-hassabis",
      "shane-legg",
      "david-silver",
      "kar-n-simonyan",
      "reid-hoffman",
      "satya-nadella",
      "sam-altman",
    ],
    groupIds: ["G09", "G31"],
    edgeIds: ["E006", "E007", "E005", "E032", "E004"],
  },
  {
    slug: "critics-and-lawmakers",
    kicker: "2018 → 2025",
    title: "Auditors, critics and lawmakers",
    dek: "Influence over AI isn’t limited to model builders: research audits, critiques and legislation each form their own clusters.",
    body: [
      "Gender Shades (2018) linked Joy Buolamwini and Timnit Gebru. Gebru and Margaret Mitchell co-led Google’s Ethical AI team, and both coauthored Stochastic Parrots (2021) with Emily M. Bender.",
      "The EU AI Act co-rapporteurs and the founding U.S. AI Safety Institute leadership each form a separate documented cluster.",
      "None of these clusters connects to the frontier-lab component through a verified, path-eligible tie in this dataset.",
    ],
    personIds: [
      "joy-buolamwini",
      "timnit-gebru",
      "margaret-mitchell",
      "emily-m-bender",
      "brando-benifei",
      "drago-tudorache",
      "gina-raimondo",
      "elizabeth-kelly",
      "elham-tabassi",
    ],
    groupIds: ["G18", "G19", "G23", "G24"],
    edgeIds: ["E039", "E044", "E045"],
  },
  {
    slug: "honest-gaps",
    kicker: "What the data doesn’t show",
    title: "Important, but unconnected",
    dek: "Eleven people have no path-eligible tie in this curated dataset. They are shown that way, not given invented links.",
    body: [
      "Jensen Huang, Liang Wenfeng, Sundar Pichai and Andrew Ng shape modern AI, but the sources collected here don’t document a qualifying person-to-person tie for them.",
      "An empty neighbourhood marks a gap in the evidence collected so far. It says nothing about a person’s importance.",
    ],
    personIds: [
      "jensen-huang",
      "liang-wenfeng",
      "tang-jie",
      "sundar-pichai",
      "sergey-brin",
      "andrew-ng",
      "percy-liang",
      "rumman-chowdhury",
      "dan-hendrycks",
      "paul-christiano",
      "joe-biden",
    ],
    groupIds: [],
    edgeIds: [],
  },
];

export const storiesBySlug = new Map(STORIES.map((s) => [s.slug, s]));
