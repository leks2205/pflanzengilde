import { StarTree } from '../types/guild';

export const STAR_TREES: StarTree[] = [
  {
    id: 'tree-apple',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Apple Tree',
      de: 'Kultur-Apfelbaum'
    },
    botanicalName: 'Malus domestica',
    category: 'FRUIT_TREE',
    matureRadiusM: 3.5,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Codling Moth (Cydia pomonella)',
        'Apple Scab (Venturia inaequalis)',
        'Woolly Aphids',
        'Vole Root Girdling',
        'Turf Grass Competition'
      ],
      de: [
        'Apfelwickler (Cydia pomonella)',
        'Apfelschorf (Venturia inaequalis)',
        'Blutläuse',
        'Wühlmausfraß an Wurzeln',
        'Konkurrenz durch Rasengräser'
      ]
    },
    description: {
      en: 'The classic permaculture canopy star. Apple guilds typically combine bulb rings around the drip line, chives as an edible border (claims that they combat scab are unproven), comfrey as a mulch plant (its leaves contain about 6.5% potassium in dry matter) and open-flowered insectary plants such as umbellifers: in apple orchards, flower strips have been shown to draw natural enemies such as parasitoid wasps.',
      de: 'Der klassische Kronen-Star der Permakultur. Apfelgilden kombinieren meist Zwiebelblumenringe an der Traufkante, Schnittlauch als essbare Einfassung (eine Wirkung gegen Schorf ist unbewiesen), Beinwell als Mulchpflanze (seine Blätter enthalten rund 6,5 % Kalium in der Trockenmasse) und offenblütige Nützlingspflanzen wie Doldenblütler: In Apfelanlagen locken Blühstreifen nachweislich Nützlinge wie Schlupfwespen an.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#ef4444',
    imageUrl: '/images/plants/tree-apple.webp?v=2',
    preferredSoils: ['LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Thrives in deep, nutrient-rich loam. Heavy, poorly drained soil and planting with the graft union below ground increase the risk of Phytophthora collar rot. Shallow chalk dries out quickly.',
      de: 'Gedeiht optimal in tiefgründigem, nährstoffreichem Lehm. Schwerer, schlecht drainierter Boden und zu tiefes Pflanzen (Veredelungsstelle unter der Erde) erhöhen das Risiko von Phytophthora-Kragenfäule. Flachgründiger Kalkboden trocknet schnell aus.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov, optimal für Wurzelbildung) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov, optimal for root establishment) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Spätsommer bis Spätherbst (Aug–Nov je nach Sorte)',
      en: 'Late summer to late autumn (Aug–Nov depending on cultivar)'
    },
    recommendedCompanions: [
      'plant-chives',
      'plant-garlic',
      'plant-comfrey',
      'plant-white-clover',
      'plant-daffodil',
      'plant-yarrow',
      'plant-horseradish',
      'plant-nasturtium',
      'plant-fennel',
      'plant-hyacinth',
      'plant-winter-aconite',
      'plant-hellebore',
      'plant-willow',
      'plant-elaeagnus',
      'plant-miners-lettuce',
      'plant-wild-garlic',
      'plant-hyssop',
      'plant-tansy',
      'plant-marigold',
      'plant-hemp',
      'plant-rosemary',
      'plant-lemon-balm',
      'plant-sweet-cicely',
      'plant-dandelion',
      'plant-chamomile',
      'plant-oregano',
      'plant-catmint',
      'plant-lovage',
      'plant-peppermint',
      'plant-alfalfa',
      'plant-nettle',
      'plant-cowslip',
      'plant-lungwort',
      'plant-welsh-onion',
      'plant-echinacea',
      'plant-alder',
      'plant-linden',
      'plant-blackcurrant',
      'plant-red-currant',
      'plant-rhubarb',
      'plant-sweet-alyssum',
      'plant-wild-carrot',
      'plant-ladys-mantle',
      'plant-chicory',
      'plant-fodder-radish',
      'plant-basil',
      'plant-summer-savory',
      'plant-pot-marigold',
      'plant-indian-mustard',
      'plant-garlic-chives',
      'plant-strawberry'
    ],
    sources: [
      'Oster, M., et al. (2021). Comfrey (Symphytum spp.) as a feed supplement in pig nutrition contributes to regional resource cycles. Science of The Total Environment, 796, 148988. doi:10.1016/j.scitotenv.2021.148988',
      'Campbell, A. J., Wilby, A., Sutton, P., & Wäckers, F. (2017). Getting More Power from Your Flowers: Multi-Functional Flower Strips Enhance Pollinators and Pest Control Agents in Apple Orchards. Insects, 8(3), 101. doi:10.3390/insects8030101',
      'Utah State University Extension (n.d.). Phytophthora Crown and Collar Rot. Utah Pests IPM Fact Sheets. https://extension.usu.edu/pests/ipm/notes_ag/fruit-phytophthora.php'
    ]
  },
  {
    id: 'tree-walnut',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Black Walnut',
      de: 'Schwarznuss / Walnuss'
    },
    botanicalName: 'Juglans nigra',
    category: 'NUT_TREE',
    matureRadiusM: 5.5,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: true,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Walnut Husk Fly',
        'Anthracnose',
        'Root Compaction', 'Codling Moth (Cydia pomonella)'],
      de: [
        'Walnussfruchtfliege',
        'Blattfleckenkrankheit (Anthraknose)',
        'Bodenverdichtung', 'Apfelwickler (Cydia pomonella)']
    },
    description: {
      en: 'A magnificent nut and timber canopy tree. Its buds, nut husks and roots contain hydrojuglone, which is converted by oxidation into allelopathic juglone; tomatoes and other nightshades (potato, pepper, eggplant), cabbage, apples and pears are listed as sensitive. A walnut guild therefore relies on species listed as juglone-tolerant, such as elderberry, currants, hostas and sweet woodruff.',
      de: 'Ein stattlicher Nuss- und Nutzholzbaum. Knospen, Fruchtschalen und Wurzeln enthalten Hydrojuglon, das durch Oxidation zum allelopathischen Juglon wird; Tomaten und andere Nachtschattengewächse (Kartoffel, Paprika, Aubergine), Kohl, Äpfel und Birnen gelten als empfindlich. Eine Walnussgilde setzt daher auf Arten, die als juglontolerant gelistet sind, etwa Holunder, Johannisbeeren, Funkien und Waldmeister.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#78350f',
    imageUrl: '/images/plants/tree-walnut.webp',
    preferredSoils: ['LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilAdvice: {
      en: 'Deep taproot with strong side roots; grows best on deep, moist, well-drained, nearly neutral and fertile soils such as loess and alluvial loams. Shallow, dry chalky or sandy soils are poorly suited.',
      de: 'Tiefe Pfahlwurzel mit kräftigen Seitenwurzeln; wächst am besten auf tiefgründigen, frischen, gut drainierten, annähernd neutralen und nährstoffreichen Böden wie Löss- und Auelehmen. Flachgründige, trockene Kalk- oder Sandböden sind wenig geeignet.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder frostfreies Frühjahr (Apr–Mai, empfindlich gegen Spätfrost)',
      en: 'Autumn (Oct–Nov) or frost-free spring (Apr–May, tender to late frosts)'
    },
    harvestTime: {
      de: 'Frühherbst (Sep–Okt, wenn die grünen Hüllen aufplatzen)',
      en: 'Early autumn (Sep–Oct, when green husks split open)'
    },
    recommendedCompanions: [
      'plant-red-currant',
      'plant-elderberry',
      'plant-woodruff',
      'plant-hosta',
      'plant-daffodil',
      'plant-chives',
      'plant-aster',
      'plant-white-clover',
      'plant-comfrey',
      'plant-hyacinth',
      'plant-hellebore',
      'plant-willow',
      'plant-miners-lettuce',
      'plant-wild-garlic',
      'plant-hemp',
      'plant-sweet-cicely',
      'plant-dandelion',
      'plant-peppermint',
      'plant-nettle',
      'plant-cowslip',
      'plant-lungwort',
      'plant-epimedium',
      'plant-wild-ginger',
      'plant-ostrich-fern',
      'plant-meadowsweet'],
    sources: [
      'Dana, M. N., & Lerner, B. R. (1994). Black Walnut Toxicity. Purdue University Cooperative Extension Service, HO-193. https://www.extension.purdue.edu/extmedia/ho/ho-193.pdf',
      'Sellmer, J., & Roman, D. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension. https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Williams, R. D. (1990). Juglans nigra L. – Black Walnut. In Silvics of North America, Vol. 2: Hardwoods. USDA Forest Service, Agriculture Handbook 654. https://research.fs.usda.gov/silvics/black-walnut'
    ]
  },
  {
    id: 'tree-peach',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Peach Tree',
      de: 'Pfirsichbaum'
    },
    botanicalName: 'Prunus persica',
    category: 'FRUIT_TREE',
    matureRadiusM: 2.8,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Oriental Fruit Moth (Grapholita molesta)',
        'Peach Leaf Curl (Taphrina deformans)',
        'Brown Rot (Monilinia spp.)'
      ],
      de: [
        'Pfirsichwickler (Grapholita molesta)',
        'Kräuselkrankheit (Taphrina deformans)',
        'Spitzendürre / Monilia-Fruchtfäule'
      ]
    },
    description: {
      en: 'A prolific, warmth- and sun-loving stone fruit. Prone to peach leaf curl and, in North America, to the peach tree borer. Aromatic herbs like garlic, tansy, and southernwood are often planted near its root collar, but a protective effect against borers is unproven; horseradish is a traditional companion, though an effect against brown rot is not documented.',
      de: 'Wärmeliebendes Steinobst mit hohem Sonnenbedarf. Anfällig für die Kräuselkrankheit, in Nordamerika auch für den Pfirsichbaum-Glasflügler (Stammbohrer). Duftende Kräuter wie Knoblauch, Rainfarn und Eberraute werden oft am Wurzelhals gepflanzt, eine Schutzwirkung gegen Stammbohrer ist jedoch unbewiesen; Meerrettich ist ein traditioneller Begleiter, eine Wirkung gegen Monilia ist aber nicht belegt.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'SUMMER',
    color: '#f97316',
    imageUrl: '/images/plants/tree-peach.webp?v=2',
    preferredSoils: ['SANDY', 'LOAM', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Requires warm, well-drained sandy loam. On heavy or poorly drained soils, plant on a raised ridge or berm about 30–45 cm high to reduce Phytophthora root and collar rot.',
      de: 'Benötigt warmen, gut drainierten Sand- oder Lehmboden. Bei schwerem oder schlecht drainiertem Boden auf einen etwa 30–45 cm hohen Damm pflanzen, um Phytophthora-Wurzel- und Kragenfäule vorzubeugen.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr nach den stärksten Frösten)',
      en: 'Spring (Mar–Apr after severe frosts)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Sep)',
      en: 'Mid-summer (Jul–Sep)'
    },
    recommendedCompanions: [
      'plant-garlic',
      'plant-chives',
      'plant-horseradish',
      'plant-comfrey',
      'plant-nasturtium',
      'plant-thyme',
      'plant-sage',
      'plant-white-clover',
      'plant-winter-aconite',
      'plant-elaeagnus',
      'plant-hyssop',
      'plant-tansy',
      'plant-marigold',
      'plant-hemp',
      'plant-rosemary',
      'plant-lemon-balm',
      'plant-chamomile',
      'plant-oregano',
      'plant-catmint',
      'plant-welsh-onion',
      'plant-echinacea',
      'plant-creeping-phlox',
      'plant-sorghum-sudangrass',
      'plant-salad-burnet',
      'plant-buckwheat',
      'plant-phacelia',
      'plant-garlic-chives'
    ],
    sources: [
      'Layton, B., & Henn, A. (2023). Disease and Insect Control for Homegrown Peaches and Plums. Mississippi State University Extension, Publication P2858. https://extension.msstate.edu/publications/disease-and-insect-control-for-homegrown-peaches-and-plums',
      'Masabni, J. G., Strang, J. G., Hartman, J. R., & Bessin, R. (2007). Growing Peaches in Kentucky. University of Kentucky Cooperative Extension Service, HO-57. https://publications.mgcafe.uky.edu/sites/publications.ca.uky.edu/files/ho57.pdf',
      'Adaskaveg, J. E., Duncan, R. A., Hasey, J. K., & Day, K. R. (2015). Phytophthora Root and Crown Rot (Peach). UC IPM Pest Management Guidelines, UC ANR Publication 3454. https://ipm.ucanr.edu/agriculture/peach/phytophthora-root-and-crown-rot/'
    ]
  },
  {
    id: 'tree-plum',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'European Plum',
      de: 'Echte Zwetschge / Pflaume'
    },
    botanicalName: 'Prunus domestica',
    category: 'FRUIT_TREE',
    matureRadiusM: 3.2,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Plum Fruit Moth (Cydia funebrana)',
        'Silver Leaf Fungus',
        'Aphid Leaf Curling'
      ],
      de: [
        'Pflaumenwickler',
        'Bleiglanzkrankheit',
        'Blattlausbefall'
      ]
    },
    description: {
      en: 'Hardy and heavy-bearing stone fruit, often combined with nitrogen-fixing clover and insectary plants like yarrow and dill. In European apple orchards, perennial flower strips between the tree rows increased aphid predators and reduced pests and fruit damage; for single companion plants this has not been shown.',
      de: 'Robustes, ertragreiches Steinobst, oft kombiniert mit stickstofffixierendem Klee und Nützlingspflanzen wie Schafgarbe und Dill. In europäischen Apfelanlagen förderten mehrjährige Blühstreifen zwischen den Baumreihen Blattlausfeinde und verringerten Schädlinge und Fruchtschäden; für einzelne Begleitpflanzen ist das nicht belegt.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#7e22ce',
    imageUrl: '/images/plants/tree-plum.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Likes moisture-retentive soil and grows well in heavy clay as long as it drains. Avoid thin, dry sandy soils: water shortage during fruit growth causes fruit drop and small fruit (shown for Japanese plum).',
      de: 'Mag wasserhaltende Böden und gedeiht auch auf schwerem Ton, sofern dieser gut abfließt. Dünne, trockene Sandböden meiden: Wassermangel während der Fruchtentwicklung führt zu Fruchtfall und kleinen Früchten (belegt für Japanische Pflaume).'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer bis Frühherbst (Jul–Okt)',
      en: 'Mid-summer to early autumn (Jul–Oct)'
    },
    recommendedCompanions: [
      'plant-chives',
      'plant-garlic',
      'plant-horseradish',
      'plant-daffodil',
      'plant-yarrow',
      'plant-borage',
      'plant-strawberry',
      'plant-comfrey',
      'plant-sage',
      'plant-hyacinth',
      'plant-white-clover',
      'plant-winter-aconite',
      'plant-hellebore',
      'plant-elaeagnus',
      'plant-miners-lettuce',
      'plant-wild-garlic',
      'plant-tansy',
      'plant-marigold',
      'plant-hemp',
      'plant-rosemary',
      'plant-lemon-balm',
      'plant-sweet-cicely',
      'plant-chamomile',
      'plant-oregano',
      'plant-catmint',
      'plant-creeping-jenny',
      'plant-nettle',
      'plant-lungwort',
      'plant-welsh-onion',
      'plant-echinacea',
      'plant-linden',
      'plant-blackcurrant',
      'plant-red-currant',
      'plant-ladys-mantle',
      'plant-chicory',
      'plant-ribwort-plantain',
      'plant-garlic-chives'
    ],
    sources: [
      'Cahenzli, F., et al. (2019). Perennial flower strips for pest control in organic apple orchards – A pan-European study. Agriculture, Ecosystems & Environment, 278, 43–53. doi:10.1016/j.agee.2019.03.011',
      'University of Wisconsin–Madison CIAS (n.d.). European Plum. Uncommon Fruit. https://uncommonfruit.cias.wisc.edu/european-plum/',
      'Hamdani, A., Hssaini, L., Bouda, S., Adiba, A., & Razouk, R. (2022). Japanese plums behavior under water stress: impact on yield and biochemical traits. Heliyon, 8(4), e09278. doi:10.1016/j.heliyon.2022.e09278'
    ]
  },
  {
    id: 'tree-pear',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'European Pear',
      de: 'Kultur-Birne'
    },
    botanicalName: 'Pyrus communis',
    category: 'FRUIT_TREE',
    matureRadiusM: 3.8,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Fire Blight (Erwinia amylovora)',
        'Pear Rust (Gymnosporangium)',
        'Pear Psylla'
      ],
      de: [
        'Feuerbrand (Erwinia amylovora)',
        'Birnengitterrost (Gymnosporangium)',
        'Birnenblattsauger'
      ]
    },
    description: {
      en: 'Stately and long-lived upright fruit tree. Excessive nitrogen and heavy pruning promote soft, vigorous shoots that are very susceptible to fire blight, so a slow-acting legume living mulch (white clover) and comfrey mulch are preferable to high-nitrogen manures.',
      de: 'Langlebiger, aufrechter Obstbaum. Zu viel Stickstoff und starker Rückschnitt fördern weiche, mastige Triebe, die sehr anfällig für Feuerbrand sind; ein langsam wirkender Leguminosen-Lebendmulch (Weißklee) und Beinwellmulch sind daher besser als scharfe Stickstoffdüngung.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#84cc16',
    imageUrl: '/images/plants/tree-pear.webp?v=2',
    preferredSoils: ['CLAY', 'LOAM', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Grows well in moisture-retentive loam or clay. On calcareous soils, pears on the common dwarfing quince rootstock often develop iron-deficiency chlorosis; a vigorous pear rootstock (e.g. Pyrus betulifolia) stayed green there.',
      de: 'Wächst gut auf wasserhaltendem Lehm- oder Tonboden. Auf kalkhaltigen Böden zeigen Birnen auf der üblichen schwachwüchsigen Quittenunterlage oft Eisenmangel-Chlorose; eine starkwüchsige Birnenunterlage (z. B. Pyrus betulifolia) blieb dort grün.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Vorfrühling (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Spätsommer bis Spätherbst (Aug–Okt, vor voller Reife pflücken)',
      en: 'Late summer to late autumn (Aug–Oct, pick slightly firm)'
    },
    recommendedCompanions: [
      'plant-yarrow',
      'plant-fennel',
      'plant-chives',
      'plant-daffodil',
      'plant-comfrey',
      'plant-red-currant',
      'plant-white-clover',
      'plant-woodruff',
      'plant-hyacinth',
      'plant-winter-aconite',
      'plant-hellebore',
      'plant-willow',
      'plant-elaeagnus',
      'plant-miners-lettuce',
      'plant-wild-garlic',
      'plant-hemp',
      'plant-lemon-balm',
      'plant-sweet-cicely',
      'plant-dandelion',
      'plant-lovage',
      'plant-peppermint',
      'plant-alfalfa',
      'plant-cowslip',
      'plant-lungwort',
      'plant-meadowsweet',
      'plant-alder',
      'plant-linden',
      'plant-blackcurrant',
      'plant-rhubarb',
      'plant-ladys-mantle',
      'plant-chicory',
      'plant-fodder-radish',
      'plant-basil',
      'plant-summer-savory',
      'plant-cornflower',
      'plant-catmint'
    ],
    sources: [
      'Ellis, M. A., & Ivey, M. L. (2016). Fire Blight of Apples and Pears. Ohio State University Extension, PLPATH-FRU-22. https://cfaes.osu.edu/fact-sheet/fire-blight-apples-and-pears',
      'Zhao, Y., et al. (2023). Bicarbonate rather than high pH in growth medium induced Fe-deficiency chlorosis in dwarfing rootstock quince A (Cydonia oblonga Mill.) but did not impair Fe nutrition of vigorous rootstock Pyrus betulifolia. Frontiers in Plant Science, 14, 1237327. doi:10.3389/fpls.2023.1237327'
    ]
  },
  {
    id: 'tree-fig',
    climateZones: ['TEMPERATE','SUBTROPICAL','TROPICAL'],
    commonName: {
      en: 'Common Fig',
      de: 'Echte Feige'
    },
    botanicalName: 'Ficus carica',
    category: 'FRUIT_TREE',
    matureRadiusM: 2.5,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Winter Frost Damage',
        'Root Nematodes',
        'Over-moist Soil Fungus'
      ],
      de: [
        'Winterfrost-Schäden',
        'Wurzelälchen (Nematoden)',
        'Staunässe / Wurzelfäule'
      ]
    },
    description: {
      en: 'Needs a warm, sunny, sheltered spot, ideally against a south- or south-west-facing wall; in cold areas protect the young fruitlets over winter. Shallow, wide-spreading root system (sometimes covering 15 m), often combined with rosemary, thyme and marigolds. Figs are prone to root-knot nematodes; a marigold cover crop before planting can suppress nematodes, though results vary, and an effect as an under-tree companion is unproven.',
      de: 'Braucht einen warmen, sonnigen, geschützten Platz, am besten an einer Süd- oder Südwestwand; in kalten Lagen die jungen Fruchtansätze über Winter schützen. Flaches, weit ausgreifendes Wurzelwerk (teils über 15 m), oft kombiniert mit Rosmarin, Thymian und Studentenblumen. Feigen sind anfällig für Wurzelgallenälchen; eine Tagetes-Vorkultur vor der Pflanzung kann Nematoden unterdrücken, die Wirkung schwankt jedoch, und als Unterpflanzung von Bäumen ist sie unbewiesen.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#4c1d95',
    imageUrl: '/images/plants/tree-fig.webp',
    preferredSoils: ['CHALKY', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilAdvice: {
      en: 'Mediterranean species that copes well with limy soil but needs free-draining ground. Waterlogged heavy clay is unsuitable.',
      de: 'Mediterrane Art, die kalkhaltigen Boden gut verträgt, aber gut durchlässigen Untergrund braucht. Staunasser, schwerer Tonboden ist ungeeignet.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) an warmem, geschütztem Standort',
      en: 'Spring (Mar–May) in a warm, sheltered location'
    },
    harvestTime: {
      de: 'Hochsommer bis Frühherbst (Jul–Okt, 1–2 Ernten)',
      en: 'Mid-summer to early autumn (Jul–Oct, 1–2 crops)'
    },
    recommendedCompanions: [
      'plant-thyme',
      'plant-lavender',
      'plant-borage',
      'plant-nasturtium',
      'plant-sedum',
      'plant-sage',
      'plant-marigold',
      'plant-white-clover',
      'plant-hemp',
      'plant-sweet-potato',
      'plant-rosemary',
      'plant-oregano',
      'plant-catmint',
      'plant-echinacea',
      'plant-subterranean-clover',
      'plant-salad-burnet',
      'plant-buckwheat',
      'plant-tithonia'
    ],
    sources: [
      'Morton, J. F. (1987). Fig. In Fruits of Warm Climates (pp. 47–50). Julia F. Morton, Miami, FL. https://hort.purdue.edu/newcrop/morton/fig.html',
      'Royal Horticultural Society (n.d.). How to grow figs. RHS Grow Your Own. https://www.rhs.org.uk/fruit/figs/grow-your-own',
      'Hooks, C. R. R., Wang, K.-H., Ploeg, A., & McSorley, R. (2010). Using marigold (Tagetes spp.) as a cover crop to protect crops from plant-parasitic nematodes. Applied Soil Ecology, 46(3), 307–320. doi:10.1016/j.apsoil.2010.09.005'
    ]
  },
  {
    id: 'tree-hazelnut',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Common Hazelnut / Filbert',
      de: 'Gemeine Hasel'
    },
    botanicalName: 'Corylus avellana',
    category: 'NUT_TREE',
    matureRadiusM: 2.5,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        'Nut Weevil (Curculio nucum)',
        'Hazelnut Big Bud Mite (Phytoptus avellanae)'
      ],
      de: [
        'Haselnussbohrer (Curculio nucum)',
        'Haselnussknospenmilbe (Phytoptus avellanae)'
      ]
    },
    description: {
      en: 'A multi-stemmed woodland edge nut producer. Its wind-pollinated catkins open in early spring before the leaves, and honeybees collect the pollen, making it an early pollen source. Well suited as the central tree of smaller semi-shaded guilds.',
      de: 'Mehrstämmiges Waldrandgehölz mit Nussertrag. Die windbestäubten Kätzchen blühen im zeitigen Frühjahr vor dem Laubaustrieb, und Honigbienen sammeln ihren Pollen – eine frühe Pollenquelle. Gut geeignet als Mittelpunkt kleinerer, halbschattiger Pflanzengilden.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#d97706',
    imageUrl: '/images/plants/tree-hazelnut.webp?v=2',
    preferredSoils: ['LOAM', 'SILT', 'CLAY', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Grows best on fertile, nutrient-rich, slightly acidic to neutral soils, though it can also thrive on dry calcareous soils. Severe summer water stress leads to more blank nuts and smaller kernels, so drought-prone sands are a poor choice.',
      de: 'Wächst am besten auf fruchtbaren, nährstoffreichen, schwach sauren bis neutralen Böden, kann aber auch auf trockenen Kalkböden gedeihen. Starker Wassermangel im Sommer führt zu mehr tauben Nüssen und kleineren Kernen, daher sind dürregefährdete Sandböden ungünstig.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Dez) oder Vorfrühling (Feb–Apr)',
      en: 'Autumn (Oct–Dec) or late winter to early spring (Feb–Apr)'
    },
    harvestTime: {
      de: 'Frühherbst (Sep–Okt)',
      en: 'Early autumn (Sep–Oct)'
    },
    recommendedCompanions: [
      'plant-snowdrop',
      'plant-crocus',
      'plant-red-currant',
      'plant-woodruff',
      'plant-bugleweed',
      'plant-comfrey',
      'plant-daffodil',
      'plant-hyacinth',
      'plant-winter-aconite',
      'plant-hellebore',
      'plant-miners-lettuce',
      'plant-wild-garlic',
      'plant-dandelion',
      'plant-creeping-jenny',
      'plant-peppermint',
      'plant-cowslip',
      'plant-lungwort',
      'plant-epimedium',
      'plant-wild-ginger',
      'plant-ostrich-fern',
      'plant-blackcurrant'
    ],
    sources: [
      'Hicks, D. (2022). Biological Flora of Britain and Ireland: Corylus avellana. Journal of Ecology, 110(12), 3053–3089. doi:10.1111/1365-2745.14008',
      'Enescu, C. M., Houston Durrant, T., de Rigo, D., & Caudullo, G. (2016). Corylus avellana in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Corylus_avellana.pdf',
      'Moine, A., et al. (2024). Grafting with non-suckering rootstock increases drought tolerance in Corylus avellana L. through physiological and biochemical adjustments. Physiologia Plantarum, 176(6), e70003. doi:10.1111/ppl.70003'
    ]
  },
  {
    id: 'tree-chestnut',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Sweet Chestnut',
      de: 'Edelkastanie / Marone'
    },
    botanicalName: 'Castanea sativa',
    category: 'NUT_TREE',
    matureRadiusM: 5.0,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Chestnut Blight (Cryphonectria parasitica)',
        'Gall Wasp'
      ],
      de: [
        'Kastanienrindenkrebs',
        'Japanische Esskastaniengallwespe'
      ]
    },
    description: {
      en: 'Majestic traditional staple-food tree; on a dry-matter basis its nuts are 75–91% carbohydrates, mainly starch. Deep-rooting (a strong taproot when young, later a deep heart-root system), often underplanted with blueberries (in acidic soil), comfrey, and nitrogen-fixing shrubs like goumi and sea buckthorn.',
      de: 'Majestätischer traditioneller Brotbaum; die Früchte bestehen in der Trockenmasse zu 75–91 % aus Kohlenhydraten, vor allem Stärke. Tiefwurzler (in der Jugend kräftige Pfahlwurzel, später tiefes Herzwurzelsystem), oft unterpflanzt mit Heidelbeeren (im sauren Boden), Beinwell und stickstoffbindenden Sträuchern wie Goumi und Sanddorn.'
    },
    bloomSeason: 'SUMMER',
    harvestSeason: 'AUTUMN',
    color: '#b45309',
    imageUrl: '/images/plants/tree-chestnut.webp?v=2',
    preferredSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilAdvice: {
      en: 'Calcifuge: grows best on well-drained, well-aerated acidic soils (roughly pH 3.5–5.5) and does not thrive on limestone. Avoid heavy clay and waterlogged soils, where roots suffer and Phytophthora (ink disease) is common.',
      de: 'Kalkmeidend: wächst optimal auf durchlässigen, gut durchlüfteten, sauren Böden (etwa pH 3,5–5,5) und gedeiht nicht auf Kalkstein. Schwere Tone und staunasse Böden meiden, dort leiden die Wurzeln und Phytophthora (Tintenkrankheit) tritt häufig auf.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Frühherbst bis Spätherbst (Sep–Nov)',
      en: 'Early autumn to late autumn (Sep–Nov)'
    },
    recommendedCompanions: [
      'plant-goumi',
      'plant-seabuckthorn',
      'plant-elderberry',
      'plant-comfrey',
      'plant-yarrow',
      'plant-woodruff',
      'plant-snowdrop',
      'plant-willow',
      'plant-elaeagnus',
      'plant-cranberry',
      'plant-dandelion',
      'plant-wintergreen',
      'plant-lingonberry',
      'plant-cowslip',
      'plant-rhododendron',
      'plant-blueberry'
    ],
    sources: [
      'Conedera, M., Tinner, W., Krebs, P., de Rigo, D., & Caudullo, G. (2016). Castanea sativa in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Castanea_sativa.pdf',
      'Santos, M. J., Pinto, T., & Vilela, A. (2022). Sweet Chestnut (Castanea sativa Mill.) Nutritional and Phenolic Composition Interactions with Chestnut Flavor Physiology. Foods, 11(24), 4052. doi:10.3390/foods11244052',
      'Aas, G. (2018). Die Esskastanie (Castanea sativa): Verwandtschaft, Morphologie und Ökologie. In Beiträge zur Edelkastanie, LWF Wissen 81. Bayerische Landesanstalt für Wald und Forstwirtschaft. https://www.lwf.bayern.de/mam/cms04/service/dateien/w81_beitraege_edelkastanie.pdf',
      'Segatz, E. (2018). Biodiversität und waldbauliche Behandlung von Edelkastanienwäldern. In Beiträge zur Edelkastanie, LWF Wissen 81. Bayerische Landesanstalt für Wald und Forstwirtschaft. https://www.lwf.bayern.de/mam/cms04/service/dateien/w81_beitraege_edelkastanie.pdf'
    ]
  },
  {
    id: 'tree-apricot',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Apricot Tree',
      de: 'Aprikosenbaum / Marille'
    },
    botanicalName: 'Prunus armeniaca',
    category: 'FRUIT_TREE',
    matureRadiusM: 3.0,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Monilinia Brown Rot',
        'Bacterial Canker (Pseudomonas)',
        'Oriental Fruit Moth (Grapholita molesta)',
        'Early Blossom Frost Damage'
      ],
      de: [
        'Spitzendürre / Monilia-Fruchtfäule',
        'Bakterienbrand (Pseudomonas)',
        'Pfirsichwickler (Grapholita molesta)',
        'Spätfrostschäden an der Blüte'
      ]
    },
    description: {
      en: 'Sun- and heat-loving stone fruit that blooms early, so buds, flowers and young fruit are often hit by spring frosts. Very susceptible to Monilinia blossom blight. Often combined with early-flowering plants (crocus, dandelion) that attract pollinators, and with traditional companions like horseradish and garlic (an antifungal effect of garlic as a companion is unproven).',
      de: 'Wärmeliebendes Steinobst mit früher Blüte, daher werden Knospen, Blüten und junge Früchte häufig von Spätfrösten geschädigt. Sehr anfällig für Monilia-Spitzendürre. Oft kombiniert mit früh blühenden Bestäuberpflanzen (Krokus, Löwenzahn) und traditionellen Begleitern wie Meerrettich und Knoblauch am Wurzelhals (eine pilzhemmende Wirkung von Knoblauch als Begleitpflanze ist unbewiesen).'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'SUMMER',
    color: '#ea580c',
    imageUrl: '/images/plants/tree-apricot.webp',
    preferredSoils: ['SANDY', 'LOAM', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Needs warm, well-drained sandy or gravelly loam. Saturated soil for 24 hours or more favors Phytophthora infections, so on heavy or wet soils plant on a slight mound or berm that drains water away from the crown.',
      de: 'Benötigt warmen, gut drainierten sandigen oder kiesigen Lehm. Wassergesättigter Boden über 24 Stunden oder länger begünstigt Phytophthora-Infektionen; auf schweren oder nassen Böden daher auf einen flachen Hügel oder Damm pflanzen, damit das Wasser vom Wurzelhals abläuft.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr, nach den stärksten Frösten) oder milder Herbst',
      en: 'Spring (Mar–Apr, after severe freeze) or mild autumn'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug)',
      en: 'Mid-summer (Jul–Aug)'
    },
    recommendedCompanions: [
      'plant-horseradish',
      'plant-garlic',
      'plant-chives',
      'plant-comfrey',
      'plant-thyme',
      'plant-crocus',
      'plant-sage',
      'plant-white-clover',
      'plant-hyacinth',
      'plant-winter-aconite',
      'plant-elaeagnus',
      'plant-hyssop',
      'plant-marigold',
      'plant-rosemary',
      'plant-lemon-balm',
      'plant-chamomile',
      'plant-oregano',
      'plant-welsh-onion',
      'plant-echinacea',
      'plant-subterranean-clover',
      'plant-salad-burnet',
      'plant-buckwheat',
      'plant-phacelia',
      'plant-garlic-chives'
    ],
    sources: [
      'Rodrigo, J., Julian, C., & Herrero, M. (2006). Spring frost damage in buds, flowers and developing fruits in apricot. Acta Horticulturae, 717, 87–88. doi:10.17660/ActaHortic.2006.717.15',
      'Ziems, A. D. (2009). Brown Rot on Apricot and Other Stone Fruits (G1965). University of Nebraska–Lincoln Extension. https://extensionpubs.unl.edu/publication/g1965/na/pdf/view',
      'Adaskaveg, J. E., et al. (2014). Phytophthora Root and Crown Rot. UC IPM Pest Management Guidelines: Apricot, UC ANR Publication 3433. https://ipm.ucanr.edu/agriculture/apricot/phytophthora-root-and-crown-rot/'
    ]
  },
  {
    id: 'tree-cherry',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Sweet Cherry',
      de: 'Süßkirsche / Vogel-Kirsche'
    },
    botanicalName: 'Prunus avium',
    category: 'FRUIT_TREE',
    matureRadiusM: 3.5,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Cherry Fruit Fly (Rhagoletis cerasi)',
        'Bacterial Canker (Pseudomonas syringae)',
        'Monilinia Blossom Blight',
        'Black Cherry Aphid',
        'Vole Root Damage', 'Spotted Wing Drosophila (Drosophila suzukii)'],
      de: [
        'Kirschfruchtfliege (Rhagoletis cerasi)',
        'Bakterienbrand (Pseudomonas syringae)',
        'Monilia-Spitzendürre',
        'Schwarze Kirschenblattlaus',
        'Wühlmausschäden an Wurzeln', 'Kirschessigfliege (Drosophila suzukii)']
    },
    description: {
      en: 'A vigorous stone fruit canopy star prized for delicious cherries. Rather shallow, heart-shaped root system with far-reaching lateral roots in the topsoil. Vulnerable to cherry fruit fly and bacterial canker; often paired with garlic/chives, tansy, and daffodils, though protection against fruit flies or voles by these companions is unproven.',
      de: 'Wuchsfreudiger Steinobst-Kronenbaum für Süßkirschen. Eher flaches Herzwurzelsystem mit weit reichenden Seitenwurzeln im Oberboden. Anfällig für Kirschfruchtfliege und Bakterienbrand; wird oft mit Knoblauch/Schnittlauch, Rainfarn und Narzissen kombiniert, ein Schutz vor Fruchtfliegen oder Wühlmäusen durch diese Begleiter ist jedoch unbewiesen.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#dc2626',
    imageUrl: '/images/plants/tree-cherry.webp',
    preferredSoils: ['LOAM', 'SILT', 'SANDY'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Favors deep, fertile, well-drained soils with a good water supply. Does not tolerate heavy clay, waterlogged or poorly drained sites, where saturated soil favors Phytophthora root and crown rot.',
      de: 'Bevorzugt tiefgründige, fruchtbare, gut drainierte Böden mit guter Wasserversorgung. Verträgt keine schweren Tone, Staunässe oder schlecht drainierten Standorte, wo wassergesättigter Boden Phytophthora-Wurzel- und Kragenfäule begünstigt.'
    },
    plantingTime: {
      de: 'Spätherbst (Okt–Dez) oder Vorfrühling (Feb–Apr)',
      en: 'Late autumn (Oct–Dec) or late winter to early spring (Feb–Apr)'
    },
    harvestTime: {
      de: 'Früh- bis Hochsommer (Jun–Aug, Kirschwochen)',
      en: 'Early to mid-summer (Jun–Aug)'
    },
    recommendedCompanions: [
      'plant-garlic',
      'plant-chives',
      'plant-daffodil',
      'plant-yarrow',
      'plant-white-clover',
      'plant-comfrey',
      'plant-tansy',
      'plant-hyacinth',
      'plant-hyssop',
      'plant-hemp',
      'plant-rosemary',
      'plant-lemon-balm',
      'plant-sweet-cicely',
      'plant-dandelion',
      'plant-chamomile',
      'plant-catmint',
      'plant-alfalfa',
      'plant-cowslip',
      'plant-welsh-onion',
      'plant-echinacea',
      'plant-linden',
      'plant-red-currant',
      'plant-creeping-phlox',
      'plant-chicory',
      'plant-ribwort-plantain',
      'plant-phacelia',
      'plant-fodder-radish',
      'plant-garlic-chives'
    ],
    sources: [
      'Welk, E., de Rigo, D., & Caudullo, G. (2016). Prunus avium in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Prunus_avium.pdf',
      'Adaskaveg, J. E., & Caprile, J. L. (2015). Phytophthora Root and Crown Rot. UC IPM Pest Management Guidelines: Cherry, UC ANR Publication 3440. https://ipm.ucanr.edu/agriculture/cherry/phytophthora-root-and-crown-rot/'
    ]
  },
  {
    id: 'tree-quince',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Quince Tree',
      de: 'Echte Quitte'
    },
    botanicalName: 'Cydonia oblonga',
    category: 'FRUIT_TREE',
    matureRadiusM: 2.2,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Fire Blight (Erwinia amylovora)',
        'Quince Leaf Blight (Diplocarpon mespili)',
        'Codling Moth',
        'Powdery Mildew'
      ],
      de: [
        'Feuerbrand (Erwinia amylovora)',
        'Blattbräune (Diplocarpon mespili)',
        'Apfelwickler',
        'Echter Mehltau'
      ]
    },
    description: {
      en: 'Fragrant, ancient pome fruit. Fruits best in a warm, sunny, sheltered spot (its spring flowers are frost-sensitive); it succeeds in semi-shade but fruits less well there. Shallow, plate-like root system, often combined with non-competing allium borders, chives and comfrey. Susceptible to quince leaf blight (Diplocarpon mespili), especially in wet summers (a protective effect of chives is unproven), and to fire blight.',
      de: 'Aromatisch duftendes, uraltes Kernobst. Trägt am besten an einem warmen, sonnigen, geschützten Platz (die Frühjahrsblüten sind frostempfindlich); im Halbschatten wächst sie, fruchtet dort aber schwächer. Flaches, tellerförmiges Wurzelsystem, oft kombiniert mit konkurrenzschwachen Allium-Einfassungen, Schnittlauch und Beinwell. Anfällig für Blattbräune (Diplocarpon mespili), besonders in nassen Sommern (eine Schutzwirkung von Schnittlauch ist unbewiesen), sowie für Feuerbrand.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#eab308',
    imageUrl: '/images/plants/tree-quince.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Tolerates a range of soils but prefers deep, fertile, moisture-retentive ones; dislikes very dry or waterlogged soil. Susceptible to iron-deficiency chlorosis on calcareous soils.',
      de: 'Verträgt verschiedene Böden, bevorzugt aber tiefgründige, fruchtbare, wasserhaltende; sehr trockener oder staunasser Boden wird nicht vertragen. Auf kalkhaltigen Böden anfällig für Eisenmangel-Chlorose.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Frühherbst bis Spätherbst (Sep–Nov vor starkem Frost)',
      en: 'Early to late autumn (Sep–Nov before heavy frost)'
    },
    recommendedCompanions: [
      'plant-horseradish',
      'plant-comfrey',
      'plant-chives',
      'plant-nasturtium',
      'plant-yarrow',
      'plant-marigold',
      'plant-lemon-balm',
      'plant-sweet-cicely',
      'plant-lovage',
      'plant-meadowsweet',
      'plant-wild-carrot',
      'plant-chicory'
    ],
    sources: [
      'Royal Horticultural Society (n.d.). How to grow quinces. RHS Grow Your Own. https://www.rhs.org.uk/fruit/quince/grow-your-own',
      'Plants For A Future (n.d.). Cydonia oblonga – Quince. PFAF Plant Database. https://pfaf.org/user/plant.aspx?latinname=Cydonia+oblonga',
      'Royal Horticultural Society (n.d.). Quince leaf blight. RHS. https://www.rhs.org.uk/disease/quince-leaf-blight',
      'Şahin, M., Mısırlı, A., & Özaktan, H. (2020). Determination of fire blight (Erwinia amylovora) susceptibility in Turkey\'s Cydonia oblonga Mill. germplasm. European Journal of Plant Pathology, 157(2), 227–237. doi:10.1007/s10658-020-01971-5',
      'Zhao, Y., et al. (2023). Bicarbonate rather than high pH in growth medium induced Fe-deficiency chlorosis in dwarfing rootstock quince A (Cydonia oblonga Mill.) but did not impair Fe nutrition of vigorous rootstock Pyrus betulifolia. Frontiers in Plant Science, 14, 1237327. doi:10.3389/fpls.2023.1237327'
    ]
  },
  {
    id: 'tree-mulberry',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Black Mulberry',
      de: 'Schwarze Maulbeere'
    },
    botanicalName: 'Morus nigra',
    category: 'FRUIT_TREE',
    matureRadiusM: 4.2,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Bacterial Leaf Blight (Pseudomonas)',
        'Premature Fruit Drop from Drought',
        'Bird Feeding Pressure'
      ],
      de: [
        'Bakterien-Blattflecken (Pseudomonas)',
        'Vorzeitiger Fruchtfall bei Dürre',
        'Vogelfraß'
      ]
    },
    description: {
      en: 'Stately, long-lived canopy star that can bear fruit for hundreds of years. Its dark berries are rich in anthocyanins (mainly cyanidin-3-O-glucoside) with antioxidant activity. Pairs well with nitrogen-fixing clovers and dynamic accumulator ground covers.',
      de: 'Stattlicher, langlebiger Kronen-Star, der über Jahrhunderte fruchten kann. Die dunklen Beeren sind reich an Anthocyanen (vor allem Cyanidin-3-O-glucosid) mit antioxidativer Wirkung. Gut kombinierbar mit stickstofffixierendem Klee und Beinwell.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#581c87',
    imageUrl: '/images/plants/tree-mulberry.webp',
    preferredSoils: ['LOAM', 'SANDY', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Likes warm, well-drained soil, preferably a deep loam; avoid waterlogged clay. Somewhat drought-resistant, but water in dry spells: if the roots become too dry, the fruit drops before it is fully ripe.',
      de: 'Mag warmen, durchlässigen Boden, am liebsten tiefgründigen Lehm; staunassen Ton meiden. Recht trockenheitsresistent, bei Trockenheit aber wässern: Werden die Wurzeln zu trocken, fallen die Früchte vor der vollen Reife ab.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder milder Herbst (Okt)',
      en: 'Spring (Mar–May) or mild autumn (Oct)'
    },
    harvestTime: {
      de: 'Hochsommer (Jun–Aug, sukzessive Ernte)',
      en: 'Mid-summer (Jun–Aug, staggered harvest)'
    },
    recommendedCompanions: [
      'plant-white-clover',
      'plant-comfrey',
      'plant-woodruff',
      'plant-daffodil',
      'plant-borage',
      'plant-yarrow',
      'plant-catmint',
      'plant-creeping-jenny',
      'plant-lovage',
      'plant-chicory',
      'plant-ribwort-plantain',
      'plant-salad-burnet',
      'plant-buckwheat',
      'plant-phacelia'
    ],
    sources: [
      'Orwa, C., Mutua, A., Kindt, R., Jamnadass, R., & Anthony, S. (2009). Morus nigra. Agroforestree Database: a tree reference and selection guide, version 4.0. World Agroforestry Centre. https://apps.worldagroforestry.org/treedb/AFTPDFS/Morus_nigra.PDF',
      'Chen, H., et al. (2016). Anti-Inflammatory and Antinociceptive Properties of Flavonoids from the Fruits of Black Mulberry (Morus nigra L.). PLOS ONE, 11(4), e0153080. doi:10.1371/journal.pone.0153080'
    ]
  },
  {
    id: 'tree-seabuckthorn-star',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Sea Buckthorn Tree',
      de: 'Sanddorn'
    },
    botanicalName: 'Hippophae rhamnoides',
    category: 'NITROGEN_FIXING_TREE',
    matureRadiusM: 2.0,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Sea Buckthorn Fruit Fly (Rhagoletis batava)',
        'Shade Intolerance',
        'Verticillium Wilt in Waterlogged Clay'
      ],
      de: [
        'Sanddornfruchtfliege (Rhagoletis batava)',
        'Extreme Schattenunverträglichkeit',
        'Verticillium-Welke bei Staunässe'
      ]
    },
    description: {
      en: 'Actinorhizal pioneer tree that fixes atmospheric nitrogen in root nodules with Frankia bacteria; used for soil improvement, wind and sand control. Its berries are rich in vitamin C (reported from about 53 to 896 mg per 100 g) and contain palmitoleic (omega-7), linoleic (omega-6) and alpha-linolenic (omega-3) acids. Needs full sun and cannot grow in shade.',
      de: 'Actinorhizales Pioniergehölz, das in Wurzelknöllchen mit Frankia-Bakterien Luftstickstoff bindet; genutzt zur Bodenverbesserung sowie gegen Wind- und Sanderosion. Die Beeren sind reich an Vitamin C (berichtet: etwa 53 bis 896 mg pro 100 g) und enthalten Palmitolein- (Omega-7), Linol- (Omega-6) und alpha-Linolensäure (Omega-3). Braucht volle Sonne und wächst nicht im Schatten.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#ea580c',
    imageUrl: '/images/plants/tree-seabuckthorn-star.webp',
    preferredSoils: ['SANDY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Pioneer of open, disturbed sites such as coastal dunes and riverside scrub; does well in very sandy soil and tolerates drought.',
      de: 'Pionierart offener, gestörter Standorte wie Küstendünen und Ufergebüsche; gedeiht gut auf sehr sandigen Böden und verträgt Trockenheit.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Okt–Nov)',
      en: 'Spring (Mar–May) or autumn (Oct–Nov)'
    },
    harvestTime: {
      de: 'Frühherbst bis Winter (Sep–Dez, nach ersten Frösten süßer)',
      en: 'Early autumn to winter (Sep–Dec, sweeter after frost)'
    },
    recommendedCompanions: [
      'plant-thyme',
      'plant-sedum',
      'plant-lavender',
      'plant-yarrow',
      'plant-oregano',
      'plant-creeping-phlox'
    ],
    sources: [
      'Kato, K., Kanayama, Y., Ohkawa, W., & Kanahama, K. (2007). Nitrogen Fixation in Seabuckthorn (Hippophae rhamnoides L.) Root Nodules and Effect of Nitrate on Nitrogenase Activity. Journal of the Japanese Society for Horticultural Science, 76(3), 185–190. doi:10.2503/jjshs.76.185',
      'Wang, Z., et al. (2022). Phytochemistry, health benefits, and food applications of sea buckthorn (Hippophae rhamnoides L.): A comprehensive review. Frontiers in Nutrition, 9, 1036295. doi:10.3389/fnut.2022.1036295',
      'Fahs, N., et al. (2026). Ecological niches and biogeography of nitrogen-fixing plants in Europe. Plant Biology, 28(5), 1349–1360. doi:10.1111/plb.70230',
      'Plants For A Future (n.d.). Hippophae rhamnoides – Sea Buckthorn. PFAF Plant Database. https://pfaf.org/user/plant.aspx?latinname=Hippophae+rhamnoides'
    ]
  },
  {
    id: 'tree-alder',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Black Alder',
      de: 'Schwarzerle'
    },
    botanicalName: 'Alnus glutinosa',
    category: 'NITROGEN_FIXING_TREE',
    matureRadiusM: 3.8,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Alder Leaf Beetle (Agelastica alni)',
        'Phytophthora alni Canker',
        'Drought Desiccation'
      ],
      de: [
        'Erlenblattkäfer (Agelastica alni)',
        'Erlensterben (Phytophthora alni)',
        'Trockenheit / Wassermangel'
      ]
    },
    description: {
      en: 'Native nitrogen-fixing canopy star for moist, heavy, or riparian guilds. Fixes nitrogen with Frankia bacteria in root nodules (alders: from several up to about 320 kg N/ha per year) and keeps its leaves nitrogen-rich until leaf fall, building a nitrogen-rich litter layer. A light-demanding pioneer that does not tolerate being overtopped, but survives flooding better than most other forest trees.',
      de: 'Einheimischer stickstofffixierender Leitbaum für feuchte, schwere Böden oder Uferbereiche. Bindet mit Frankia-Bakterien in Wurzelknöllchen Luftstickstoff (Erlen: von einigen bis etwa 320 kg N/ha und Jahr) und behält bis zum Laubfall stickstoffreiche Blätter, die eine stickstoffreiche Streuschicht bilden. Lichtbedürftige Pionierbaumart, die keine Überschirmung verträgt, Überflutung aber besser übersteht als die meisten anderen Waldbäume.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#15803d',
    imageUrl: '/images/plants/tree-alder.webp',
    preferredSoils: ['CLAY', 'SILT', 'LOAM'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Thrives in low-lying, damp, marshy and riverside soils, including heavy clay and silt. Grows even on coarse sand or gravel if moisture is ample, but fails on dry sites and grows poorly on calcareous soils.',
      de: 'Gedeiht auf tiefliegenden, feuchten, sumpfigen Böden und an Ufern, auch auf schwerem Ton und Schluff. Wächst bei ausreichender Feuchte sogar auf grobem Sand oder Kies, versagt aber auf trockenen Standorten und kümmert auf Kalkböden.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Vorfrühling (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Ganzjährig als Pionier-/Mulchholz; Chop & Drop im Sommer (Jun–Jul)',
      en: 'Year-round biomass/support; chop & drop in summer (Jun–Jul)'
    },
    recommendedCompanions: [
      'plant-elderberry',
      'plant-comfrey',
      'plant-bugleweed',
      'plant-woodruff',
      'plant-tea-sinensis',
      'plant-creeping-jenny',
      'plant-lovage',
      'plant-nettle',
      'plant-wild-ginger',
      'plant-ostrich-fern',
      'plant-meadowsweet',
      'plant-rhododendron',
      'plant-blackcurrant',
      'plant-red-currant',
      'plant-rhubarb'
    ],
    sources: [
      'Houston Durrant, T., de Rigo, D., & Caudullo, G. (2016). Alnus glutinosa in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Alnus_glutinosa.pdf',
      'Claessens, H., et al. (2010). A review of the characteristics of black alder (Alnus glutinosa (L.) Gaertn.) and their implications for silvicultural practices. Forestry, 83(2), 163–175. doi:10.1093/forestry/cpp038',
      'Tobita, H., et al. (2015). Responses of symbiotic N2 fixation in Alnus species to the projected elevated CO2 environment. Trees, 30(2), 523–537. doi:10.1007/s00468-015-1297-x'
    ]
  },
  {
    id: 'tree-pawpaw',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Pawpaw Tree',
      de: 'Dreilappige Papau / Indianerbanane'
    },
    botanicalName: 'Asimina triloba',
    category: 'FRUIT_TREE',
    matureRadiusM: 2.5,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Young Leaf Sunburn (UV sensitivity)',
        'Pollination Deficits (Fly and Beetle Pollinated)',
        'Taproot Disturbance'
      ],
      de: [
        'Sonnenbrand an Jungblättern (UV-Sensibilität)',
        'Bestäubungsdefizite (Fliegen- und Käferbestäubung)',
        'Wurzelstörung beim Umpflanzen'
      ]
    },
    description: {
      en: 'Shade-tolerant temperate fruit tree with large, custard-like fruits of tropical flavor. Seedlings are extremely sensitive to full sunlight and need shade for the first year or two, while established trees fruit best in open exposure. Contains annonaceous acetogenins with pesticidal activity; in its native range it has few serious pests (the main one is the pawpaw peduncle borer). Pollinated by flies and beetles, which are unreliable, so fruit set is often low.',
      de: 'Schattenverträglicher Obstbaum gemäßigter Breiten mit großen, cremigen Früchten von tropischem Aroma. Sämlinge sind extrem empfindlich gegen volle Sonne und brauchen im ersten, oft auch im zweiten Jahr Schatten; ältere Bäume tragen in offener Lage am besten. Enthält Annonaceen-Acetogenine mit pestizider Wirkung; im Heimatgebiet gibt es wenige ernste Schädlinge (Hauptschädling ist der Papau-Blütenstielbohrer). Bestäubt von Fliegen und Käfern, die unzuverlässig sind, daher ist der Fruchtansatz oft gering.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#65a30d',
    imageUrl: '/images/plants/tree-pawpaw.webp',
    preferredSoils: ['LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Needs deep, fertile, well-drained, slightly acid soil (pH 5.5–7); good drainage is essential. Native to stream banks, ravine slopes and floodplains. Dry, thin sandy soils are unsuitable.',
      de: 'Braucht tiefgründigen, fruchtbaren, gut drainierten, leicht sauren Boden (pH 5,5–7); gute Drainage ist entscheidend. Heimisch an Bachufern, Schluchthängen und in Auen. Trockene, flachgründige Sandböden sind ungeeignet.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach Frostgefahr)',
      en: 'Spring (Apr–May after frost danger)'
    },
    harvestTime: {
      de: 'Spätsommer bis Frühherbst (Sep–Okt)',
      en: 'Late summer to early autumn (Sep–Oct)'
    },
    recommendedCompanions: [
      'plant-hosta',
      'plant-woodruff',
      'plant-red-currant',
      'plant-comfrey',
      'plant-white-clover',
      'plant-epimedium',
      'plant-wild-ginger',
      'plant-ostrich-fern'
    ],
    sources: [
      'Jones, S. C., Peterson, R. N., Turner, T., Pomper, K. W., & Layne, D. R. (n.d.). Pawpaw Planting Guide. Kentucky State University Cooperative Extension Program. https://www.kysu.edu/academics/college-ahnr/school-of-anr/pawpaw/pawpaw-planting-guide.php',
      'Sullivan, J. (1993). Asimina triloba. Fire Effects Information System. USDA Forest Service, Rocky Mountain Research Station. https://www.fs.usda.gov/database/feis/plants/tree/asitri/all.html',
      'McLaughlin, J. L. (2008). Paw Paw and Cancer: Annonaceous Acetogenins from Discovery to Commercial Products. Journal of Natural Products, 71(7), 1311–1321. doi:10.1021/np800191t'
    ]
  },
  {
    id: 'shrub-blueberry',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Highbush Blueberry',
      de: 'Kulturheidelbeere'
    },
    botanicalName: 'Vaccinium corymbosum',
    category: 'BERRY_SHRUB',
    matureRadiusM: 1.1,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Iron Chlorosis at pH > 5.0',
        'Spotted Wing Drosophila (Drosophila suzukii)',
        'Mummy Berry (Monilinia vaccinii-corymbosi)',
        'Shallow Drought Desiccation'
      ],
      de: [
        'Eisenchlorose bei pH > 5,0',
        'Kirschessigfliege (Drosophila suzukii)',
        'Monilia-Fruchtfäule (Mummy Berry)',
        'Trockenstress durch Flachwurzeln'
      ]
    },
    description: {
      en: 'Acid-loving keystone berry shrub. Its shallow, fibrous roots lack root hairs, and it partners with ericoid mycorrhizal fungi for nutrient uptake. Tolerates partial shade, but yield and fruit quality decline with increasing shade. Grows in acid soil alongside cranberries, lupines and conifer mulch; never lime.',
      de: 'Säureliebender Beerenstrauch-Star. Das flache, faserige Wurzelwerk hat keine Wurzelhaare und nutzt ericoide Mykorrhizapilze zur Nährstoffaufnahme. Verträgt Halbschatten, Ertrag und Fruchtqualität sinken aber mit zunehmender Beschattung. Wächst in saurem Boden zusammen mit Moosbeeren (Cranberries), Lupinen und Nadelmulch; niemals kalken.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#2563eb',
    imageUrl: '/images/plants/shrub-blueberry.webp?v=2',
    preferredSoils: ['ACIDIC', 'SANDY'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilAdvice: {
      en: 'Strict acid-lover: soil pH 4.5–5.5 (optimum about 4.5); above pH 5.0, poor growth and leaf chlorosis can be expected. Grows best in soil high in organic matter with even moisture; with few root hairs and roots rarely deeper than 30–45 cm, it is prone to drought injury.',
      de: 'Streng säureliebend: Boden-pH 4,5–5,5 (Optimum etwa 4,5); über pH 5,0 ist mit Kümmerwuchs und Blattchlorose zu rechnen. Wächst am besten in humusreichem, gleichmäßig feuchtem Boden; mit wenigen Wurzelhaaren und Wurzeln meist nicht tiefer als 30–45 cm ist sie trockenheitsempfindlich.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Mai) in saurem Substrat',
      en: 'Autumn (Oct–Nov) or spring (Mar–May) in acidic soil'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug)',
      en: 'Mid-summer (Jul–Aug)'
    },
    recommendedCompanions: [
      'plant-cranberry',
      'plant-lupine',
      'plant-woodruff',
      'plant-comfrey',
      'plant-wintergreen',
      'plant-lingonberry',
      'plant-rhododendron'
    ],
    sources: [
      'Fernandez, G., Cline, B., Spayd, S., & Burrack, H. (2022). Chapter 14: Small Fruits. Extension Gardener Handbook. NC State Extension. https://content.ces.ncsu.edu/extension-gardener-handbook/14-small-fruits',
      'Sadowsky, J. J., Hanson, E. J., & Schilder, A. M. C. (2012). Root Colonization by Ericoid Mycorrhizae and Dark Septate Endophytes in Organic and Conventional Blueberry Fields in Michigan. International Journal of Fruit Science, 12(1–3), 169–187. doi:10.1080/15538362.2011.619346',
      'Oregon State University Extension Service (2025). Growing blueberries in your home garden (EC 1304). https://extension.oregonstate.edu/catalog/ec-1304-growing-blueberries-your-home-garden',
      'Traunfeld, J. (2024). Growing Blueberries in a Home Garden. University of Maryland Extension. https://extension.umd.edu/resource/growing-blueberries-home-garden'
    ]
  },
  {
    id: 'shrub-blackcurrant',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Blackcurrant Bush',
      de: 'Schwarze Johannisbeere'
    },
    botanicalName: 'Ribes nigrum',
    category: 'BERRY_SHRUB',
    matureRadiusM: 1.0,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Blackcurrant Gall Mite (Cecidophyopsis ribis)',
        'American Gooseberry Mildew (Podosphaera mors-uvae)',
        'Clearwing Borer'
      ],
      de: [
        'Johannisbeer-Gallmilbe (Cecidophyopsis ribis)',
        'Amerikanischer Stachelbeermehltau',
        'Johannisbeer-Glasflügler'
      ]
    },
    description: {
      en: 'High-yielding understory shrub, very rich in vitamin C (about 180 mg per 100 g of fruit, versus about 40 mg in red currants). Fruits best in full sun but still does well in light shade. Often paired with alliums and aromatic southernwood, though claims that they deter gall mites or clearwing moths are unproven.',
      de: 'Ertragreicher Unterwuchs-Beerenstrauch, sehr reich an Vitamin C (rund 180 mg pro 100 g Frucht, gegenüber etwa 40 mg bei Roten Johannisbeeren). Trägt in voller Sonne am besten, gedeiht aber auch im lichten Schatten. Wird oft mit Allium und duftender Eberraute kombiniert, eine Wirkung gegen Gallmilbe oder Glasflügler ist jedoch unbewiesen.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#312e81',
    imageUrl: '/images/plants/shrub-blackcurrant.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: [],
    soilAdvice: {
      en: 'Prefers well-drained but moisture-retentive, fertile loam or clay, though it copes with most other soil conditions. Porous sandy soils dry out quickly.',
      de: 'Bevorzugt gut durchlässigen, aber wasserhaltenden, nährstoffreichen Lehm- oder Tonboden, kommt aber mit den meisten anderen Böden zurecht. Durchlässige Sandböden trocknen schnell aus.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug)',
      en: 'Mid-summer (Jul–Aug)'
    },
    recommendedCompanions: [
      'plant-chives',
      'plant-garlic',
      'plant-borage',
      'plant-comfrey',
      'plant-white-clover',
      'plant-nettle',
      'plant-meadowsweet',
      'plant-welsh-onion',
      'plant-garlic-chives'
    ],
    sources: [
      'USDA Agricultural Research Service (2019). Currants, european black, raw (FDC ID 173963). FoodData Central, SR Legacy. https://fdc.nal.usda.gov/fdc-app.html#/food-details/173963/nutrients',
      'Royal Horticultural Society (n.d.). Blackcurrants: Grow Your Own. RHS. https://www.rhs.org.uk/fruit/blackcurrants/grow-your-own'
    ]
  },
  {
    id: 'vine-grape',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Grapevine',
      de: 'Echte Weinrebe'
    },
    botanicalName: 'Vitis vinifera',
    category: 'VINE',
    matureRadiusM: 1.8,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Downy Mildew (Plasmopara viticola)',
        'Powdery Mildew (Erysiphe necator)',
        'Spider Mites',
        'Botrytis Bunch Rot', 'European Grapevine Moth (Lobesia botrana)'],
      de: [
        'Falscher Mehltau (Plasmopara viticola)',
        'Echter Mehltau (Oidium)',
        'Rote Spinne (Spinnmilben)',
        'Grauschimmel (Botrytis)', 'Bekreuzter Traubenwickler (Lobesia botrana)']
    },
    description: {
      en: 'The quintessential sun-loving perennial vine for trellises and arbors. Single roots can reach 6 m or deeper, although most roots stay in the top metre. Sage may help: in sealed-box trials its volatiles reduced grapevine susceptibility to downy mildew, and sprayed sage extract gave full to partial control in field trials; a benefit from simply planting sage nearby is unproven. Inter-row ground cover (e.g. a grass–sainfoin–white clover mix) cuts rain splash from the soil and delayed downy mildew, and spontaneous vegetation supports predatory mites.',
      de: 'Klassische sonnenhungrige Kletter-Leitpflanze für Spaliere und Lauben. Einzelne Wurzeln reichen 6 m und tiefer, die meisten liegen aber im obersten Meter. Salbei kann helfen: In geschlossenen Boxversuchen senkten seine Duftstoffe die Anfälligkeit der Rebe für Falschen Mehltau, und gespritzter Salbeiextrakt wirkte in Freilandversuchen gut bis teilweise; ein Nutzen durch bloße Nachbarpflanzung ist unbelegt. Eine Begrünung der Fahrgasse (z. B. Gras-Esparsette-Weißklee-Mischung) vermindert Spritzwasser vom Boden und verzögerte den Falschen Mehltau, Spontanvegetation fördert Raubmilben.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#4c1d95',
    imageUrl: '/images/plants/vine-grape.webp?v=2',
    preferredSoils: ['SANDY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Grows on many soil types but needs good drainage. European grapes cope with moderately alkaline (limy) soils, though above pH 8 nutrient problems can occur. Heavy, poorly drained clay is not suitable.',
      de: 'Wächst auf vielen Bodenarten, braucht aber gute Drainage. Europäerreben vertragen mäßig kalkhaltige Böden, über pH 8 können jedoch Nährstoffprobleme auftreten. Schwerer, schlecht drainierter Ton ist ungeeignet.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach Frösten) oder milder Herbst',
      en: 'Spring (Apr–May after frost) or mild autumn'
    },
    harvestTime: {
      de: 'Spätsommer bis Frühherbst (Aug–Okt)',
      en: 'Late summer to early autumn (Aug–Oct)'
    },
    recommendedCompanions: [
      'plant-sage',
      'plant-hyssop',
      'plant-thyme',
      'plant-chives',
      'plant-white-clover',
      'plant-borage',
      'plant-tansy',
      'plant-hemp',
      'plant-rosemary',
      'plant-chamomile',
      'plant-oregano',
      'plant-echinacea', 'plant-sainfoin',
      'plant-creeping-phlox',
      'plant-salad-burnet',
      'plant-phacelia',
      'plant-common-vetch'
    ],
    sources: [
      'Smart, D. R., et al. (2006). Grapevine Rooting Patterns: A Comprehensive Analysis and a Review. American Journal of Enology and Viticulture, 57(1), 89–104. doi:10.5344/ajev.2006.57.1.89',
      'Fittipaldi Broussard, M., et al. (2026). The Consociation of Sage and Grapevine Modifies Grape Leaf Metabolism and Reduces Downy Mildew Infection. Agronomy, 16(2), 201. doi:10.3390/agronomy16020201',
      'Dagostin, S., et al. (2010). Salvia officinalis Extract Can Protect Grapevine Against Plasmopara viticola. Plant Disease, 94(5), 575–580. doi:10.1094/PDIS-94-5-0575',
      'Hasanaliyeva, G., et al. (2024). Cover crops lower the dispersal of grapevine foliar pathogens from the ground and contribute to early-season disease management. Frontiers in Plant Science, 15, 1498848. doi:10.3389/fpls.2024.1498848',
      'Möth, S., et al. (2021). Unexpected Effects of Local Management and Landscape Composition on Predatory Mites and Their Food Resources in Vineyards. Insects, 12(2), 180. doi:10.3390/insects12020180',
      'Strik, B. (2011). Growing table grapes (EC 1639). Oregon State University Extension Service. https://extension.oregonstate.edu/sites/extd8/files/catalog/auto/EC1639.pdf'
    ]
  },
  {
    id: 'vine-kiwi',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Hardy Kiwi / Kiwiberry',
      de: 'Scharfzahniger Strahlengriffel / Kiwibeere'
    },
    botanicalName: 'Actinidia arguta',
    category: 'VINE',
    matureRadiusM: 2.0,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Late Spring Shoot Frost',
        'Cat Damage to Foliage and Roots (Catnip-like Scent)',
        'Drought Stress'
      ],
      de: [
        'Spätfrost an Austrieben',
        'Katzenschäden an Laub und Wurzeln (katzenminzeartiger Duft)',
        'Trockenheitsempfindlichkeit'
      ]
    },
    description: {
      en: 'Vigorous climbing vine for pergolas, producing smooth-skinned mini kiwis that are eaten whole. Fully dormant vines are cold-hardy to roughly -23 to -32 °C, but young spring shoots are damaged by brief frosts around -1 °C. Needs regular summer watering without standing water; a ground cover such as sweet woodruff or a living mulch helps keep the root zone moist.',
      de: 'Wuchsfreudige Kletterpflanze für Pergolen mit glattschaligen Minikiwis, die ganz gegessen werden. Voll ruhende Ranken sind bis etwa -23 bis -32 °C winterhart, junge Austriebe werden im Frühjahr aber schon durch kurzen Frost um -1 °C geschädigt. Braucht im Sommer regelmäßige Bewässerung ohne Staunässe; eine Bodendecke aus Waldmeister oder Lebendmulch hilft, den Wurzelraum feucht zu halten.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#16a34a',
    imageUrl: '/images/plants/vine-kiwi.webp',
    preferredSoils: ['LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Needs well-drained, slightly acidic sandy loam or clay loam (pH 5.6–6.5) and is sensitive to poor drainage during the growing season. Alkaline chalk soils lie outside its preferred pH range.',
      de: 'Benötigt gut drainierten, leicht sauren sandigen oder tonigen Lehm (pH 5,6–6,5) und ist in der Wachstumszeit empfindlich gegen schlechten Wasserabzug. Alkalische Kalkböden liegen außerhalb des bevorzugten pH-Bereichs.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) an sonnigem, geschütztem Gerüst',
      en: 'Spring (Apr–May) on sunny, sheltered trellis'
    },
    harvestTime: {
      de: 'Spätherbst (Okt–Nov vor starken Frösten)',
      en: 'Late autumn (Oct–Nov before hard frost)'
    },
    recommendedCompanions: [
      'plant-woodruff',
      'plant-comfrey',
      'plant-daffodil',
      'plant-white-clover',
      'plant-yarrow',
      'plant-creeping-jenny',
      'plant-rhododendron'
    ],
    sources: [
      'Strik, B., Dixon, E., Detweiler, A. J., & Sanchez, N. (2021). Growing kiwifruit in your home garden (EM 9322). Oregon State University Extension Service. https://extension.oregonstate.edu/catalog/em-9322-growing-kiwifruit-your-home-garden',
      'NC State Extension (n.d.). Actinidia arguta (Hardy Kiwi). North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/actinidia-arguta/'
    ]
  },
  {
    id: 'herb-rhubarb',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Garden Rhubarb',
      de: 'Gemeiner Rhabarber'
    },
    botanicalName: 'Rheum rhabarbarum',
    category: 'PERENNIAL_HERB',
    matureRadiusM: 0.9,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Phytophthora Crown Rot',
        'Rhubarb Curculio (Lixus concavus)',
        'Nitrogen Starvation'
      ],
      de: [
        'Phytophthora-Wurzelhalsfäule',
        'Rhabarber-Rüsselkäfer',
        'Stickstoffmangel'
      ]
    },
    description: {
      en: 'Productive perennial with huge leaves that shade the ground beneath them. Grows best in an open, sunny site but also copes with light shade. Often combined with allium companions (claims that they deter curculio and fungal rot are unproven) and comfrey mulch.',
      de: 'Ertragreiche Großstaude mit riesigen Blättern, die den Boden darunter beschatten. Wächst am besten an einem offenen, sonnigen Standort, kommt aber auch mit lichtem Schatten zurecht. Wird oft mit Allium-Begleitern (ein Schutz vor Fäule und Rüsselkäfern ist unbewiesen) und Beinwellmulch kombiniert.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'EARLY_SPRING',
    color: '#be123c',
    imageUrl: '/images/plants/herb-rhubarb.webp?v=2',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Grows best in fertile, moisture-retentive but well-drained soil with good organic matter content; mulch with well-rotted organic matter every spring. Plant in well-drained soil to prevent Phytophthora crown rot.',
      de: 'Wächst am besten in nährstoffreichem, frischem, aber durchlässigem Boden mit gutem Humusgehalt; jedes Frühjahr mit gut verrottetem organischem Material mulchen. In durchlässigen Boden pflanzen, um Phytophthora-Kronenfäule vorzubeugen.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Okt–Nov) als Wurzelstock',
      en: 'Spring (Mar–Apr) or autumn (Oct–Nov) via crown'
    },
    harvestTime: {
      de: 'Frühling bis Ende Juni/Anfang Juli (Apr–Anfang Jul; traditionell bis Johannistag, 24. Jun)',
      en: 'Spring to late June/early July (Apr–early Jul; traditionally until St. John’s Day, Jun 24)'
    },
    recommendedCompanions: [
      'plant-garlic',
      'plant-chives',
      'plant-comfrey',
      'plant-borage',
      'plant-woodruff',
      'plant-lovage',
    ],
    sources: [
      'Royal Horticultural Society (n.d.). How to grow rhubarb. RHS Grow Your Own. https://www.rhs.org.uk/vegetables/rhubarb/grow-your-own',
      'Lyon, E., & Young, C. E. (2021). Growing Rhubarb in the Home Garden (HYG-1631). Ohio State University Extension. https://cfaes.osu.edu/fact-sheet/growing-rhubarb-home-garden'
    ]
  },
  {
    id: 'shrub-elderberry',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Black Elderberry Shrub',
      de: 'Schwarzer Holunder (Leitstrauch)'
    },
    botanicalName: 'Sambucus nigra',
    category: 'BERRY_SHRUB',
    matureRadiusM: 1.8,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Elderberry Aphid (Aphis sambuci)',
        'Bird Predation on Berries'
      ],
      de: [
        'Holunderblattlaus (Aphis sambuci)',
        'Vogelfraß'
      ]
    },
    description: {
      en: 'Resilient native keystone shrub with aromatic flowers and dark berries. It persists even in deep woodland shade, but there it becomes weak, spindly and few-flowered with low fruit set, so it crops best in sun or at woodland edges. The related American elder (S. canadensis) is listed as juglone-tolerant. Spring colonies of the elder aphid feed hoverfly larvae, although this aphid is toxic prey that the seven-spot ladybird avoids.',
      de: 'Robuster einheimischer Leitstrauch mit duftenden Blüten und dunklen Beeren. Er hält sich selbst im tiefen Waldschatten, wird dort aber schwach, sparrig und blütenarm mit geringem Fruchtansatz; am besten trägt er in der Sonne oder am Waldrand. Der verwandte Kanadische Holunder (S. canadensis) gilt als juglontolerant. Frühjahrskolonien der Holunderblattlaus ernähren Schwebfliegenlarven, für den Siebenpunkt-Marienkäfer ist diese Blattlaus aber giftige Beute, die er meidet.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#1e1b4b',
    imageUrl: '/images/plants/shrub-elderberry.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Nitrogen-loving: establishes mostly on bare or disturbed, well-drained soil enriched with phosphate and nitrogen from decomposing organic matter (e.g. near dung or compost heaps). Adapts to clay, silt and woodland soils.',
      de: 'Stickstoffliebend: siedelt sich vor allem auf offenem oder gestörtem, durchlässigem Boden an, der durch zersetzte organische Substanz mit Phosphat und Stickstoff angereichert ist (z. B. an Mist- oder Komposthaufen). Passt sich Ton-, Lehm- und Waldböden an.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Blüten: Mai–Jun; Beeren: Aug–Okt',
      en: 'Blossoms: May–Jun; Berries: Aug–Oct'
    },
    recommendedCompanions: [
      'plant-wild-garlic',
      'plant-comfrey',
      'plant-red-currant',
      'plant-woodruff',
      'plant-bugleweed',
      'plant-tea-sinensis',
      'plant-creeping-jenny',
      'plant-nettle',
      'plant-ostrich-fern',
    ],
    sources: [
      'Forbes, R. S. (n.d.). Sambucus nigra L. Fermanagh species accounts. Botanical Society of Britain & Ireland. https://bsbi.org/in-your-area/local-botany/co-fermanagh/fermanagh-species-accounts/sambucus-nigra-l',
      'Sellmer, J., & Roman, D. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension. https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Nedvěd, O., & Salvucci, S. (2008). Ladybird Coccinella septempunctata (Coleoptera: Coccinellidae) prefers toxic prey in laboratory choice experiment. European Journal of Entomology, 105(3), 431–436. doi:10.14411/eje.2008.055',
      'InfluentialPoints (n.d.). Aphis sambuci (Elder aphid). http://influentialpoints.com/Gallery/Aphis_sambuci_elder_aphid.htm'
    ]
  },
  {
    id: 'tree-ginkgo',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Ginkgo / Maidenhair Tree',
      de: 'Ginkgobaum / Fächerblattbaum'
    },
    botanicalName: 'Ginkgo biloba',
    category: 'NUT_TREE',
    matureRadiusM: 4.0,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Vole bark gnawing on juvenile trunks',
        'Root rot in permanently waterlogged soil',
        'Slow juvenile establishment (years 1–3)'
      ],
      de: [
        'Wühlmausfraß an junger Rinde',
        'Wurzelfäule bei dauerhafter Staunässe',
        'Langsames Jugendwachstum (Jahre 1–3)'
      ]
    },
    description: {
      en: 'An ancient "living fossil" that survived the Ice Ages only in China, and a resilient nut and medicinal anchor tree. Usually deep-rooted and wind-firm, a good canopy partner for understory herbs and shrubs. Prized for brilliant yellow autumn foliage and its seed kernels, a traditional cooked food in China and Japan (do not eat raw or in large quantities: they contain the toxin 4-methoxypyridoxine). Very tolerant of urban soils and air pollution, and free of serious pests and diseases.',
      de: 'Uraltes „lebendes Fossil“, das die Eiszeiten nur in China überdauert hat, und robuster Nuss- und Heilbaum-Anker. Meist tief wurzelnd und sturmfest, ein guter Kronenpartner für Kräuter und Beerensträucher. Geschätzt für seine leuchtend gelbe Herbstfärbung und die Samenkerne, ein traditionelles gegartes Lebensmittel in China und Japan (nicht roh oder in großen Mengen essen: sie enthalten das Gift 4-Methoxypyridoxin). Sehr tolerant gegenüber Stadtböden und Luftverschmutzung und frei von ernsthaften Schädlingen und Krankheiten.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#eab308',
    imageUrl: '/images/plants/tree-ginkgo.webp',
    preferredSoils: ['LOAM', 'SANDY', 'SILT'],
    unsuitableSoils: [],
    soilAdvice: {
      en: 'Prefers deep, sandy, moist but well-drained soil in full sun; avoid poorly drained sites. Drought-resistant and very pH-adaptable (acid to alkaline), and tolerates air pollution and soil salt.',
      de: 'Bevorzugt tiefgründigen, sandigen, frischen, aber gut drainierten Boden in voller Sonne; schlecht drainierte Standorte meiden. Trockenheitsresistent und sehr pH-tolerant (sauer bis alkalisch), verträgt Luftverschmutzung und Bodensalz.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Okt–Nov)',
      en: 'Spring (Mar–May) or autumn (Oct–Nov)'
    },
    harvestTime: {
      de: 'Blätter: Jun–Aug (grün) oder Okt (goldgelb); Samen: Spätherbst',
      en: 'Foliage: Jun–Aug (green) or Oct (golden); Seeds: late autumn'
    },
    recommendedCompanions: [
      'plant-daffodil',
      'plant-white-clover',
      'plant-comfrey',
      'plant-chives',
      'plant-yarrow',
      'plant-woodruff',
      'plant-red-currant',
      'plant-tea-sinensis',
      'plant-lungwort',
      'plant-epimedium',
      'plant-wild-ginger',
      'plant-rhododendron'
    ],
    sources: [
      'Moore, L. M., & Walker Wilson, J. D. (2006). Ginkgo, Ginkgo species. USDA NRCS Plant Guide. https://plants.sc.egov.usda.gov/DocumentLibrary/plantguide/pdf/pg_ginkg.pdf',
      'Gilman, E. F., et al. (2018). Ginkgo biloba: Ginkgo (ST273). UF/IFAS Extension. https://ask.ifas.ufl.edu/publication/ST273'
    ]
  },
  {
    id: 'tree-tea-sinensis',
    climateZones: ["TEMPERATE","SUBTROPICAL"],
    commonName: {
      en: 'Chinese Tea Bush',
      de: 'Chinesischer Teestrauch'
    },
    botanicalName: 'Camellia sinensis var. sinensis',
    category: 'BERRY_SHRUB',
    matureRadiusM: 1.2,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        "Lime-Induced Chlorosis (Alkaline pH sensitivity)",
        "Tea Red Spider Mite (Oligonychus coffeae)",
        "Tea Blister Blight (Exobasidium vexans)",
        "Desiccating Winter Winds", "Tea Green Leafhopper (Empoasca onukii)", "Tea Geometrid (Ectropis obliqua)"],
      de: [
        "Kalkchlorose bei hohem pH-Wert",
        "Rote Spinnmilbe (Oligonychus coffeae)",
        "Tee-Blasenrost (Exobasidium vexans)",
        "Austrocknende Winter- und Ostwinde", "Grüne Teezikade (Empoasca onukii)", "Teespanner (Ectropis obliqua)"]
    },
    description: {
      en: 'A compact evergreen shrub and the most cold-tolerant form of tea, clearly more cold-resistant than Assam tea. Its leaves are small (about 5–8 cm, versus about 8–13 cm in Assam tea). In a survey of 596 Chinese tea accessions, leaves contained 14–48% polyphenols, 8–26% catechins, 1–6.5% free amino acids (including theanine) and 1.2–5.9% caffeine in dry weight. Its leaves are used for green, white, yellow, oolong, black and dark teas.',
      de: 'Ein kompakter immergrüner Strauch und die kältetoleranteste Form des Teestrauchs, deutlich kälteresistenter als Assam-Tee. Die Blätter sind klein (etwa 5–8 cm, gegenüber etwa 8–13 cm beim Assam-Tee). In einer Untersuchung von 596 chinesischen Teeherkünften enthielten die Blätter 14–48 % Polyphenole, 8–26 % Catechine, 1–6,5 % freie Aminosäuren (darunter Theanin) und 1,2–5,9 % Koffein in der Trockenmasse. Die Blätter werden zu Grün-, Weiß-, Gelb-, Oolong-, Schwarz- und Dunkeltee verarbeitet.'
    },
    bloomSeason: 'AUTUMN',
    harvestSeason: 'LATE_SPRING',
    color: '#15803d',
    imageUrl: '/images/plants/tree-tea-sinensis.webp',
    preferredSoils: ["ACIDIC","LOAM","SILT"],
    unsuitableSoils: ["CHALKY","CLAY"],
    soilAdvice: {
      en: 'Calcifuge: needs acid, well-drained soil, with an optimum pH of 4.5–5.5. Light shade raises amino acids such as theanine and lowers catechins, giving a milder, more umami tea. Tea roots take up ammonium (NH4+) much faster than nitrate, indicating a preference for ammonium; pair with N-fixers (alder) and comfrey mulch, and avoid lime and waterlogging.',
      de: 'Kalkflüchter: braucht sauren, gut drainierten Boden, optimal pH 4,5–5,5. Lichter Schatten erhöht Aminosäuren wie Theanin und senkt die Catechine, was milderen, umami-reicheren Tee ergibt. Teewurzeln nehmen Ammonium (NH4+) deutlich schneller auf als Nitrat, ein Hinweis auf eine Ammonium-Vorliebe; mit Stickstoffsammlern (Erle) und Beinwellmulch kombinieren, Kalk und Staunässe meiden.'
    },
    plantingTime: {
      de: 'Frühjahr nach den Spätfrösten (Apr–Mai) oder milder Frühherbst (Sep–Okt) an windgeschütztem Ost-/Halbschatten-Standort',
      en: 'Spring after hard frosts (Apr–May) or mild early autumn (Sep–Oct) in a wind-sheltered East/partial-shade microclimate'
    },
    harvestTime: {
      de: 'Apr–Aug: 3–4 Pflück-Flushes (Knospe + 1–2 Blätter im Frühjahr für Weiß-, Grün-, Gelb- & Schwarztee; reifere 3.–5. Kaimiancha-Blätter für Oolong)',
      en: 'Apr–Aug: 3–4 flushes (1 bud + 1–2 tender leaves in spring for White, Green, Yellow & Black tea; mature 3rd–5th Kaimiancha leaves for Oolong)'
    },
    recommendedCompanions: [
      'plant-comfrey',
      'plant-woodruff',
      'plant-yarrow',
      'plant-chives',
      'plant-daffodil',
      'plant-hyacinth',
      'plant-peppermint',
      'plant-wintergreen',
      'plant-lingonberry',
      'plant-epimedium',
      'plant-rhododendron',
      'plant-alder',
      'plant-sicklepod',
      'plant-soybean',
      'plant-african-marigold',
      'plant-chinese-motherwort'
    ],
    sources: [
      'Li, Y., et al. (2019). Comparative transcriptomic analysis reveals gene expression associated with cold adaptation in the tea plant Camellia sinensis. BMC Genomics, 20(1), 624. doi:10.1186/s12864-019-5988-3',
      'NC State Extension (n.d.). Camellia sinensis. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/camellia-sinensis/',
      'Chen, L., & Zhou, Z.-X. (2005). Variations of main quality components of tea genetic resources [Camellia sinensis (L.) O. Kuntze] preserved in the China National Germplasm Tea Repository. Plant Foods for Human Nutrition, 60(1), 31–35. doi:10.1007/s11130-005-2540-1',
      'Niu, X., et al. (2025). Multi-omics analysis reveals the regulatory mechanism of shading on quality-related metabolites in Camellia sinensis cv. Lifeng. Food Chemistry: Molecular Sciences, 11, 100314. doi:10.1016/j.fochms.2025.100314',
      'Ruan, L., et al. (2016). Characteristics of NH4+ and NO3- fluxes in tea (Camellia sinensis) roots measured by scanning ion-selective electrode technique. Scientific Reports, 6, 38370. doi:10.1038/srep38370',
      'Yan, P., et al. (2020). Soil acidification in Chinese tea plantations. Science of The Total Environment, 715, 136963. doi:10.1016/j.scitotenv.2020.136963'
    ]
  },
  {
    id: 'tree-tea-assamica',
    climateZones: ["SUBTROPICAL","TROPICAL"],
    commonName: {
      en: 'Assam Tea Tree',
      de: 'Assam-Teebaum'
    },
    botanicalName: 'Camellia sinensis var. assamica',
    category: 'FRUIT_TREE',
    matureRadiusM: 2,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        "Frost Sensitivity",
        "Tea Mosquito Bug (Helopeltis theivora)",
        "Red Rust (Cephaleuros virescens)",
        "Drought Stress under Low Humidity", "Tea Green Leafhopper (Empoasca onukii)", "Tea Geometrid (Ectropis obliqua)"],
      de: [
        "Frostempfindlichkeit",
        "Teewanze (Helopeltis theivora)",
        "Roter Algenrost (Cephaleuros virescens)",
        "Trockenstress bei niedriger Luftfeuchtigkeit", "Grüne Teezikade (Empoasca onukii)", "Teespanner (Ectropis obliqua)"]
    },
    description: {
      en: 'A vigorous, large-leaved evergreen that grows from a shrub into a large tree if left unpruned; in cultivation it is kept low by plucking. Native to warm evergreen broad-leaved forests of Assam, Yunnan and Southeast Asia. Its leaves (about 8–13 cm) are larger than those of China tea, and it is less cold-tolerant. Southern Chinese tea resources, with Yunnan at the top, have the highest polyphenol contents; Assam tea is the basis of Assam and Dianhong black teas and of Pu-erh.',
      de: 'Ein wuchskräftiges, großblättriges Immergrün, das ungeschnitten vom Strauch zum großen Baum heranwächst; in Kultur wird es durch das Pflücken niedrig gehalten. Heimisch in warmen immergrünen Laubwäldern von Assam, Yunnan und Südostasien. Die Blätter (etwa 8–13 cm) sind größer als beim China-Tee, die Pflanze ist weniger kältetolerant. Südchinesische Teeherkünfte, allen voran aus Yunnan, haben die höchsten Polyphenolgehalte; Assam-Tee ist die Grundlage von Assam- und Dianhong-Schwarztee sowie von Pu-Erh.'
    },
    bloomSeason: 'AUTUMN',
    harvestSeason: 'SUMMER',
    color: '#166534',
    imageUrl: '/images/plants/tree-tea-assamica.webp',
    preferredSoils: ["ACIDIC","LOAM","SILT"],
    unsuitableSoils: ["CHALKY","CLAY"],
    soilAdvice: {
      en: 'Needs deep, humus-rich, acid soil with an optimum pH of 4.5–5.5, light shade from taller (often nitrogen-fixing) shade trees, and a frost-free climate. Avoid lime and waterlogging.',
      de: 'Braucht tiefgründigen, humusreichen, sauren Boden mit optimalem pH 4,5–5,5, lichten Schatten durch höhere (oft stickstoffbindende) Schattenbäume und ein frostfreies Klima (in Mitteleuropa Kalthaus-/Wintergartenkultur). Kalk und Staunässe meiden.'
    },
    plantingTime: {
      de: 'Warmes Frühjahr (Apr–Jun) oder Beginn der Monsun-/Regenzeit (frostfrei >= 18°C)',
      en: 'Warm spring (Apr–Jun) or onset of monsoon/rainy season (frost-free >= 18°C)'
    },
    harvestTime: {
      de: 'März bis November in 7–10-tägigen Pflückrunden (First Flush im Frühjahr, Golden-Tip Second Flush im Mai/Juni für Schwarztee, Sommer/Herbst für Sheng & Shou Pu-erh)',
      en: 'March to November in 7–10 day plucking rounds (Spring First Flush, Golden-Tip Second Flush in May/June for Black Tea, Summer/Autumn flushes for Sheng & Shou Pu-erh)'
    },
    recommendedCompanions: [
      'plant-white-clover',
      'plant-comfrey',
      'plant-yarrow',
      'plant-nasturtium',
      'plant-borage',
      'plant-sweet-potato',
      'plant-peppermint',
      'plant-rhododendron',
      'plant-nepal-alder',
      'plant-sicklepod',
      'plant-tithonia',
      'plant-african-marigold',
      'plant-chinese-motherwort'
    ],
    sources: [
      'NC State Extension (n.d.). Camellia sinensis. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/camellia-sinensis/',
      'Li, Y., et al. (2019). Comparative transcriptomic analysis reveals gene expression associated with cold adaptation in the tea plant Camellia sinensis. BMC Genomics, 20(1), 624. doi:10.1186/s12864-019-5988-3',
      'Chen, L., & Zhou, Z.-X. (2005). Variations of main quality components of tea genetic resources [Camellia sinensis (L.) O. Kuntze] preserved in the China National Germplasm Tea Repository. Plant Foods for Human Nutrition, 60(1), 31–35. doi:10.1007/s11130-005-2540-1',
      'Yan, P., et al. (2020). Soil acidification in Chinese tea plantations. Science of The Total Environment, 715, 136963. doi:10.1016/j.scitotenv.2020.136963'
    ]
  },
  {
    id: 'herb-hemp',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Industrial Hemp',
      de: 'Nutzhanf'
    },
    botanicalName: 'Cannabis sativa',
    category: 'ANNUAL_HERB',
    matureRadiusM: 0.9,
    rootHabit: 'DEEP_TAP',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Hemp Aphid (Phorodon cannabis)',
        'Grey Mould (Botrytis cinerea)',
        'Sclerotinia Stem Rot (Sclerotinia sclerotiorum)',
        'Waterlogging & Root Hypoxia'
      ],
      de: [
        'Hanfblattlaus (Phorodon cannabis)',
        'Grauschimmel (Botrytis cinerea)',
        'Sklerotien-Stängelfäule (Sclerotinia sclerotiorum)',
        'Staunässe & Sauerstoffmangel'
      ]
    },
    description: {
      en: 'Fast-growing multifunctional annual crop and ancient economic plant, yielding fiber biomass and seeds with about 20–25% protein and an oil rich in omega-6 (linoleic) and omega-3 (alpha-linolenic) fatty acids. In loose soil its roots reach 1.3–2 m deep, but hemp is sensitive to soil compaction. Once established at high density, its fast-closing canopy suppresses many weeds, though perennial rhizomatous weeds remain hard to control. Understory companions add nitrogen fixation, insectary flowers and ground cover.',
      de: 'Schnellwüchsige, multifunktionale einjährige Kultur und uralte Nutzpflanze; liefert Faserbiomasse und Samen mit etwa 20–25 % Eiweiß und einem Öl reich an Omega-6- (Linolsäure) und Omega-3-Fettsäuren (Alpha-Linolensäure). In lockerem Boden reichen die Wurzeln 1,3–2 m tief, Hanf ist jedoch empfindlich gegen Bodenverdichtung. Bei dichter Saat unterdrückt das schnell schließende Blätterdach nach der Etablierung viele Unkräuter, ausdauernde Wurzelunkräuter bleiben aber schwer zu bekämpfen. Begleitpflanzen liefern Stickstoff, Nützlingsblüten und Bodenbedeckung.'
    },
    bloomSeason: 'SUMMER',
    harvestSeason: 'AUTUMN',
    color: '#15803d',
    imageUrl: '/images/plants/herb-hemp.webp',
    preferredSoils: ['LOAM', 'SILT', 'SANDY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilAdvice: {
      en: 'Best adapted to deep, loose, well-drained loam or silt with a pH between 6.0 and 7.0. Does not grow well on wet soils or those with a heavy clay content, and is sensitive to crusting and compaction.',
      de: 'Am besten geeignet sind tiefgründige, lockere, gut drainierte Lehm- oder Lössböden mit einem pH zwischen 6,0 und 7,0. Wächst schlecht auf nassen oder schweren Tonböden und ist empfindlich gegen Verschlämmung und Verdichtung.'
    },
    plantingTime: {
      de: 'Ende April bis Mitte Mai (nach den letzten Nachtfrösten, Keimtemperatur ≥ 10 °C)',
      en: 'Late April to mid-May (after last spring frosts, soil temp ≥ 10 °C)'
    },
    harvestTime: {
      de: 'September bis Oktober (Samen- und Faserreife)',
      en: 'September to October (seed maturity and fiber harvest)'
    },
    recommendedCompanions: [
      'plant-white-clover',
      'plant-yarrow',
      'plant-chives',
      'plant-comfrey',
      'plant-nasturtium',
      'plant-borage',
      'plant-hemp',
      'plant-alfalfa'
    ],
    sources: [
      'Amaducci, S., Zatta, A., Raffanini, M., & Venturi, G. (2008). Characterisation of hemp (Cannabis sativa L.) roots under different growing conditions. Plant and Soil, 313(1–2), 227–235. doi:10.1007/s11104-008-9695-0',
      'Collins, A., Graybill, J. S., Roth, G. W., Harper, J. K., Manzo, H. E., & Kime, L. (2023). Industrial Hemp Production. Penn State Extension. https://extension.psu.edu/industrial-hemp-production',
      'Kaur, N., et al. (2025). Herbicide use and weed management strategies in hemp cultivation. Journal of Cannabis Research, 7(1), 27. doi:10.1186/s42238-025-00280-0',
      'Farinon, B., et al. (2020). The Seed of Industrial Hemp (Cannabis sativa L.): Nutritional Quality and Potential Functionality for Human Health and Nutrition. Nutrients, 12(7), 1935. doi:10.3390/nu12071935'
    ]
  },
  {
    id: 'shrub-red-currant',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Red Currant Bush',
      de: 'Rote Johannisbeere'
    },
    botanicalName: 'Ribes rubrum',
    category: 'BERRY_SHRUB',
    matureRadiusM: 0.9,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        'Red Currant Blister Aphid (Cryptomyzus ribis)',
        'Currant Clearwing Borer (Synanthedon tipuliformis)',
        'Grey Mould (Botrytis cinerea)',
        'Anthracnose Leaf Spot (Drepanopeziza ribis)'
      ],
      de: [
        'Johannisbeerblasenlaus (Cryptomyzus ribis)',
        'Johannisbeer-Glasflügler (Synanthedon tipuliformis)',
        'Grauschimmel (Botrytis cinerea)',
        'Blattfallkrankheit (Drepanopeziza ribis)'
      ]
    },
    description: {
      en: 'Classic, heavy-cropping woodland edge berry shrub bearing translucent ruby-red racemes rich in vitamin C (about 46–68 mg per 100 g). Unlike most fruit crops it tolerates partial shade, and currants are listed as juglone-tolerant. Its shallow, fibrous roots pair well with living mulch (white clover, sweet woodruff), comfrey mulch, and aromatic allium/artemisia companions (claims that their scent deters clearwing borers and blister aphids are unproven).',
      de: 'Klassischer, reich tragender Waldrand-Beerenstrauch mit leuchtend rubinroten Rispen, reich an Vitamin C (etwa 46–68 mg pro 100 g). Anders als die meisten Obstarten verträgt er Halbschatten, und Johannisbeeren gelten als juglontolerant. Das flache Faserwurzelwerk passt gut zu Lebendmulch (Weißklee, Waldmeister), Beinwellmulch sowie duftenden Allium- und Eberrauten-Begleitern (eine Wirkung gegen Glasflügler und Johannisbeerblasenläuse ist unbewiesen).'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'SUMMER',
    color: '#dc2626',
    imageUrl: '/images/plants/shrub-red-currant.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Prefers a cool, moist site and humus-rich loam or clay; the ideal pH is about 6.5, but currants adapt to a wide range including alkaline soils. The shallow, fibrous roots are easily damaged, so do not cultivate near the plants; keep a 5–8 cm mulch layer and renew it yearly. Dry sandy soils are a poor choice.',
      de: 'Bevorzugt einen kühlen, feuchten Standort und humosen Lehm- oder Tonboden; optimal ist ein pH um 6,5, Johannisbeeren passen sich aber einer großen Spanne bis in den alkalischen Bereich an. Die flachen Faserwurzeln werden leicht verletzt, daher nicht im Wurzelbereich hacken; eine 5–8 cm dicke Mulchschicht halten und jährlich erneuern. Trockene Sandböden sind ungünstig.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Vorfrühling (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Ende Jun–Aug, ab dem Johannistag)',
      en: 'Mid-summer (Late Jun–Aug, around St. John’s Day)'
    },
    recommendedCompanions: [
      'plant-comfrey',
      'plant-chives',
      'plant-garlic',
      'plant-welsh-onion',
      'plant-yarrow',
      'plant-white-clover',
      'plant-woodruff',
      'plant-borage',
      'plant-chamomile',
      'plant-oregano',
      'plant-nettle',
      'plant-meadowsweet',
      'plant-garlic-chives'
    ],
    sources: [
      'Hansen, S., Maughan, T., & Black, B. (2014). How to Grow Red Currants in Your Garden. Utah State University Extension. https://extension.usu.edu/yardandgarden/research/red-currants-in-the-garden.pdf',
      'Cornell University Department of Horticulture (n.d.). Gooseberries and Currants, Ribes spp. Cornell Fruit Resources. http://www.hort.cornell.edu/fruit/mfruit/gooseberries.html',
      'Miladinović, B., et al. (2024). Vitamin C content and antioxidant activity of red currant (Ribes rubrum L.) juices. Lekovite Sirovine, 44(1), e013. doi:10.61652/leksir2444013M',
      'Sellmer, J., & Roman, D. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension. https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants'
    ]
  },
  {
    id: 'tree-linden',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Small-Leaved Linden / Lime Tree',
      de: 'Winterlinde'
    },
    botanicalName: 'Tilia cordata',
    category: 'NUT_TREE',
    matureRadiusM: 4.5,
    rootHabit: 'WIDE_SPREADING',
    jugloneProducer: false,
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        'Lime Aphid (Eucallipterus tiliae)',
        'Lime Spider Mite (Eotetranychus tiliarium)',
        'Vole bark gnawing on juvenile trunks',
        'Verticillium Wilt (Verticillium dahliae)'
      ],
      de: [
        'Lindenblattlaus (Eucallipterus tiliae)',
        'Lindenspinnmilbe (Eotetranychus tiliarium)',
        'Wühlmausfraß an junger Rinde',
        'Verticillium-Welke (Verticillium dahliae)'
      ]
    },
    description: {
      en: 'European agroforestry keystone tree and soil-improving species. Its young leaves are edible raw, mild and somewhat mucilaginous, while its fragrant June–July flowers are a valuable nectar and pollen source for bees and are used for linden tea. In a 14-species common-garden study, lime had the most calcium-rich leaf litter, with fast forest-floor turnover, the highest forest-floor pH and more earthworms. Has a deep heart-root system and resprouts vigorously after coppicing or pollarding (Chop & Drop).',
      de: 'Europäischer Agroforst-Leitbaum und bodenverbessernde Baumart. Die jungen Blätter sind roh essbar, mild und etwas schleimig; die duftenden Blüten (Juni–Juli) sind eine wertvolle Nektar- und Pollenquelle für Bienen und liefern Lindenblütentee. In einem Vergleich von 14 Baumarten hatte die Linde die calciumreichste Laubstreu, einen schnellen Streuumsatz, den höchsten pH-Wert der Humusauflage und mehr Regenwürmer. Bildet ein tiefes Herzwurzelsystem und treibt nach Schneitelung oder Auf-den-Stock-Setzen kräftig wieder aus (Chop & Drop).'
    },
    bloomSeason: 'SUMMER',
    harvestSeason: 'SUMMER',
    color: '#65a30d',
    imageUrl: '/images/plants/tree-linden.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Grows on soils from pH 4 to 8, best on neutral to basic ones; its deep heart roots also open up heavy clay. Its calcium-rich litter is associated with higher topsoil pH. Avoid very dry, poor sandy sites; drought stress generally favors spider mites.',
      de: 'Wächst auf Böden von pH 4 bis 8, am besten auf neutralen bis basischen; die tiefen Herzwurzeln erschließen auch schwere Tonböden. Ihr calciumreiches Laub geht mit einem höheren pH-Wert des Oberbodens einher. Sehr trockene, arme Sandböden meiden; Trockenstress begünstigt allgemein Spinnmilben.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Salatblätter: Apr–Mai; Lindenblüten: Jun–Jul; Nüsschen: Sep–Okt',
      en: 'Salad leaves: Apr–May; Blossoms: Jun–Jul; Nutlets: Sep–Oct'
    },
    recommendedCompanions: [
      'plant-comfrey',
      'plant-white-clover',
      'plant-yarrow',
      'plant-fennel',
      'plant-daffodil',
      'plant-hyacinth',
      'plant-hellebore',
      'plant-woodruff',
      'plant-wild-garlic',
      'plant-red-currant',
      'plant-lungwort',
      'plant-hosta',
      'plant-catmint',
      'plant-nettle',
      'plant-blackcurrant',
      'plant-rhubarb'
    ],
    sources: [
      'Reich, P. B., et al. (2005). Linking litter calcium, earthworms and soil properties: a common garden test with 14 tree species. Ecology Letters, 8(8), 811–818. doi:10.1111/j.1461-0248.2005.00779.x',
      'De Jaegere, T., Hein, S., & Claessens, H. (2016). A Review of the Characteristics of Small-Leaved Lime (Tilia cordata Mill.) and Their Implications for Silviculture in a Changing Climate. Forests, 7(3), 56. doi:10.3390/f7030056',
      'Eaton, E., Caudullo, G., & de Rigo, D. (2016). Tilia cordata, Tilia platyphyllos and other limes in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Tilia_spp.pdf',
      'Fern, K. (n.d.). Tilia cordata. Useful Temperate Plants Database. https://temperate.theferns.info/plant/Tilia+cordata',
      'Cranshaw, W. S., & Sclar, D. C. (2014). Spider Mites. Colorado State University Extension, Fact Sheet 5.507. https://extension.colostate.edu/topic-areas/insects/spider-mites-5-507/'
    ]
  },
  {
    id: 'shrub-rhododendron',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Rhododendron (Catawba)',
      de: 'Rhododendron / Alpenrose'
    },
    botanicalName: 'Rhododendron catawbiense',
    category: 'BERRY_SHRUB',
    matureRadiusM: 1.3,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        'Black Vine Weevil (Otiorhynchus sulcatus)',
        'Rhododendron Lace Bug (Stephanitis rhododendri)',
        'Grey Mould (Botrytis cinerea)',
        'Turf Grass Competition',
        'Lime-Induced Chlorosis (Alkaline pH > 6.0)'
      ],
      de: [
        'Gefurchter Dickmaulrüssler (Otiorhynchus sulcatus)',
        'Rhododendron-Netzwanze (Stephanitis rhododendri)',
        'Grauschimmel (Botrytis cinerea)',
        'Konkurrenz durch Rasengräser',
        'Kalkchlorose bei hohem pH-Wert (> 6,0)'
      ]
    },
    description: {
      en: 'Evergreen acid-loving woodland keystone shrub, very winter-hardy (USDA zone 4, about -30 °C), with spectacular late-spring flower trusses visited by bumblebees. Its fine hair roots never form root hairs; instead it relies on ericoid mycorrhizal fungi (e.g. Oidiodendron maius, Hyaloscypha/Pezoloma ericae) that release enzymes such as proteases and phosphatases, making organic N and P available in acidic humus. It shares this mycorrhizal type with blueberry, lingonberry, cranberry and wintergreen. Leaves, flowers and nectar contain diterpene grayanotoxins and are poisonous to people and livestock.',
      de: 'Immergrüner, säureliebender Waldrand-Leitstrauch, sehr winterhart (USDA-Zone 4, etwa -30 °C), mit prächtigen Blütenständen im Spätfrühling, die von Hummeln besucht werden. Die feinen Haarwurzeln bilden keine Wurzelhaare; stattdessen nutzt er ericoide Mykorrhizapilze (z. B. Oidiodendron maius, Hyaloscypha/Pezoloma ericae), die Enzyme wie Proteasen und Phosphatasen abgeben und so organischen Stickstoff und Phosphor im sauren Humus verfügbar machen. Diesen Mykorrhizatyp teilt er mit Kulturheidelbeere, Preiselbeere, Cranberry und Scheinbeere. Blätter, Blüten und Nektar enthalten Diterpen-Grayanotoxine und sind für Menschen und Weidetiere giftig.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'LATE_SPRING',
    color: '#9333ea',
    imageUrl: '/images/plants/shrub-rhododendron.webp',
    preferredSoils: ['ACIDIC', 'LOAM', 'SILT'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilAdvice: {
      en: 'Calcifuge needing cool, humus-rich, well-aerated acidic soil (pH about 4.5–6.0) in dappled woodland shade. Shallow-rooted, so never cultivate the root zone; keep a 5–8 cm layer of compost, pine bark or pine straw. Juglone-sensitive: plant outside the walnut root zone (on average 15–18 m from the trunk of a large tree). Avoid stagnant waterlogging.',
      de: 'Kalkflüchter für kühle, humose, luftige und saure Böden (pH etwa 4,5–6,0) im lichten Halbschatten. Flachwurzler, daher den Wurzelbereich nie behacken; eine 5–8 cm dicke Schicht aus Kompost, Kiefernrinde oder Nadelstreu halten. Juglonempfindlich: außerhalb des Walnuss-Wurzelbereichs pflanzen (im Mittel 15–18 m vom Stamm eines großen Baums). Staunässe meiden.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Frühherbst (Sep–Okt) flach in saures Substrat',
      en: 'Spring (Apr–May) or early autumn (Sep–Oct) planted shallowly in acidic humus'
    },
    harvestTime: {
      de: 'Nicht essbar (Giftpflanze: Grayanotoxine)! Hauptblüte & Hummeltracht: Mai bis Juni',
      en: 'Non-edible (toxic grayanotoxins)! Prime bumblebee bloom: May to June'
    },
    recommendedCompanions: [
      'plant-wintergreen',
      'plant-lingonberry',
      'plant-cranberry',
      'plant-epimedium',
      'plant-ostrich-fern',
      'plant-hosta',
      'plant-woodruff',
      'plant-lupine',
      'plant-comfrey',
      'plant-daffodil',
      'plant-chives',
      'plant-chamomile',
      'plant-tea-sinensis',
      'plant-alder',
      'plant-blueberry'
    ],
    sources: [
      'NC State Extension (n.d.). Rhododendron catawbiense (Catawba Rhododendron). North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/rhododendron-catawbiense/',
      'Wei, X., et al. (2022). Ericoid mycorrhizal fungi as biostimulants for improving propagation and production of ericaceous plants. Frontiers in Plant Science, 13, 1027390. doi:10.3389/fpls.2022.1027390',
      'Vohník, M. (2020). Ericoid mycorrhizal symbiosis: theoretical background and methods for its comprehensive investigation. Mycorrhiza, 30(6), 671–695. doi:10.1007/s00572-020-00989-1',
      'Jansen, S. A., et al. (2012). Grayanotoxin Poisoning: \'Mad Honey Disease\' and Beyond. Cardiovascular Toxicology, 12(3), 208–215. doi:10.1007/s12012-012-9162-2',
      'Egan, P. A., Stevenson, P. C., & Stout, J. C. (2022). Pollinator selection against toxic nectar as a key facilitator of a plant invasion. Philosophical Transactions of the Royal Society B, 377(1853), 20210168. doi:10.1098/rstb.2021.0168',
      'Polomski, R. F., Bir, R. E., & Beasley, J. (2016). Rododendros (HGIC 1073S). Clemson Cooperative Extension, Home & Garden Information Center. https://hgic.clemson.edu/factsheet/rhododendron/',
      'The Morton Arboretum (n.d.). Black walnut toxicity. https://mortonarb.org/plant-and-protect/tree-plant-care/plant-care-resources/black-walnut-toxicity/'
    ]
  }
];
