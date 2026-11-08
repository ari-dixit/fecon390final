# People Shaping Modern AI — Since 2015
**Research and implementation document | 7 November 2026**

## 1. Project purpose and scope
This is a seed corpus for a public-facing, interactive map of prominent people working on AI from **2015 onward**. The intended product has (a) a navigable graph of person nodes, (b) click-to-expand relationship evidence, (c) degrees-of-separation paths, and (d) a searchable people directory with short biographies. The roster deliberately includes founders, scientific researchers, operators, infrastructure leaders, independent critics and policymakers—not just generative-AI CEOs.

**Dataset summary:** 107 people across 12 thematic clusters; 37 evidence-backed groups; 56 manually curated cross-group connections. Groups yield 242 additional documented pairwise links when expanded; 264 eligible edges in the default path graph. The graph may have disconnected components; that is a feature of honest evidence, not a data error.

### Ground rules for a credible graph
- A graph edge means a specific, documented professional tie, not simply shared opinions or sector participation.
- Do not interpret association, funding by a company, organizational reporting or co-employment as personal friendship or a hidden power structure.
- Use only path_eligible=true edges in the default degrees-of-separation calculation.
- Groups encode documented shared projects, cofounding or coauthorship; small group pairwise ties may be materialized algorithmically.
- Render path_eligible=false links as optional dotted contextual links; they are not included in shortest paths.
- Show year_or_period and linked sources on all person and connection details.
- Preserve alumni affiliations and historical labels; don’t label 2023 roles as current in 2026.
- Show isolated/disconnected people accurately instead of inventing connections.
- Relationships before 2015 are context only and disabled by default.
- This is a curated starter dataset, not a definitive census or a causal measure of influence.

### Connection logic
The highest-confidence connections are **cofounders, paper coauthors, members of a named small team, people serving on the same specific board/committee at the same time, or directly documented appointments/collaborations**. Weak contextual links (same broad employer, successive roles, company-level advisory relationships) are flagged `path_eligible=false`. The JSON separates group relationships from explicit cross-group edges and includes a pre-expanded edge list for simple graph libraries.

## 2. People directory

### OpenAI (21)

**Sam Altman** — Co-chair at launch; subsequently CEO of OpenAI.  
*Why include:* Central executive and governance node connecting the original research lab to commercial deployment and policy debates.  
*2015+ milestones:* 2015 OpenAI launch; CEO from 2019; removed/reinstated in Nov. 2023; on expanded board in 2024.  
*Evidence:* [S01](#s01), [S17](#s17), [S18](#s18), [S51](#s51).

**Greg Brockman** — Founding CTO; president.  
*Why include:* Built early OpenAI engineering organization and served as a key executive through the lab’s growth.  
*2015+ milestones:* Founding CTO 2015; president by 2023; featured in 2024 board review.  
*Evidence:* [S01](#s01), [S51](#s51), [S37](#s37).

**Ilya Sutskever** — OpenAI cofounder and former chief scientist; SSI cofounder.  
*Why include:* Links Google Brain-era deep learning, OpenAI founding, its 2023 board crisis, and the founding of SSI.  
*2015+ milestones:* OpenAI research director 2015–2024; OpenAI board 2023; SSI cofounder 2024.  
*Evidence:* [S01](#s01), [S17](#s17), [S19](#s19), [S16](#s16).

**Wojciech Zaremba** — OpenAI founding researcher.  
*Why include:* Founding technical contributor; listed among leadership contributors on the o1 research program.  
*2015+ milestones:* OpenAI founding member 2015; o1 leadership contributor 2024.  
*Evidence:* [S01](#s01), [S37](#s37).

**John Schulman** — OpenAI cofounder; Thinking Machines Lab cofounder.  
*Why include:* Connects OpenAI reinforcement learning, Anthropic, and the later Thinking Machines founding team.  
*2015+ milestones:* Founded OpenAI 2015; joined Anthropic 2024; Thinking Machines cofounder 2025.  
*Evidence:* [S01](#s01), [S15](#s15), [S49](#s49).

**Andrej Karpathy** — OpenAI founding researcher; former Tesla AI director; educator.  
*Why include:* A particularly clear bridge from OpenAI to Tesla’s AI operations and Stanford research/education.  
*2015+ milestones:* OpenAI 2015–2017 and 2023–2024; Tesla AI 2017–2022; Eureka Labs 2024.  
*Evidence:* [S01](#s01), [S53](#s53).

**Mira Murati** — Former OpenAI CTO; Thinking Machines Lab founder/CEO.  
*Why include:* Led high-profile product and technical operations at OpenAI before launching another frontier lab.  
*2015+ milestones:* OpenAI CTO during ChatGPT era; interim CEO Nov. 2023; launched Thinking Machines in 2025.  
*Evidence:* [S17](#s17), [S51](#s51), [S15](#s15).

**Jakub Pachocki** — OpenAI chief scientist after Ilya Sutskever.  
*Why include:* Research leadership across large-scale reinforcement learning and GPT-4 development.  
*2015+ milestones:* Joined OpenAI 2017; became chief scientist 2024.  
*Evidence:* [S19](#s19), [S37](#s37).

**Mark Chen** — OpenAI chief research officer.  
*Why include:* An important research-to-product leader and documented contributor to the o1 program.  
*2015+ milestones:* Named chief research officer in 2025; listed on o1 leadership team.  
*Evidence:* [S20](#s20), [S37](#s37).

**Lukasz Kaiser** — Transformer paper coauthor; later OpenAI researcher.  
*Why include:* Unusually direct link between the 2017 Transformer team and OpenAI’s frontier research.  
*2015+ milestones:* 2017 Transformer coauthor; later OpenAI researcher and o1 leadership contributor.  
*Evidence:* [S04](#s04), [S37](#s37).

**Alec Radford** — OpenAI researcher associated with early GPT, CLIP and Whisper.  
*Why include:* Represents the model-design contributions underlying the GPT series and multimodal systems.  
*2015+ milestones:* Research contributor to landmark OpenAI model families in 2018–2022; later advisory role at Thinking Machines.  
*Evidence:* [S49](#s49).

**Barret Zoph** — Former OpenAI post-training researcher; Thinking Machines cofounder.  
*Why include:* Moves between Google Brain, OpenAI, and Thinking Machines, illustrating talent circulation among labs.  
*2015+ milestones:* OpenAI research leader; founded Thinking Machines in 2025; later left the startup.  
*Evidence:* [S15](#s15), [S49](#s49), [S37](#s37).

**Lilian Weng** — Former OpenAI safety research leader; Thinking Machines founding team.  
*Why include:* Important bridge between OpenAI safety research and the Thinking Machines founding cohort.  
*2015+ milestones:* OpenAI safety systems leadership; Thinking Machines founding cohort 2025.  
*Evidence:* [S49](#s49), [S37](#s37).

**Andrew Tulloch** — Former OpenAI engineer; Thinking Machines founding team.  
*Why include:* Another cross-lab movement connecting frontier model engineering to a new AI startup.  
*2015+ milestones:* OpenAI engineering; cofounder at Thinking Machines in 2025; later departed.  
*Evidence:* [S49](#s49).

**Luke Metz** — Former OpenAI researcher; Thinking Machines founding team.  
*Why include:* Represents the research cohort that followed Mira Murati into a new lab.  
*2015+ milestones:* Thinking Machines founding cohort 2025 after work at OpenAI.  
*Evidence:* [S49](#s49).

**Bret Taylor** — OpenAI board chair; technology executive.  
*Why include:* Governance bridge from OpenAI’s 2023 leadership reset into its expanded board.  
*2015+ milestones:* Became OpenAI board chair during Nov. 2023 reconstitution.  
*Evidence:* [S51](#s51), [S18](#s18), [S48](#s48).

**Adam D’Angelo** — Quora CEO and OpenAI board member.  
*Why include:* Rare long-serving independent board member spanning the Nov. 2023 governance dispute and later board.  
*2015+ milestones:* On OpenAI board in 2023, 2024 and later structure announcements.  
*Evidence:* [S17](#s17), [S18](#s18), [S48](#s48).

**Helen Toner** — Former OpenAI board director; AI governance researcher.  
*Why include:* Publicly documented role in the November 2023 OpenAI board and AI governance debate.  
*2015+ milestones:* Served on OpenAI board through Nov. 2023 transition.  
*Evidence:* [S17](#s17).

**Tasha McCauley** — Former OpenAI board director.  
*Why include:* One of the named independent directors in the November 2023 OpenAI governance events.  
*2015+ milestones:* Served on OpenAI board in 2023.  
*Evidence:* [S17](#s17).

**Nicole Seligman** — OpenAI independent director.  
*Why include:* Served on the reconstituted board and its safety/security committee in 2024.  
*2015+ milestones:* Joined OpenAI board March 2024; safety/security committee member.  
*Evidence:* [S18](#s18), [S24](#s24), [S48](#s48).

**Paul Christiano** — AI alignment researcher; OpenAI independent director.  
*Why include:* Connects technical alignment research and the nonprofit governance structure of OpenAI.  
*2015+ milestones:* Named on OpenAI foundation board in its post-2025 structure.  
*Evidence:* [S48](#s48).


### Anthropic (9)

**Dario Amodei** — Anthropic cofounder and CEO; former OpenAI VP of research.  
*Why include:* A visible bridge from OpenAI scaling research to Anthropic’s safety-focused commercial frontier models.  
*2015+ milestones:* OpenAI VP of research before 2021; founded Anthropic 2021.  
*Evidence:* [S02](#s02), [S03](#s03).

**Daniela Amodei** — Anthropic cofounder and president.  
*Why include:* Combines safety, operations, governance and company leadership across OpenAI and Anthropic.  
*2015+ milestones:* Former OpenAI VP of safety; cofounded Anthropic 2021.  
*Evidence:* [S02](#s02), [S03](#s03).

**Jack Clark** — Anthropic cofounder; formerly OpenAI policy director.  
*Why include:* Policy-focused founder connecting lab operations with the public debate on AI’s social impact.  
*2015+ milestones:* OpenAI policy director before 2021; Anthropic cofounder.  
*Evidence:* [S02](#s02), [S03](#s03).

**Chris Olah** — Anthropic cofounder; interpretability research lead.  
*Why include:* Prominent mechanistic-interpretability researcher who moved from OpenAI to Anthropic.  
*2015+ milestones:* OpenAI interpretability research; Anthropic cofounder 2021.  
*Evidence:* [S02](#s02), [S03](#s03).

**Jared Kaplan** — Anthropic cofounder; research leader.  
*Why include:* Foundational work on scaling laws and subsequent frontier-model research at Anthropic.  
*2015+ milestones:* OpenAI scaling-laws research; Anthropic cofounder 2021.  
*Evidence:* [S02](#s02), [S03](#s03).

**Sam McCandlish** — Anthropic cofounder; chief architect.  
*Why include:* Developed large-model training research at OpenAI before joining the Anthropic founding team.  
*2015+ milestones:* Former OpenAI AI-safety lead; Anthropic cofounder 2021.  
*Evidence:* [S02](#s02), [S03](#s03).

**Tom Brown** — Anthropic cofounder; chief compute officer.  
*Why include:* Previously led GPT-3 engineering, then helped build Anthropic compute capabilities.  
*2015+ milestones:* OpenAI GPT-3 engineering; Anthropic cofounder 2021.  
*Evidence:* [S02](#s02), [S03](#s03).

**Ben Mann** — Anthropic cofounder; former OpenAI engineer.  
*Why include:* Another founder whose career makes the OpenAI–Anthropic talent split concrete.  
*2015+ milestones:* OpenAI GPT-3/API engineering; Anthropic cofounder 2021.  
*Evidence:* [S03](#s03).

**Amanda Askell** — Anthropic AI alignment and model behavior researcher.  
*Why include:* Known for work on model personality, alignment and human values in Claude systems.  
*2015+ milestones:* Worked in AI safety at OpenAI then Anthropic.  
*Evidence:* [S03](#s03).  *Editorial note:* S03 documents early OpenAI-to-Anthropic staff; verify latest job title before launch.


### Google DeepMind (8)

**Demis Hassabis** — Google DeepMind cofounder and scientific leader.  
*Why include:* Central to DeepMind/Google Brain integration, AlphaFold, and broader frontier-AI research.  
*2015+ milestones:* Led DeepMind through 2023 merger with Google Brain; co-recipient 2024 Chemistry Nobel.  
*Evidence:* [S05](#s05), [S06](#s06).

**Shane Legg** — DeepMind cofounder and AGI researcher.  
*Why include:* Founding DeepMind research voice and early AGI proponent; retained as a historical organizational tie.  
*2015+ milestones:* Prominent DeepMind AGI research and leadership activity since 2015.  
*Evidence:* [S05](#s05).  *Editorial note:* DeepMind founding in 2010 predates the primary 2015+ timeline.

**Mustafa Suleyman** — DeepMind and Inflection cofounder; Microsoft AI leader.  
*Why include:* A highly legible path from DeepMind to Inflection to Microsoft’s consumer AI effort.  
*2015+ milestones:* DeepMind cofounder (2010); Inflection cofounder 2022; joined Microsoft AI 2024.  
*Evidence:* [S07](#s07), [S36](#s36).

**David Silver** — DeepMind reinforcement-learning researcher.  
*Why include:* Known for work associated with AlphaGo and later reinforcement-learning research at DeepMind.  
*2015+ milestones:* DeepMind reinforcement learning and AlphaGo-era research 2015 onward.  
*Evidence:* [S05](#s05).

**John Jumper** — AlphaFold research leader and 2024 Nobel laureate.  
*Why include:* Illustrates AI’s application beyond chatbots through protein-structure prediction.  
*2015+ milestones:* AlphaFold 2 (2021); shared 2024 Chemistry Nobel with Demis Hassabis.  
*Evidence:* [S06](#s06), [S47](#s47).

**Jeff Dean** — Google senior AI research leader.  
*Why include:* A long-running research executive connecting Google Brain and the later DeepMind organization.  
*2015+ milestones:* Senior leader during Google Brain era and its 2023 integration with DeepMind.  
*Evidence:* [S05](#s05).

**Sundar Pichai** — Google/Alphabet CEO.  
*Why include:* Executive decision-maker for AI deployment and the Google Brain–DeepMind combination.  
*2015+ milestones:* Led Google and Alphabet as AI research became central to products after 2015.  
*Evidence:* [S05](#s05).

**Sergey Brin** — Google cofounder.  
*Why include:* Relevant as a corporate founder and contributor to Google’s strategic direction in the generative-AI era.  
*2015+ milestones:* Google/Alphabet involvement during the 2020s AI expansion.  
*Evidence:* [S05](#s05).  *Editorial note:* A direct person-to-person edge is not inferred merely from Google co-affiliation.


### Transformer ecosystem (11)

**Noam Shazeer** — Transformer coauthor; Character.AI cofounder; Google DeepMind researcher.  
*Why include:* Worked on the 2017 Transformer and founded Character.AI before returning to Google.  
*2015+ milestones:* Transformer paper 2017; Character.AI 2021; returned to Google 2024.  
*Evidence:* [S04](#s04), [S35](#s35).

**Ashish Vaswani** — Lead-named Transformer coauthor; Adept/Essential AI cofounder.  
*Why include:* Bridge from the seminal Transformer paper to two subsequent model startups.  
*2015+ milestones:* 2017 Transformer coauthor; Adept cofounder 2022; Essential AI cofounder 2023.  
*Evidence:* [S04](#s04), [S54](#s54).

**Niki Parmar** — Transformer coauthor; Adept/Essential AI cofounder.  
*Why include:* Connects Google’s Transformer work to two startup founding cohorts with Ashish Vaswani.  
*2015+ milestones:* 2017 Transformer coauthor; Adept cofounder 2022; Essential AI cofounder.  
*Evidence:* [S04](#s04), [S54](#s54).

**Jakob Uszkoreit** — Transformer coauthor; later AI-biotechnology founder.  
*Why include:* Member of 2017 Transformer research team; later pursued machine learning for biological systems.  
*2015+ milestones:* 2017 Transformer paper; later founded Inceptive.  
*Evidence:* [S04](#s04).

**Llion Jones** — Transformer coauthor; Sakana AI cofounder.  
*Why include:* Connects 2017 Google Transformer research to Japan-based Sakana AI.  
*2015+ milestones:* Transformer paper 2017; Sakana AI cofounder 2023.  
*Evidence:* [S04](#s04), [S11](#s11).

**Aidan Gomez** — Transformer coauthor; Cohere CEO/cofounder.  
*Why include:* Links foundational model architecture research to enterprise AI commercialization.  
*2015+ milestones:* Transformer paper 2017; Cohere cofounder 2019.  
*Evidence:* [S04](#s04), [S10](#s10).

**Illia Polosukhin** — Transformer coauthor; NEAR Protocol cofounder.  
*Why include:* Shows the original Transformer team’s later spread into blockchain and open infrastructure.  
*2015+ milestones:* Transformer paper 2017; cofounder of NEAR ecosystem.  
*Evidence:* [S04](#s04).

**Daniel De Freitas** — Character.AI cofounder; former Google researcher.  
*Why include:* Co-founded Character.AI with Shazeer before both returned to Google in 2024.  
*2015+ milestones:* Character.AI cofounder 2021; returned to Google 2024.  
*Evidence:* [S35](#s35).

**David Ha** — Sakana AI cofounder; former Google Brain researcher.  
*Why include:* Connects Google Brain research in Japan with the Sakana AI startup ecosystem.  
*2015+ milestones:* Former Google Brain researcher; cofounder Sakana AI in 2023.  
*Evidence:* [S11](#s11).

**Ren Ito** — Sakana AI cofounder and chairman.  
*Why include:* Provides an operating/policy background alongside Sakana’s research founders.  
*2015+ milestones:* Cofounded Sakana AI 2023; former Ministry of Foreign Affairs of Japan and Stability AI executive.  
*Evidence:* [S11](#s11).

**David Luan** — Adept AI cofounder.  
*Why include:* Built an agent-centric startup alongside Transformer coauthors Ashish Vaswani and Niki Parmar.  
*2015+ milestones:* Founded Adept with Vaswani and Parmar 2022.  
*Evidence:* [S54](#s54).


### Meta / Scale (8)

**Mark Zuckerberg** — Meta founder and CEO.  
*Why include:* Executive leadership over FAIR, Llama, and the formation of Meta Superintelligence Labs.  
*2015+ milestones:* Meta AI expansion and 2025 creation of Superintelligence Labs.  
*Evidence:* [S09](#s09).

**Yann LeCun** — Former Meta chief AI scientist; world-models researcher.  
*Why include:* Led FAIR’s scientific direction, articulated an alternative to text-only LLM approaches, and later launched a new lab.  
*2015+ milestones:* Meta AI leadership 2015–2025; left to pursue AMI Labs in 2025–2026.  
*Evidence:* [S05](#s05), [S74](#s74).  *Editorial note:* Left Meta in 2025 and launched an independent research startup; reverify precise current title before publishing.

**Joelle Pineau** — Former Meta AI research VP; Cohere chief AI officer.  
*Why include:* A major cross-company transition from Meta open research to Cohere enterprise AI.  
*2015+ milestones:* Led FAIR/Meta AI research; left Meta 2025; joined Cohere leadership.  
*Evidence:* [S10](#s10).

**Alexandr Wang** — Scale AI cofounder; Meta AI executive.  
*Why include:* Links training-data infrastructure with Meta’s 2025 AI reorganization.  
*2015+ milestones:* Scale cofounder 2016; moved to Meta to lead AI efforts in 2025.  
*Evidence:* [S13](#s13), [S09](#s09).

**Lucy Guo** — Scale AI cofounder.  
*Why include:* Early founder of a key AI training-data company, with a trajectory separate from cofounder Alexandr Wang.  
*2015+ milestones:* Cofounded Scale AI in 2016; later pursued other entrepreneurial projects.  
*Evidence:* [S67](#s67), [S13](#s13).

**Nat Friedman** — AI investor; Meta AI product leader.  
*Why include:* Connects venture investing and 2025 Meta AI product/research leadership.  
*2015+ milestones:* AI investing with Daniel Gross; 2025 role leading AI products and applied research at Meta.  
*Evidence:* [S09](#s09).

**Daniel Gross** — SSI cofounder; AI investor; later Meta.  
*Why include:* A rare link between Ilya Sutskever’s SSI, AI investing, and Meta Superintelligence Labs.  
*2015+ milestones:* SSI cofounder 2024; left SSI in 2025 and joined Meta AI effort.  
*Evidence:* [S16](#s16).  *Editorial note:* Meta affiliation is corroborated by 2025–26 reporting; time-box connections.

**Shengjia Zhao** — Former OpenAI researcher; Meta AI research leadership.  
*Why include:* OpenAI o1 contributor who moved into Meta’s superintelligence research leadership.  
*2015+ milestones:* OpenAI o1 contributor 2024; Meta MSL chief scientist 2025.  
*Evidence:* [S37](#s37), [S09](#s09).


### Microsoft AI (3)

**Satya Nadella** — Microsoft chairman/CEO.  
*Why include:* Led Microsoft’s generative AI expansion and created Microsoft AI under Mustafa Suleyman.  
*2015+ milestones:* Microsoft AI reorganization and executive appointments in 2024.  
*Evidence:* [S07](#s07).

**Karén Simonyan** — Inflection cofounder; Microsoft AI chief scientist at 2024 launch.  
*Why include:* Directly connects Inflection’s founders with Microsoft’s new consumer AI organization.  
*2015+ milestones:* Inflection technical leadership; moved to Microsoft AI 2024.  
*Evidence:* [S07](#s07).

**Reid Hoffman** — Investor; Inflection cofounder; former OpenAI director; Microsoft board member.  
*Why include:* One of the clearest overlaps among OpenAI funding/boards, Microsoft governance, and AI startup creation.  
*2015+ milestones:* OpenAI early supporter and board member 2019–2023; Inflection cofounder 2022; Microsoft board since 2017.  
*Evidence:* [S01](#s01), [S36](#s36).


### Mistral AI (3)

**Arthur Mensch** — Mistral AI cofounder and CEO.  
*Why include:* Founded a major European frontier-model company after research at DeepMind.  
*2015+ milestones:* Mistral cofounder 2023; prior DeepMind researcher.  
*Evidence:* [S08](#s08).

**Guillaume Lample** — Mistral AI cofounder; research leader.  
*Why include:* Former Meta research scientist and one of Mistral’s three founders.  
*2015+ milestones:* Meta AI research background; Mistral cofounder 2023.  
*Evidence:* [S08](#s08).

**Timothée Lacroix** — Mistral AI cofounder; CTO.  
*Why include:* Former Meta researcher and technical founder of Mistral.  
*2015+ milestones:* Meta AI research background; Mistral cofounder 2023.  
*Evidence:* [S08](#s08).


### xAI / AI companies (5)

**Elon Musk** — OpenAI 2015 co-chair; Tesla CEO; xAI founder.  
*Why include:* Connects OpenAI’s initial formation, Tesla autonomous systems, and the subsequent launch of xAI.  
*2015+ milestones:* OpenAI co-chair 2015; left board 2018; launched xAI 2023.  
*Evidence:* [S01](#s01), [S59](#s59), [S34](#s34).

**Igor Babuschkin** — xAI original team; former DeepMind/OpenAI researcher.  
*Why include:* Example of movement across DeepMind, OpenAI, and xAI.  
*2015+ milestones:* Worked at DeepMind and OpenAI before xAI’s 2023 launch.  
*Evidence:* [S34](#s34).

**Jimmy Ba** — xAI original research team; University of Toronto professor.  
*Why include:* Prominent deep-learning researcher in the xAI launch cohort.  
*2015+ milestones:* Joined original xAI research team in 2023.  
*Evidence:* [S34](#s34).

**Yuhuai Wu** — xAI founding researcher.  
*Why include:* Early member of xAI’s model research effort after experience at Google and other labs.  
*2015+ milestones:* On original xAI research team 2023.  
*Evidence:* [S34](#s34).

**Christian Szegedy** — Original xAI researcher; former Google scientist.  
*Why include:* An early xAI researcher with substantial Google research experience.  
*2015+ milestones:* Moved from Google to xAI launch team in 2023.  
*Evidence:* [S34](#s34).


### AI startups / infrastructure (17)

**Nick Frosst** — Cohere cofounder.  
*Why include:* Cofounded a leading enterprise language-model company with Aidan Gomez and Ivan Zhang.  
*2015+ milestones:* Cohere cofounder 2019.  
*Evidence:* [S10](#s10), [S55](#s55).

**Ivan Zhang** — Cohere cofounder.  
*Why include:* Combines operating and technical startup experience as part of the Cohere founding trio.  
*2015+ milestones:* Cohere cofounder 2019.  
*Evidence:* [S10](#s10), [S55](#s55).

**Aravind Srinivas** — Perplexity cofounder and CEO.  
*Why include:* Former OpenAI researcher who brought LLMs into web search and answer products.  
*2015+ milestones:* Worked at OpenAI before Perplexity founding in 2022.  
*Evidence:* [S14](#s14).

**Denis Yarats** — Perplexity cofounder and CTO.  
*Why include:* Former Meta AI scientist and founding technical leader of Perplexity.  
*2015+ milestones:* Meta AI research; Perplexity cofounder 2022.  
*Evidence:* [S14](#s14).

**Johnny Ho** — Perplexity cofounder.  
*Why include:* Early engineering founder with a Quora background.  
*2015+ milestones:* Perplexity cofounder 2022.  
*Evidence:* [S14](#s14).

**Andy Konwinski** — Perplexity cofounder; Databricks founding-team background.  
*Why include:* Connects data infrastructure experience to Perplexity’s founding.  
*2015+ milestones:* Perplexity cofounder 2022; previously on Databricks founding team.  
*Evidence:* [S14](#s14).

**Fei-Fei Li** — Stanford HAI founding director; World Labs cofounder.  
*Why include:* Foundational computer-vision researcher who bridges academia, Google Cloud, and spatial AI startups.  
*2015+ milestones:* Stanford HAI founding director 2019; World Labs cofounder 2024.  
*Evidence:* [S29](#s29), [S12](#s12).

**Justin Johnson** — World Labs cofounder.  
*Why include:* Research cofounder of the spatial-intelligence startup alongside Fei-Fei Li.  
*2015+ milestones:* Founded World Labs in 2024.  
*Evidence:* [S12](#s12).

**Ben Mildenhall** — World Labs cofounder.  
*Why include:* Research cofounder associated with generative 3D and neural rendering.  
*2015+ milestones:* Founded World Labs in 2024.  
*Evidence:* [S12](#s12).

**Christoph Lassner** — World Labs cofounder.  
*Why include:* Research cofounder working on spatial and generative AI systems.  
*2015+ milestones:* Founded World Labs in 2024.  
*Evidence:* [S12](#s12).

**Daniel Levy** — SSI cofounder; formerly OpenAI researcher.  
*Why include:* Moved from OpenAI to cofound Safe Superintelligence with Sutskever and Gross.  
*2015+ milestones:* SSI founding team 2024; formerly led optimization work at OpenAI.  
*Evidence:* [S16](#s16).

**Clément Delangue** — Hugging Face cofounder and CEO.  
*Why include:* Major figure in open-source model and dataset distribution.  
*2015+ milestones:* Hugging Face founded 2016; Transformers and Hub subsequently expanded ecosystem.  
*Evidence:* [S25](#s25).

**Julien Chaumond** — Hugging Face cofounder.  
*Why include:* Helped build the open model and tooling ecosystem with Delangue and Wolf.  
*2015+ milestones:* Hugging Face cofounder 2016.  
*Evidence:* [S25](#s25).

**Thomas Wolf** — Hugging Face cofounder.  
*Why include:* Research and open-source leadership central to the Transformers software ecosystem.  
*2015+ milestones:* Hugging Face cofounder 2016.  
*Evidence:* [S25](#s25).

**Harrison Chase** — LangChain cofounder.  
*Why include:* Developed influential developer tooling for LLM applications and agents.  
*2015+ milestones:* Started LangChain software 2022; co-founded company 2023.  
*Evidence:* [S30](#s30).

**Ankush Gola** — LangChain cofounder.  
*Why include:* Cofounded the commercial LangChain organization with Harrison Chase.  
*2015+ milestones:* LangChain company cofounder 2023.  
*Evidence:* [S30](#s30).

**Jensen Huang** — NVIDIA cofounder and CEO.  
*Why include:* An infrastructure decision-maker whose GPUs are central to modern large-model training and deployment.  
*2015+ milestones:* Led NVIDIA’s AI-compute business throughout 2015–2026.  
*Evidence:* [S31](#s31).


### International AI labs (3)

**Liang Wenfeng** — DeepSeek founder and CEO; High-Flyer founder.  
*Why include:* Built China’s DeepSeek research lab, responsible for influential 2024–2025 open model releases.  
*2015+ milestones:* High-Flyer quant-fund founder; founded DeepSeek 2023; DeepSeek-R1 2025.  
*Evidence:* [S32](#s32).

**Yang Zhilin** — Moonshot AI founder/CEO.  
*Why include:* Founded the Kimi model family company and connects Chinese frontier AI to international research.  
*2015+ milestones:* Moonshot AI founded 2023; worked in international AI research before founding.  
*Evidence:* [S33](#s33), [S58](#s58).

**Tang Jie** — Z.ai / Zhipu AI researcher and founder.  
*Why include:* Chinese AI academic and founder; doctoral mentor connection to Moonshot founder Yang Zhilin.  
*2015+ milestones:* Researcher and cofounder in China’s frontier-AI ecosystem.  
*Evidence:* [S58](#s58).


### Academic / AI society (10)

**Geoffrey Hinton** — Deep-learning researcher; 2024 Nobel laureate.  
*Why include:* Major deep learning pioneer and public voice on AI risk; training links shaped younger researchers.  
*2015+ milestones:* Left Google 2023; Nobel Physics 2024 for neural-network methods.  
*Evidence:* [S46](#s46).

**Yoshua Bengio** — Mila founder; LawZero scientific director.  
*Why include:* Pioneer of deep learning who founded a dedicated nonprofit for safe-by-design AI in 2025.  
*2015+ milestones:* AI safety research and 2025 founding of LawZero.  
*Evidence:* [S28](#s28), [S60](#s60).

**Andrew Ng** — DeepLearning.AI founder; machine learning educator.  
*Why include:* Broad educator/operator whose teaching and investments expanded the practical AI ecosystem.  
*2015+ milestones:* Founded DeepLearning.AI in 2017; continued AI education and startup-building.  
*Evidence:* [S45](#s45).

**Percy Liang** — Director of Stanford Center for Research on Foundation Models.  
*Why include:* Connects open model research, measurement and benchmarking with the academic AI governance debate.  
*2015+ milestones:* Led Stanford CRFM and foundation-model evaluation work in the 2020s.  
*Evidence:* [S38](#s38).

**Timnit Gebru** — Founder, Distributed AI Research Institute; former Google Ethical AI co-lead.  
*Why include:* Coauthored foundational AI bias and LLM risk papers; illustrates independent criticism of labs.  
*2015+ milestones:* Gender Shades 2018; Google Ethical AI 2018–2020; founded DAIR.  
*Evidence:* [S26](#s26), [S40](#s40), [S41](#s41).

**Margaret Mitchell** — Former Google Ethical AI co-lead; Hugging Face chief ethics scientist.  
*Why include:* Connects Google ethics research, the Stochastic Parrots paper and Hugging Face AI governance.  
*2015+ milestones:* Google ethical AI co-lead 2018–2021; Hugging Face ethics role from 2021.  
*Evidence:* [S27](#s27), [S26](#s26), [S41](#s41).

**Emily M. Bender** — University of Washington linguist and AI critic.  
*Why include:* Coauthor of influential 2021 Stochastic Parrots paper on risks of large-scale language models.  
*2015+ milestones:* Coauthored 2021 Stochastic Parrots paper with Gebru and Mitchell.  
*Evidence:* [S41](#s41).

**Joy Buolamwini** — Algorithmic Justice League founder.  
*Why include:* Coauthored Gender Shades, a major 2018 audit of demographic disparities in computer vision.  
*2015+ milestones:* Founded Algorithmic Justice League; Gender Shades with Timnit Gebru 2018.  
*Evidence:* [S39](#s39), [S40](#s40).

**Rumman Chowdhury** — Humane Intelligence cofounder; responsible-AI researcher.  
*Why include:* Developed community AI red-teaming and accountability methods; earlier led responsible AI at Twitter.  
*2015+ milestones:* Humane Intelligence formed 2023; previously led Twitter ML ethics; U.S. AI science envoy.  
*Evidence:* [S42](#s42), [S43](#s43).

**Dan Hendrycks** — Center for AI Safety director.  
*Why include:* AI evaluation and safety researcher with publicly reported advisory ties to Scale and xAI.  
*2015+ milestones:* CAIS director; advised xAI and Scale AI.  
*Evidence:* [S44](#s44).


### AI policy / governance (9)

**David Sacks** — U.S. White House Special Advisor for AI and Crypto (2025).  
*Why include:* Links venture capital to development of federal AI strategy under the Trump administration.  
*2015+ milestones:* Appointed AI/crypto advisor in 2025; contributed to 2025 U.S. AI Action Plan.  
*Evidence:* [S22](#s22), [S56](#s56), [S57](#s57).

**Michael Kratsios** — U.S. White House OSTP director (2025).  
*Why include:* Helped lead U.S. science and technology policy and contributed to the 2025 AI Action Plan.  
*2015+ milestones:* Director of OSTP and 2025 AI Action Plan contributor.  
*Evidence:* [S22](#s22).

**Donald Trump** — U.S. president in 2025–2026.  
*Why include:* Relevant as the president who appointed David Sacks and directed the 2025 AI policy process.  
*2015+ milestones:* Announced David Sacks role in Dec. 2024; administration published AI Action Plan July 2025.  
*Evidence:* [S57](#s57), [S22](#s22).

**Joe Biden** — U.S. president 2021–2025.  
*Why include:* His 2023 AI executive order established tasks leading to the U.S. AI Safety Institute.  
*2015+ milestones:* 2023 executive order informed NIST AI safety efforts and 2024 leadership appointments.  
*Evidence:* [S21](#s21).

**Gina Raimondo** — U.S. Commerce secretary during 2024 AI institute appointments.  
*Why include:* Announced first U.S. AI Safety Institute leadership under NIST.  
*2015+ milestones:* Named Elizabeth Kelly director and Elham Tabassi CTO in Feb. 2024.  
*Evidence:* [S21](#s21).

**Elizabeth Kelly** — Inaugural director of the U.S. AI Safety Institute.  
*Why include:* Government leader responsible for establishing U.S. AI evaluation and safety capability in 2024.  
*2015+ milestones:* Named founding U.S. AISI director in February 2024.  
*Evidence:* [S21](#s21).

**Elham Tabassi** — Inaugural CTO of the U.S. AI Safety Institute.  
*Why include:* Scientific and technical government counterpart to founding director Elizabeth Kelly.  
*2015+ milestones:* Named founding U.S. AISI CTO in February 2024.  
*Evidence:* [S21](#s21).

**Brando Benifei** — European Parliament AI Act co-rapporteur.  
*Why include:* Directly shaped EU AI Act negotiations as one of two parliamentary co-rapporteurs.  
*2015+ milestones:* Co-rapporteur during EU AI Act 2023–2024 negotiations.  
*Evidence:* [S23](#s23).

**Dragoș Tudorache** — European Parliament AI Act co-rapporteur.  
*Why include:* Co-led European Parliament’s negotiations on the AI Act with Brando Benifei.  
*2015+ milestones:* Co-rapporteur during EU AI Act 2023–2024 negotiations.  
*Evidence:* [S23](#s23).

## 3. High-evidence relationship groups
These groups give Cursor explicit relationship definitions. For coauthor and cofounder groups, every pair shares the stated group relationship. The UI should show the group label rather than mislabel all pairwise links as friendships.

- **G01 · OpenAI 2015 launch team (2015–2018)** — Sam Altman, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, John Schulman, Andrej Karpathy, Elon Musk. Listed as co-chairs, research director, CTO or founding researchers in OpenAI’s own launch announcement. **Path eligible:** yes. Sources: [S01](#s01). *Note:* Shared launch is not identical to a cofounder or personal friendship relationship.
- **G02 · Anthropic 2021 founding team (2021)** — Dario Amodei, Daniela Amodei, Jack Clark, Chris Olah, Jared Kaplan, Sam McCandlish, Tom Brown, Ben Mann. Eight Anthropic cofounders listed in Anthropic materials. **Path eligible:** yes. Sources: [S03](#s03).
- **G03 · 2017 Transformer paper (2017)** — Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan Gomez, Lukasz Kaiser, Illia Polosukhin. All eight authors of Attention Is All You Need. **Path eligible:** yes. Sources: [S04](#s04).
- **G04 · Mistral AI founding (2023)** — Arthur Mensch, Guillaume Lample, Timothée Lacroix. Official Mistral founding trio. **Path eligible:** yes. Sources: [S08](#s08).
- **G05 · Cohere founding (2019)** — Aidan Gomez, Nick Frosst, Ivan Zhang. Company’s three founders. **Path eligible:** yes. Sources: [S10](#s10), [S55](#s55).
- **G06 · Sakana AI founding (2023)** — David Ha, Llion Jones, Ren Ito. Official founding team. **Path eligible:** yes. Sources: [S11](#s11).
- **G07 · World Labs founding (2024)** — Fei-Fei Li, Justin Johnson, Ben Mildenhall, Christoph Lassner. Official World Labs founding quartet. **Path eligible:** yes. Sources: [S12](#s12).
- **G08 · Perplexity founding (2022)** — Aravind Srinivas, Denis Yarats, Johnny Ho, Andy Konwinski. Perplexity founders identified in AWS profile. **Path eligible:** yes. Sources: [S14](#s14).
- **G09 · Inflection AI founding (2022)** — Mustafa Suleyman, Karén Simonyan, Reid Hoffman. Founders of Inflection; check cofounder-specific status of Simonyan when presenting. **Path eligible:** yes. Sources: [S07](#s07), [S36](#s36).
- **G10 · Safe Superintelligence (SSI) founding (2024)** — Ilya Sutskever, Daniel Gross, Daniel Levy. Founders listed in SSI recruitment materials. **Path eligible:** yes. Sources: [S16](#s16).
- **G11 · Thinking Machines Lab founding team (2025)** — Mira Murati, John Schulman, Barret Zoph, Lilian Weng, Andrew Tulloch, Luke Metz. 2025 founding team; some later departed. **Path eligible:** yes. Sources: [S15](#s15), [S49](#s49).
- **G12 · Character.AI cofounding (2021)** — Noam Shazeer, Daniel De Freitas. Character.AI founders returned to Google in 2024. **Path eligible:** yes. Sources: [S35](#s35).
- **G13 · Essential AI cofounders (2023)** — Ashish Vaswani, Niki Parmar. Reuters confirms the 2023 Essential AI cofounding pair. **Path eligible:** yes. Sources: [S68](#s68).
- **G14 · Adept AI founding collaboration (2022)** — David Luan, Ashish Vaswani, Niki Parmar. Founder David Luan explicitly identifies Vaswani and Parmar as his cofounders. **Path eligible:** yes. Sources: [S54](#s54).
- **G15 · Hugging Face founding (2016)** — Clément Delangue, Julien Chaumond, Thomas Wolf. Founding team covered by IBM. **Path eligible:** yes. Sources: [S25](#s25).
- **G16 · LangChain company founding (2023)** — Harrison Chase, Ankush Gola. LangChain organizational history names both cofounders. **Path eligible:** yes. Sources: [S30](#s30).
- **G17 · Scale AI founding (2016)** — Alexandr Wang, Lucy Guo. Cofounders of Scale AI, as interviewed at company launch. **Path eligible:** yes. Sources: [S67](#s67).
- **G18 · 2018 Gender Shades paper (2018)** — Joy Buolamwini, Timnit Gebru. Both listed as paper authors. **Path eligible:** yes. Sources: [S40](#s40).
- **G19 · 2021 Stochastic Parrots paper (2021)** — Emily M. Bender, Timnit Gebru, Margaret Mitchell. The three are among the paper’s authors; Mitchell credited under pen name Shmargaret Shmitchell. **Path eligible:** yes. Sources: [S41](#s41).
- **G20 · AlphaFold research / 2024 Nobel (2018–2024)** — Demis Hassabis, John Jumper. Collaborated on AlphaFold research recognized by the Nobel Committee. **Path eligible:** yes. Sources: [S06](#s06), [S47](#s47).
- **G21 · OpenAI board (before Nov. 2023 change) (2023)** — Ilya Sutskever, Adam D’Angelo, Helen Toner, Tasha McCauley. All four listed as directors in Nov. 2023 announcement. **Path eligible:** yes. Sources: [S17](#s17).
- **G22 · OpenAI safety committee (2024) (2024)** — Bret Taylor, Adam D’Angelo, Nicole Seligman, Sam Altman. All four explicitly named on the 2024 safety and security committee. **Path eligible:** yes. Sources: [S24](#s24).
- **G23 · EU AI Act parliamentary negotiators (2023–2024)** — Brando Benifei, Dragoș Tudorache. Both were co-rapporteurs negotiating the European Parliament’s position. **Path eligible:** yes. Sources: [S23](#s23).
- **G24 · U.S. AI Safety Institute leadership (2024)** — Gina Raimondo, Elizabeth Kelly, Elham Tabassi. Raimondo named both founding AI Safety Institute leaders. **Path eligible:** yes. Sources: [S21](#s21).
- **G25 · U.S. AI Action Plan (named policy leaders) (2025)** — David Sacks, Michael Kratsios, Donald Trump. Trump directed the plan; Sacks and Kratsios were named leaders. Shared policy work does not imply equal authorship. **Path eligible:** no. Sources: [S22](#s22).
- **G26 · 2025 Meta Superintelligence Labs leaders (2025)** — Mark Zuckerberg, Alexandr Wang, Nat Friedman, Shengjia Zhao. Meta CEO statement names each person and their role in formation. **Path eligible:** no. Sources: [S09](#s09). *Note:* Organizational hierarchy does not by itself establish a close personal relationship.
- **G27 · Early xAI original team (2023)** — Elon Musk, Igor Babuschkin, Jimmy Ba, Yuhuai Wu, Christian Szegedy. Named among original xAI researchers. **Path eligible:** yes. Sources: [S34](#s34). *Note:* Original founding research cohort, not necessarily all corporate founders.
- **G28 · 2020 GPT-3 research paper — selected contributors (2020)** — Ilya Sutskever, Dario Amodei, Tom Brown, Ben Mann, Jared Kaplan, Sam McCandlish, Jack Clark, Amanda Askell, Mark Chen, Alec Radford. All selected people appear as authors of the 2020 GPT-3 paper (which has additional authors not listed here). **Path eligible:** yes. Sources: [S61](#s61).
- **G29 · 2020 Scaling Laws paper — selected coauthors (2020)** — Dario Amodei, Jared Kaplan, Sam McCandlish, Tom Brown, Alec Radford. All selected people coauthored the 2020 OpenAI scaling-laws paper. **Path eligible:** yes. Sources: [S62](#s62).
- **G30 · 2016 AlphaGo Nature paper — selected authors (2016)** — Ilya Sutskever, Demis Hassabis, David Silver. All three are listed authors of DeepMind and Google’s 2016 AlphaGo paper. **Path eligible:** yes. Sources: [S63](#s63).
- **G31 · 2017 AlphaGo Zero Nature paper — selected authors (2017)** — Demis Hassabis, David Silver, Karén Simonyan. All three coauthored the 2017 AlphaGo Zero paper. **Path eligible:** yes. Sources: [S64](#s64).
- **G32 · 2015 Deep Q-Network Nature paper — selected authors (2015)** — Demis Hassabis, David Silver, Shane Legg. All three coauthored the February 2015 deep reinforcement-learning paper. **Path eligible:** yes. Sources: [S66](#s66).
- **G33 · 2015 Nature deep-learning review (2015)** — Yann LeCun, Yoshua Bengio, Geoffrey Hinton. These three researchers coauthored the influential 2015 Nature review article, Deep Learning. **Path eligible:** yes. Sources: [S69](#s69).
- **G34 · 2015 Knowledge Distillation paper — selected authors (2015)** — Geoffrey Hinton, Jeff Dean. Both coauthored the 2015 research paper on knowledge distillation, along with Oriol Vinyals. **Path eligible:** yes. Sources: [S70](#s70).
- **G35 · 2017 Capsule Networks paper — selected authors (2017)** — Geoffrey Hinton, Nick Frosst. Both coauthored Dynamic Routing Between Capsules, along with Sara Sabour. **Path eligible:** yes. Sources: [S71](#s71).
- **G36 · 2016 Layer Normalization paper — selected authors (2016)** — Jimmy Ba, Geoffrey Hinton. Both coauthored Layer Normalization, along with Jamie Ryan Kiros. **Path eligible:** yes. Sources: [S72](#s72).
- **G37 · 2017 Sparsely-Gated Mixture of Experts paper — selected authors (2017)** — Noam Shazeer, Geoffrey Hinton, Jeff Dean. All three coauthored the influential 2017 paper, along with additional researchers. **Path eligible:** yes. Sources: [S73](#s73).

## 4. Specific cross-group connections
The connections below are individually recorded in the JSON and CSV. Any cross-group edge marked contextual is **not** counted in default degrees of separation. This avoids overstating the social density of AI.

| People | Documented relationship / date | Default path? | Evidence |
|---|---|:---:|---|
| Sam Altman ↔ Dario Amodei | executive overlap (2016–2020): Altman was a leader at OpenAI while Amodei led research there before founding Anthropic. | No | [S01](#s01), [S03](#s03) |
| Sam Altman ↔ Daniela Amodei | executive overlap (before 2021): OpenAI leadership overlap prior to the Anthropic founding split. | No | [S03](#s03) |
| Ilya Sutskever ↔ Dario Amodei | joint research leadership (2016–2020): OpenAI expressly states Amodei and Sutskever co-led its research direction. | Yes | [S65](#s65) |
| Sam Altman ↔ Reid Hoffman | board colleagues (2019–2023): Hoffman served on OpenAI’s board during Altman’s tenure as chief executive. | Yes | [S36](#s36) |
| Reid Hoffman ↔ Satya Nadella | board relationship (2017 onward): Hoffman states that he has served on Microsoft’s board since 2017. | Yes | [S36](#s36) |
| Satya Nadella ↔ Mustafa Suleyman | appointed or hired (2024): Nadella publicly announced Suleyman’s appointment to lead Microsoft AI. | Yes | [S07](#s07) |
| Satya Nadella ↔ Karén Simonyan | appointed or hired (2024): Nadella publicly announced Simonyan’s move to the new Microsoft AI organization. | Yes | [S07](#s07) |
| Andrej Karpathy ↔ Fei-Fei Li | phd advisor (2011–2015): Karpathy names Li as his doctoral adviser at Stanford; pre-2015 connection explains a later career bridge. | No | [S53](#s53) |
| Andrej Karpathy ↔ Elon Musk | executive overlap (2017–2022): Karpathy led Tesla AI while Musk led Tesla; this is a documented executive/technical hierarchy. | Yes | [S53](#s53), [S01](#s01) |
| Dario Amodei ↔ John Schulman | company overlap (2024–2025): Schulman joined Anthropic before moving to Thinking Machines, where Amodei was CEO. | No | [S15](#s15), [S02](#s02) |
| Mira Murati ↔ Sam Altman | executive colleagues (2018–2024): Murati was OpenAI CTO and interim CEO in Nov. 2023 during Altman’s leadership transition. | Yes | [S17](#s17), [S51](#s51) |
| Mira Murati ↔ Greg Brockman | executive colleagues (2018–2024): OpenAI technology and company leaders during the 2023 transition. | Yes | [S51](#s51) |
| Jakub Pachocki ↔ Ilya Sutskever | research succession (2024): Pachocki was appointed as chief scientist following Sutskever’s departure. | Yes | [S19](#s19) |
| Mark Chen ↔ Jakub Pachocki | joint research program (2024): Both are named in leadership for the OpenAI o1 research effort. | Yes | [S37](#s37) |
| Mark Chen ↔ Wojciech Zaremba | joint research program (2024): Both were included in named leadership of the OpenAI o1 research effort. | Yes | [S37](#s37) |
| Jakub Pachocki ↔ Shengjia Zhao | joint research program (2024): Pachocki is listed among o1 leadership and Zhao among foundational research contributors. | Yes | [S37](#s37) |
| Mark Chen ↔ Shengjia Zhao | joint research program (2024): Both listed in OpenAI’s named o1 research contribution credits. | Yes | [S37](#s37) |
| Alexandr Wang ↔ Mark Zuckerberg | executive hire (2025): Meta’s CEO placed Wang in charge of Meta Superintelligence Labs; Scale confirmed his move. | Yes | [S09](#s09), [S13](#s13) |
| Alexandr Wang ↔ Nat Friedman | leadership colleagues (2025): Meta explicitly identifies Wang and Friedman in complementary 2025 AI leadership roles. | Yes | [S09](#s09) |
| Alexandr Wang ↔ Shengjia Zhao | leadership colleagues (2025): Meta explicitly names Wang as leader and Zhao as chief scientist of its AI effort. | Yes | [S09](#s09) |
| Nat Friedman ↔ Shengjia Zhao | leadership colleagues (2025): Meta’s AI division announced both among its leadership team. | No | [S09](#s09) |
| Mark Zuckerberg ↔ Yann LeCun | executive overlap (2015–2025): LeCun served as Meta’s chief AI scientist under Zuckerberg’s company leadership. | No | [S09](#s09) |
| Mark Zuckerberg ↔ Joelle Pineau | executive overlap (2017–2025): Pineau led FAIR/Meta AI during the company’s Zuckerberg-led AI expansion. | No | [S09](#s09), [S10](#s10) |
| Joelle Pineau ↔ Aidan Gomez | company leadership (2025 onward): Cohere identifies Pineau as chief AI officer and Gomez as founder/CEO. | Yes | [S10](#s10) |
| Daniel Gross ↔ Nat Friedman | investment partnership (2020s): Gross and Friedman invested together in AI companies through NFDG. | No | [S36](#s36) |
| Daniel Gross ↔ Alexandr Wang | company overlap (2025): Gross joined Meta AI after SSI; Wang led the new Meta AI effort. | No | [S09](#s09), [S16](#s16) |
| Arthur Mensch ↔ Demis Hassabis | lab overlap (before 2023): Mensch worked at DeepMind before founding Mistral while Hassabis led the lab. | No | [S08](#s08), [S05](#s05) |
| Guillaume Lample ↔ Yann LeCun | lab overlap (before 2023): Lample researched at Meta before founding Mistral; LeCun was chief AI scientist. | No | [S08](#s08) |
| Timothée Lacroix ↔ Yann LeCun | lab overlap (before 2023): Lacroix researched at Meta before founding Mistral; LeCun led FAIR’s research vision. | No | [S08](#s08) |
| Aravind Srinivas ↔ Sam Altman | company overlap (before 2022): Srinivas previously worked at OpenAI before founding Perplexity. | No | [S14](#s14) |
| Denis Yarats ↔ Yann LeCun | lab overlap (before 2022): Yarats worked in Meta AI research, associated with the larger FAIR ecosystem. | No | [S14](#s14) |
| Mustafa Suleyman ↔ Demis Hassabis | deepmind founders (2010–2015+): Both founded DeepMind before 2015 and remained important to the organization afterward. | No | [S05](#s05), [S07](#s07) |
| Shane Legg ↔ Demis Hassabis | deepmind founders (2010–2015+): Both were DeepMind founders before 2015 and remained influential afterward. | No | [S05](#s05) |
| Jeff Dean ↔ Demis Hassabis | lab reorganization (2023): Google united Google Brain and DeepMind under one Google DeepMind organization in 2023. | No | [S05](#s05) |
| Sundar Pichai ↔ Demis Hassabis | executive reporting (2023 onward): Google/Alphabet leadership structure includes Google DeepMind under Hassabis. | No | [S05](#s05) |
| Noam Shazeer ↔ Daniel De Freitas | cofounder and return (2021–2024): Cofounded Character.AI and returned to Google in 2024. | Yes | [S35](#s35) |
| Andrej Karpathy ↔ John Schulman | founding colleagues (2015–2017): Both are listed as OpenAI founding researchers. | Yes | [S01](#s01) |
| Dario Amodei ↔ Daniela Amodei | cofounders (2021): Cofounded Anthropic and led the firm’s research and commercial functions. | Yes | [S02](#s02) |
| Timnit Gebru ↔ Margaret Mitchell | coled research team (2018–2020): The pair co-led Google’s Ethical AI research team. | Yes | [S26](#s26), [S27](#s27) |
| Margaret Mitchell ↔ Clément Delangue | executive research relationship (2021 onward): Mitchell joined Hugging Face as chief ethics scientist while Delangue led the company. | No | [S27](#s27), [S25](#s25) |
| Yoshua Bengio ↔ Sam Altman | openai launch advisory (2015): OpenAI’s launch announcement listed Bengio among its scientific advisors. | No | [S01](#s01) |
| Dan Hendrycks ↔ Elon Musk | research advisor (2020s): Center for AI Safety identifies Hendrycks as an xAI advisor. | No | [S44](#s44) |
| Dan Hendrycks ↔ Alexandr Wang | research advisor (2020s): Center for AI Safety identifies Hendrycks as a Scale AI advisor. | No | [S44](#s44) |
| Timnit Gebru ↔ Joy Buolamwini | research coauthor (2018): Coauthored the peer-reviewed Gender Shades research paper. | Yes | [S40](#s40) |
| Emily M. Bender ↔ Timnit Gebru | research coauthor (2021): Coauthored On the Dangers of Stochastic Parrots. | Yes | [S41](#s41) |
| Daniel Gross ↔ Ilya Sutskever | cofounders (2024): Cofounded SSI with Daniel Levy. | Yes | [S16](#s16) |
| Gina Raimondo ↔ Elizabeth Kelly | appointed (2024): Raimondo publicly named Kelly as inaugural director of the U.S. AI Safety Institute. | Yes | [S21](#s21) |
| Gina Raimondo ↔ Elham Tabassi | appointed (2024): Raimondo publicly named Tabassi CTO of the U.S. AI Safety Institute. | Yes | [S21](#s21) |
| Elizabeth Kelly ↔ Elham Tabassi | government team (2024): Became director and CTO, respectively, in the institute’s founding leadership. | Yes | [S21](#s21) |
| Donald Trump ↔ David Sacks | appointed (2024–2025): Trump publicly announced Sacks’s AI and crypto policy advisor appointment. | Yes | [S57](#s57) |
| David Sacks ↔ Michael Kratsios | joint policy work (2025): Both are named in the White House release for the 2025 America’s AI Action Plan. | Yes | [S22](#s22) |
| Donald Trump ↔ Michael Kratsios | presidential administration (2025): Kratsios led OSTP under Trump during the AI Action Plan launch. | No | [S22](#s22) |
| Joe Biden ↔ Gina Raimondo | executive cabinet (2023–2024): Biden AI executive order led to Commerce/NIST AI-safety responsibilities under Secretary Raimondo. | No | [S21](#s21) |
| Yang Zhilin ↔ Tang Jie | academic advisor (2010s): Tang was Yang’s university advisor in China before Yang founded Moonshot AI. | No | [S58](#s58) |
| Yang Zhilin ↔ Yann LeCun | research coauthor (2010s–2020s): Biographical research reports Yang coauthored papers with LeCun. | Yes | [S33](#s33) |
| Yang Zhilin ↔ Yoshua Bengio | research coauthor (2010s–2020s): Research reporting identifies Yang as a coauthor with Bengio. | Yes | [S33](#s33) |

## 5. Compelling stories to surface in the website
1. **From one lab to two:** OpenAI’s 2015 team and the 2021 Anthropic founders illustrate how shared origins lead to separate competing research institutions. Explain movement through documented employment/founding ties; do not insinuate secret coordination.
2. **The Transformer diaspora:** One 2017 paper connects eight coauthors who later helped develop Cohere, Character.AI, Sakana AI, Essential AI, and OpenAI research.
3. **The 2023–25 company reshuffle:** Mustafa Suleyman’s DeepMind → Inflection → Microsoft trajectory, alongside Alexandr Wang’s Scale → Meta transition, shows how frontier AI organizations exchange leaders.
4. **The OpenAI governance story:** The board cohort in November 2023, the new board in 2024, and Mira Murati’s later startup explain how governance and talent movement overlap.
5. **Scientists, critics and lawmakers:** Gender Shades, Stochastic Parrots, Stanford foundation-model evaluation, the EU AI Act, and the U.S. AI Safety Institute show that power over AI is not just held by model developers.
6. **Important gaps:** DeepSeek and Moonshot AI have their own trajectories. If a credible relationship to a U.S. lab figure is missing, keep the node unconnected rather than create a connection from mere competition.

7. **The DeepMind-to-OpenAI science bridge:** Ilya Sutskever, Demis Hassabis and David Silver are coauthors on the 2016 AlphaGo paper, and the 2017 AlphaGo Zero team includes Karén Simonyan, later a Microsoft AI leader.
8. **Researchers linked across AI generations:** The 2015 Nature survey links Yann LeCun, Yoshua Bengio and Geoffrey Hinton; Hinton’s 2015–17 paper coauthors connect to Jeff Dean, Noam Shazeer, Jimmy Ba, and Nick Frosst. These are documented scientific ties, not claims of joint business control.

## 6. Information architecture for Cursor
**Graph:** node color = thematic cluster; size = a visual/editorial setting, not a scientific measure of power; solid link = eligible documented relation; dotted link = weaker/contextual relation; clicking any edge opens the relationship statement, dates and sources. Include group/founding/coauthor filters and a toggle to include or exclude contextual edges.

**People directory:** searchable name, role, why they matter, since-2015 timeline, thematic cluster, source hyperlinks and documented connections. Support deep links like `/people/dario-amodei`. Profiles should say “former” when necessary rather than claiming every source describes the current job.

**Degrees apart:** use unweighted BFS on an undirected graph built from `path_eligible=true` explicit and derived group edges. Display the exact person sequence and the relationship source at each hop. If there is no path, say so. Paths are **evidence trails, not proof of interpersonal familiarity or causal control**. Consider separate path modes: Strict / Expanded with contextual ties.

**Time filter:** show people active in selected year and only relationships whose documented period intersects it. A `2010–2015+` background edge should be disabled for the 2015+ default setting.

**Quality gate:** vet editorial notes and time-sensitive roles before publication; verify photographs and licenses; never infer donations, board seats, personal political affiliation, funding, friendship or closeness from a shared employer. Avoid automated background relationship generation from LinkedIn school/company matches without sourced proof.

### Suggested user journeys
- Start at Ilya Sutskever → trace an OpenAI founding relationship → see early Anthropic overlap and SSI founding.
- Start at Aidan Gomez → explore the Transformer-paper author web → reach Sakana, Character.AI, and OpenAI.
- Start at Reid Hoffman → compare his OpenAI board history, Inflection founding, and Microsoft board role.
- Start at Joy Buolamwini → Gender Shades with Gebru → Google Ethical AI and the Stochastic Parrots collaborators.
- Start at David Sacks → view the Trump appointment and cooperation on the 2025 AI Action Plan.

## 7. Sources and verification index
Sources are a mixture of company announcements, original papers, university/research institutions, government documents and reputable reporting. An edge is not “verified” beyond what its cited source states. This index is a starting point for editorial review, not a guarantee that every link remains live or every job title is current.

<a id="s01"></a>**[S01] OpenAI: Introducing OpenAI (Dec. 2015)** — https://openai.com/index/introducing-openai/  
<a id="s02"></a>**[S02] Anthropic: Leadership and founders** — https://www.anthropic.com/company/leadership  
<a id="s03"></a>**[S03] Anthropic founding team background (AWS/Anthropic)** — https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/events/approved/reinvent-2025/reinvent/2024/slides/aim/AIM123-S_Leverage-Anthropics-Claude-models-for-AIs-evolving-landscape-sponsored-by-Anthropic.pdf  
<a id="s04"></a>**[S04] Google Research: Attention Is All You Need (2017)** — https://research.google/pubs/attention-is-all-you-need/  
<a id="s05"></a>**[S05] Google DeepMind: About and history** — https://deepmind.google/about/  
<a id="s06"></a>**[S06] Google DeepMind: 2024 AlphaFold Nobel** — https://deepmind.google/blog/demis-hassabis-john-jumper-awarded-nobel-prize-in-chemistry/  
<a id="s07"></a>**[S07] Microsoft: Mustafa Suleyman and Karén Simonyan join (2024)** — https://blogs.microsoft.com/blog/2024/03/19/mustafa-suleyman-deepmind-and-inflection-co-founder-joins-microsoft-to-lead-copilot/  
<a id="s08"></a>**[S08] Mistral AI: Founders and timeline** — https://mistral.ai/about/  
<a id="s09"></a>**[S09] Meta: Q2 2025 prepared remarks on Superintelligence Labs** — https://s21.q4cdn.com/399680738/files/doc_downloads/2025/META-Q2-2025-Prepared-Remarks.pdf  
<a id="s10"></a>**[S10] Cohere: About and leadership** — https://cohere.com/about  
<a id="s11"></a>**[S11] Sakana AI: Company information** — https://sakana.ai/company-info/  
<a id="s12"></a>**[S12] World Labs: About and founders** — https://www.worldlabs.ai/about  
<a id="s13"></a>**[S13] Scale AI: Alexandr Wang joins Meta (June 2025)** — https://scale.com/blog/scale-ai-announces-next-phase-of-company-evolution  
<a id="s14"></a>**[S14] AWS: Perplexity cofounders and backgrounds** — https://aws.amazon.com/aws-startups/learn/reimagining-search-perplexity-drives-productivity-with-generative-ai-powered-answer-engine/  
<a id="s15"></a>**[S15] Reuters: Thinking Machines Lab launch (Feb. 2025)** — https://www.reuters.com/technology/artificial-intelligence/former-openai-technology-chief-mira-muratis-ai-startup-taps-top-researchers-2025-02-18/  
<a id="s16"></a>**[S16] SSI: Founders (original recruitment document)** — https://static1.squarespace.com/static/627e2d05bbf4f73ea395b2dd/t/67225c4c644e1e407c77a414/1730305102489/Safe%2BSuperintelligence%2B-%2BML%2BEngineer.pdf  
<a id="s17"></a>**[S17] OpenAI: Leadership transition and board (Nov. 2023)** — https://openai.com/index/openai-announces-leadership-transition/  
<a id="s18"></a>**[S18] OpenAI: Board expansion (Mar. 2024)** — https://openai.com/index/openai-announces-new-members-to-board-of-directors/  
<a id="s19"></a>**[S19] OpenAI: Jakub Pachocki named chief scientist (2024)** — https://openai.com/index/jakub-pachocki-announced-as-chief-scientist/  
<a id="s20"></a>**[S20] OpenAI: Mark Chen research leadership (Mar. 2025)** — https://openai.com/index/leadership-updates-march-2025/  
<a id="s21"></a>**[S21] NIST: U.S. AI Safety Institute leadership (Feb. 2024)** — https://www.nist.gov/news-events/news/2024/02/us-commerce-secretary-gina-raimondo-announces-key-executive-leadership-us  
<a id="s22"></a>**[S22] White House: U.S. AI Action Plan (July 2025)** — https://www.whitehouse.gov/releases/2025/07/white-house-unveils-americas-ai-action-plan/  
<a id="s23"></a>**[S23] European Parliament: AI Act co-rapporteurs (2024)** — https://www.europarl.europa.eu/committees/en/artificial-intelligence-act/product-details/20230417CDT11481  
<a id="s24"></a>**[S24] OpenAI: 2024 Safety and Security Committee** — https://openai.com/index/openai-board-forms-safety-and-security-committee/  
<a id="s25"></a>**[S25] IBM: Hugging Face founders and history** — https://www.ibm.com/think/topics/hugging-face  
<a id="s26"></a>**[S26] Ford Foundation: Timnit Gebru describes the Google Ethical AI team** — https://www.fordfoundation.org/news-and-stories/videos/on-what-matters-social-justice-leaders-share-their-big-plans-for-a-more-just-world/making-ai-systems-more-just-with-hilary-pennington-and-dr-timnit-gebru/  
<a id="s27"></a>**[S27] Margaret Mitchell: personal biography** — https://m-mitchell.com/  
<a id="s28"></a>**[S28] LawZero: Yoshua Bengio profile** — https://lawzero.org/en/team/yoshua-bengio  
<a id="s29"></a>**[S29] Stanford HAI: Fei-Fei Li bio** — https://hai.stanford.edu/people/fei-fei-li  
<a id="s30"></a>**[S30] LangChain: About and founding story** — https://www.langchain.com/about  
<a id="s31"></a>**[S31] NVIDIA: Jensen Huang biography** — https://nvidianews.nvidia.com/bios/jensen-huang  
<a id="s32"></a>**[S32] Congressional Research Service: DeepSeek (July 2025)** — https://www.everycrsreport.com/files/2025-07-01_IF13051_6e8500c4da90c57a0086c1f6d74605c989abc442.pdf  
<a id="s33"></a>**[S33] The Wire China: Moonshot AI founder Yang Zhilin** — https://www.thewirechina.com/2025/09/28/who-is-moonshot-ai/  
<a id="s34"></a>**[S34] Observer: xAI original team (July 2023)** — https://observer.com/2023/07/elon-musk-launches-xai/  
<a id="s35"></a>**[S35] TechCrunch: Character.AI founders return to Google (2024)** — https://techcrunch.com/2024/08/02/character-ai-ceo-noam-shazeer-returns-to-google/  
<a id="s36"></a>**[S36] Reid Hoffman: first-person account of AI roles** — https://www.porchlightbooks.com/globalassets/changethis/245--february-2025/pdfs/245.01.superagency.pdf  
<a id="s37"></a>**[S37] OpenAI: OpenAI o1 named contributors** — https://openai.com/openai-o1-contributions/  
<a id="s38"></a>**[S38] Stanford: Percy Liang CRFM biography** — https://profiles.stanford.edu/percy-liang  
<a id="s39"></a>**[S39] MIT Media Lab: Joy Buolamwini** — https://www.media.mit.edu/people/joyab/overview/  
<a id="s40"></a>**[S40] PMLR: Gender Shades (Buolamwini and Gebru, 2018)** — https://proceedings.mlr.press/v81/buolamwini18a.html  
<a id="s41"></a>**[S41] ACM: Stochastic Parrots coauthors (2021)** — https://doi.org/10.1145/3442188.3445922  
<a id="s42"></a>**[S42] Harvard Berkman Klein: Rumman Chowdhury** — https://cyber.harvard.edu/people/rumman-chowdhury  
<a id="s43"></a>**[S43] Humane Intelligence: Organizational history** — https://humane-intelligence.org/about/  
<a id="s44"></a>**[S44] Center for AI Safety: Dan Hendrycks** — https://safe.ai/team/dan-hendrycks  
<a id="s45"></a>**[S45] DeepLearning.AI: Andrew Ng founded organization in 2017** — https://www.deeplearning.ai/about  
<a id="s46"></a>**[S46] Nobel Prize: Geoffrey Hinton (2024 Physics)** — https://www.nobelprize.org/prizes/physics/2024/hinton/facts/  
<a id="s47"></a>**[S47] Nobel Prize: 2024 Chemistry (Hassabis, Jumper, Baker)** — https://www.nobelprize.org/prizes/chemistry/2024/press-release/  
<a id="s48"></a>**[S48] OpenAI: current organizational structure and board (2025+)** — https://openai.com/our-structure/  
<a id="s49"></a>**[S49] Thinking Machines Lab: founding story and recent departures** — https://research.contrary.com/report/thinking-machines-lab  
<a id="s50"></a>**[S50] Sakana AI: founding team and investors** — https://sakana.ai/seed-round/  
<a id="s51"></a>**[S51] OpenAI: Sam Altman returns; board reshaped (Nov. 2023)** — https://openai.com/index/sam-altman-returns-as-ceo-openai-has-a-new-initial-board/  
<a id="s52"></a>**[S52] Stanford HAI: About and research leadership** — https://hai.stanford.edu/about  
<a id="s53"></a>**[S53] Karpathy: academic and career biography** — https://karpathy.ai/  
<a id="s54"></a>**[S54] Adept: announcement by David Luan about cofounders (2022)** — https://www.adept.ai/blog/introducing-adept/  
<a id="s55"></a>**[S55] Cohere: Nick Frosst, Ivan Zhang, Aidan Gomez founders** — https://www.ciscoinvestments.com/portfolio/cohere  
<a id="s56"></a>**[S56] White House: David Sacks appointment letter** — https://www.whitehouse.gov/wp-content/uploads/2025/06/David-Sacks.pdf  
<a id="s57"></a>**[S57] U.S. Presidency Project: David Sacks appointment statement** — https://www.presidency.ucsb.edu/documents/statement-president-elect-donald-j-trump-announcing-the-appointment-david-o-sacks-white  
<a id="s58"></a>**[S58] CNA: Chinese AI founders (2026)** — https://www.channelnewsasia.com/east-asia/china-deepseek-zhipu-ai-moonshot-liang-wenfeng-yang-zhilin-tang-jie-6269866  
<a id="s59"></a>**[S59] OpenAI 2018 board update** — https://openai.com/index/openai-supporters/  
<a id="s60"></a>**[S60] LawZero: June 2025 announcement** — https://lawzero.org/en/news/yoshua-bengio-launches-lawzero-new-nonprofit-advancing-safe-design-ai  
<a id="s61"></a>**[S61] OpenAI: Language Models Are Few-Shot Learners (GPT-3, 2020 authors)** — https://openai.com/index/language-models-are-few-shot-learners/  
<a id="s62"></a>**[S62] OpenAI: Scaling Laws for Neural Language Models (2020 authors)** — https://openai.com/index/scaling-laws-for-neural-language-models/  
<a id="s63"></a>**[S63] Google Research: AlphaGo Nature paper (2016)** — https://research.google/pubs/mastering-the-game-of-go-with-deep-neural-networks-and-tree-search/  
<a id="s64"></a>**[S64] Nature: AlphaGo Zero authors (2017)** — https://www.nature.com/articles/nature24270  
<a id="s65"></a>**[S65] OpenAI: Dec. 2020 organizational update on Dario Amodei** — https://openai.com/index/organizational-update/  
<a id="s66"></a>**[S66] Nature: Deep Q-Network paper (Feb. 2015)** — https://www.nature.com/articles/nature14236  
<a id="s67"></a>**[S67] Y Combinator: 2016 interview with Scale cofounders Wang and Guo** — https://www.ycombinator.com/blog/scale  
<a id="s68"></a>**[S68] Reuters: Essential AI founded by Vaswani and Parmar (2023)** — https://finance.yahoo.com/news/top-ex-google-ai-researchers-120100948.html  
<a id="s69"></a>**[S69] Nature: Deep Learning review by LeCun, Bengio, Hinton (2015)** — https://www.nature.com/articles/nature14539  
<a id="s70"></a>**[S70] Google Research: Distilling the Knowledge in a Neural Network (2015)** — https://research.google/pubs/distilling-the-knowledge-in-a-neural-network/  
<a id="s71"></a>**[S71] Google Research: Dynamic Routing Between Capsules (2017)** — https://research.google/pubs/dynamic-routing-between-capsules/  
<a id="s72"></a>**[S72] arXiv: Layer Normalization by Ba, Kiros, Hinton (2016)** — https://arxiv.org/abs/1607.06450  
<a id="s73"></a>**[S73] Google Research: Sparsely Gated Mixture of Experts by Shazeer et al. (2017)** — https://research.google/pubs/outrageously-large-neural-networks-the-sparsely-gated-mixture-of-experts-layer/  
<a id="s74"></a>**[S74] Reuters: Yann LeCun to depart Meta to start AI laboratory (Nov. 2025)** — https://www.reuters.com/technology/yann-lecun-leave-meta-launch-ai-startup-focused-advanced-machine-intelligence-2025-11-19/  

## 8. Provided companion files
- `ai_people_network_seed.json`: machine-readable people, relationship groups, explicit edges, pairwise derived edges and sources.
- `people.csv`: tabular directory, suitable for importing into SQLite/Supabase.
- `relationships.csv`: graph-ready source/target rows with path eligibility and source IDs.

**Editorial note (November 2026):** Personnel roles can change rapidly. Relationships refer to the historical period in the evidence. This is a curated, auditable research seed; do not publish it as an exhaustive or quantitatively validated influence ranking.
