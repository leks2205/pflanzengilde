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
      en: 'The premier permaculture canopy star. Standard or semi-dwarf apple trees benefit from dense bulb rings around the drip line, chives as an edible border (claims that they combat scab are unproven), deep-rooted comfrey for potassium, and umbelliferous insectaries to attract parasitoid wasps.',
      de: 'Der klassische Kronen-Star der Permakultur. Apfelbäume profitieren von dichten Zwiebelblumenringen an der Traufkante, Schnittlauch als essbarer Einfassung (eine Wirkung gegen Schorf ist unbewiesen), tief wurzelndem Beinwell für Kalium und Doldenblütlern zur Anlockung nützlicher Schlupfwespen.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#ef4444',
    imageUrl: '/images/plants/tree-apple.webp?v=2',
    preferredSoils: ['LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Thrives in deep, nutrient-rich loam. In heavy clay, ensure surface drainage and avoid deep planting to prevent collar rot. Shallow chalk induces drought stress.',
      de: 'Gedeiht optimal in tiefgründigem, nährstoffreichem Lehm. Bei schwerem Ton auf guten Wasserabfluss achten und Stammkragen frei halten. Flachgründiger Kalkboden führt zu Trockenstress.'
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
      'plant-meadowsweet',
      'plant-welsh-onion',
      'plant-echinacea',
      'plant-wormwood',
      'plant-alder',
      'plant-linden',
      'plant-blackcurrant',
      'plant-red-currant',
      'plant-rhubarb',
      'plant-sweet-alyssum',
      'plant-wild-carrot'
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
      en: 'A magnificent nut and timber canopy tree that secretes Juglone—a natural allelopathic compound toxic to Solanaceae (tomatoes, nightshades), apples, pears, and brassicas. Designing a walnut guild requires strictly juglone-tolerant species like elderberry, currants, hostas, and sweet woodruff.',
      de: 'Ein stattlicher Nuss- und Nutzholzbaum, der Juglon absondert – eine allelopathische Substanz, die für Nachtschattengewächse (Tomaten), Äpfel, Birnen und Kohl giftig ist. Eine Walnussgilde erfordert streng juglontolerante Arten wie Holunder, Johannisbeeren und Waldmeister.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#78350f',
    imageUrl: '/images/plants/tree-walnut.webp',
    preferredSoils: ['LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilAdvice: {
      en: 'Its massive central taproot demands deep, moist, rich alluvial loam. Shallow chalky or thin sandy soils severely restrict root development.',
      de: 'Die gewaltige Pfahlwurzel verlangt nach tiefgründigem, feuchtem, humusreichem Ackerlehm. Flachgründige Kalk- oder Dürreböden hemmen das Wachstum drastisch.'
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
      'plant-sweet-flag',
      'plant-meadowsweet']
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
      en: 'A prolific stone fruit requiring high warmth and solar radiation. Highly susceptible to trunk borers and fungal leaf curl. Aromatic herbs like garlic, tansy, and southernwood are often planted near its root collar, but a protective effect against borers is unproven; horseradish is traditionally added against brown rot.',
      de: 'Wärmeliebendes Steinobst mit hohem Sonnenbedarf. Anfällig für Stammbohrer und Kräuselkrankheit. Duftende Kräuter wie Knoblauch, Rainfarn und Eberraute werden oft am Wurzelhals gepflanzt, eine Schutzwirkung gegen Stammbohrer ist jedoch unbewiesen; Meerrettich wird traditionell gegen Monilia-Pilze ergänzt.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'SUMMER',
    color: '#f97316',
    imageUrl: '/images/plants/tree-peach.webp?v=2',
    preferredSoils: ['SANDY', 'LOAM', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Requires warm, exceptionally well-drained sandy loam. On heavy clay soils, plant on a 40–50 cm raised mound (berm) to prevent Phytophthora root and collar rot.',
      de: 'Benötigt warmen, exzellent drainierten Sand- oder Lehmboden. Bei schwerem Ton zwingend auf einen 40–50 cm Hochberm pflanzen, um Wurzelfäule zu vermeiden.'
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
      'plant-southernwood',
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
      'plant-echinacea'
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
      en: 'Hardy and heavy-bearing stone fruit that thrives with nitrogen-fixing cover crops and beneficial insectaries like yarrow and dill, which support natural enemies of aphids; pest control is field-proven only for diverse flower strips, not single plants.',
      de: 'Robustes, ertragreiches Steinobst. Gedeiht optimal mit stickstofffixierendem Klee und insektenfördernden Pflanzen wie Schafgarbe und Dill, die Gegenspieler von Blattläusen fördern; eine Schädlingsbekämpfung ist nur für artenreiche Blühstreifen belegt, nicht für Einzelpflanzen.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'LATE_SPRING',
    color: '#7e22ce',
    imageUrl: '/images/plants/tree-plum.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Naturally tolerant of heavy clay and damp soil. Avoid thin, dry sandy soils which trigger severe moisture stress and premature fruit drop.',
      de: 'Von Natur aus sehr tolerant gegenüber schwerem Ton und feuchtem Boden. Reine Sandböden meiden, da sie Trockenstress und vorzeitigen Fruchtabfall auslösen.'
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
      'plant-wormwood',
      'plant-linden',
      'plant-blackcurrant',
      'plant-red-currant'
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
      en: 'Stately and long-lived upright fruit tree. Highly vulnerable to fire blight if given excessive fast-release nitrogen; benefits from slow, perennial leguminous mulch (white clover) and deep-mining comfrey rather than high-nitrogen manures.',
      de: 'Langlebiger, aufrechter Obstbaum. Anfällig für Feuerbrand bei zu rascher Stickstoffzufuhr; profitiert von sanftem, ausdauerndem Leguminosenmulch (Weißklee) und tiefwurzelndem Beinwell statt scharfer Düngung.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#84cc16',
    imageUrl: '/images/plants/tree-pear.webp?v=2',
    preferredSoils: ['CLAY', 'LOAM', 'SILT'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilAdvice: {
      en: 'Excels in cool, heavy, water-retentive clay soils. On shallow chalky limestone soils, common pear rootstocks suffer lime-induced iron chlorosis.',
      de: 'Gedeiht prächtig in kühlen, schweren, feuchten Tonböden. Auf kalkhaltigen Steinböden leiden Birnenunterlagen häufig unter Eisenchlorose.'
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
      'plant-rhubarb'
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
      en: 'Thrives against southern walls or warm microclimates. Wide shallow fibrous root system that loves companion herbs like rosemary, thyme, and marigolds (which suppress root-knot nematodes as a dense pre-plant cover crop, but not proven as companions under trees).',
      de: 'Gedeiht hervorragend an Südwänden und in warmen Mikroklimata. Flachstreichendes Wurzelwerk, das mediterrane Begleiter wie Rosmarin, Thymian und Studentenblumen schätzt (Tagetes wirkt als dichte Vorkultur gegen Wurzelgallennematoden, als Unterpflanzung von Bäumen ist das unbewiesen).'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#4c1d95',
    imageUrl: '/images/plants/tree-fig.webp',
    preferredSoils: ['CHALKY', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilAdvice: {
      en: 'Calciphile Mediterranean species. Flourishes in alkaline, stony, free-draining limestone soils. Waterlogged, saturated heavy clay rots roots rapidly.',
      de: 'Kalkliebende mediterrane Art. Liebt alkalische, steinige, gut durchlässige Kalkböden. Absolut empfindlich gegen nasse, kalte Tonböden (Wurzelfäule).'
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
      'plant-echinacea'
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
      en: 'A multi-stemmed woodland edge nut producer that produces early winter/spring catkins, serving as a critical first pollen source for waking bees. Perfect central tree for smaller semi-shaded guilds.',
      de: 'Mehrstämmiges Waldrandgehölz mit sehr frühen Kätzchenblüten im Vorfrühling – eine überlebenswichtige erste Pollenquelle für erwachende Bienen. Ideal für halbschattige Pflanzengilden.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#d97706',
    imageUrl: '/images/plants/tree-hazelnut.webp?v=2',
    preferredSoils: ['LOAM', 'SILT', 'CLAY', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Prefers moist, organic-rich, slightly acidic to neutral woodland loam. Avoid drought-prone sands, which limit nut filling and cause scorch.',
      de: 'Bevorzugt feuchten, humusreichen, schwach sauren bis neutralen Waldlehm. Dürreempfindliche Sandböden meiden, da sie den Nussansatz beeinträchtigen.'
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
      en: 'Majestic staple-crop nut tree producing carbohydrate-rich nuts. Deep taproot system that supports extensive understory guilds of blueberries (in acidic soil), comfrey, and nitrogen-fixing shrubs like goumi and sea buckthorn.',
      de: 'Majestätischer Nuss- und Brotbaum mit stärkereichen Früchten. Tiefes Wurzelsystem, das einen ausgedehnten Unterwuchs aus Heidelbeeren (im sauren Boden), Beinwell und stickstoffbindenden Sträuchern wie Goumi und Sanddorn hervorragend toleriert.'
    },
    bloomSeason: 'SUMMER',
    harvestSeason: 'AUTUMN',
    color: '#b45309',
    imageUrl: '/images/plants/tree-chestnut.webp?v=2',
    preferredSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilAdvice: {
      en: 'Strict calcifuge (acidophile, pH 4.5–6.0). Highly intolerant of chalk/limestone, which causes fatal iron chlorosis. Also dislikes compacted, waterlogged clay.',
      de: 'Streng kalkfliehend (säureliebend, pH 4,5–6,0). Verträgt keinerlei Kalkböden (tödliche Eisenchlorose). Meidet zudem verdichteten, nassen Ton.'
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
      en: 'Sun- and heat-loving stone fruit that blooms exceptionally early in spring. Highly vulnerable to late spring frost and Monilinia blossom blight. Benefits tremendously from early spring pollinator attractors (crocus, dandelion) to ensure fruit set before other flowers open, and traditional allies like horseradish and garlic (an antifungal effect of garlic as a companion is unproven).',
      de: 'Wärmeliebendes Steinobst mit besonders früher Blüte im Vorfrühling. Anfällig für Spätfröste und Monilia-Spitzendürre. Profitiert enorm von extrem frühen Bestäuberpflanzen (Krokus, Löwenzahn) für den Fruchtansatz sowie traditionellen Begleitern wie Meerrettich und Knoblauch am Wurzelhals (eine pilzhemmende Wirkung von Knoblauch als Begleitpflanze ist unbewiesen).'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'SUMMER',
    color: '#ea580c',
    imageUrl: '/images/plants/tree-apricot.webp',
    preferredSoils: ['SANDY', 'LOAM', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Demands warm, rapid-draining sandy or gravelly loam. On heavy clay, must be mounded onto a 50 cm raised berm with coarse sand amendments to prevent Phytophthora collar rot.',
      de: 'Benötigt warmen, schnell abtrocknenden sandigen oder kiesigen Lehm. Bei schwerem Ton zwingend auf einen 50 cm Hochberm mit Sandzusatz pflanzen (Schutz vor Kragenfäule).'
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
      'plant-southernwood',
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
      'plant-echinacea'
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
    rootHabit: 'DEEP_TAP',
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
      en: 'A vigorous stone fruit canopy star prized for delicious cherries. Deep taproot with wide surface feeder network. Highly vulnerable to cherry fruit fly and bacterial canker; often paired with garlic/chives, tansy, and daffodils, though protection against fruit flies or voles by these companions is unproven.',
      de: 'Wuchsfreudiger Steinobst-Kronenbaum für Süßkirschen. Tiefes Wurzelwerk mit weitreichenden Feinwurzeln. Anfällig für Kirschfruchtfliege und Bakterienbrand; wird oft mit Knoblauch/Schnittlauch, Rainfarn und Narzissen kombiniert, ein Schutz vor Fruchtfliegen oder Wühlmäusen durch diese Begleiter ist jedoch unbewiesen.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#dc2626',
    imageUrl: '/images/plants/tree-cherry.webp',
    preferredSoils: ['LOAM', 'SILT', 'SANDY'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Demands deep, warm, well-aerated sandy or silty loam. Wet, heavy clay suffocates roots and triggers fatal bacterial canker and gummosis.',
      de: 'Verlangt tiefgründigen, warmen, gut durchlüfteten sandigen oder lehmigen Boden. Nasse Tonböden führen zu Sauerstoffmangel und begünstigen Bakterienbrand und Gummifluss.'
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
      'plant-red-currant'
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
    sunPreference: 'PARTIAL_SUN',
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
      en: 'Fragrant, ancient pome fruit tolerant of semi-shaded locations and damp soils. Shallow rooting system that thrives with non-competing allium borders, chives (a protective effect against Diplocarpon leaf blight is unproven), and deep-mining comfrey.',
      de: 'Aromatisch duftendes Kernobst, das Halbschatten und feuchtere Böden schätzt. Flaches Wurzelsystem, das hervorragend mit konkurrenzschwachen Allium-Einfassungen, Schnittlauch (eine Schutzwirkung gegen Blattbräune ist unbewiesen) und tiefbohrendem Beinwell harmoniert.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#eab308',
    imageUrl: '/images/plants/tree-quince.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Prefers moist, fertile, moisture-retentive loam or clay. Shallow chalk or high alkaline limestone soils induce severe iron chlorosis.',
      de: 'Bevorzugt feuchten, humosen, nährstoffreichen Lehm- oder Tonboden. Flachgründiger Kalkboden führt schnell zu starker Eisenchlorose.'
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
      'plant-sweet-flag',
      'plant-meadowsweet',
      'plant-wormwood',
      'plant-wild-carrot'
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
    rootHabit: 'DEEP_TAP',
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
      en: 'Stately, incredibly long-lived canopy star bearing intensely sweet, antioxidant-rich berries over several weeks. Deep taproot unlocks minerals from the subsoil. Pairs well with nitrogen-fixing clovers and dynamic accumulator ground covers.',
      de: 'Langlebiger, stattlicher Kronen-Star mit zuckersüßen, hocharomatischen Beerenfrüchten über viele Wochen. Seine tiefe Pfahlwurzel erschließt Mineralien aus tiefen Erdschichten. Perfekt kombinierbar mit stickstofffixierendem Klee und Beinwell.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#581c87',
    imageUrl: '/images/plants/tree-mulberry.webp',
    preferredSoils: ['LOAM', 'SANDY', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Flourishes in warm, deep, well-draining soils; exceptionally drought-tolerant once established. Saturated, poorly aerated clay causes root rot.',
      de: 'Gedeiht auf tiefen, warmen, durchlässigen Böden; nach dem Anwachsen ausgesprochen trockenheitsresistent. Staunasser, kalter Tonboden führt zu Wurzelfäule.'
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
      'plant-lovage'
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
      en: 'Actinorhizal pioneer tree fixing massive atmospheric nitrogen via Frankia symbiosis. Invaluable for poor soils and sun-drenched microclimates. Abundant medicinal berries packed with Vitamin C and omega fatty acids. Demands full unfiltered sun.',
      de: 'Actinorhizales Pioniergehölz, das über Frankia-Symbiose enorme Mengen Luftstickstoff im Boden bindet. Ideal zur Bodenverbesserung auf sonnigen Standorten. Üppige Vitamin-C- und Omega-Fettsäuren-Heilbeeren. Benötigt zwingend volle Sonne.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#ea580c',
    imageUrl: '/images/plants/tree-seabuckthorn-star.webp',
    preferredSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Pioneer of sandy, gravelly, calcareous soils. Intolerant of standing water or dense, suffocating clay.',
      de: 'Pionierart auf sandigen, kiesigen, kalkreichen Böden. Extrem empfindlich gegenüber Staunässe und verdichtetem Ton.'
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
      'plant-oregano'
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
    sunPreference: 'PARTIAL_SUN',
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
      en: 'Premier native nitrogen-fixing canopy star for moist, heavy, or riparian guilds. Enriches surrounding soil with high-nitrogen leaf drop and root nodule exudates. Tolerates partial shade and periodic waterlogging.',
      de: 'Hervorragender einheimischer stickstofffixierender Leitbaum für feuchte, schwere Böden oder Uferbereiche. Reichert den Boden durch stickstoffreichen Laubfall und Knöllchenbakterien an. Sehr schattentolerant und nässefest.'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#15803d',
    imageUrl: '/images/plants/tree-alder.webp',
    preferredSoils: ['CLAY', 'SILT', 'LOAM', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilAdvice: {
      en: 'Adapted to saturated, heavy clay, silty floodplains, and peaty acidic ground. Will suffer and desiccate in dry, porous sandy soils.',
      de: 'Perfekt angepasst an nasse Tonböden, Schluff und saure Moorböden. Geht auf trockenen, durchlässigen Sand- und Kalkböden ein.'
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
      'plant-sweet-flag',
      'plant-meadowsweet',
      'plant-rhododendron',
      'plant-blackcurrant',
      'plant-red-currant',
      'plant-rhubarb'
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
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        'Young Leaf Sunburn (UV sensitivity)',
        'Pollination Deficits (Blowfly pollinated)',
        'Taproot Disturbance'
      ],
      de: [
        'Sonnenbrand an Jungblättern (UV-Sensibilität)',
        'Bestäubungsdefizite (Aasfliegen-Bestäubung)',
        'Wurzelstörung beim Umpflanzen'
      ]
    },
    description: {
      en: 'Temperate understory star producing large tropical-custard fruits (mango/banana flavor). Young trees require partial shade to avoid UV sunburn. Rich in annonaceous acetogenins which naturally repel chewing insect pests.',
      de: 'Halbschattenliebender Unterholz-Star mit großen, tropisch schmeckenden Früchten (Mango-Bananen-Aroma). Junge Bäume benötigen zwingend Halbschatten gegen UV-Sonnenbrand. Enthält insektizide Acetogenine, die Schädlinge abwehren.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#65a30d',
    imageUrl: '/images/plants/tree-pawpaw.webp',
    preferredSoils: ['LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilAdvice: {
      en: 'Demands deep, fertile, moisture-retentive, humus-rich alluvial loam. Dislikes dry, thin sandy soils.',
      de: 'Verlangt tiefgründigen, humusreichen, feuchten Auenlehm. Flachgründige, trockene Sandböden werden nicht vertragen.'
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
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        'Iron Chlorosis at pH > 5.2',
        'Spotted Wing Drosophila (Drosophila suzukii)',
        'Mummy Berry (Monilinia vaccinii-corymbosi)',
        'Shallow Drought Desiccation'
      ],
      de: [
        'Eisenchlorose bei pH > 5,2',
        'Kirschessigfliege (Drosophila suzukii)',
        'Monilia-Fruchtfäule (Mummy Berry)',
        'Trockenstress durch Flachwurzeln'
      ]
    },
    description: {
      en: 'Acid-loving keystone berry shrub. Lacks root hairs and depends on symbiotic ericoid mycorrhizae. Thrives in partial shade and acid soils alongside cranberries, lupines, and conifer mulch. Never pair with lime or alkaline alliums.',
      de: 'Säureliebender Beerenstrauch-Star. Besitzt keine Wurzelhaare und ist auf ericoide Mykorrhizapilze angewiesen. Liebt Halbschatten und saure Waldböden (pH 4,0–5,0) zusammen mit Moosbeeren (Cranberries), Lupinen und Rindenmulch.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#2563eb',
    imageUrl: '/images/plants/shrub-blueberry.webp?v=2',
    preferredSoils: ['ACIDIC', 'SANDY'],
    unsuitableSoils: ['CHALKY', 'CLAY', 'LOAM'],
    soilAdvice: {
      en: 'Strict acidophile (pH 4.2–5.2). Requires high organic matter, peat or pine needle mulch, and consistent moisture. Chalky or high-pH soils are lethal.',
      de: 'Streng sauer liebend (pH 4,2–5,2). Benötigt humusreichen Moorbeet- oder Nadelwaldboden und gleichmäßige Feuchte. Kalkhaltige Böden führen rasch zum Eingehen.'
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
    sunPreference: 'PARTIAL_SUN',
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
      en: 'High-yielding, shade-tolerant understory shrub packed with vitamin C. Flourishes in partial shade where stone fruits fail. Often paired with alliums and aromatic southernwood, though claims that they deter gall mites or clearwing moths are unproven.',
      de: 'Ertragreicher, schattentoleranter Beeren-Star mit hohem Vitamin-C-Gehalt. Gedeiht prächtig im Halbschatten. Wird oft mit Allium und duftender Eberraute kombiniert, eine Wirkung gegen Gallmilbe oder Glasflügler ist jedoch unbewiesen.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'SUMMER',
    color: '#312e81',
    imageUrl: '/images/plants/shrub-blackcurrant.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Loves cool, moist, rich clay or fertile loam. Dries out easily in porous sandy soils, leading to mildew outbreaks.',
      de: 'Liebt kühlen, feuchten, nährstoffreichen Ton- und Lehmboden. Trockene Sandböden meiden (führt zu Mehltau und Beerenabwurf).'
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
      'plant-southernwood',
      'plant-comfrey',
      'plant-white-clover',
      'plant-nettle',
      'plant-meadowsweet',
      'plant-welsh-onion',
      'plant-wormwood'
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
    rootHabit: 'DEEP_TAP',
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
      en: 'The quintessential sun-loving perennial vine. Deep taproot anchors the guild while climbing trellises or arbor structures. Sage companion planting may help (its volatile monoterpenes primed defenses against downy mildew in closed-box and extract tests, not yet in the field), as may living mulch groundcovers (white clover) sustaining predatory mites and blocking soil oospore splash.',
      de: 'Klassische sonnenhungrige Kletter-Leitpflanze. Die bis zu 6 m tiefen Wurzeln erschließen Unterbodenressourcen. Möglicher Nutzen durch Salbei-Begleitpflanzung (flüchtige Monoterpene induzierten in Box- und Extraktversuchen Abwehr gegen Falschen Mehltau, im Freiland noch unbelegt) sowie durch Weißklee als Bodendecker gegen Sporenspritzwasser und zur Raubmilbenförderung.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#4c1d95',
    imageUrl: '/images/plants/vine-grape.webp?v=2',
    preferredSoils: ['CHALKY', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Thrives in warm, rocky, calcareous, free-draining hillsides. Wet, waterlogged clay rots roots and drastically increases fungal mildew pressure.',
      de: 'Liebt warme, steinige, kalkhaltige, tief durchlässige Böden. Kalter, nasser Tonboden hemmt die Wurzeln und fördert Pilzerkrankungen.'
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
      'plant-echinacea', 'plant-sainfoin']
  },
  {
    id: 'vine-kiwi',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Hardy Kiwi / Kiwiberry',
      de: 'Scharfzahniger Strahlengriffel / Kiwibeere'
    },
    botanicalName: 'Actinidia arguta',
    category: 'VINE',
    matureRadiusM: 2.0,
    rootHabit: 'SURFACE_FEEDER',
    jugloneProducer: false,
    sunPreference: 'PARTIAL_SUN',
    vulnerabilities: {
      en: [
        'Late Spring Shoot Frost',
        'Feline Root Scratching (Actinidine attractant)',
        'Drought Stress'
      ],
      de: [
        'Spätfrost an Austrieben',
        'Katzenverbiss an Wurzeln (durch Actinidin)',
        'Trockenheitsempfindlichkeit'
      ]
    },
    description: {
      en: 'Vigorous, exceptionally cold-hardy (-30°C) fruiting liana producing smooth-skinned mini kiwis eaten whole. Thrives climbing pergolas in partial shade. Requires moist, cool soil around roots, protected by ground-covering sweet woodruff and living mulch.',
      de: 'Extrem frostharte (-30 °C), wuchsfreudige Schlingpflanze mit stachellosen, mundgerechten Minikiwis. Gedeiht hervorragend an Rankgerüsten im Halbschatten. Schätzt feuchte, kühle Bodenbedeckung durch Waldmeister und Klee.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#16a34a',
    imageUrl: '/images/plants/vine-kiwi.webp',
    preferredSoils: ['LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY'],
    soilAdvice: {
      en: 'Needs rich, humus-packed, slightly acidic to neutral loam with constant moisture. Alkaline chalk soils cause chlorosis.',
      de: 'Benötigt humusreichen, lockeren, leicht sauren bis neutralen Lehm mit kontinuierlicher Feuchtigkeit. Auf Kalkböden chloroseanfällig.'
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
    sunPreference: 'FULL_SHADE',
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
      en: 'Heavy-yielding perennial megaphorb with huge umbrella leaves functioning as natural weed suppression. Outstanding performer in full shade or cool woodland corners. Deep fleshy root system thrives with allium companions (claims that they deter curculio and fungal rot are unproven) and potassium-pumping comfrey.',
      de: 'Extrem langlebige Großstaude mit riesigen Blättern, die den Boden vollkommen beschatten und Unkraut unterdrücken. Hervorragend für schattige Gartenbereiche geeignet. Profitiert von Allium-Begleitern (ein Schutz vor Fäule und Rüsselkäfern ist unbewiesen) und kaliumreichem Beinwellmulch.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'EARLY_SPRING',
    color: '#be123c',
    imageUrl: '/images/plants/herb-rhubarb.webp?v=2',
    preferredSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Heavy feeder demanding deep, fertile, water-retentive clay or loam enriched with heavy compost. Thin dry sand causes premature dormancy.',
      de: 'Starkzehrer, der tiefgründigen, feuchten, nährstoffreichen Lehm- oder Tonboden benötigt. Auf trockenen Sandböden verkümmert er rasch.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Okt–Nov) als Wurzelstock',
      en: 'Spring (Mar–Apr) or autumn (Oct–Nov) via crown'
    },
    harvestTime: {
      de: 'Frühling bis Johannistag (Apr–24. Jun)',
      en: 'Spring to St. John’s Day (Apr–Jun 24)'
    },
    recommendedCompanions: [
      'plant-garlic',
      'plant-chives',
      'plant-comfrey',
      'plant-borage',
      'plant-woodruff',
      'plant-lovage',
      'plant-sweet-flag'
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
    sunPreference: 'FULL_SHADE',
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
      en: 'Resilient, highly shade-tolerant native keystone shrub producing aromatic flowers and medicinal dark berries. Juglone-tolerant; acts as a nursery for hoverflies and ladybugs. Thrives in dense forest shade or edge guilds.',
      de: 'Extrem robuster, voll schattentoleranter einheimischer Leitstrauch mit heilsamen Blüten und Vitamin-Beeren. Juglonverträglich; dient als Nützlingswiege für Schwebfliegen und Marienkäfer. Gedeiht selbst im tiefen Baumschatten.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#1e1b4b',
    imageUrl: '/images/plants/shrub-elderberry.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Remarkably adaptable to damp, nutrient-rich clay, silt, and woodland soils. Tolerates temporary flooding and compaction.',
      de: 'Überaus anpassungsfähig an feuchte, nährstoffreiche Ton-, Lehm- und Waldböden. Verträgt auch zeitweilige Nässe und Bodenverdichtung.'
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
      'plant-sweet-flag'
    ]
  },
  {
    id: 'tree-ginkgo',
    climateZones: ['TEMPERATE', 'SUBTROPICAL'],
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
      en: 'An ancient living fossil and resilient nut/medicinal anchor tree. Deep central taproot and non-invasive lateral rooting make it an outstanding canopy partner for understory herbs and shrubs. Prized for autumn golden foliage, edible roasted seeds (Bai Guo), and total immunity to urban pollution and common tree diseases.',
      de: 'Uraltes lebendes Fossil und robuster Nuss-/Heilbaum-Anker. Die tiefe Pfahlwurzel und nicht-invasive Feinwurzeln machen ihn zum idealen Kronenpartner für Kräuter und Beerensträucher. Berühmt für seine goldene Herbstfärbung, essbare geröstete Samen (Bai Guo) und absolute Resistenz gegen Schädlinge und Stadtklima.'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'AUTUMN',
    color: '#eab308',
    imageUrl: '/images/plants/tree-ginkgo.webp',
    preferredSoils: ['LOAM', 'SANDY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilAdvice: {
      en: 'Requires deep, well-draining loam or sandy loam. Avoid stagnant, oxygen-poor waterlogging. Exceptionally tolerant of urban soils, air pollution, and variable pH (5.5–8.0).',
      de: 'Benötigt tiefgründigen, gut drainierten Lehm- oder Sandboden. Dauerhafte Staunässe vermeiden. Extrem widerstandsfähig gegen Stadtklima, Abgase, Trockenheit und pH-Werte von 5,5 bis 8,0.'
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
    ]
  },
  {
    id: 'tree-tea-sinensis',
    climateZones: ["TEMPERATE","SUBTROPICAL","BOREAL"],
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
        "Kalkchlorose bei hohem pH-Wert (> 6,5)",
        "Rote Spinnmilbe (Oligonychus coffeae)",
        "Tee-Blasenrost (Exobasidium vexans)",
        "Austrocknende Winter- und Ostwinde", "Grüne Teezikade (Empoasca onukii)", "Teespanner (Ectropis obliqua)"]
    },
    description: {
      en: 'A compact, remarkably cold-hardy evergreen shrub (hardy down to -15°C) evolved in the misty montane forest understories of SW China. Its small, coriaceous leaves (4–10 cm) balance tea polyphenols (15–22% catechins), caffeine (2.5–4.0%), and high root-synthesized L-theanine (1.5–3.5%, umami & Hui Gan sweetness), making it the premier cultivar group for all 6 major tea types: Green, White, Yellow, Oolong, small-leaf Black, and Dark tea.',
      de: 'Ein kompakter, bemerkenswert frostharter immergrüner Unterwuchs-Strauch (winterhart bis -15°C) aus den Bergnebelwäldern Südwestchinas. Seine kleinen, ledrigen Blätter (4–10 cm) vereinen Polyphenole (15–22 % Catechine), Koffein (2,5–4,0 %) und einen hohen Gehalt an wurzelsynthetisiertem L-Theanin (1,5–3,5 %, Umami & Hui-Gan-Süße) – die ideale Varietät für alle 6 großen Teesorten: Grün-, Weiß-, Gelb-, Oolong-, feinen Schwarz- und Dunkeltee (Hei Cha).'
    },
    bloomSeason: 'AUTUMN',
    harvestSeason: 'LATE_SPRING',
    color: '#15803d',
    imageUrl: '/images/plants/tree-tea-sinensis.webp',
    preferredSoils: ["ACIDIC","LOAM","SILT"],
    unsuitableSoils: ["CHALKY","CLAY"],
    soilAdvice: {
      en: 'Obligate calcifuge demanding acidic, well-drained forest loam (pH 4.5–5.8) and 30–50% dappled canopy shade (which suppresses bitter EGCG catechins and preserves L-theanine umami). Roots preferentially assimilate ammonium (NH4+) via the GS-GOGAT pathway and extrude H+ protons via plasma-membrane H+-ATPase; pair with organic N-fixers (Alder) and K/Ca/Mg dynamic accumulators (Comfrey) while avoiding synthetic urea or chalk.',
      de: 'Obligater Kalkflüchter: benötigt zwingend sauren, gut dränierenden Waldboden (pH 4,5–5,8) sowie 30–50 % lichten Halbschatten (hemmt bittere EGCG-Catechine und bewahrt das L-Theanin-Umami). Die Wurzeln bevorzugen Ammonium (NH4+) über den GS-GOGAT-Weg zur L-Theanin-Synthese und säuern die Rhizosphäre aktiv über H+-ATPase an; ideal mit Erlen-Laubmulch, Nadelstreu und Beinwell-Kalium kombinieren, Kalk und Staunässe strikt meiden.'
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
      'plant-soybean'
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
    sunPreference: 'FULL_SUN',
    vulnerabilities: {
      en: [
        "Frost Sensitivity (Damaged below -3°C)",
        "Tea Mosquito Bug (Helopeltis theivora)",
        "Red Rust (Cephaleuros virescens)",
        "Drought Stress under Low Humidity", "Tea Green Leafhopper (Empoasca onukii)", "Tea Geometrid (Ectropis obliqua)"],
      de: [
        "Frostempfindlichkeit (Frostschäden unter -3°C)",
        "Teewanze (Helopeltis theivora)",
        "Roter Algenrost (Cephaleuros virescens)",
        "Trockenstress bei niedriger Luftfeuchtigkeit", "Grüne Teezikade (Empoasca onukii)", "Teespanner (Ectropis obliqua)"]
    },
    description: {
      en: 'A vigorous, broad-leafed evergreen sub-canopy tree (8–18 m wild height; pruned to a 0.9 m plucking table or 3 m Qiaomu arbor) native to Assam, Yunnan, and SE Asia. Its large, thin, bullate leaves (15–30 cm) pack 25–35% polyphenols (gallated catechins), 3.5–5.0% caffeine, and 2.0–2.5x higher Polyphenol Oxidase (PPO) activity than var. sinensis—making it the world\'s benchmark for malty Assam & Dianhong Black Tea (rich in theaflavins/thearubigins), Yunnan Moonlight White, and Raw (Sheng) & Ripe (Shou) Pu-erh Dark Tea.',
      de: 'Ein wuchskräftiger, großblättriger immergrüner Baum (wild 8–18 m; in Kultur als 0,9 m Pflücktisch oder 3 m Qiaomu-Halbstamm) aus den feuchtwarmen Monsunwäldern von Assam, Yunnan und Südostasien. Seine großen, dünnen Blätter (15–30 cm) enthalten 25–35 % Polyphenole (gallierte Catechine), 3,5–5,0 % Koffein und eine 2,0–2,5-fach höhere Polyphenoloxidase-Aktivität (PPO) als var. sinensis – die Referenzvarietät für malzigen Assam- & Dianhong-Schwarztee (reich an Theaflavinen/Thearubiginen), Yunnan Moonlight White sowie rohen (Sheng) und gereiften (Shou) Pu-erh-Tee.'
    },
    bloomSeason: 'AUTUMN',
    harvestSeason: 'SUMMER',
    color: '#166534',
    imageUrl: '/images/plants/tree-tea-assamica.webp',
    preferredSoils: ["ACIDIC","LOAM","SILT"],
    unsuitableSoils: ["CHALKY","CLAY"],
    soilAdvice: {
      en: 'Thrives in deep (> 1.5 m), humus-rich acidic subtropical/tropical forest soils (pH 4.5–5.5) with high atmospheric humidity (>= 70–80% RH) and 25–35% high-canopy leguminous/actinorhizal shade. Intolerant of frost below -3°C, free lime, or stagnant waterlogging.',
      de: 'Gedeiht in tiefgründigem (> 1,5 m), saurem, humusreichem Urwaldboden (pH 4,5–5,5) bei hoher Luftfeuchtigkeit (>= 70–80 % rF) und 25–35 % hohem Kronenschatten. Unverträglich gegen Frost unter -3°C (in Mitteleuropa Kalthaus-/Wintergartenkultur), Kalk und stauende Nässe.'
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
      'plant-sicklepod'
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
      en: 'Fast-growing multifunctional annual pioneer crop and ancient economic herb. Generates abundant protein- and omega-rich seeds, aromatic terpenes, and massive lignocellulosic biomass. Its vigorous taproot penetrates 1.5–2.5 m deep, fracturing compacted subsoils and cycling subsoil minerals. Its dense canopy suppresses over 95% of invasive weed rhizomes. Understory companions supply nitrogen fixation, floral biocontrol for aphids, and antifungal ground cover.',
      de: 'Schnellwüchsige, multifunktionale Großkultur und uralte Nutzpflanze. Liefert hochwertige protein- und omega-3-reiche Hanfsamen, aromatische Terpene und enorme Mengen lignocellulosereicher Biomasse. Die kräftige Pfahlwurzel dringt 1,5–2,5 m tief ein, bricht verdichtete Unterböden auf und mobilisiert Nährstoffe. Das dichte Kronendach unterdrückt über 95 % aller Wurzelunkräuter. Begleitpflanzen liefern Stickstoff, Nützlingsförderung gegen Blattläuse und pilzhemmenden Bodenschutz.'
    },
    bloomSeason: 'SUMMER',
    harvestSeason: 'AUTUMN',
    color: '#15803d',
    imageUrl: '/images/plants/herb-hemp.webp',
    preferredSoils: ['LOAM', 'SILT', 'SANDY', 'CHALKY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilAdvice: {
      en: 'Requires deep, loose, moisture-retentive loam or silt with balanced drainage (pH 6.0–7.5). Avoid heavy anaerobic waterlogged clay which causes seedling rot and taproot distortion, and strongly acidic ground (pH < 5.8).',
      de: 'Benötigt tiefgründigen, gut belüfteten und humosen Lehm- oder Lössboden (pH 6,0–7,5). Meidet staunasse, kalte Tonböden (führt zu Keimlingsfäule) sowie stark saure Standorte (pH < 5,8).'
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
      en: 'Classic, heavy-cropping woodland edge berry shrub bearing translucent ruby-red racemes rich in vitamin C, pectin, and organic acids. Exceptionally shade- and juglone-tolerant. Because its dense fibrous roots feed in the top 15–30 cm of soil, it thrives when paired with living mulch (white clover, sweet woodruff), potassium-accumulating comfrey, and aromatic allium/artemisia companions (claims that their scent deters clearwing borers and blister aphids are unproven).',
      de: 'Klassischer, reich tragender Waldrand-Beerenstrauch mit leuchtend rubinroten, Vitamin-C- und pektinreichen Rispen. Extrem schatten- und juglonverträglich. Da das dichte Feinwurzelsystem in den obersten 15–30 cm wächst, profitiert der Strauch massiv von kühlendem Lebendmulch (Weißklee, Waldmeister), kaliumreichem Beinwell-Mulch sowie duftenden Allium- und Eberrauten-Begleitern (eine Wirkung gegen Glasflügler und Johannisbeerblasenläuse ist unbewiesen).'
    },
    bloomSeason: 'EARLY_SPRING',
    harvestSeason: 'SUMMER',
    color: '#dc2626',
    imageUrl: '/images/plants/shrub-red-currant.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Requires cool, consistently moist, humus-rich loam or clay (pH 5.5–7.0). Shallow surface feeder: never cultivate or hoe around the root zone; maintain an 8–10 cm organic mulch layer. Dry sandy soils cause summer leaf scorch and berry drop.',
      de: 'Benötigt kühlen, gleichmäßig feuchten, humosen Lehm- oder Tonboden (pH 5,5–7,0). Als Flachwurzler niemals im Wurzelbereich hacken, sondern ganzjährig 8–10 cm hoch mulchen. Trockene Sandböden führen zu Sonnenbrand und vorzeitigem Beerenabwurf.'
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
      'plant-southernwood',
      'plant-wormwood',
      'plant-yarrow',
      'plant-white-clover',
      'plant-woodruff',
      'plant-borage',
      'plant-chamomile',
      'plant-oregano',
      'plant-nettle',
      'plant-meadowsweet'
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
    rootHabit: 'DEEP_TAP',
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
      en: 'Premier European agroforestry keystone tree and soil-regenerating nurse species. Its tender spring leaves are prized as a mild, mucilage-rich perennial tree salad, while its fragrant mid-summer blossoms provide a world-class nectar bridge for honeybees and wild pollinators as well as medicinal linden tea. Its deep heart-root system mines subsoil calcium and magnesium, shedding fast-decomposing leaf litter that builds fertile, earthworm-rich mull humus. Responds exceptionally well to coppicing and pollarding (Chop & Drop).',
      de: 'Herausragender europäischer Permakultur-Leitbaum und bodenverbessernder Ammenbaum. Seine zarten, milden Frühjahrsblätter liefern erstklassigen mehrjährigen „Baum-Salat“, während die duftenden Hochsommerblüten als erstklassige Bienenweide die Trachtlücke schließen und heilsamen Lindenblütentee liefern. Das tiefreichende Herzwurzelsystem pumpt Calcium und Magnesium aus dem Unterboden; das leicht zersetzliche Laub bildet milden, regenwurmreichen Mull-Humus. Ideal auch für Schneitelung und Niederwald-Schnitt (Chop & Drop).'
    },
    bloomSeason: 'SUMMER',
    harvestSeason: 'SUMMER',
    color: '#65a30d',
    imageUrl: '/images/plants/tree-linden.webp',
    preferredSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['SANDY'],
    soilAdvice: {
      en: 'Thrives in deep, fresh to moist loam, silt, clay, or calcareous soils (pH 5.5–8.0). Actively buffers acidic topsoils via calcium-rich leaf litter. Avoid bone-dry, nutrient-poor sandy sites where summer drought triggers spider mite outbreaks.',
      de: 'Gedeiht optimal auf tiefgründigen, frischen bis feuchten Lehm-, Löss-, Ton- oder Kalkböden (pH 5,5–8,0). Puffert saure Oberböden aktiv durch sein calciumreiches Falllaub ab. Extrem trockene, nährstoffarme Sandböden meiden (fördert Spinnmilbenbefall).'
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
      en: 'Evergreen acidophilic woodland keystone shrub (hardy to -30°C) famed for spectacular late-spring flower trusses that nourish specialist long-tongued queen bumblebees (Bombus hortorum, B. pascuorum). Lacks root hairs entirely, relying on intracellular ericoid mycorrhizal fungi (Pezoloma ericae, Oidiodendron maius) that secrete extracellular proteases and phosphatases to unlock organic N and P in low-pH humus—forming a shared mycorrhizal network with Highbush Blueberry, Lingonberry, Cranberry, and Wintergreen. Foliage and nectar contain diterpenoid grayanotoxins (strictly non-edible to humans and livestock).',
      de: 'Immergrüner, extrem winterharter (-30 °C) Moorbeet-Leitstrauch mit prächtigen Blütenständen im Spätfrühling, die langrüsselige Hummelköniginnen (Bombus hortorum, B. pascuorum) ernähren. Besitzt keinerlei Wurzelhaare, sondern feinste Haarwurzeln in Symbiose mit ericoiden Mykorrhizapilzen (Pezoloma ericae, Oidiodendron maius), die organischen Stickstoff und Phosphor im sauren Waldboden erschließen und ein gemeinsames Mykorrhiza-Netzwerk mit Kulturheidelbeere, Preiselbeere, Cranberry und Scheinbeere bilden. Blätter und Nektar enthalten Diterpen-Grayanotoxine (für Menschen und Haustiere giftig).'
    },
    bloomSeason: 'LATE_SPRING',
    harvestSeason: 'LATE_SPRING',
    color: '#9333ea',
    imageUrl: '/images/plants/shrub-rhododendron.webp',
    preferredSoils: ['ACIDIC', 'LOAM', 'SILT'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilAdvice: {
      en: 'Obligate calcifuge demanding cool, humus-rich, well-aerated acidic soil (pH 4.2–5.5) with 30–60% dappled woodland shade. Shallow fibrous hair-root ball (top 15–40 cm) must never be cultivated; maintain an 8–10 cm pine bark or leaf-mould mulch layer. Highly sensitive to Black Walnut juglone and stagnant clay waterlogging.',
      de: 'Obligater Kalkflüchter für kühle, humose, luftige und saure Waldböden (pH 4,2–5,5) im lichten Halbschatten. Den flachen Haarwurzelballen (oberste 15–40 cm) niemals behacken, sondern ganzjährig 8–10 cm dick mit Kiefernrinde, Nadelstreu oder Laubkompost mulchen. Stark juglonempfindlich (Walnuss-Abstand ≥ 20 m) und empfindlich gegen Staunässe.'
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
    ]
  }
];
