import { GuildPlant } from '../types/guild';

export const GUILD_PLANTS: GuildPlant[] = [
  // --- MULTI-FUNCTIONAL HEROES & DYNAMIC ACCUMULATORS ---
  {
    id: 'plant-comfrey',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Russian Comfrey (Bocking 14)',
      de: 'Echter Beinwell (Bocking 14)'
    },
    botanicalName: 'Symphytum x uplandicum',
    layer: 'HERBACEOUS',
    roles: ['DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'], // 3-4 flushes per year
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 0.8,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Sterile cultivar Bocking 14 will not self-seed aggressively. Massive taproot (up to 10ft) mines potassium, calcium, and magnesium. Excellent chop-and-drop green manure. Deciduous in winter.',
      de: 'Die sterile Sorte Bocking 14 versamt sich nicht unkontrolliert. Enorme Pfahlwurzel (bis zu 3 m tief) erschließt Kalium, Calcium und Magnesium aus dem Unterboden. Hervorragender Chop-and-Drop-Mulchlieferant.'
    },
    color: '#059669',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-comfrey.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in deep, moist clay or loam. Its biological-drill taproot fractures compacted subsoil clay, making nutrients available.',
      de: 'Gedeiht in feuchtem, tiefgründigem Ton- und Lehmboden. Die bis zu 3 m tiefe Pfahlwurzel bricht verdichtete Tonschichten auf.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Nov) als Wurzelsteckling',
      en: 'Spring (Mar–May) or autumn (Sep–Nov) via root cuttings'
    },
    harvestTime: {
      de: 'Mai bis Oktober (3–5 Mulchschnitte pro Saison)',
      en: 'May to October (3–5 chop-and-drop cuts per season)'
    },
    recommendedForTrees: [
      'tree-apple', 'tree-walnut', 'tree-peach', 'tree-apricot', 'tree-plum', 'tree-pear', 'tree-hazelnut', 'tree-chestnut', 'tree-cherry', 'tree-quince', 'tree-mulberry', 'tree-alder', 'tree-pawpaw', 'shrub-blueberry', 'shrub-blackcurrant', 'herb-rhubarb', 'vine-kiwi', 'shrub-elderberry', 'tree-ginkgo',
      'tree-tea-sinensis',
      'tree-tea-assamica',
      'herb-hemp', 'shrub-red-currant', 'tree-linden', 'shrub-rhododendron']
  },
  {
    id: 'plant-white-clover',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'White Clover',
      de: 'Weißklee'
    },
    botanicalName: 'Trifolium repens',
    layer: 'GROUND_COVER',
    roles: ['NITROGEN_FIXER', 'LIVING_MULCH', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.6,
    maxDistanceM: 3.7,
    spreadM: 0.5,
    heightM: 0.2,
    perennial: true,
    notes: {
      en: 'Low-growing living carpet that fixes atmospheric nitrogen via Rhizobium nodules. Semi-evergreen, keeping soil armored through cold months. Long-flowering nectar favorite for honeybees.',
      de: 'Flach wachsender Teppich, der über Knöllchenbakterien Luftstickstoff bindet. Wintergrün für ganzjährigen Bodenschutz. Ausdauernde Nektarquelle für Honig- und Wildbienen.'
    },
    color: '#10b981',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-white-clover.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SANDY', 'SILT', 'CHALKY', 'ACIDIC'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Extremely versatile living mulch adapting to virtually all soils, fixing nitrogen even on depleted ground.',
      de: 'Sehr anpassungsfähiger Bodendecker für fast alle Böden, bindet Stickstoff auch auf ausgelaugtem Grund.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Spätsommer (Aug–Sep) als Saatgut',
      en: 'Spring (Mar–May) or late summer (Aug–Sep) by seed'
    },
    harvestTime: {
      de: 'Mai bis September (Blüten für Tee; Blätter ganzjährig schnittfähig)',
      en: 'May to September (blossoms for tea; foliage continuous)'
    },
    recommendedForTrees: [
      'tree-apple', 'tree-walnut', 'tree-peach', 'tree-apricot', 'tree-plum', 'tree-pear', 'tree-fig', 'tree-cherry', 'tree-mulberry', 'tree-pawpaw', 'shrub-blackcurrant', 'vine-grape', 'vine-kiwi', 'tree-ginkgo',
      'tree-tea-assamica',
      'herb-hemp', 'shrub-red-currant', 'tree-linden']
  },
  {
    id: 'plant-yarrow',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Yarrow',
      de: 'Gemeine Schafgarbe'
    },
    botanicalName: 'Achillea millefolium',
    layer: 'HERBACEOUS',
    roles: ['DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET', 'PEST_REPELLER', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 3,
    spreadM: 0.6,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Accumulates copper, potassium, phosphorus, and sulfur. Flat flower heads attract parasitic micro-wasps, hoverflies, and ladybugs that prey on aphids and caterpillars (orchard pest control is field-proven for mixed flower strips, not single plants). Feathery aromatic foliage.',
      de: 'Akkumuliert Kupfer, Kalium, Phosphor und Schwefel. Flache Schirmdolden locken Schwebfliegen, Marienkäfer und Schlupfwespen an, die Läuse und Raupen fressen (im Obstbau ist eine Schädlingsbekämpfung nur für artenreiche Blühstreifen belegt, nicht für Einzelpflanzen). Würzig duftendes Laub.'
    },
    color: '#eab308',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-yarrow.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT', 'CLAY', 'ACIDIC'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Deep fibrous roots thrive in dry sand and poor alkaline chalk. Highly drought-tolerant once rooted.',
      de: 'Tiefgehende Faserwurzeln gedeihen in trockenem Sand und kargem Kalk. Sehr trockenheitsresistent.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Frühherbst (Sep–Okt)',
      en: 'Spring (Mar–May) or early autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Juni bis September (Blüten und Blätter während der Vollblüte)',
      en: 'June to September (flowering tops and tender leaves)'
    },
    recommendedForTrees: [
      'tree-apple', 'tree-plum', 'tree-pear', 'tree-chestnut', 'tree-cherry', 'tree-quince', 'tree-mulberry', 'tree-seabuckthorn-star', 'vine-kiwi', 'tree-ginkgo',
      'tree-tea-sinensis',
      'tree-tea-assamica',
      'herb-hemp', 'shrub-red-currant', 'tree-linden']
  },
  {
    id: 'plant-chives',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Common Chives',
      de: 'Schnittlauch'
    },
    botanicalName: 'Allium schoenoprasum',
    layer: 'BULB_ROOT',
    roles: ['PEST_REPELLER', 'ANTIFUNGAL', 'POLLINATOR_MAGNET', 'GRASS_BARRIER', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.5,
    maxDistanceM: 1.5,
    spreadM: 0.3,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'The ultimate permaculture workhorse. Forms dense, fibrous clumps (claims that they hold back turf grass have not been measured). The popular idea that its sulfur compounds suppress apple scab (Venturia inaequalis) or black spot is unproven.',
      de: 'Das ultimative Permakultur-Arbeitstier. Bildet dichte, büschelige Horste (eine Hemmung von Rasengräsern wurde nie gemessen). Die verbreitete Annahme, seine Schwefelverbindungen hemmten Apfelschorf (Venturia inaequalis) oder Pilzkrankheiten, ist unbewiesen.'
    },
    color: '#a855f7',
    iconName: 'ShieldAlert',
    imageUrl: '/images/plants/plant-chives.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT', 'CLAY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Prefers fertile, moist loam, but adapts well to clay and chalk. Well suited to dense planting rings.',
      de: 'Bevorzugt nährstoffreichen Lehm, toleriert aber auch Ton und Kalkmergel. Gut geeignet für dichte Pflanzringe.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Spätsommer (Aug–Okt)',
      en: 'Spring (Mar–May) or late summer (Aug–Oct)'
    },
    harvestTime: {
      de: 'März bis November (kontinuierlicher Schnitt)',
      en: 'March to November (continuous cut-and-come-again)'
    },
    recommendedForTrees: [
      'tree-apple', 'tree-walnut', 'tree-peach', 'tree-apricot', 'tree-plum', 'tree-pear', 'tree-cherry', 'tree-quince', 'shrub-blackcurrant', 'vine-grape', 'herb-rhubarb', 'tree-ginkgo',
      'tree-tea-sinensis',
      'herb-hemp', 'shrub-red-currant', 'shrub-rhododendron']
  },
  {
    id: 'plant-garlic',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Hardneck Garlic',
      de: 'Winter-Knoblauch'
    },
    botanicalName: 'Allium sativum',
    layer: 'BULB_ROOT',
    roles: ['PEST_REPELLER', 'ANTIFUNGAL', 'GRASS_BARRIER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'WINTER'],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.3,
    maxDistanceM: 1.2,
    spreadM: 0.2,
    heightM: 0.5,
    perennial: false,
    notes: {
      en: 'Strong-smelling allicin and diallyl disulfide compounds; claims that they deter trunk borers or aphids are unproven. Traditionally planted in Zone 1 (0.3–1.0 m ring) without root disturbance to the tree, but suppression of apple scab or trunk pests has not been shown.',
      de: 'Stark riechende Allicin-Verbindungen; eine Abwehr von Stammbohrern oder Läusen ist unbewiesen. Traditionell im Ring um den Stammkragen gepflanzt, ohne die Baumwurzeln zu stören, eine Hemmung von Apfelschorf oder Schädlingen am Stammfuß ist jedoch nicht belegt.'
    },
    color: '#f43f5e',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-garlic.webp?v=2',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Requires loose, well-drained soil. Waterlogged, heavy clay causes fungal rot of dormant bulbs.',
      de: 'Benötigt lockeren, durchlässigen Boden. Staunässe in schwerem Ton führt zu Zwiebelfäule.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov für Winterknoblauch) oder Vorfrühling (Feb–Mär)',
      en: 'Autumn (Sep–Nov for winter garlic) or late winter (Feb–Mar)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug, wenn das Laub zur Hälfte vergilbt)',
      en: 'Mid-summer (Jul–Aug, when lower leaves yellow)'
    },
    recommendedForTrees: ['tree-apple', 'tree-peach', 'tree-apricot', 'tree-plum', 'tree-cherry', 'shrub-blackcurrant', 'herb-rhubarb', 'shrub-red-currant']
  },
  {
    id: 'plant-daffodil',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Wild Daffodil',
      de: 'Echte Narzisse / Osterglocke'
    },
    botanicalName: 'Narcissus pseudonarcissus',
    layer: 'BULB_ROOT',
    roles: ['GRASS_BARRIER', 'POLLINATOR_MAGNET', 'PEST_REPELLER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      floweringSeasons: ['EARLY_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'WINTER'], // poisonous bulbs repel burrowing voles
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.3,
    maxDistanceM: 1.2,
    spreadM: 0.2,
    heightM: 0.4,
    perennial: true,
    notes: {
      en: 'Bulbs contain toxic lycorine, and voles avoided eating them in feeding tests. Often planted shoulder-to-shoulder in Zone 1, but protection of the tree root collar from voles is unproven.',
      de: 'Enthält giftiges Lycorin; in Fraßversuchen mieden Wühlmäuse die Zwiebeln. Wird oft dicht im 1-Meter-Ring gepflanzt, ein Schutz der Baumwurzeln vor Wühlmäusen oder Rasengräsern ist jedoch unbewiesen.'
    },
    color: '#fbbf24',
    iconName: 'ShieldAlert',
    imageUrl: '/images/plants/plant-daffodil.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CHALKY', 'CLAY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Highly adaptable spring bulb. Resistant to Juglone and turf grass root pressure.',
      de: 'Sehr robuster Frühlingsblüher. Unempfindlich gegen Juglon und Rasenwurzeln.'
    },
    plantingTime: {
      de: 'Frühherbst (Sep–Nov, 10–15 cm tief als Zwiebel)',
      en: 'Early autumn (Sep–Nov, 10–15 cm deep bulbs)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: März bis Mai (Schutz- und Nektarphase)',
      en: 'Non-edible! Bloom: March to May (protective barrier and early nectar)'
    },
    recommendedForTrees: [
      'tree-apple', 'tree-walnut', 'tree-plum', 'tree-pear', 'tree-hazelnut', 'tree-cherry', 'tree-mulberry', 'vine-kiwi', 'tree-ginkgo',
      'tree-tea-sinensis', 'tree-linden', 'shrub-rhododendron']
  },
  {
    id: 'plant-nasturtium',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL', 'TROPICAL'],
    commonName: {
      en: 'Garden Nasturtium',
      de: 'Große Kapuzinerkresse'
    },
    botanicalName: 'Tropaeolum majus',
    layer: 'GROUND_COVER',
    roles: ['PEST_REPELLER', 'LIVING_MULCH', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'], // Dies with first frost and creates rich biomass blanket
      pestDeterrenceSeasons: ['SUMMER', 'AUTUMN'],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 0.9,
    heightM: 0.3,
    perennial: false,
    notes: {
      en: 'Often called an aphid trap crop, but there is no evidence that it draws aphids away from trees or that its mustard oils confuse woolly apple aphids and whiteflies. Dies down as winter mulch.',
      de: 'Gilt oft als Fangpflanze für Blattläuse, doch es gibt keinen Beleg, dass sie Läuse von Gehölzen weglockt oder ihre Senföle Schädlinge verwirren. Bildet im Herbst nahrhaften Frostmulch.'
    },
    color: '#f97316',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-nasturtium.webp',
    suitableSoils: ['SANDY', 'LOAM', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Flourishes in lean, well-drained sandy or loamy soils. Excess nitrogen in heavy clay causes lush leaf growth at the expense of flowers.',
      de: 'Gedeiht auf kargen, gut drainierten Böden. Zu viel Stickstoff in schwerem Ton hemmt die Blüte.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach den Eisheiligen als Direktsaat)',
      en: 'Spring (Apr–May after last frosts by direct seed)'
    },
    harvestTime: {
      de: 'Juni bis Oktober (Blüten, Blätter und grüne Samenknospen)',
      en: 'June to October (blossoms, peppery leaves, green seed pods)'
    },
    recommendedForTrees: [
      'tree-apple',
      'tree-peach',
      'tree-fig',
      'tree-quince',
      'tree-tea-assamica',
      'herb-hemp'
    ]
  },
  {
    id: 'plant-borage',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Borage (Starflower)',
      de: 'Borretsch'
    },
    botanicalName: 'Borago officinalis',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 2.1,
    spreadM: 0.5,
    heightM: 0.6,
    perennial: false,
    notes: {
      en: 'Prolific self-seeder and dynamic potassium accumulator. Flowers continuously refill nectar cups every 2 minutes, maintaining an irresistible pollinator magnet during high summer.',
      de: 'Versamt sich zuverlässig selbst. Füllt Nektarbecher alle 2 Minuten nach – ein unübertroffener Bienenmagnet im Hochsommer.'
    },
    color: '#3b82f6',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-borage.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Deep taproot loves loose, sandy or loamy soils. Drought-tolerant once established; dislikes stagnant water.',
      de: 'Pfahlwurzel liebt lockeren Sand oder Lehm. Sehr trockenheitsresistent; meidet Staunässe.'
    },
    plantingTime: {
      de: 'Frühjahr bis Frühsommer (Apr–Jun per Direktsaat)',
      en: 'Spring to early summer (Apr–Jun direct seed)'
    },
    harvestTime: {
      de: 'Mai bis Oktober (gurkenartige Blüten und junge Blätter)',
      en: 'May to October (star flowers and tender cucumber-flavored leaves)'
    },
    recommendedForTrees: [
      'tree-plum', 'tree-fig', 'tree-mulberry', 'shrub-blackcurrant', 'vine-grape', 'herb-rhubarb',
      'tree-tea-assamica',
      'herb-hemp', 'shrub-red-currant']
  },
  {
    id: 'plant-horseradish',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Horseradish',
      de: 'Meerrettich / Kren'
    },
    botanicalName: 'Armoracia rusticana',
    layer: 'HERBACEOUS',
    roles: ['ANTIFUNGAL', 'DYNAMIC_ACCUMULATOR', 'PEST_REPELLER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING'],
      harvestSeasons: ['AUTUMN', 'WINTER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.2,
    maxDistanceM: 2.7,
    spreadM: 0.8,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Fierce root system containing allyl isothiocyanate, a proven natural fungicide. Excellent companion for stone fruit (peach, plum) to reduce Monilia brown rot pressure.',
      de: 'Wurzeln enthalten Allylsenföl – ein nachgewiesenes natürliches Fungizid. Perfekter Begleiter für Steinobst gegen Monilia-Fruchtfäule.'
    },
    color: '#84cc16',
    iconName: 'ShieldAlert',
    imageUrl: '/images/plants/plant-horseradish.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Powerful deep root thrives in deep moisture-retentive soils and heavy clay; poor dry sand limits root development.',
      de: 'Starke Tiefwurzel gedeiht in feuchtem Ton und Lehm; trockener Sand hemmt das Wurzelwachstum.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr, schräg 5–10 cm tief)',
      en: 'Spring (Mar–Apr, planted at 45° angle 5–10 cm deep)'
    },
    harvestTime: {
      de: 'Spätherbst bis Winter (Okt–Feb, nach dem ersten Frost)',
      en: 'Late autumn to winter (Oct–Feb, after first frost)'
    },
    recommendedForTrees: ['tree-apple', 'tree-peach', 'tree-apricot', 'tree-plum', 'tree-quince']
  },
  {
    id: 'plant-lavender',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'English Lavender',
      de: 'Echter Lavendel'
    },
    botanicalName: 'Lavandula angustifolia',
    layer: 'SHRUB',
    roles: ['PEST_REPELLER', 'POLLINATOR_MAGNET', 'ANTIFUNGAL'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 0.6,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Evergreen aromatic shrub rich in linalool; claims that it repels codling moths or aphids are unproven. Plant on warm southern sun skirt. Highly sensitive to Juglone.',
      de: 'Wintergrüner, linalool-reicher Duftstrauch; eine Abwehr von Wicklern und Läusen ist unbewiesen. An sonnigen Südrändern pflanzen. Sehr empfindlich gegen Juglon.'
    },
    color: '#8b5cf6',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-lavender.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Calciphile xeriscape herb. Demands lean, sandy or chalky, free-draining alkaline soil. Rots in wet clay.',
      de: 'Kalkliebendes Trockenkraut. Zwingend auf durchlässigem, magerem Kalk- oder Sandboden. Verfault in nassem Ton.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach den Frösten)',
      en: 'Spring (Apr–May after frost)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug, kurz vor dem Aufblühen der Knospen)',
      en: 'Mid-summer (Jul–Aug, just as flower buds open)'
    },
    recommendedForTrees: ['tree-fig', 'tree-seabuckthorn-star']
  },
  {
    id: 'plant-goumi',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Goumi Berry',
      de: 'Goumi-Beere / Reichblütige Ölweide'
    },
    botanicalName: 'Elaeagnus multiflora',
    layer: 'SHRUB',
    roles: ['NITROGEN_FIXER', 'EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.8,
    maxDistanceM: 3.7,
    spreadM: 1.8,
    heightM: 1.8,
    perennial: true,
    notes: {
      en: 'Actinorhizal shrub housing Frankia bacteria that fix substantial nitrogen directly into the fruit tree feeder root zone. Produces vitamin C and lycopene-rich berries in early summer.',
      de: 'Stickstofffixierender Strauch über Frankia-Bakterien. Liefert Stickstoff direkt an die Wurzelzone des Hauptbaums und trägt vitaminreiche Beeren.'
    },
    color: '#ea580c',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-goumi.webp',
    suitableSoils: ['LOAM', 'SANDY', 'ACIDIC', 'SILT'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Actinorhizal Frankia nitrogen fixer adapted to poor, sandy, or slightly acidic soils.',
      de: 'Actinorrhiza-Stickstoffbinder, optimal angepasst an magere, sandige oder saure Böden.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug, süß-herbe rote Beeren)',
      en: 'Mid-summer (Jul–Aug, ripe red speckled berries)'
    },
    recommendedForTrees: ['tree-chestnut']
  },
  {
    id: 'plant-seabuckthorn',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Sea Buckthorn',
      de: 'Sanddorn'
    },
    botanicalName: 'Hippophae rhamnoides',
    layer: 'SHRUB',
    roles: ['NITROGEN_FIXER', 'EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['AUTUMN', 'WINTER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 2.1,
    maxDistanceM: 4.3,
    spreadM: 1.8,
    heightM: 2.4,
    perennial: true,
    notes: {
      en: 'Pioneer nitrogen-fixing shrub that handles harsh winds on the western orchard quadrant. Produces bright orange superfruit berries packed with vitamins C, E, and omega-7.',
      de: 'Pioniergehölz für windige Westlagen. Fixiert Stickstoff und liefert extrem vitaminreiche orange Beeren (Vitamin C, E, Omega-7).'
    },
    color: '#f59e0b',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-seabuckthorn.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Coastal pioneer that fixes nitrogen in pure sand or gravel. Highly drought-tolerant; hates stagnant clay.',
      de: 'Dünenschwester mit Knöllchenbakterien. Wächst in reinem Sand und Schotter; verträgt keine verdichtete Staunässe.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Okt–Nov)',
      en: 'Spring (Mar–May) or autumn (Oct–Nov)'
    },
    harvestTime: {
      de: 'Frühherbst bis Winter (Sep–Dez, nach erstem Frost)',
      en: 'Early autumn to winter (Sep–Dec, after first frost)'
    },
    recommendedForTrees: ['tree-chestnut']
  },
  {
    id: 'plant-lupine',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Wild Perennial Lupine',
      de: 'Vielblättrige Lupine'
    },
    botanicalName: 'Lupinus perennis',
    layer: 'HERBACEOUS',
    roles: ['NITROGEN_FIXER', 'POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.2,
    maxDistanceM: 2.4,
    spreadM: 0.6,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Deep taproot that pulls up phosphorus and fixes nitrogen rapidly in early summer. Tall floral spires are beloved by bumblebees. Prefers slightly acidic to neutral soils.',
      de: 'Tiefgehende Pfahlwurzel bindet Stickstoff und schließt Phosphor auf. Hohe Blütenkerzen ziehen Hummeln magisch an. Bevorzugt leicht sauren Boden.'
    },
    color: '#6366f1',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-lupine.webp',
    suitableSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Strict acidophile legume (pH 5.0–6.5). Fixes nitrogen in poor, sandy, acidic soils. Fatal chlorosis on chalk.',
      de: 'Säureliebende Leguminose (pH 5,0–6,5). Bindet Stickstoff auf saurem Sandboden. Tödliche Chlorose auf Kalk.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Spätsommer (Aug–Sep) per Aussaat',
      en: 'Spring (Mar–May) or late summer (Aug–Sep) by seed'
    },
    harvestTime: {
      de: 'Nicht essbar (Zierlupine)! Blütezeit: Mai bis Juli (Stickstoffanreicherung)',
      en: 'Non-edible (ornamental lupine)! Bloom: May to July (nitrogen enrichment)'
    },
    recommendedForTrees: ['shrub-blueberry', 'shrub-rhododendron']
  },
  {
    id: 'plant-red-currant',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Red Currant',
      de: 'Rote Johannisbeere'
    },
    botanicalName: 'Ribes rubrum',
    layer: 'SHRUB',
    roles: ['EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.8,
    maxDistanceM: 3.4,
    spreadM: 1.2,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Exceptional shade tolerance allows heavy fruiting on the cool northern canopy drip line where light-demanding crops fail. Early spring greenish-yellow racemes feed queen bumblebees (Bombus spp.) and wild mining bees (Andrena spp.) ahead of fruit tree bloom. Fully immune to Black Walnut juglone toxicity.',
      de: 'Ausgezeichnete Schattentoleranz für hohe Erträge am kühlen nördlichen Kronentrauf, wo lichthungrige Arten versagen. Frühe Blütenrispen ernähren Hummelköniginnen (Bombus spp.) und Sandbienen (Andrena spp.) noch vor der Obstbaumblüte. Vollkommen immun gegen Walnuss-Juglon.'
    },
    color: '#dc2626',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-red-currant.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Prefers cool, moist, organic-rich soil. Thrives in heavy loam and clay understorey. Juglone immune.',
      de: 'Liebt kühlen, feuchten, humosen Boden. Gedeiht prächtig im Halbschatten auf Lehm und Ton. Völlig juglonresistent.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Vorfrühling (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug, um den Johannistag)',
      en: 'Mid-summer (Jul–Aug, around St. John’s Day)'
    },
    recommendedForTrees: ['tree-walnut', 'tree-pear', 'tree-apple', 'tree-plum', 'tree-cherry', 'tree-hazelnut', 'tree-pawpaw', 'shrub-elderberry', 'tree-ginkgo', 'tree-alder', 'tree-linden']
  },
  {
    id: 'plant-elderberry',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Black Elderberry',
      de: 'Schwarzer Holunder'
    },
    botanicalName: 'Sambucus nigra',
    layer: 'SHRUB',
    roles: ['POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY', 'BIOMASS_PRODUCER', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 2.4,
    maxDistanceM: 4.3,
    spreadM: 2.1,
    heightM: 3,
    perennial: true,
    notes: {
      en: 'Tough woodland buffer shrub. Large flat flower heads attract over 60 pollinator species. Extremely high juglone tolerance makes it an essential anchor in Black Walnut guilds.',
      de: 'Robuster Pufferstrauch für den Waldrand. Große Doldenblüten ernähren über 60 Insektenarten. Hohe Juglontoleranz – unverzichtbar in Walnussgilden.'
    },
    color: '#475569',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-elderberry.webp',
    suitableSoils: ['CLAY', 'LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Native hedgerow pioneer thriving in heavy, rich, damp clay and loam soils. Fully juglone-tolerant.',
      de: 'Robuster Pionierstrauch für schwere, feuchte Ton- und Lehmböden. Vollständig immun gegen Juglon.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Blüten: Mai–Jun; Beeren: Aug–Okt',
      en: 'Blossoms: May–Jun; Berries: Aug–Oct'
    },
    recommendedForTrees: ['tree-walnut', 'tree-chestnut', 'tree-alder']
  },
  {
    id: 'plant-woodruff',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Sweet Woodruff',
      de: 'Echter Waldmeister'
    },
    botanicalName: 'Galium odoratum',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.6,
    maxDistanceM: 2.1,
    spreadM: 0.5,
    heightM: 0.2,
    perennial: true,
    notes: {
      en: 'Creeping woodland ground cover that thrives under dense shade and deciduous leaf litter. Completely juglone tolerant. Sweet coumarin scent keeps soil cool and suppresses weeds.',
      de: 'Wald-Bodendecker für dichten Schatten und Falllaub. Vollkommen juglontolerant. Cumarinduft, kühlt den Boden und unterdrückt Unkräuter.'
    },
    color: '#15803d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-woodruff.webp',
    suitableSoils: ['LOAM', 'SILT', 'CLAY', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilNotes: {
      en: 'Woodland shade carpet requiring humus-rich, moist, slightly acidic to neutral woodland soil. Juglone tolerant.',
      de: 'Waldschatten-Teppich für feuchte, humusreiche Waldböden. Gedeiht prächtig unter Walnuss und Hasel.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Sep–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Vor der Blüte im April bis Mai (aromatisches Waldmeisterkraut)',
      en: 'Before blooming in April to May'
    },
    recommendedForTrees: [
      'tree-walnut', 'tree-hazelnut', 'tree-pear', 'tree-chestnut', 'tree-mulberry', 'tree-alder', 'tree-pawpaw', 'shrub-blueberry', 'vine-kiwi', 'herb-rhubarb', 'shrub-elderberry', 'tree-ginkgo',
      'tree-tea-sinensis', 'shrub-red-currant', 'tree-linden', 'shrub-rhododendron']
  },
  {
    id: 'plant-thyme',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Creeping Wild Thyme',
      de: 'Sand-Thymian / Quendel'
    },
    botanicalName: 'Thymus serpyllum',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'PEST_REPELLER', 'POLLINATOR_MAGNET', 'ANTIFUNGAL'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 0.6,
    maxDistanceM: 1.8,
    spreadM: 0.5,
    heightM: 0.1,
    perennial: true,
    notes: {
      en: 'Dense, evergreen aromatic mat providing critical winter soil armor. Thymol terpenes repel crawling pest larvae. Highly drought resistant on southern solar skirt.',
      de: 'Dichter, wintergrüner Duftteppich für ganzjährigen Bodenschutz. Thymol wehrt schädliche Insektenlarven ab. Äußerst trockenheitsresistent am Südrand.'
    },
    color: '#9333ea',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-thyme.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Evergreen xeriscape carpet. Thrives in dry, stony, sandy, and calcareous soils. Saturated winter clay causes rot.',
      de: 'Wintergrüner Trockenrasen. Liebt karge, steinige, sandige und kalkhaltige Böden. Meidet nasse Tonböden.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach den letzten Frösten)',
      en: 'Spring (Apr–May after frost risk)'
    },
    harvestTime: {
      de: 'Mai bis September (kontinuierliche Triebspitzenernte)',
      en: 'May to September (cut shoot tips in the morning)'
    },
    recommendedForTrees: [
      'tree-peach', 'tree-apricot', 'tree-fig', 'tree-seabuckthorn-star', 'vine-grape'
    ]
  },
  {
    id: 'plant-sage',
    climateZones: ['TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Common Sage',
      de: 'Echter Salbei'
    },
    botanicalName: 'Salvia officinalis',
    layer: 'HERBACEOUS',
    roles: ['ANTIFUNGAL', 'PEST_REPELLER', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: ['LATE_SPRING', 'SUMMER'],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.6,
    maxDistanceM: 2.0,
    spreadM: 0.6,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Aromatic evergreen subshrub whose volatile monoterpenes (camphor, 1,8-cineole, thujone) primed grapevine defenses against Downy Mildew (Plasmopara viticola) in closed-box and extract tests; protection in the field is not yet shown. Profuse violet floral spikes provide high-value nectar for bees. Requires a sunny, dry microclimate on the southern drip line.',
      de: 'Aromatischer Halbstrauch, dessen flüchtige Monoterpene (Kampfer, Cineol, Thujon) in Box- und Extraktversuchen die Abwehr von Weinreben gegen Falschen Mehltau (Plasmopara viticola) anregten; ein Schutz im Freiland ist noch nicht belegt. Reichhaltige violette Blütenstände ernähren Hummeln und Wildbienen. Bevorzugt trockene, sonnige Standorte am Südrand.'
    },
    color: '#059669',
    iconName: 'ShieldAlert',
    imageUrl: '/images/plants/plant-sage.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Thrives in dry, warm, well-draining soils with neutral to alkaline pH. Highly intolerant of winter waterlogging and heavy cold clay.',
      de: 'Bevorzugt trockene, warme und durchlässige Böden mit neutralem bis kalkhaltigem pH-Wert. Verträgt keine winterliche Staunässe oder schweren Ton.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach Frostende)',
      en: 'Spring (Apr–May after last frost)'
    },
    harvestTime: {
      de: 'Mai bis Oktober (laufende Blatternte vor und nach der Blüte)',
      en: 'May to October (ongoing leaf harvest before and after flowering)'
    },
    recommendedForTrees: [
      'vine-grape',
      'tree-peach',
      'tree-apricot',
      'tree-fig',
      'tree-plum'
    ]
  },
  {
    id: 'plant-strawberry',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Alpine Wood Strawberry',
      de: 'Monats-Walderdbeere'
    },
    botanicalName: 'Fragaria vesca',
    layer: 'GROUND_COVER',
    roles: ['EDIBLE_UNDERSTORY', 'LIVING_MULCH', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['SUMMER', 'EARLY_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 0.6,
    maxDistanceM: 2.4,
    spreadM: 0.3,
    heightM: 0.2,
    perennial: true,
    notes: {
      en: 'Non-invasive clumping woodland strawberry providing continuous sweet berry yields from May to October. Shallow fibrous root system prevents soil drying without competing with tree taproots.',
      de: 'Horstbildende Walderdbeere mit kontinuierlichem Beerenertrag von Mai bis Oktober. Flaches Wurzelsystem schützt den Boden vor Austrocknung ohne Baumkonkurrenz.'
    },
    color: '#ef4444',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-strawberry.webp?v=2',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Prefers fertile, humus-rich, slightly acidic to neutral loam. Shallow roots appreciate steady moisture.',
      de: 'Bevorzugt lockeren, humosen, schwach sauren bis neutralen Waldboden mit gleichmäßiger Bodenfeuchte.'
    },
    plantingTime: {
      de: 'Spätsommer (Jul–Aug, ideal) oder Frühjahr (Mär–Apr)',
      en: 'Late summer (Jul–Aug, ideal) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Frühsommer bis Frühherbst (Jun–Sep je nach Sorte)',
      en: 'Early summer to early autumn (Jun–Sep depending on type)'
    },
    recommendedForTrees: ['tree-plum']
  },
  {
    id: 'plant-bugleweed',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Carpet Bugleweed',
      de: 'Kriechender Günsel'
    },
    botanicalName: 'Ajuga reptans',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'POLLINATOR_MAGNET', 'GRASS_BARRIER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.6,
    maxDistanceM: 2.1,
    spreadM: 0.6,
    heightM: 0.2,
    perennial: true,
    notes: {
      en: 'Evergreen rhizomatous mat that chokes out invasive grasses even in heavy damp shade. Beautiful blue flower spikes provide an intense nectar pulse for emerging bumblebees.',
      de: 'Wintergrüner Ausläuferteppich, der Gräser auch im feuchten Halbschatten unterdrückt. Blaue Blütenkerzen bieten Nektar für Hummeln.'
    },
    color: '#2563eb',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-bugleweed.webp',
    suitableSoils: ['CLAY', 'LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Aggressive evergreen runner forming dense soil armor in moist, heavy clay and partial shade.',
      de: 'Ausdauernder Bodendecker, der auf schwerem, feuchtem Ton und im Halbschatten dichte Teppiche bildet.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Spätsommer (Aug–Okt)',
      en: 'Spring (Mar–May) or late summer (Aug–Oct)'
    },
    harvestTime: {
      de: 'Mai bis Juni (Blüten und Blätter während der Blüte)',
      en: 'May to June (leaves and flowering spikes)'
    },
    recommendedForTrees: ['tree-hazelnut', 'tree-alder', 'shrub-elderberry']
  },
  {
    id: 'plant-crocus',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Early Spring Crocus',
      de: 'Frühlings-Krokus'
    },
    botanicalName: 'Crocus vernus',
    layer: 'BULB_ROOT',
    roles: ['POLLINATOR_MAGNET', 'GRASS_BARRIER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING'],
      floweringSeasons: ['EARLY_SPRING'],
      foliageSeasons: ['EARLY_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['WINTER', 'EARLY_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.5,
    maxDistanceM: 1.2,
    spreadM: 0.1,
    heightM: 0.1,
    perennial: true,
    notes: {
      en: 'Pivotal phenological hero: blooms in late winter/early spring to bridge the critical hunger gap for newly awakened queen bumblebees before fruit trees blossom.',
      de: 'Schlüsselfigur gegen die Frühjahrs-Hungerlücke: Blüht extrem früh und versorgt erwachende Hummelköniginnen noch vor der Obstblüte.'
    },
    color: '#7c3aed',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-crocus.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Requires fast-draining gritty loam or sand; dormant summer corms rot in saturated heavy clay.',
      de: 'Benötigt durchlässigen, kiesigen Boden; ruhende Knollen verfaulen in nassen, kalten Tonböden.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov, 6–8 cm tief)',
      en: 'Autumn (Sep–Nov, 6–8 cm deep)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Februar bis April (früheste Bienenweide)',
      en: 'Non-edible! Bloom: February to April (first crucial pollen bridge)'
    },
    recommendedForTrees: ['tree-apricot', 'tree-hazelnut']
  },
  {
    id: 'plant-snowdrop',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Common Snowdrop',
      de: 'Gemeines Schneeglöckchen'
    },
    botanicalName: 'Galanthus nivalis',
    layer: 'BULB_ROOT',
    roles: ['POLLINATOR_MAGNET', 'GRASS_BARRIER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING'],
      floweringSeasons: ['WINTER', 'EARLY_SPRING'],
      foliageSeasons: ['EARLY_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['WINTER', 'EARLY_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.3,
    maxDistanceM: 1.2,
    spreadM: 0.1,
    heightM: 0.2,
    perennial: true,
    notes: {
      en: 'The very first nectar source of the calendar year, pushing through snow in February/March. Thrives in cool shade along the northern drip line.',
      de: 'Erste Nektarquelle des Jahres, durchbricht bereits im Februar/März den Schnee. Gedeiht im kühlen Schatten am Nordrand der Traufe.'
    },
    color: '#e2e8f0',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-snowdrop.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in cool, moist, rich woodland clay and deciduous leaf mould. Desiccates in dry sand.',
      de: 'Gedeiht in kühlem, feuchtem Lehmboden und Laubhumus. Reiner Trockensand lässt die Zwiebeln austrocknen.'
    },
    plantingTime: {
      de: 'Frühherbst (Sep–Nov, 5–8 cm tief als Zwiebel)',
      en: 'Early autumn (Sep–Nov, 5–8 cm deep bulbs)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Januar bis März (Schneeglöckchen-Nektar)',
      en: 'Non-edible! Bloom: January to March (winter/spring sentinel)'
    },
    recommendedForTrees: ['tree-hazelnut', 'tree-chestnut']
  },
  {
    id: 'plant-sedum',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Autumn Stonecrop',
      de: 'Herbst-Fetthenne'
    },
    botanicalName: 'Hylotelephium spectabile',
    layer: 'GROUND_COVER',
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['AUTUMN'],
      foliageSeasons: ['SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 2.1,
    spreadM: 0.5,
    heightM: 0.5,
    perennial: true,
    notes: {
      en: 'Succulent water-storing leaves and flat late-blooming flowerheads provide essential autumn nectar until first hard frost, fueling bees before winter cluster.',
      de: 'Sukkulente Wasserspeicherblätter und späte Schirmblüten bieten überlebenswichtigen Herbstnektar bis zum ersten Frost.'
    },
    color: '#db2777',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-sedum.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Drought-tolerant succulent storing water in thick leaves. Excels in poor gravel, sand, and limestone.',
      de: 'Sukkulenter Wasserspeicher für sonnige, karge Schotter-, Sand- und Kalkmergelböden.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Jun) oder Frühherbst (Aug–Okt)',
      en: 'Spring (Apr–Jun) or early autumn (Aug–Oct)'
    },
    harvestTime: {
      de: 'Mai bis September (junge Triebspitzen als lebender Mulch/Salat)',
      en: 'May to September (young shoot tips)'
    },
    recommendedForTrees: ['tree-fig', 'tree-seabuckthorn-star']
  },
  {
    id: 'plant-aster',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'New England Aster',
      de: 'Raublatt-Aster'
    },
    botanicalName: 'Symphyotrichum novae-angliae',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['SUMMER', 'AUTUMN'],
      floweringSeasons: ['AUTUMN'],
      foliageSeasons: ['SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.5,
    maxDistanceM: 3,
    spreadM: 0.8,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Late-season powerhouse producing clouds of purple daisy blossoms right up until November. Completely immune to Juglone toxicity.',
      de: 'Spätblühendes Kraftpaket mit violetten Blüten bis in den November. Vollständig immun gegen Juglon.'
    },
    color: '#9333ea',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-aster.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in rich, moist loam and clay. Fully juglone tolerant, powering late-season honeybee nectar.',
      de: 'Gedeiht in nährstoffreichem, feuchtem Lehm und Ton. Völlig immun gegen Juglon; späte Bienenweide.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Spätsommer (Aug–Sep)',
      en: 'Spring (Apr–May) or late summer (Aug–Sep)'
    },
    harvestTime: {
      de: 'Spätsommer bis Spätherbst (Aug–Nov, späte Nektarweide)',
      en: 'Late summer to late autumn (Aug–Nov, late pollinator fuel)'
    },
    recommendedForTrees: ['tree-walnut']
  },
  {
    id: 'plant-hosta',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Plantain Lily / Hosta',
      de: 'Funkie / Hosta'
    },
    botanicalName: 'Hosta sieboldiana',
    layer: 'HERBACEOUS',
    roles: ['LIVING_MULCH', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 2.1,
    spreadM: 0.9,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Immense broad leaves cast dense shade in deep shade under walnut or dense canopy trees (weed or grass suppression has not been measured). Emerging spring shoots are a delicious edible delicacy.',
      de: 'Riesige Schmuckblätter beschatten den Boden im tiefen Schatten unter Walnussbäumen dicht (eine Unkraut- oder Grasunterdrückung wurde nie gemessen). Junge Frühjahrstriebe sind ein zartes Gemüse.'
    },
    color: '#16a34a',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-hosta.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilNotes: {
      en: 'Loves rich, moist, shaded clay and woodland loam. Fully juglone tolerant living mulch.',
      de: 'Liebt feuchten, nährstoffreichen Ton- und Waldboden im Schatten. Völlig juglontolerant.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Frühherbst (Aug–Okt)',
      en: 'Spring (Mar–May) or early autumn (Aug–Oct)'
    },
    harvestTime: {
      de: 'April bis Mai (junge gerollte Blatttriebe als Urwald-Spargel)',
      en: 'April to May (young furled spring shoots edible)'
    },
    recommendedForTrees: ['tree-walnut', 'tree-pawpaw', 'tree-linden', 'shrub-rhododendron']
  },
  {
    id: 'plant-fennel',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Bronze Fennel',
      de: 'Bronze-Fenchel'
    },
    botanicalName: 'Foeniculum vulgare',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'PEST_REPELLER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.8,
    maxDistanceM: 3,
    spreadM: 0.6,
    heightM: 1.5,
    perennial: true,
    notes: {
      en: 'Delicate umbelliferous yellow flowerheads attract hoverflies, lacewings, and parasitic braconid wasps that prey on caterpillars and aphids (orchard pest control is field-proven for mixed flower strips, not single plants). Feathery aromatic foliage.',
      de: 'Filigrane gelbe Doldenblüten ziehen Schwebfliegen, Florfliegen und Schlupfwespen an, die Raupen und Läuse fressen (im Obstbau ist eine Schädlingsbekämpfung nur für artenreiche Blühstreifen belegt, nicht für Einzelpflanzen).'
    },
    color: '#ca8a04',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-fennel.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Deep taproot thrives in warm, free-draining, fertile sandy loam and chalky soil. Attracts beneficial wasps.',
      de: 'Tiefwurzelnd in warmem, durchlässigem Sand- und Kalklehm. Zieht nützliche Schlupfwespen an.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai per Direktsaat)',
      en: 'Spring (Apr–May direct seed)'
    },
    harvestTime: {
      de: 'Kraut: Jun–Sep; Samen: Aug–Okt; Knollen: Sep–Nov',
      en: 'Herb: Jun–Sep; Seeds: Aug–Oct; Bulbs: Sep–Nov'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-linden']
  },
  {
    id: 'plant-southernwood',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Southernwood',
      de: 'Eberraute'
    },
    botanicalName: 'Artemisia abrotanum',
    layer: 'SHRUB',
    roles: ['PEST_REPELLER', 'ANTIFUNGAL'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['EARLY_SPRING'],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 1.8,
    spreadM: 0.8,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Intense lemon-camphor aromatic foliage. Traditional companion for peach, apricot, and plum trees, though claims that its scent masks trees from wood-boring beetles or codling moths are unproven.',
      de: 'Intensiv zitronig-kampferartiger Duft. Traditioneller Partner für Steinobst, eine Abwehr von Holzbohrern oder Wicklern durch Duftüberdeckung ist jedoch unbewiesen.'
    },
    color: '#15803d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-southernwood.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Woody Artemisia shrub thriving in warm, dry, well-drained sandy or limestone soils. Strong camphor scent.',
      de: 'Halbstrauch für warme, trockene Sand- und Kalkböden. Starker Kampferduft.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Frühherbst (Sep–Okt)',
      en: 'Spring (Apr–May) or early autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Mai bis September (aromatische Eberraute-Triebe)',
      en: 'May to September (aromatic shoots)'
    },
    recommendedForTrees: ['tree-peach', 'tree-apricot', 'shrub-blackcurrant', 'shrub-red-currant']
  },
  {
    id: 'plant-sweet-potato',
    climateZones: ['TEMPERATE','SUBTROPICAL','TROPICAL'],
    commonName: {
      en: 'Sweet Potato',
      de: 'Süßkartoffel'
    },
    botanicalName: 'Ipomoea batatas',
    layer: 'GROUND_COVER',
    roles: ['EDIBLE_UNDERSTORY', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['SUMMER', 'AUTUMN'],
      floweringSeasons: [],
      foliageSeasons: ['SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 1.2,
    heightM: 0.2,
    perennial: false,
    notes: {
      en: 'Vigorous trailing heat-loving vine that forms a dense weed-suppressing carpet in warm summer months while generating edible tuber yields.',
      de: 'Wuchsfreudige Schlingpflanze für warme Lagen. Bildet im Hochsommer dichte Teppiche gegen Verdunstung und liefert essbare Knollen.'
    },
    color: '#c2410c',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-sweet-potato.webp',
    suitableSoils: ['SANDY', 'LOAM', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Requires warm, loose, well-drained sandy loam for vigorous tuber expansion. Heavy clay deforms roots.',
      de: 'Braucht warmen, lockeren Sandlehm zur Knollenbildung. Schwerer, nasser Ton führt zu Knollenfäule.'
    },
    plantingTime: {
      de: 'Spätfrühling (Mai–Jun nach den Eisheiligen als Steckling)',
      en: 'Late spring (May–Jun after frost risk via slips)'
    },
    harvestTime: {
      de: 'Frühherbst (Sep–Okt vor dem ersten Frost)',
      en: 'Early autumn (Sep–Oct before first freeze)'
    },
    recommendedForTrees: [
      'tree-fig',
      'tree-tea-assamica'
    ]
  },

  // --- WINTER SUCCESSION, WINTER POLLINATORS, BIOMASS COPPICE & WINTER EDIBLE UNDERSTORY ---
  {
    id: 'plant-winter-aconite',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Winter Aconite',
      de: 'Winterling'
    },
    botanicalName: 'Eranthis hyemalis',
    layer: 'GROUND_COVER',
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['WINTER', 'EARLY_SPRING'],
      floweringSeasons: ['WINTER', 'EARLY_SPRING'],
      foliageSeasons: ['WINTER', 'EARLY_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['WINTER', 'EARLY_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.3,
    maxDistanceM: 1.2,
    spreadM: 0.2,
    heightM: 0.1,
    perennial: true,
    notes: {
      en: 'One of the earliest winter nectar sources in temperate climates. Golden cup flowers push up through snow in January and February to sustain emerging queen bumblebees before fruit tree blossom.',
      de: 'Eine der allerersten Winter-Nektarquellen. Die leuchtend gelben Schalenblüten durchbrechen im Januar/Februar oft den Schnee und retten erwachende Hummelköniginnen vor dem Verhungern.'
    },
    color: '#eab308',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-winter-aconite.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['ACIDIC'],
    soilNotes: {
      en: 'Loves moist, humus-rich woodland soils with moderate lime. Ephemeral tuber goes dormant by late spring.',
      de: 'Liebt feuchten, humosen Laubwaldboden mit mäßigem Kalkgehalt. Zieht im späten Frühjahr komplett ein.'
    },
    plantingTime: {
      de: 'Frühherbst (Sep–Nov, Knöllchen vor Pflanzung einweichen)',
      en: 'Early autumn (Sep–Nov, soak tubers before planting)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Januar bis März (Winterling-Pollenweide)',
      en: 'Non-edible! Bloom: January to March (winter pollen lifeline)'
    },
    recommendedForTrees: ['tree-apple', 'tree-apricot', 'tree-peach', 'tree-plum', 'tree-pear', 'tree-hazelnut']
  },
  {
    id: 'plant-hellebore',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Christmas Rose',
      de: 'Christrose (Schneerose)'
    },
    botanicalName: 'Helleborus niger',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH', 'PEST_REPELLER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['WINTER', 'EARLY_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['WINTER', 'EARLY_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.0,
    maxDistanceM: 2.5,
    spreadM: 0.5,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'Deep-winter blooming evergreen perennial. Pure white flowers provide vital pollen in December to February. Leathery leaves provide year-round living mulch; the plant is toxic, but claims that it deters voles and rabbits are unproven.',
      de: 'Winterblühende, immergrüne Staude. Weiße Blüten liefern von Dezember bis Februar überlebenswichtigen Pollen für Winterbienen. Ledrige Blätter schützen den Boden; die Pflanze ist giftig, eine Vertreibung von Wühlmäusen ist jedoch unbewiesen.'
    },
    color: '#f8fafc',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-hellebore.webp',
    suitableSoils: ['LOAM', 'CLAY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['ACIDIC', 'SANDY'],
    soilNotes: {
      en: 'Calciphile perennial requiring humus-rich, well-drained loam or clay. Tolerates deep canopy shade.',
      de: 'Kalkliebende Halbschattenpflanze für nährstoffreichen Lehm oder Ton. Bildet langlebige Horste.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Sep–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Dezember bis April (Christrose / Schneerose)',
      en: 'Non-edible! Bloom: December to April (winter/spring flowering)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-walnut', 'tree-hazelnut', 'tree-plum', 'tree-linden']
  },
  {
    id: 'plant-willow',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Basket Willow',
      de: 'Korbweide (Hanfweide)'
    },
    botanicalName: 'Salix viminalis',
    layer: 'SHRUB',
    roles: ['BIOMASS_PRODUCER', 'DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET', 'PEST_REPELLER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['WINTER', 'EARLY_SPRING'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['WINTER', 'EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['WINTER', 'EARLY_SPRING'],
      harvestSeasons: ['WINTER', 'EARLY_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 2.5,
    maxDistanceM: 4.5,
    spreadM: 1.5,
    heightM: 2.5,
    perennial: true,
    notes: {
      en: 'Permaculture biomass champion. Annual winter coppicing (Feb/Mar) generates abundant ramial woodchip mulch; claims that its salicylic acid strengthens nearby fruit trees against fungal pathogens are unproven.',
      de: 'Der Biomasse-Champion der Permakultur. Jährlicher Winterschnitt (Februar/März) liefert enorme Mengen Rindenmulch; dass seine Salicylsäure die Abwehrkräfte der Obstbäume gegen Schorf und Pilzkrankheiten stärkt, ist unbewiesen.'
    },
    color: '#84cc16',
    iconName: 'Scissors',
    imageUrl: '/images/plants/plant-willow.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY', 'SANDY'],
    soilNotes: {
      en: 'Thrives in heavy, moist clay or silt. Mines minerals and tolerates seasonal waterlogging.',
      de: 'Gedeiht exzellent in schwerem, feuchtem Ton und Lehm. Schließt tiefsitzende Nährstoffe auf.'
    },
    plantingTime: {
      de: 'Spätherbst bis Vorfrühling (Nov–Mär als unbewurzelte Steckhölzer)',
      en: 'Late autumn to late winter (Nov–Mar as dormant hardwood cuttings)'
    },
    harvestTime: {
      de: 'Winter bis Vorfrühling (Dez–Mär für Flechtweiden; Sommer für Chop & Drop)',
      en: 'Winter (Dec–Mar for weaving rods; summer for chop-and-drop biomass)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-chestnut', 'tree-walnut']
  },
  {
    id: 'plant-elaeagnus',
    climateZones: ['BOREAL','TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Autumn Olive / Silverberry',
      de: 'Doldige Ölweide (Winter-Silberbeere)'
    },
    botanicalName: 'Elaeagnus umbellata',
    layer: 'SHRUB',
    roles: ['NITROGEN_FIXER', 'BIOMASS_PRODUCER', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: ['WINTER', 'EARLY_SPRING', 'SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 2.5,
    maxDistanceM: 4.5,
    spreadM: 1.8,
    heightM: 2.5,
    perennial: true,
    notes: {
      en: 'Actinorhizal Frankia nitrogen fixer that cycles nitrogen even in winter. Can be coppiced in late winter or early spring for nitrogen-rich green mulch. Yields antioxidant-rich lycopene berries in late autumn and winter.',
      de: 'Actinorhizaler Frankia-Stickstoffsammler, der auch im kühlen Winter Stickstoff bindet. Spätwinter-Schnitt liefert nährstoffreichen Mulch. Trägt lycopinreiche, essbare Beeren im Spätherbst und Winter.'
    },
    color: '#065f46',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-elaeagnus.webp',
    suitableSoils: ['SANDY', 'LOAM', 'CLAY', 'CHALKY', 'ACIDIC'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Extremely rugged pioneer shrub. Fixes nitrogen on degraded, sandy, or rocky soils.',
      de: 'Extrem robuste Pionierpflanze. Verbessert karge Sand- oder Kiesböden durch intensive Stickstofffixierung.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Herbst (Sep–Nov, essbare vitaminreiche Ölweidenfrüchte)',
      en: 'Autumn (Sep–Nov, nutrient-dense silverberries)'
    },
    recommendedForTrees: ['tree-apple', 'tree-apricot', 'tree-peach', 'tree-pear', 'tree-plum', 'tree-chestnut']
  },
  {
    id: 'plant-miners-lettuce',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: "Miner's Lettuce",
      de: 'Winterportulak (Tellerkraut)'
    },
    botanicalName: 'Claytonia perfoliata',
    layer: 'GROUND_COVER',
    roles: ['EDIBLE_UNDERSTORY', 'LIVING_MULCH', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['AUTUMN', 'WINTER', 'EARLY_SPRING'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['AUTUMN', 'WINTER', 'EARLY_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['SUMMER', 'AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['WINTER', 'EARLY_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.8,
    maxDistanceM: 2.5,
    spreadM: 0.3,
    heightM: 0.15,
    perennial: false,
    notes: {
      en: 'Cold-hardy winter salad champion (-20°C). Germinates in cool autumn and creates a lush, juicy, vitamin-C-rich green carpet under dormant fruit trees all winter long. Self-seeds reliably without competing in summer.',
      de: 'Frostharter Wintersalat-Champion (-20 °C). Keimt im kühlen Herbst und bildet den ganzen Winter über saftige, vitamin-C-reiche Blattrosetten unter laublosen Obstbäumen. Versamt sich von selbst.'
    },
    color: '#16a34a',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-miners-lettuce.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Prefers cool, moist, slightly acidic woodland soil. Forms natural winter living mulch.',
      de: 'Bevorzugt feuchten, humosen, leicht sauren Boden. Bildet im Winter lebendigen Bodenschutz.'
    },
    plantingTime: {
      de: 'Spätsommer bis Frühherbst (Aug–Okt) oder Vorfrühling (Feb–Mär)',
      en: 'Late summer to early autumn (Aug–Oct) or late winter (Feb–Mar)'
    },
    harvestTime: {
      de: 'Spätherbst bis Vorfrühling (Nov–Apr, vitaminreiches Wintergrün)',
      en: 'Late autumn to early spring (Nov–Apr, winter salad greens)'
    },
    recommendedForTrees: ['tree-apple', 'tree-walnut', 'tree-hazelnut', 'tree-pear', 'tree-plum']
  },
  {
    id: 'plant-wild-garlic',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Wild Garlic (Ramsons)',
      de: 'Bärlauch'
    },
    botanicalName: 'Allium ursinum',
    layer: 'GROUND_COVER',
    roles: ['EDIBLE_UNDERSTORY', 'PEST_REPELLER', 'ANTIFUNGAL', 'GRASS_BARRIER', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['WINTER', 'EARLY_SPRING', 'LATE_SPRING'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['WINTER', 'EARLY_SPRING', 'LATE_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['WINTER', 'EARLY_SPRING', 'LATE_SPRING'],
      plantingSeasons: ['SUMMER', 'AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.3,
    maxDistanceM: 1.5,
    spreadM: 0.25,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'Native woodland allium that sprouts in late winter under snow. Forms dense spring carpets with white bee flowers and a gourmet spring harvest; claims of pest deterrence or protection against tree canker are unproven.',
      de: 'Einheimisches Waldzwiebelgewächs, das bereits im Spätwinter austreibt. Bildet dichte Frühjahrsteppiche mit weißen Bienenblüten und beliebtem Speisewert; eine Schädlingsabwehr oder ein Schutz vor Rindenpilzen ist unbewiesen.'
    },
    color: '#15803d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-wild-garlic.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY', 'ACIDIC'],
    soilNotes: {
      en: 'Prefers shaded, moist, nutrient-rich deciduous woodland loam. Dies down in summer as canopy closes.',
      de: 'Bevorzugt schattigen, feuchten, nährstoffreichen Laubwaldlehm. Zieht im Frühsommer komplett ein.'
    },
    plantingTime: {
      de: 'Spätsommer bis Herbst (Aug–Nov als Zwiebeln) oder Vorfrühling',
      en: 'Late summer to autumn (Aug–Nov as dormant bulbs)'
    },
    harvestTime: {
      de: 'Vorfrühling bis Mai (Mär–Mai vor der Blüte)',
      en: 'Early spring to May (Mar–May prior to full bloom)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-plum', 'tree-hazelnut', 'tree-walnut', 'shrub-elderberry', 'tree-linden']
  },
  {
    id: 'plant-hyssop',
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Hyssop',
      de: 'Echter Ysop'
    },
    botanicalName: 'Hyssopus officinalis',
    layer: 'HERBACEOUS',
    roles: ['PEST_REPELLER', 'POLLINATOR_MAGNET', 'ANTIFUNGAL'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.5,
    maxDistanceM: 2.0,
    spreadM: 0.5,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Ancient medicinal subshrub rich in pinocamphone and camphor oils. Scientifically demonstrated in viticulture and orchards to deter flea beetles, leafhoppers, and fungal mildew spores while attracting bumblebees.',
      de: 'Aromatischer Halbstrauch reich an Pinocamphon- und Kampferölen. Wissenschaftlich bewährter Begleiter im Wein- und Obstbau zur Abwehr von Erdflöhen, Zikaden und Mehltau bei starker Bienenförderung.'
    },
    color: '#3b82f6',
    iconName: 'Bug',
    imageUrl: '/images/plants/plant-hyssop.webp',
    suitableSoils: ['CHALKY', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Demands alkaline or neutral, well-drained, warm soils. Cannot tolerate standing water or cold heavy clay.',
      de: 'Verlangt kalkhaltigen oder neutralen, durchlässigen, warmen Boden. Meidet kalten, nassen Ton.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Herbst (Sep–Okt)',
      en: 'Spring (Apr–May) or autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Juni bis September (würziges Kraut kurz vor oder während der Blüte)',
      en: 'June to September (leaves and flower shoots before full bloom)'
    },
    recommendedForTrees: ['vine-grape', 'tree-peach', 'tree-apple', 'tree-apricot', 'tree-cherry']
  },
  {
    id: 'plant-cranberry',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'American Cranberry',
      de: 'Großfrüchtige Moosbeere (Cranberry)'
    },
    botanicalName: 'Vaccinium macrocarpon',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 0.3,
    maxDistanceM: 1.5,
    spreadM: 0.6,
    heightM: 0.15,
    perennial: true,
    notes: {
      en: 'Creeping evergreen ericaceous ground cover forming a dense protective living mulch. Shares obligate acidophile ericoid mycorrhizae with blueberries, protecting shallow roots from weed competition and drying winds.',
      de: 'Immergrüner Zwergstrauch, der einen dichten lebenden Schutzmulch bildet. Teilt die ericoide Mykorrhiza mit Kulturheidelbeeren und schützt deren flache Wurzeln vor Unkraut und Austrocknung.'
    },
    color: '#991b1b',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-cranberry.webp',
    suitableSoils: ['ACIDIC', 'SANDY'],
    unsuitableSoils: ['CHALKY', 'CLAY', 'LOAM'],
    soilNotes: {
      en: 'Strict acidophile (pH 4.0–5.2) requiring moist, peaty, humus-rich sand. Rapidly develops chlorosis on chalk.',
      de: 'Streng sauerliebend (pH 4,0–5,2). Verlangt feuchten, torfigen, humosen Sandboden; chloroseanfällig auf Kalk.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) in saurem Feuchtboden',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) in acidic moist soil'
    },
    harvestTime: {
      de: 'Frühherbst bis Spätherbst (Sep–Nov)',
      en: 'Early autumn to late autumn (Sep–Nov)'
    },
    recommendedForTrees: ['shrub-blueberry', 'tree-chestnut', 'shrub-rhododendron']
  },
  {
    id: 'plant-tansy',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Common Tansy',
      de: 'Gemeiner Rainfarn'
    },
    botanicalName: 'Tanacetum vulgare',
    layer: 'HERBACEOUS',
    roles: ['PEST_REPELLER', 'DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.2,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'Potent aromatic perennial rich in beta-thujone and camphor. Its extracts affected codling moths in lab tests, but repelling fruit flies, beetles, ants, or aphids as a living plant is unproven. Strong accumulator of potassium.',
      de: 'Stark duftende Wildstaude mit hohem Thujon- und Kampfergehalt. Extrakte wirkten im Labor auf Apfelwickler, eine Vertreibung von Fruchtfliegen, Blattläusen oder Käfern durch die lebende Pflanze ist jedoch unbewiesen. Akkumuliert Kalium im Laub.'
    },
    color: '#eab308',
    iconName: 'Bug',
    imageUrl: '/images/plants/plant-tansy.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Extremely rugged and adaptable to almost any soil, tolerating heavy clay, rubble, and dry sandy banks.',
      de: 'Extrem robust und anspruchslos; gedeiht auf fast allen Böden von schwerem Ton bis Trockensand.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt)',
      en: 'Spring (Mar–May) or autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Sep für Schädlingsbrühen und Insektenschutz)',
      en: 'Mid-summer (Jul–Sep for pest-deterrent sprays and mulch)'
    },
    recommendedForTrees: ['tree-cherry', 'tree-peach', 'tree-apple', 'tree-plum', 'vine-grape']
  },
  {
    id: 'plant-hyacinth',
    commonName: {
      de: 'Garten-Hyazinthe',
      en: 'Common Hyacinth'
    },
    botanicalName: 'Hyacinthus orientalis',
    layer: 'BULB_ROOT',
    roles: ["DYNAMIC_ACCUMULATOR","POLLINATOR_MAGNET","GRASS_BARRIER","PEST_REPELLER"],
    seasonalActivity: {
      activeSeasons: ["EARLY_SPRING","LATE_SPRING"],
      floweringSeasons: ["EARLY_SPRING","LATE_SPRING"],
      foliageSeasons: ["EARLY_SPRING","LATE_SPRING"],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ["EARLY_SPRING","LATE_SPRING","WINTER"],
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['EARLY_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    climateZones: ["BOREAL","TEMPERATE","SUBTROPICAL"],
    minDistanceM: 0.3,
    maxDistanceM: 1,
    spreadM: 0.2,
    heightM: 0.3,
    perennial: true,
    notes: {
      de: 'Robuster Frühlingsblüher. Die dichten Zwiebeln enthalten spitze Calciumoxalat-Nadeln (Raphiden) und giftige Alkaloide; dass sie Wühlmäuse von Baumwurzeln fernhalten, ist jedoch unbewiesen. Bietet erwachenden Hummelköniginnen und Wildbienen im Vorfrühling eine hochkalorische Nektarquelle.',
      en: 'Hardy spring bloomer. Dense bulbs contain sharp calcium oxalate raphides and toxic alkaloids, but claims that they keep voles away from tree root collars are unproven. Supplies emerging bumblebee queens and early solitary bees with high-energy nectar.'
    },
    color: '#818cf8',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-hyacinth.webp?v=2',
    suitableSoils: ["LOAM","SANDY","SILT","CHALKY"],
    unsuitableSoils: ["CLAY"],
    soilNotes: {
      de: 'Bevorzugt lockere, humose, durchlässige Böden. Auf schweren Tonböden neigen die Zwiebeln zu Faulnis.',
      en: 'Requires loose, humus-rich, well-draining soils. Bulbs rot rapidly in waterlogged heavy clay.'
    },
    plantingTime: {
      de: 'Frühherbst (Sep–Nov, 10–12 cm tief vor Bodenfrost)',
      en: 'Early autumn (Sep–Nov, 10–12 cm deep before soil freeze)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: März bis April (Bienenweide)',
      en: 'Non-edible! Bloom: March to April (early bee nectar)'
    },
    recommendedForTrees: [
      "tree-apple",
      "tree-cherry",
      "tree-plum",
      "tree-pear",
      "tree-apricot",
      "tree-hazelnut",
      "tree-walnut",
      "tree-tea-sinensis", 'tree-linden']
  },
  {
    id: 'plant-tea-sinensis',
    commonName: {
      de: 'Chinesischer Teestrauch',
      en: 'Chinese Tea Bush'
    },
    botanicalName: 'Camellia sinensis var. sinensis',
    layer: 'SHRUB',
    roles: ["EDIBLE_UNDERSTORY","DYNAMIC_ACCUMULATOR","LIVING_MULCH"],
    seasonalActivity: {
      activeSeasons: ["LATE_SPRING","SUMMER","AUTUMN"],
      floweringSeasons: ["AUTUMN"],
      foliageSeasons: ["EARLY_SPRING","LATE_SPRING","SUMMER","AUTUMN","WINTER"],
      chopAndDropSeasons: ["LATE_SPRING","SUMMER"],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'SENSITIVE',
    climateZones: ["TEMPERATE","SUBTROPICAL","BOREAL"],
    minDistanceM: 2,
    maxDistanceM: 4,
    spreadM: 1.2,
    heightM: 1.8,
    perennial: true,
    notes: {
      de: 'Wertvoller immergrüner Strauch (Zone 3, Ost-Morgensonne / 30–50 % Kronenschatten) unter lichten Stickstoff- oder Tiefwurzler-Bäumen wie Schwarzerle oder Ginkgo. Die natürliche Beschattung durch den Hauptbaum hemmt bittere EGCG-Catechine im Teeblatt und steigert den Gehalt an wurzelsynthetisiertem L-Theanin (Umami) und Chlorophyll für erstklassigen eigenen Grün-, Weiß-, Gelb- und Oolong-Tee. Gleichzeitig akkumuliert der Strauch Polyphenole, Aluminium und Fluorid und stabilisiert durch H+-ATPase-Wurzelaktivität das saure Waldboden-Mikroklima.',
      en: 'Valuable evergreen understory shrub (Zone 3, East morning sun / 30–50% dappled canopy shade) beneath light-canopy nitrogen fixers or deep-rooted trees such as Black Alder or Ginkgo. Overstory canopy shading suppresses bitter EGCG catechin synthesis in the tea flush while boosting root-synthesized L-theanine (umami) and chlorophyll for high-grade homegrown Green, White, Yellow, and Oolong tea. Simultaneously cycles polyphenols, aluminum, and trace minerals while maintaining an acidic forest floor.'
    },
    color: '#15803d',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-tea-sinensis.webp',
    suitableSoils: ["ACIDIC","LOAM","SILT"],
    unsuitableSoils: ["CHALKY"],
    soilNotes: {
      de: 'Obligater Kalkflüchter (pH 4,5–5,8); nimmt Stickstoff bevorzugt als Ammonium (NH4+) über den GS-GOGAT-Zyklus auf und versauert die eigene Rhizosphäre aktiv.',
      en: 'Obligate calcifuge (pH 4.5–5.8); preferentially assimilates ammonium (NH4+) via the root GS-GOGAT cycle while actively acidifying its rhizosphere.'
    },
    plantingTime: {
      de: 'Frühjahr nach Spätfrösten (Apr–Mai) oder milder Herbst (Sep–Okt)',
      en: 'Spring after frosts (Apr–May) or mild autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Apr–Aug (Knospe + 1–2 Blätter im Frühjahr für Weiß-/Grün-/Gelb-/Schwarztee; 3.–5. Blatt im Sommer für Oolong; Formschnitt für sauren Mulch)',
      en: 'Apr–Aug (1 bud + 1–2 leaves in spring for White/Green/Yellow/Black tea; 3rd–5th leaf in summer for Oolong; skiffing prunings for acidic mulch)'
    },
    recommendedForTrees: [
      "tree-ginkgo",
      "shrub-elderberry",
      "tree-alder",
      "shrub-rhododendron"
    ]
  },
  {
    id: 'plant-marigold',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL', 'TROPICAL'],
    commonName: {
      en: 'French Marigold',
      de: 'Studentenblume / Tagetes'
    },
    botanicalName: 'Tagetes patula',
    layer: 'HERBACEOUS',
    roles: ['PEST_REPELLER', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.3,
    maxDistanceM: 1.5,
    spreadM: 0.3,
    heightM: 0.35,
    perennial: false,
    notes: {
      en: 'Well-known nematode cover crop. Roots exude alpha-terthienyl, and grown as a dense pre-plant or rotation crop it suppresses root-knot (Meloidogyne spp.) and lesion nematodes in annual crops; as a companion under trees this is unproven. Claims that its scent masks trees from whiteflies and aphids are also unproven; blooms attract syrphid flies until autumn frosts.',
      de: 'Bekannte Nematoden-Vorkultur. Die Wurzeln scheiden alpha-Terthienyl aus; als dichte Vor- oder Zwischenfrucht senkt sie in einjährigen Kulturen Wurzelgallenälchen (Meloidogyne spp.) und andere Nematoden, als Unterpflanzung von Bäumen ist das unbewiesen. Eine Duftmaskierung gegen Schädlinge ist ebenfalls unbewiesen; nektarreiche Blüten nähren Schwebfliegen bis zu den ersten Frösten.'
    },
    color: '#f59e0b',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-marigold.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Thrives in any sunny, well-draining garden soil. Excellent pioneer companion for fruit tree basins.',
      de: 'Gedeiht in jedem durchlässigen, sonnigen Gartenboden. Hervorragender Pionierpartner in der Baumscheibe.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach den Eisheiligen als Aussaat oder Setzling)',
      en: 'Spring (Apr–May after last frosts as seeds or transplants)'
    },
    harvestTime: {
      de: 'Juni bis Oktober (durchgehende Blütezeit & Schwebfliegen-Nektar)',
      en: 'June to October (continuous flowering & hoverfly nectar)'
    },
    recommendedForTrees: [
      'tree-fig',
      'tree-peach',
      'tree-apricot',
      'tree-plum',
      'tree-apple',
      'tree-quince'
    ]
  },
  {
    id: 'plant-hemp',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Industrial Hemp',
      de: 'Nutzhanf'
    },
    botanicalName: 'Cannabis sativa',
    layer: 'HERBACEOUS',
    roles: [
      'BIOMASS_PRODUCER',
      'DYNAMIC_ACCUMULATOR',
      'PEST_REPELLER',
      'GRASS_BARRIER',
      'POLLINATOR_MAGNET',
      'EDIBLE_UNDERSTORY'
    ],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: ['SUMMER', 'AUTUMN'],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.8,
    maxDistanceM: 4.5,
    spreadM: 0.7,
    heightM: 2.8,
    perennial: false,
    notes: {
      en: 'Vigorous annual taproot pioneer and ultimate dynamic accumulator. Penetrates up to 2.5 m deep to fracture compacted subsoil, cycling subsoil silica, calcium, and potassium. Dense foliage suppresses 95%+ of weeds and couch grass. Male plants produce vital late-summer pollen during the seasonal bee pollen dearth. Immense biomass producer for carbon-rich chop and drop.',
      de: 'Wüchsige einjährige Pionierpflanze und erstklassiger dynamischer Akkumulator. Bricht mit bis zu 2,5 m tiefer Pfahlwurzel Pflugsohlen und verdichtete Unterböden auf, mobilisiert Kieselsäure, Calcium und Kalium. Dichtes Kronendach unterdrückt 95 %+ aller Wurzelunkräuter und Quecken. Männliche Blüten liefern essenziellen Pollen im Spätsommer (Pollenlücke). Gewaltiger Biomasse-Lieferant für lignocellulosereichen Chop & Drop.'
    },
    color: '#15803d',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-hemp.webp',
    suitableSoils: ['LOAM', 'SILT', 'SANDY', 'CHALKY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Requires deep, loose loam or silt with good drainage (pH 6.0–7.5). Avoid heavy waterlogged clay (causes seedling rot) and strongly acidic soils.',
      de: 'Bevorzugt tiefgründige, lockere Lehm- und Lössböden (pH 6,0–7,5). Meidet staunasse, verdichtete Tonböden und stark saure Standorte.'
    },
    plantingTime: {
      de: 'Mitte April bis Ende Mai (Bodentemperatur ≥ 10 °C nach Nachtfrösten)',
      en: 'Mid-April to late May (soil temp ≥ 10 °C after frosts)'
    },
    harvestTime: {
      de: 'September bis Oktober (Samenreife & Faserernte)',
      en: 'September to October (seed maturity & fiber harvest)'
    },
    recommendedForTrees: [
      'tree-apple',
      'tree-pear',
      'tree-plum',
      'tree-cherry',
      'tree-peach',
      'tree-fig',
      'tree-walnut',
      'vine-grape',
      'herb-hemp'
    ]
  },
  // --- FURTHER COMPANIONS ---
  {
    id: 'plant-rosemary',
    climateZones: ['TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Rosemary',
      de: 'Echter Rosmarin'
    },
    botanicalName: 'Salvia rosmarinus',
    layer: 'SHRUB',
    roles: ['PEST_REPELLER', 'POLLINATOR_MAGNET', 'ANTIFUNGAL', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.5,
    maxDistanceM: 4.5,
    spreadM: 1.0,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Evergreen Mediterranean shrub whose essential oil features a synergistic blend of 1,8-cineole, camphor, and alpha-pinene. Such aromatic "push" plants reduced tea geometrid moths in tea fields, but masking fruit trees from tortricid moths and aphids is unproven; it reliably supplies critical early-spring nectar to queen bumblebees.',
      de: 'Immergrüner mediterraner Halbstrauch, dessen ätherisches Öl durch Synergie von 1,8-Cineol, Kampfer und alpha-Pinen auffällt. Solche Duft-"Push"-Pflanzen senkten im Teeanbau den Befall mit Tee-Spannern, eine Überdeckung von Obstbaumgerüchen gegen Wickler und Blattläuse ist jedoch unbewiesen; die Pflanze sichert frühes Nektarangebot für Hummelköniginnen.'
    },
    color: '#3b82f6',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-rosemary.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Demands free-draining, warm, calcareous or sandy soil. Sensitive to winter waterlogging in heavy clay.',
      de: 'Benötigt durchlässige, warme, kalkhaltige oder sandige Böden. Empfindlich gegen winterliche Staunässe in schwerem Ton.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) nach den letzten starken Frösten',
      en: 'Spring (Apr–May) after severe frosts'
    },
    harvestTime: {
      de: 'Ganzjährig (Triebspitzen vor und nach der Blüte)',
      en: 'Year-round (shoot tips before and after bloom)'
    },
    recommendedForTrees: [
      'tree-fig',
      'tree-peach',
      'tree-apricot',
      'vine-grape',
      'tree-plum',
      'tree-cherry',
      'tree-apple'
    ]
  },
  {
    id: 'plant-lemon-balm',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Lemon Balm',
      de: 'Zitronenmelisse'
    },
    botanicalName: 'Melissa officinalis',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'PEST_REPELLER', 'LIVING_MULCH', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 0.7,
    perennial: true,
    notes: {
      en: 'Foliage emits a volatile bouquet dominated by citral (geranial and neral), geraniol, and citronellal—compounds that chemically mimic the honeybee (Apis mellifera) Nasonov orientation pheromone. Draws pollinating bees into the guild to improve fruit set, particularly on European Pear trees whose low-sugar blossom nectar is frequently bypassed.',
      de: 'Laub verdunstet ein Terpenbouquet aus Citral (Geranial und Neral), Geraniol und Citronellal, das chemisch das Nasonov-Orientierungspheromon der Honigbiene imitiert. Zieht Bestäuber gezielt in die Gilde – essenziell für Birnbäume, deren zuckerarmer Blütennektar sonst oft ignoriert wird.'
    },
    color: '#84cc16',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-lemon-balm.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SANDY', 'SILT'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Highly adaptable to sun or partial shade in moist, humus-rich garden soils.',
      de: 'Äußerst anpassungsfähig in Sonne und Halbschatten auf frischen, humosen Gartenböden.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) durch Teilung oder Aussaat',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) by division or seed'
    },
    harvestTime: {
      de: 'Mai bis September (laufender Blattschnitt vor der Blüte)',
      en: 'May to September (continuous leaf harvest before flowering)'
    },
    recommendedForTrees: [
      'tree-pear',
      'tree-apple',
      'tree-cherry',
      'tree-plum',
      'tree-peach',
      'tree-apricot',
      'tree-quince'
    ]
  },
  {
    id: 'plant-sweet-cicely',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Sweet Cicely',
      de: 'Süßdolde'
    },
    botanicalName: 'Myrrhis odorata',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR', 'EDIBLE_UNDERSTORY', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER'],
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.9,
    maxDistanceM: 3.2,
    spreadM: 0.8,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'Shade-tolerant perennial umbellifer rich in trans-anethole. One of the earliest-blooming Apiaceae in spring, providing critical early nectar to hoverflies and parasitoid wasps right as fruit tree pests emerge. Deep taproot mines subsoil minerals.',
      de: 'Schattentoleranter, mehrjähriger Doldenblütler mit hohem trans-Anethol-Gehalt. Blüht als einer der ersten Doldenblütler im Frühjahr und versorgt Schwebfliegen sowie Schlupfwespen genau zum Schlupfzeitpunkt früher Obstbaumschädlinge. Tiefe Pfahlwurzel.'
    },
    color: '#a3e635',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-sweet-cicely.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in cool, moist, humus-rich woodland loam and partial shade.',
      de: 'Gedeiht optimal in kühlen, frischen, humosen Waldböden und im Halbschatten.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov) als Kaltkeimer-Saat oder Wurzelstockteilung',
      en: 'Autumn (Sep–Nov) as cold-stratified seed or crown division'
    },
    harvestTime: {
      de: 'April bis Juli (junge Anisblätter und grüne Samen)',
      en: 'April to July (anise-scented leaves and green seeds)'
    },
    recommendedForTrees: [
      'tree-apple',
      'tree-pear',
      'tree-plum',
      'tree-quince',
      'tree-cherry',
      'tree-walnut'
    ]
  },
  {
    id: 'plant-dandelion',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Common Dandelion',
      de: 'Gewöhnlicher Löwenzahn'
    },
    botanicalName: 'Taraxacum officinale',
    layer: 'HERBACEOUS',
    roles: ['DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['LATE_SPRING', 'SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.5,
    maxDistanceM: 3.0,
    spreadM: 0.35,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'Deep-taproot pioneer and dynamic accumulator that fractures subsoil compaction pans and cycles subsoil calcium, potassium, and iron into the topsoil. Provides an essential early-spring nectar and pollen reservoir for emerging solitary orchard bees (Osmia, Andrena) and queen bumblebees prior to fruit tree bloom.',
      de: 'Tiefwurzelnder Pionier und dynamischer Akkumulator, der Bodenverdichtungen aufbricht und Calcium, Kalium sowie Eisen in den Oberboden transportiert. Bildet eine essenzielle Vorfrühlings-Nektar- und Pollenbrücke für Mauerbienen (Osmia), Sandbienen und Hummelköniginnen vor der Obstbaumblüte.'
    },
    color: '#eab308',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-dandelion.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SANDY', 'CHALKY', 'SILT', 'ACIDIC'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Universal pioneer adapting to all soils; especially valuable for aerating heavy clay.',
      de: 'Universelle Pionierpflanze für alle Böden; besonders wertvoll zur biologischen Lockerung schwerer Tonböden.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Spätsommer (Aug–Sep)',
      en: 'Spring (Mar–May) or late summer (Aug–Sep)'
    },
    harvestTime: {
      de: 'März bis Mai (junge Bitterstoff-Rosettenblätter und Blüten)',
      en: 'March to May (young bitter leaves and spring blooms)'
    },
    recommendedForTrees: [
      'tree-apple',
      'tree-pear',
      'tree-cherry',
      'tree-chestnut',
      'tree-hazelnut',
      'tree-walnut'
    ]
  },
  {
    id: 'plant-chamomile',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'German Chamomile',
      de: 'Echte Kamille'
    },
    botanicalName: 'Matricaria chamomilla',
    layer: 'HERBACEOUS',
    roles: ['ANTIFUNGAL', 'POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.6,
    maxDistanceM: 2.5,
    spreadM: 0.3,
    heightM: 0.5,
    perennial: false,
    notes: {
      en: 'Self-seeding annual rich in alpha-bisabolol and matricin (chamazulene). Secretes fungistatic root exudates that suppress soilborne damping-off and Phytophthora while accumulating calcium, potassium, and sulfur.',
      de: 'Selbstaussäende Heilpflanze, reich an alpha-Bisabolol und Matricin (Chamazulen). Scheidet fungistatische Wurzelexsudate gegen bodenbürtige Schadpilze aus und reichert Calcium, Kalium sowie Schwefel im Oberboden an.'
    },
    color: '#fde047',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-chamomile.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CLAY'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Prefers open, sunny, neutral to slightly acidic loam or sandy-loam soils.',
      de: 'Bevorzugt sonnige, offene, neutrale bis schwach saure Lehm- und Sandböden.'
    },
    plantingTime: {
      de: 'März bis Mai oder September (Lichtkeimer – Samen nur andrücken)',
      en: 'March to May or September (light germinator – press seeds onto surface)'
    },
    harvestTime: {
      de: 'Juni bis August (Blütenköpfe bei voller Öffnung)',
      en: 'June to August (flower heads at full bloom)'
    },
    recommendedForTrees: [
      'tree-apple',
      'tree-peach',
      'tree-apricot',
      'vine-grape',
      'tree-plum',
      'tree-cherry', 'shrub-red-currant', 'shrub-rhododendron']
  },
  {
    id: 'plant-oregano',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Wild Oregano / Marjoram',
      de: 'Echter Dost / Wilder Majoran'
    },
    botanicalName: 'Origanum vulgare',
    layer: 'GROUND_COVER',
    roles: ['PEST_REPELLER', 'ANTIFUNGAL', 'LIVING_MULCH', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.7,
    maxDistanceM: 3.0,
    spreadM: 0.5,
    heightM: 0.4,
    perennial: true,
    notes: {
      en: 'Aromatic woody-based groundcover producing high concentrations of phenolic monoterpenes (carvacrol and thymol). Proven in agronomic bioassays to disrupt fungal plasma membrane permeability, inhibiting spore germination and mycelial expansion of grey mould (Botrytis cinerea) on grapevines and berry shrubs.',
      de: 'Aromatischer Halbstrauch mit hohem Gehalt an phenolischen Monoterpenen (Carvacrol und Thymol). Zerstört nachweislich die Plasmamembran von Pilzzellen und hemmt so die Sporenkeimung und das Myzelwachstum von Grauschimmel (Botrytis cinerea) an Weinreben und Beerenobst.'
    },
    color: '#c026d3',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-oregano.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Thrives in warm, dry, calcareous or gravely slopes with full solar exposure.',
      de: 'Liebt warme, trockene, kalkhaltige oder steinige Böden in voller Sonne.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) als Staude oder Lichtkeimer-Saat',
      en: 'Spring (Apr–May) as perennial division or surface-sown seed'
    },
    harvestTime: {
      de: 'Juli bis September (blühendes Kraut)',
      en: 'July to September (flowering herb tops)'
    },
    recommendedForTrees: [
      'vine-grape',
      'tree-fig',
      'tree-peach',
      'tree-apricot',
      'tree-plum',
      'tree-apple',
      'tree-seabuckthorn-star', 'shrub-red-currant']
  },
  {
    id: 'plant-catmint',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Catmint / Catnip',
      de: 'Echte Katzenminze'
    },
    botanicalName: 'Nepeta cataria',
    layer: 'HERBACEOUS',
    roles: ['PEST_REPELLER', 'POLLINATOR_MAGNET', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 0.8,
    perennial: true,
    notes: {
      en: 'Synthesizes iridoid nepetalactone isomers that selectively activate the insect chemical irritant receptor TRPA1, repelling flea beetles, mosquitoes, and flies. Simultaneously functions as a natural semiochemical kairomone that recruits aphid parasitoid micro-wasps (Aphidius, Praon) and predatory lacewings into the orchard canopy.',
      de: 'Bildet Iridoid-Nepetalacton, das selektiv den chemischen Schmerz-/Reizrezeptor TRPA1 von Insekten aktiviert und Erdflöhe sowie Schadfliegen abschreckt. Wirkt zugleich als natürliches Pheromon/Kairomon, das parasitische Schlupfwespen (Aphidius, Praon) und Florfliegen gezielt in den Kronenraum lockt.'
    },
    color: '#818cf8',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-catmint.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Drought-tolerant once established; prefers well-drained neutral to alkaline soils.',
      de: 'Nach Etablierung sehr trockenheitsverträglich; bevorzugt durchlässige, neutrale bis kalkhaltige Böden.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Herbst (Sep–Okt)',
      en: 'Spring (Apr–May) or autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Juni bis September (Rückschnitt nach erster Blüte fördert Nachblüte)',
      en: 'June to September (shearing after first flush triggers rebloom)'
    },
    recommendedForTrees: [
      'tree-mulberry',
      'tree-apple',
      'tree-peach',
      'tree-plum',
      'tree-cherry',
      'tree-fig', 'tree-linden']
  },
  {
    id: 'plant-creeping-jenny',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Creeping Jenny / Moneywort',
      de: 'Pfennigkraut / Münzkraut'
    },
    botanicalName: 'Lysimachia nummularia',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'GRASS_BARRIER', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.4,
    maxDistanceM: 3.5,
    spreadM: 0.8,
    heightM: 0.08,
    perennial: true,
    notes: {
      en: 'Forms a lush, prostrate evergreen mat that armors moist soils against evaporation and weeds. Classic forest-garden groundcover under Mulberry trees, forming a clean, soft cushion to catch falling ripe berries without soil bruising.',
      de: 'Bildet einen dichten, wintergrünen Teppich, der den Boden vor Austrocknung schützt. Klassischer Waldgarten-Bodendecker unter Maulbeerbäumen: Polstert herabfallende reife Früchte weich ab und schützt sie vor Erdverschmutzung.'
    },
    color: '#4ade80',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-creeping-jenny.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in moist, heavy loam or clay and partial shade; prevents surface crusting.',
      de: 'Ideal für frische bis feuchte Lehm- und Tonböden im Halbschatten; verhindert Bodenverkrustung.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) durch wurzelnde Ausläufer',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) via rooting runners'
    },
    harvestTime: {
      de: 'Mai bis Juli (Blütezeit für Öl-Bienen der Gattung Macropis)',
      en: 'May to July (bloom period supporting specialist Macropis oil-bees)'
    },
    recommendedForTrees: [
      'tree-mulberry',
      'vine-kiwi',
      'tree-hazelnut',
      'shrub-elderberry',
      'tree-alder',
      'tree-plum'
    ]
  },
  {
    id: 'plant-lovage',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Garden Lovage',
      de: 'Echter Liebstöckel / Maggikraut'
    },
    botanicalName: 'Levisticum officinale',
    layer: 'HERBACEOUS',
    roles: ['DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.5,
    maxDistanceM: 4.0,
    spreadM: 1.0,
    heightM: 2.0,
    perennial: true,
    notes: {
      en: 'Towering perennial umbellifer (up to 2 m) with a thick, deep taproot that mines subsoil potassium, magnesium, and sulfur. High-volume chop-and-drop biomass producer; yellow summer umbels host legions of parasitic ichneumonid wasps.',
      de: 'Imposanter, bis 2 m hoher Doldenblütler mit kräftiger Pfahlwurzel, die Kalium, Magnesium und Schwefel aus dem Unterboden erschließt. Liefert große Mengen Chop-and-Drop-Biomasse; gelbe Dolden ernähren unzählige Schlupfwespen.'
    },
    color: '#16a34a',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-lovage.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Loves deep, nutrient-rich, moist clay-loam; breaks up heavy soils effortlessly.',
      de: 'Liebt tiefgründige, nährstoffreiche, feuchte Lehm- und Tonböden; lockert schwere Böden nachhaltig.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Sep–Okt) als Wurzelstock',
      en: 'Spring (Mar–Apr) or autumn (Sep–Oct) by rootstock division'
    },
    harvestTime: {
      de: 'April bis Oktober (laufender Blattschnitt und Mulchernte)',
      en: 'April to October (continuous culinary leaf & biomass cuts)'
    },
    recommendedForTrees: [
      'herb-rhubarb',
      'tree-apple',
      'tree-pear',
      'tree-alder',
      'tree-quince',
      'tree-mulberry'
    ]
  },
  {
    id: 'plant-peppermint',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Peppermint',
      de: 'Pfefferminze'
    },
    botanicalName: 'Mentha x piperita',
    layer: 'GROUND_COVER',
    roles: ['PEST_REPELLER', 'LIVING_MULCH', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.6,
    maxDistanceM: 3.0,
    spreadM: 0.8,
    heightM: 0.45,
    perennial: true,
    notes: {
      en: 'Volatile menthol, menthone, and 1,8-cineole emissions disrupt olfactory host-finding in aphids, spider mites, and ants (which farm aphids). Vigorous stoloniferous living mulch that thrives in acid tea guilds and juglone-rich walnut zones.',
      de: 'Flüchtiges Menthol, Menthon und 1,8-Cineol stören die Geruchsorientierung von Blattläusen, Spinnmilben und blattlauspflegenden Ameisen. Wüchsiger, flachwurzelnder Bodendecker – ideal für saure Teegilden und juglonreiche Walnuss-Zonen.'
    },
    color: '#0d9488',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-peppermint.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Prefers moist, humus-rich, slightly acidic to neutral soils in sun or partial shade.',
      de: 'Bevorzugt frische, humose, schwach saure bis neutrale Böden in Sonne bis Halbschatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) über Wurzelausläufer',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) via stolon cuttings'
    },
    harvestTime: {
      de: 'Mai bis September (vor Blühbeginn höchster Mentholgehalt)',
      en: 'May to September (highest menthol concentration prior to bloom)'
    },
    recommendedForTrees: [
      'tree-tea-sinensis',
      'tree-tea-assamica',
      'tree-walnut',
      'tree-apple',
      'tree-pear',
      'tree-hazelnut'
    ]
  },
  {
    id: 'plant-alfalfa',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Alfalfa / Lucerne',
      de: 'Blaue Luzerne / Ewiger Klee'
    },
    botanicalName: 'Medicago sativa',
    layer: 'HERBACEOUS',
    roles: ['NITROGEN_FIXER', 'DYNAMIC_ACCUMULATOR', 'BIOMASS_PRODUCER', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.2,
    maxDistanceM: 4.0,
    spreadM: 0.6,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Deep-rooted perennial legume fixing 100–220 kg N/ha/yr in symbiosis with Sinorhizobium meliloti. Powerful taproot penetrates 3–5 m into subsoil hardpans. Epicuticular waxes contain natural 1-triacontanol, a proven plant growth regulator that stimulates shoot elongation and root development when cut foliage is applied as green mulch.',
      de: 'Tiefwurzelnde Leguminose, die in Symbiose mit Sinorhizobium meliloti 100–220 kg N/ha/Jahr bindet. Ihre 3–5 m tiefe Pfahlwurzel bricht verdichtete Unterböden auf. Die Wachsschicht enthält natürliches 1-Triacontanol, das als Wuchsregulator das Wurzel- und Triebwachstum des Hauptbaums beim Mulchen stimuliert.'
    },
    color: '#6366f1',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-alfalfa.webp',
    suitableSoils: ['LOAM', 'CHALKY', 'SANDY', 'SILT'],
    unsuitableSoils: ['ACIDIC', 'CLAY'],
    soilNotes: {
      en: 'Requires deep, well-drained neutral to calcareous soils (pH 6.5–7.8) for optimal nodulation.',
      de: 'Benötigt tiefgründige, gut dränierte, neutrale bis kalkreiche Böden (pH 6,5–7,8) für optimale Knöllchenbildung.'
    },
    plantingTime: {
      de: 'April bis Mai oder August als Direktsaat',
      en: 'April to May or August by direct seeding'
    },
    harvestTime: {
      de: 'Mai bis Oktober (3–4 proteinreiche Mulchschnitte pro Jahr)',
      en: 'May to October (3–4 high-nitrogen chop-and-drop cuts per year)'
    },
    recommendedForTrees: [
      'herb-hemp',
      'tree-apple',
      'tree-pear',
      'tree-cherry'
    ]
  },
  {
    id: 'plant-nettle',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Stinging Nettle',
      de: 'Große Brennnessel'
    },
    botanicalName: 'Urtica dioica',
    layer: 'HERBACEOUS',
    roles: ['DYNAMIC_ACCUMULATOR', 'BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.0,
    maxDistanceM: 3.5,
    spreadM: 0.8,
    heightM: 1.5,
    perennial: true,
    notes: {
      en: 'Premier dynamic accumulator of iron, silicon, nitrogen, calcium, and potassium. Serves as a vital conservation biological control nursery by hosting the specialized nettle aphid (Microlophium carnosum, which cannot feed on crops), sustaining large spring populations of predatory ladybirds, anthocorid bugs, and hoverflies that disperse onto fruit trees.',
      de: 'Herausragender dynamischer Akkumulator für Eisen, Silizium, Stickstoff, Calcium und Kalium. Dient als biologische Nützlingswiege: Beherbergt die harmlose Brennnesselblattlaus (Microlophium carnosum), an der sich Marienkäfer, Blumenwanzen und Schwebfliegen vermehren, bevor sie zur Schädlingsbekämpfung in Obstbäume übersiedeln.'
    },
    color: '#15803d',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-nettle.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in moist, nitrogen- and phosphate-rich woodland edges and heavy loams.',
      de: 'Gedeiht optimal auf frischen, nährstoff- und humusreichen Lehmböden im Halbschatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Sep–Okt) über Rhizomstücke',
      en: 'Spring (Mar–Apr) or autumn (Sep–Oct) via rhizome divisions'
    },
    harvestTime: {
      de: 'April bis September (3–4 Mulchschnitte vor der Samenreife)',
      en: 'April to September (3–4 chop-and-drop cuts prior to seed set)'
    },
    recommendedForTrees: [
      'shrub-elderberry',
      'tree-walnut',
      'shrub-blackcurrant',
      'tree-apple',
      'tree-plum',
      'tree-alder', 'shrub-red-currant', 'tree-linden']
  },
  {
    id: 'plant-wintergreen',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Eastern Teaberry / Wintergreen',
      de: 'Amerikanische Scheinbeere'
    },
    botanicalName: 'Gaultheria procumbens',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'EDIBLE_UNDERSTORY', 'ANTIFUNGAL'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['AUTUMN', 'WINTER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 0.3,
    maxDistanceM: 2.0,
    spreadM: 0.4,
    heightM: 0.15,
    perennial: true,
    notes: {
      en: 'Specialized acid-loving (pH 4.0–5.5) evergreen groundcover that shares mutualistic ericoid mycorrhizae with blueberries and cranberries. Foliage produces natural methyl salicylate (oil of wintergreen), which suppresses soilborne fungal pathogens while producing edible winter berries.',
      de: 'Spezialisierter, säureliebender (pH 4,0–5,5) immergrüner Bodendecker, der eine symbiontische ericoide Mykorrhiza mit Heidelbeeren teilt. Enthält natürliches Methylsalicylat (Wintergrünöl), das bodenbürtige Pilzinfektionen hemmt, und trägt essbare rote Winterbeeren.'
    },
    color: '#dc2626',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-wintergreen.webp?v=2',
    suitableSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Strictly requires acidic, humus-rich, well-aerated sandy or peat soils (pH 4.0–5.5). Incompatible with chalk/lime.',
      de: 'Zwingend auf saure, humose, lockere Sand- oder Torfböden (pH 4,0–5,5) angewiesen. Unverträglich mit Kalk.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) mit Nadelholzhäcksel/Rhododendronerde',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) with pine bark or ericaceous compost'
    },
    harvestTime: {
      de: 'Oktober bis März (aromatische rote Winterbeeren)',
      en: 'October to March (aromatic red winter berries)'
    },
    recommendedForTrees: [
      'shrub-blueberry',
      'tree-chestnut',
      'tree-tea-sinensis',
      'shrub-rhododendron'
    ]
  },
  {
    id: 'plant-lingonberry',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Lingonberry / Cowberry',
      de: 'Preiselbeere'
    },
    botanicalName: 'Vaccinium vitis-idaea',
    layer: 'SHRUB',
    roles: ['EDIBLE_UNDERSTORY', 'LIVING_MULCH', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 0.4,
    maxDistanceM: 2.2,
    spreadM: 0.4,
    heightM: 0.25,
    perennial: true,
    notes: {
      en: 'Compact dwarf evergreen shrub forming an interwoven acidic understory with highbush blueberries. Shares ericoid mycorrhizae that enhance phosphorus and iron uptake in low-pH soils while protecting root crowns from thermal stress.',
      de: 'Kompakter immergrüner Zwergstrauch, der eine dichte säureliebende Unterschicht für Kulturheidelbeeren bildet. Teilt ericoide Mykorrhizapilze zur Phosphor- und Eisenaufnahme in sauren Böden und schützt Flachwurzeln vor Austrocknung.'
    },
    color: '#b91c1c',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-lingonberry.webp',
    suitableSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Requires acidic soil (pH 4.2–5.5) high in organic matter and pine needle/bark mulch.',
      de: 'Benötigt sauren Boden (pH 4,2–5,5) mit hohem Humusanteil und Nadelstreu/Rindenmulch.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Frühherbst (Aug–Okt)',
      en: 'Spring (Mar–Apr) or early autumn (Aug–Oct)'
    },
    harvestTime: {
      de: 'August bis Oktober (hochwertige antioxidative Beeren)',
      en: 'August to October (high-antioxidant tart berries)'
    },
    recommendedForTrees: [
      'shrub-blueberry',
      'tree-chestnut',
      'tree-tea-sinensis',
      'shrub-rhododendron'
    ]
  },
  {
    id: 'plant-cowslip',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Cowslip',
      de: 'Echte Schlüsselblume'
    },
    botanicalName: 'Primula veris',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.4,
    maxDistanceM: 2.0,
    spreadM: 0.25,
    heightM: 0.25,
    perennial: true,
    notes: {
      en: 'Golden spring bell blossoms provide essential early-season nectar and pollen for emerging queen bumblebees (Bombus hortorum) and solitary bees. Classic woodland-edge ephemeral under hazelnut, sweet chestnut, and apple canopies.',
      de: 'Goldgelbe Frühlingsblüten liefern lebenswichtigen frühen Nektar und Pollen für erwachende Hummelköniginnen und Pelzbienen. Klassischer Waldrandsaum unter Haselnuss, Esskastanie und Apfelbäumen.'
    },
    color: '#facc15',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-cowslip.webp',
    suitableSoils: ['LOAM', 'CHALKY', 'CLAY', 'SILT'],
    unsuitableSoils: ['ACIDIC'],
    soilNotes: {
      en: 'Thrives in well-drained, calcareous, base-rich loam or chalky clay in spring sun and summer shade.',
      de: 'Gedeiht auf durchlässigen, basen- und kalkreichen Lehm- oder Tonböden; verträgt Sommertrockenheit unter Laubbäumen.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov) als Kaltkeimer-Saat oder Jungpflanze',
      en: 'Autumn (Sep–Nov) as cold-stratified seed or plug plants'
    },
    harvestTime: {
      de: 'April bis Mai (Blütezeit; geschützte Wildart – nur aus eigenem Anbau)',
      en: 'April to May (bloom period; protected in wild – cultivate from nursery stock)'
    },
    recommendedForTrees: [
      'tree-hazelnut',
      'tree-apple',
      'tree-chestnut',
      'tree-pear',
      'tree-cherry',
      'tree-walnut'
    ]
  },
  {
    id: 'plant-lungwort',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Common Lungwort',
      de: 'Geflecktes Lungenkraut'
    },
    botanicalName: 'Pulmonaria officinalis',
    layer: 'GROUND_COVER',
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.5,
    maxDistanceM: 2.5,
    spreadM: 0.45,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'Early spring nectar reservoir with flowers that transition from pink to violet-blue as cell sap pH changes. Premier nectar source for hairy-footed flower bees (Anthophora plumipes). Dense bristly foliage forms a durable living shade mulch under Ginkgo, Plum, and Hazelnut.',
      de: 'Frühe Nektarquelle mit Blüten, die sich durch pH-Wert-Verschiebung im Zellsaft von Rosa zu Blau verfärben. Hauptnahrungsquelle für die Frühlings-Pelzbiene (Anthophora plumipes). Bildet dichten, rauen Blätterteppich im Halbschatten unter Ginkgo, Pflaume und Hasel.'
    },
    color: '#a855f7',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-lungwort.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Loves cool, humus-rich, moist deciduous forest loam with good water retention.',
      de: 'Bevorzugt kühle, humose, nährstoffreiche und feuchte Waldböden mit guter Wasserführung.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Sep–Okt) durch Wurzelstockteilung',
      en: 'Spring (Mar–Apr) or autumn (Sep–Oct) by rhizome division'
    },
    harvestTime: {
      de: 'März bis Mai (Hauptblüte für frühe Bestäuber)',
      en: 'March to May (prime bloom for early wild bees)'
    },
    recommendedForTrees: [
      'tree-ginkgo',
      'tree-hazelnut',
      'tree-plum',
      'tree-apple',
      'tree-pear',
      'tree-walnut', 'tree-linden']
  },
  {
    id: 'plant-epimedium',
    climateZones: ['TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: "Bishop's Hat / Barrenwort",
      de: 'Großblütige Elfenblume'
    },
    botanicalName: 'Epimedium grandiflorum',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'GRASS_BARRIER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.5,
    maxDistanceM: 2.5,
    spreadM: 0.45,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'Hardy semi-evergreen woodland groundcover originating from East Asian temperate mountain forests. Establishes a dense subterranean rhizome mat (suppression of couch grass has not been measured) without competing with tree taproots. Classic historical companion to Ginkgo biloba and Pawpaw.',
      de: 'Robuster wintergrüner Waldstauden-Bodendecker aus ostasiatischen Bergwäldern. Bildet ein dichtes Rhizomgeflecht (eine Unterdrückung von Wurzelunkräutern wurde nie gemessen), ohne mit den Tiefwurzeln von Bäumen zu konkurrieren. Historischer Begleiter von Ginkgo und Pawpaw.'
    },
    color: '#ec4899',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-epimedium.webp',
    suitableSoils: ['LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Prefers acidic to neutral, humus-rich woodland loam; handles dry shade once root system establishes.',
      de: 'Bevorzugt saure bis neutrale, humose Waldböden; nach dem Einwurzeln erstaunlich trockenheitsverträglich im Wurzelschatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Nov) als geteilte Rhizome',
      en: 'Spring (Mar–May) or autumn (Sep–Nov) via divided rhizomes'
    },
    harvestTime: {
      de: 'April bis Mai (feine elfenhafte Frühlingsblüten)',
      en: 'April to May (delicate spurred spring blooms)'
    },
    recommendedForTrees: [
      'tree-ginkgo',
      'tree-pawpaw',
      'tree-hazelnut',
      'tree-tea-sinensis',
      'tree-walnut',
      'shrub-rhododendron'
    ]
  },
  {
    id: 'plant-wild-ginger',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'European Wild Ginger / Asarabacca',
      de: 'Gewöhnliche Haselwurz'
    },
    botanicalName: 'Asarum europaeum',
    layer: 'GROUND_COVER',
    roles: ['LIVING_MULCH', 'PEST_REPELLER', 'GRASS_BARRIER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: []
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.4,
    maxDistanceM: 2.0,
    spreadM: 0.35,
    heightM: 0.12,
    perennial: true,
    notes: {
      en: 'Shade-obligate evergreen woodland groundcover rich in aristolochic acid, trans-isoasarone, and defensive phenolics; claims that this makes the foliage unpalatable to slugs and voles are unproven. Seeds bear lipid-rich elaiosomes that foster mutualistic woodland ant colonies (myrmecochory), conditioning the understory soil beneath Walnut, Hazelnut, and Pawpaw canopies.',
      de: 'Immergrüner Tiefschatten-Bodendecker mit Aristolochiasäuren und trans-Isoasaron; dass sie das Blattwerk für Nacktschnecken und Wühlmäuse ungenießbar machen, ist unbewiesen. Samen besitzen fettreiche Elaiosomen, die Waldameisen anlocken (Myrmekochorie) und den Waldboden unter Walnuss, Hasel und Pawpaw lockern.'
    },
    color: '#065f46',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-wild-ginger.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Demands moist, humus-rich, calcareous or base-rich woodland loam in deep shade.',
      de: 'Benötigt feuchte, humose, kalk- und nährstoffreiche Waldböden in tiefem Schatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Sep–Okt)',
      en: 'Spring (Mar–Apr) or autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Ganzjährig dekorativer Bodenschutz (Giftpflanze – nicht zum Verzehr)',
      en: 'Year-round evergreen soil armor (toxic – not for consumption)'
    },
    recommendedForTrees: [
      'tree-pawpaw',
      'tree-walnut',
      'tree-hazelnut',
      'tree-alder',
      'tree-ginkgo'
    ]
  },
  {
    id: 'plant-ostrich-fern',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Ostrich Fern / Fiddlehead Fern',
      de: 'Straußenfarn'
    },
    botanicalName: 'Matteuccia struthiopteris',
    layer: 'HERBACEOUS',
    roles: ['BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: [],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.8,
    maxDistanceM: 3.0,
    spreadM: 0.8,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Vigorous colonial fern 100% immune to Black Walnut juglone allelopathy (Purdue University Forestry Bulletin). Yields prized culinary fiddleheads in spring while accumulating potassium and generating abundant carbon-rich autumn frond mulch.',
      de: 'Wüchsiger Trichterfarn, der zu 100 % resistent gegen das Juglon der Schwarznuss ist (Purdue Forestry Bulletin). Liefert im Frühjahr essbare Fiddleheads (Bischofsmützen-Triebe), reichert Kalium an und erzeugt im Herbst wertvollen Farnmulch.'
    },
    color: '#047857',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-ostrich-fern.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY', 'SANDY'],
    soilNotes: {
      en: 'Requires constantly moist, organic-rich alluvial soils in cool woodland shade.',
      de: 'Erfordert dauerhaft frische bis feuchte, humusreiche Waldböden in kühlem Schatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Okt–Nov) als Wurzelstock',
      en: 'Spring (Mar–Apr) or autumn (Oct–Nov) as bare-root crowns'
    },
    harvestTime: {
      de: 'April bis Mai (eingerollte junge Fiddleheads, gekocht genießbar)',
      en: 'April to May (tightly coiled fiddleheads, cooked thoroughly)'
    },
    recommendedForTrees: [
      'tree-walnut',
      'tree-alder',
      'tree-pawpaw',
      'shrub-elderberry',
      'tree-hazelnut',
      'shrub-rhododendron'
    ]
  },
  {
    id: 'plant-sweet-flag',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Sweet Flag / Calamus',
      de: 'Echter Kalmus'
    },
    botanicalName: 'Acorus calamus',
    layer: 'HERBACEOUS',
    roles: ['PEST_REPELLER', 'DYNAMIC_ACCUMULATOR', 'GRASS_BARRIER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'Semi-aquatic and wet-ground reed herb with intensely aromatic rhizomes containing beta-asarone, which repels soil insect larvae. Completely immune to juglone; ideal biological filter in moist swales and rain catchment basins around Black Walnut and Alder guilds.',
      de: 'Sumpf- und Feuchtzonenpflanze mit intensiv würzigem Wurzelstock, dessen beta-Asaron schädliche Bodenlarven vergrämt. Vollkommen juglonresistent; idealer biologischer Wurzelpuffer in feuchten Mulden unter Walnuss- und Erlengilden.'
    },
    color: '#65a30d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-sweet-flag.webp',
    suitableSoils: ['CLAY', 'LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in waterlogged, saturated clay, silt, or pond margins; tolerates standing water up to 20 cm.',
      de: 'Gedeiht in staunassen Ton- und Schlickböden sowie feuchten Senken; verträgt zeitweise Überflutung.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Herbst (Sep–Okt) durch Rhizomteilung',
      en: 'Spring (Apr–May) or autumn (Sep–Oct) via rhizome sections'
    },
    harvestTime: {
      de: 'Oktober bis November (aromatische Rhizome im Spätherbst)',
      en: 'October to November (aromatic rhizomes dug in late autumn)'
    },
    recommendedForTrees: [
      'tree-walnut',
      'tree-alder',
      'tree-quince',
      'shrub-elderberry',
      'herb-rhubarb'
    ]
  },
  {
    id: 'plant-meadowsweet',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Meadowsweet / Queen of the Meadow',
      de: 'Echtes Mädesüß'
    },
    botanicalName: 'Filipendula ulmaria',
    layer: 'HERBACEOUS',
    roles: ['ANTIFUNGAL', 'POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: ['SUMMER'],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'ANY',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.7,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Rich in natural salicylic acid precursors, methyl salicylate, and tannins. Claims that it creates a fungistatic root environment protecting fruit tree root collars from Phytophthora are unproven; its creamy cloud-like blooms nourish syrphid flies and wild bees.',
      de: 'Reich an natürlichen Salicylsäure-Verbindungen, Methylsalicylat und Gerbstoffen. Ein Schutz der Obstbaum-Wurzelhälse vor Phytophthora durch ein fungistatisches Milieu ist unbewiesen; cremeweiße Duftblüten ernähren Schwebfliegen und Wildbienen.'
    },
    color: '#fef08a',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-meadowsweet.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilNotes: {
      en: 'Thrives in damp to wet, nutrient-rich loam or clay soils; excellent for riparian guilds.',
      de: 'Optimal für frische bis nasse, nährstoffreiche Lehm- und Tonböden in Ufernähe und Senken.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) durch Teilung',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) via root division'
    },
    harvestTime: {
      de: 'Juni bis August (duftende Blütenrispen)',
      en: 'June to August (fragrant almond-vanilla flower panicles)'
    },
    recommendedForTrees: [
      'tree-alder',
      'tree-quince',
      'shrub-blackcurrant',
      'tree-apple',
      'tree-pear',
      'tree-walnut', 'shrub-red-currant']
  },
  {
    id: 'plant-welsh-onion',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Welsh Onion / Bunching Onion',
      de: 'Winterheckenzwiebel / Lauchzwiebel'
    },
    botanicalName: 'Allium fistulosum',
    layer: 'BULB_ROOT',
    roles: ['PEST_REPELLER', 'ANTIFUNGAL', 'GRASS_BARRIER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.4,
    maxDistanceM: 1.8,
    spreadM: 0.3,
    heightM: 0.5,
    perennial: true,
    notes: {
      en: 'Perennial non-bulbing allium that maintains permanent evergreen foliage. Continuously releases volatile allicin and organosulfurs around the root collar, but claims that these disorient clearwing borers (Synanthedon spp.) or protect fruit trees from Fusarium and root rot are unproven.',
      de: 'Ausdauernde, wintergrüne Heckenzwiebel für den Wurzelhalsbereich. Verdunstet permanent flüchtiges Allicin und Schwefelverbindungen, eine Wirkung gegen Glasflügler und Bohrer oder ein Schutz der Obstbäume vor Fusarium und Wurzelfäule ist jedoch unbewiesen.'
    },
    color: '#22c55e',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-welsh-onion.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CLAY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Highly versatile in loose, humus-rich garden soils with good moisture.',
      de: 'Sehr anpassungsfähig auf lockeren, humosen Gartenböden mit gleichmäßiger Feuchte.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) durch Aussaat oder Horstteilung',
      en: 'Spring (Mar–May) by direct seed or clump division'
    },
    harvestTime: {
      de: 'Ganzjährig (fortlaufender Schnitt der aromatischen Röhrenblätter)',
      en: 'Year-round (perpetual cut of hollow allium leaves)'
    },
    recommendedForTrees: [
      'shrub-blackcurrant',
      'tree-apple',
      'tree-peach',
      'tree-plum',
      'tree-apricot',
      'tree-cherry', 'shrub-red-currant']
  },
  {
    id: 'plant-echinacea',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Purple Coneflower',
      de: 'Purpur-Sonnenhut'
    },
    botanicalName: 'Echinacea purpurea',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.5,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'Deep-rooted prairie composite that forms intensive symbioses with arbuscular mycorrhizal fungi (Rhizophagus irregularis), improving subsoil aggregate structure and drought resilience. Open disc florets provide high-sucrose nectar during the critical late-summer floral dearth for wild bees, hoverflies, and sphecid wasps.',
      de: 'Tiefwurzelnde Präriestaude, die intensive Symbiosen mit arbuskulären Mykorrhizapilzen (Rhizophagus irregularis) eingeht und die Bodenstruktur verbessert. Offene Scheibenblüten bieten während der spät-sommerlichen Trachtlücke zuckerreichen Nektar für Wildbienen, Schwebfliegen und Grabwespen.'
    },
    color: '#d946ef',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-echinacea.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Requires well-drained, sunny loam or sandy soils; dislikes winter waterlogging.',
      de: 'Verlangt sonnige, durchlässige Lehm- oder Sandböden; empfindlich gegen stauende Nässe im Winter.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt)',
      en: 'Spring (Mar–May) or autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Juli bis Oktober (lange Blühphase; Wurzeln im Spätherbst)',
      en: 'July to October (extended flowering period; roots in late autumn)'
    },
    recommendedForTrees: [
      'tree-peach',
      'tree-apricot',
      'tree-plum',
      'tree-cherry',
      'tree-fig',
      'tree-apple',
      'vine-grape'
    ]
  },
  {
    id: 'plant-wormwood',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Wormwood / Absinthe',
      de: 'Echter Wermut'
    },
    botanicalName: 'Artemisia absinthium',
    layer: 'HERBACEOUS',
    roles: ['PEST_REPELLER', 'ANTIFUNGAL'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['EARLY_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.5,
    maxDistanceM: 4.5,
    spreadM: 0.8,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Aromatic woody subshrub rich in bitter absinthin, thujone, and chamazulene. Its extracts deterred codling moths in lab tests, but protection of trees against caterpillars, sawflies, or rust fungi is unproven; traditionally planted on the prevailing windward edge of the guild.',
      de: 'Aromatischer Halbstrauch mit extrem hohem Gehalt an bitterem Absinthin, Thujon und Chamazulen. Extrakte wirkten im Labor gegen Apfelwickler, ein Schutz der Bäume vor Wicklerraupen, Blattwespen oder Rostpilzen ist jedoch unbewiesen; traditionell am windzugewandten Außenrand der Gilde platziert.'
    },
    color: '#94a3b8',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-wormwood.webp',
    suitableSoils: ['SANDY', 'LOAM', 'CHALKY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Loves dry, poor, calcareous or stony soil in full sun; highly drought-resistant.',
      de: 'Liebt trockene, magere, kalkhaltige oder steinige Böden in voller Sonne; extrem trockenheitsresistent.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) durch Aussaat oder Stecklinge',
      en: 'Spring (Apr–May) by seed or softwood cuttings'
    },
    harvestTime: {
      de: 'Juli bis September (blühende Triebspitzen)',
      en: 'July to September (flowering shoot tips)'
    },
    recommendedForTrees: [
      'shrub-blackcurrant',
      'tree-quince',
      'tree-apple',
      'tree-plum', 'shrub-red-currant']
  },
  {
    id: 'plant-rhododendron',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Rhododendron (Catawba)',
      de: 'Rhododendron / Alpenrose'
    },
    botanicalName: 'Rhododendron catawbiense',
    layer: 'SHRUB',
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH', 'GRASS_BARRIER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.5,
    maxDistanceM: 4.2,
    spreadM: 2.2,
    heightM: 2.2,
    perennial: true,
    notes: {
      en: 'Evergreen acidophilic woodland shrub (pH 4.2–5.5) with dense coriaceous foliage that provides year-round windbreak protection, microclimate humidity buffering, and weed exclusion on the cool northern/eastern drip line of acidic guilds. Its hairless fibrous roots host intracellular ericoid mycorrhizal fungi (Pezoloma ericae, Oidiodendron maius) that secrete extracellular proteases and phosphatases, forming a common mycorrhizal network with Highbush Blueberry, Lingonberry, Cranberry, and Wintergreen while fueling specialist long-tongued bumblebee queens (Bombus hortorum). Strictly non-edible (contains grayanotoxins).',
      de: 'Immergrüner, stark säureliebender (pH 4,2–5,5) Waldgarten-Strauch, dessen dichtes, ledriges Laubwerk ganzjährigen Windschutz, Mikroklima-Luftfeuchte und Unkrautunterdrückung am kühlen Nord-/Ostrand saurer Gilden bietet. Seine haarlosen Feinwurzeln beherbergen ericoide Mykorrhizapilze (Pezoloma ericae, Oidiodendron maius), die über extrazelluläre Proteasen und Phosphatasen organische Nährstoffe erschließen und ein gemeinsames Mykorrhiza-Netzwerk mit Heidelbeeren, Preiselbeeren und Scheinbeeren aufbauen. Wichtige Spätfrühlingstracht für langrüsselige Hummelköniginnen (Bombus hortorum). Giftpflanze (Grayanotoxine – nicht zum Verzehr).'
    },
    color: '#9333ea',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-rhododendron.webp',
    suitableSoils: ['ACIDIC', 'LOAM', 'SILT'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Obligate calcifuge (pH 4.2–5.5) requiring cool, humus-rich, well-aerated acidic soil and pine bark or leaf-mould mulch. Highly sensitive to Black Walnut juglone and alkaline lime.',
      de: 'Obligater Kalkflüchter (pH 4,2–5,5) für kühle, humose, gut belüftete Moorbeet- und Waldböden mit Nadelstreu- oder Rindenmulch. Stark empfindlich gegen Walnuss-Juglon und Kalk.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Frühherbst (Sep–Okt) flach in sauren Waldboden',
      en: 'Spring (Apr–May) or early autumn (Sep–Oct) planted shallowly in acidic soil'
    },
    harvestTime: {
      de: 'Nicht essbar (Giftpflanze: Grayanotoxine)! Hauptblüte für Hummeln: Mai bis Juni',
      en: 'Non-edible (toxic grayanotoxins)! Prime bumblebee bloom: May to June'
    },
    recommendedForTrees: [
      'shrub-blueberry',
      'tree-tea-sinensis',
      'tree-tea-assamica',
      'tree-chestnut',
      'tree-alder',
      'tree-ginkgo',
      'vine-kiwi'
    ]
  },
  {
    id: 'plant-alder',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Black Alder (Coppiced Nurse Tree)',
      de: 'Schwarzerle (Ammenbaum im Niederwaldschnitt)'
    },
    botanicalName: 'Alnus glutinosa',
    layer: 'SUB_CANOPY',
    roles: ['NITROGEN_FIXER', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['WINTER', 'EARLY_SPRING'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['WINTER', 'SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 3.0,
    maxDistanceM: 7.0,
    spreadM: 3.0,
    heightM: 6.0,
    perennial: true,
    notes: {
      en: 'The Black Alder star tree kept as a coppiced or pollarded nurse tree on the outer windward flank of a guild. Actinorhizal Frankia alni root nodules fix 100–150 kg N/ha/yr; fixed nitrogen reaches neighbouring trees through high-N leaf litter, summer-pollard chop & drop and shared mycorrhizal networks. Its light, dappled crown supplies the 30–50% overhead shade that lowers bitter catechins and raises L-theanine in var. sinensis tea, and the acidic, N-rich litter suits calcifuge understories. Coppice every 2–4 years (15–20 cm above the stool) or pollard at 1.8–2.0 m so the crown never over-shades the star plant.',
      de: 'Der Schwarzerlen-Leitbaum als auf den Stock gesetzter oder geschneitelter Ammenbaum an der äußeren Windseite der Gilde. Aktinorhizale Frankia-alni-Knöllchen binden 100–150 kg N/ha und Jahr; der Stickstoff erreicht Nachbargehölze über stickstoffreiches Falllaub, Sommerschnitt-Mulch und gemeinsame Mykorrhiza-Netzwerke. Die lichte Krone liefert die 30–50 % Streuschatten, die beim Chinesischen Teestrauch bittere Catechine senken und L-Theanin erhöhen; das saure, N-reiche Laub passt zu kalkfliehenden Unterpflanzungen. Alle 2–4 Jahre auf 15–20 cm über dem Stock setzen oder auf 1,8–2,0 m köpfen, damit die Krone die Star-Pflanze nie überschattet.'
    },
    color: '#15803d',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-alder.webp',
    suitableSoils: ['CLAY', 'SILT', 'LOAM', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilNotes: {
      en: 'Thrives on moist to waterlogged clay, silt and acidic peaty ground; tolerates seasonal flooding. Desiccates on dry, porous sand and chalk.',
      de: 'Gedeiht auf feuchten bis nassen Ton-, Schluff- und sauren Moorböden und verträgt zeitweise Überflutung. Vertrocknet auf durchlässigem Sand und Kalk.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Vorfrühling (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Sommerschnitt als Laubmulch (Jun–Jul); Niederwaldschnitt für Zweighäcksel im Spätwinter (Jan–Mär)',
      en: 'Summer leaf-pollard for mulch (Jun–Jul); winter coppice for ramial chipped wood (Jan–Mar)'
    },
    recommendedForTrees: ['tree-tea-sinensis', 'shrub-rhododendron', 'tree-apple', 'tree-pear']
  },
  {
    id: 'plant-nepal-alder',
    climateZones: ['SUBTROPICAL', 'TROPICAL'],
    commonName: {
      en: 'Nepalese Alder (Tea Shade Tree)',
      de: 'Nepal-Erle (Tee-Schattenbaum)'
    },
    botanicalName: 'Alnus nepalensis',
    layer: 'SUB_CANOPY',
    roles: ['NITROGEN_FIXER', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['AUTUMN', 'WINTER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['WINTER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING', 'SUMMER'],
      harvestSeasons: ['WINTER']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 3.0,
    maxDistanceM: 8.0,
    spreadM: 4.0,
    heightM: 10.0,
    perennial: true,
    notes: {
      en: 'Fast-growing actinorhizal (Frankia) pioneer of Himalayan and Yunnan montane forests and the classic N-fixing shade tree of highland tea and large-cardamom gardens. In a Yunnan field study, alders interplanted into mature var. assamica tea increased tea yield and soil microbial biomass compared with tea monoculture (Mortimer et al., 2015). Place on the sun side of the tea row and lop side branches in the cool dry season to hold canopy shade near 25–35%; loppings are a fast-decomposing, N-rich mulch. Only light frost tolerance: frost-free subtropical and tropical highland sites.',
      de: 'Schnellwüchsiger aktinorhizaler (Frankia) Pionierbaum der Bergwälder des Himalaya und Yunnans und klassischer stickstofffixierender Schattenbaum in Hochland-Teegärten und Kardamom-Kulturen. In einer Feldstudie in Yunnan steigerten in reife var.-assamica-Teegärten gepflanzte Erlen den Teeertrag und die mikrobielle Bodenbiomasse gegenüber der Tee-Monokultur (Mortimer et al., 2015). Auf der Sonnenseite der Teereihe pflanzen und Seitenäste in der kühlen Trockenzeit schneiteln, um ca. 25–35 % Kronenschatten zu halten; das Schnittgut ist schnell zersetzlicher, N-reicher Mulch. Nur leicht frosthart: frostfreie subtropische und tropische Hochlagen.'
    },
    color: '#166534',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-nepal-alder.webp',
    suitableSoils: ['ACIDIC', 'LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Colonises acidic, eroded or landslide soils on moist mountain slopes; improves soil N and organic matter. Avoid calcareous, alkaline sites.',
      de: 'Besiedelt saure, erodierte oder Rutschhang-Böden an feuchten Berghängen und reichert Stickstoff und Humus an. Kalkhaltige, alkalische Standorte meiden.'
    },
    plantingTime: {
      de: 'Zu Beginn der Monsun-/Regenzeit (Mai–Jul)',
      en: 'At the onset of the monsoon/rainy season (May–Jul)'
    },
    harvestTime: {
      de: 'Schneitelung der Seitenäste in der kühlen Trockenzeit (Dez–Feb) als Mulch',
      en: 'Lop side branches in the cool dry season (Dec–Feb) for mulch'
    },
    recommendedForTrees: ['tree-tea-assamica']
  },
  {
    id: 'plant-albizia',
    climateZones: ['SUBTROPICAL', 'TROPICAL'],
    commonName: {
      en: 'Chinese Albizia / Sau Tree (Tea Shade Tree)',
      de: 'Chinesische Albizie / Sau-Baum (Tee-Schattenbaum)'
    },
    botanicalName: 'Albizia chinensis',
    layer: 'SUB_CANOPY',
    roles: ['NITROGEN_FIXER', 'BIOMASS_PRODUCER', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['WINTER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING', 'SUMMER'],
      harvestSeasons: ['WINTER']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 3.0,
    maxDistanceM: 8.0,
    spreadM: 4.0,
    heightM: 7.0,
    perennial: true,
    notes: {
      en: 'The traditional leguminous "Sau" shade tree of Assam and NE Indian tea gardens. Rhizobium root nodules fix nitrogen, and its fine bipinnate foliage casts light, filtered shade that protects large-leaf var. assamica flushes from leaf scorch. Shed leaves, twigs and pods return organic matter to the tea soil. Tolerates frequent pruning: grown to about 7 m and cut back to about 4 m (Orwa et al., 2009). Fluffy spring flower heads feed bees. Humid tropical/subtropical monsoon climates up to 1,800 m; only light frost tolerance.',
      de: 'Der traditionelle Leguminosen-Schattenbaum („Sau-Baum“) der Teegärten in Assam und Nordostindien. Rhizobium-Knöllchen binden Luftstickstoff, und das feine doppelt gefiederte Laub wirft lichten Filterschatten, der die großen var.-assamica-Blätter vor Sonnenbrand schützt. Abgeworfene Blätter, Zweige und Hülsen führen dem Teeboden organische Substanz zu. Verträgt häufigen Rückschnitt: auf ca. 7 m wachsen lassen und auf ca. 4 m zurückschneiden (Orwa et al., 2009). Die flauschigen Frühjahrsblüten sind Bienenweide. Feuchte tropische/subtropische Monsunklimate bis 1.800 m; nur leicht frosthart.'
    },
    color: '#65a30d',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-albizia.webp',
    suitableSoils: ['ACIDIC', 'LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Grows on deep, moist, acidic tropical loams and clays with 1,000–5,000 mm annual rainfall. Not suited to calcareous or droughty soils.',
      de: 'Wächst auf tiefgründigen, feuchten, sauren tropischen Lehm- und Tonböden bei 1.000–5.000 mm Jahresniederschlag. Ungeeignet für kalkhaltige oder trockene Böden.'
    },
    plantingTime: {
      de: 'Zu Beginn der Regenzeit (Mai–Jul)',
      en: 'At the onset of the rainy season (May–Jul)'
    },
    harvestTime: {
      de: 'Rückschnitt/Schneitelung in der kühlen Trockenzeit (Dez–Feb); Blüte Mär–Mai',
      en: 'Lopping/cut-back in the cool dry season (Dec–Feb); flowering Mar–May'
    },
    recommendedForTrees: ['tree-tea-assamica']
  },
  {
    id: 'plant-linden',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Small-Leaved Linden (Pollard / Coppice)',
      de: 'Winterlinde (Kopfbaum / Niederwald)'
    },
    botanicalName: 'Tilia cordata',
    layer: 'SUB_CANOPY',
    roles: ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR', 'BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['WINTER', 'SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 3.5,
    maxDistanceM: 7.0,
    spreadM: 3.0,
    heightM: 6.0,
    perennial: true,
    notes: {
      en: 'The Small-leaved Linden star tree kept as a pollarded or coppiced hedgerow tree on the outer flank of a fruit-tree guild. Its June–July blossom bridges the nectar gap after fruit-tree bloom for honeybees, bumblebees and hoverflies; the calcium- and magnesium-rich leaf litter decomposes quickly and stimulates earthworm activity and mull humus (Reich et al., 2005). Young spring leaves are an edible salad green. Pollard at 1.8–2.5 m every 2–4 winters or cut leafy summer shoots for chop & drop. Raises topsoil pH—keep away from tea, blueberry and rhododendron guilds.',
      de: 'Der Winterlinden-Leitbaum als geköpfter oder auf den Stock gesetzter Heckenbaum am äußeren Rand einer Obstbaumgilde. Die Blüte im Juni–Juli schließt die Trachtlücke nach der Obstblüte für Honigbienen, Hummeln und Schwebfliegen; das calcium- und magnesiumreiche Laub zersetzt sich schnell und fördert Regenwürmer und Mull-Humus (Reich et al., 2005). Junge Frühjahrsblätter sind essbarer Blattsalat. Alle 2–4 Winter auf 1,8–2,5 m köpfen oder belaubte Sommertriebe als Chop & Drop schneiden. Hebt den pH-Wert im Oberboden – von Tee-, Heidelbeer- und Rhododendron-Gilden fernhalten.'
    },
    color: '#65a30d',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-linden.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Deep, fresh to moist loam, silt, clay or calcareous soils (pH 5.5–8.0). Buffers acidic topsoil through Ca-rich litter; drought on poor sand invites spider mites.',
      de: 'Tiefgründige, frische bis feuchte Lehm-, Löss-, Ton- oder Kalkböden (pH 5,5–8,0). Puffert saure Oberböden durch Ca-reiches Laub; auf trockenem Sand drohen Spinnmilben.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Salatblätter Apr–Mai; Blüten Jun–Jul; Kopfschnitt im Winter (Dez–Feb)',
      en: 'Salad leaves Apr–May; blossoms Jun–Jul; pollarding in winter (Dec–Feb)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-cherry', 'tree-plum']
  },
  {
    id: 'plant-blueberry',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Highbush Blueberry',
      de: 'Kulturheidelbeere'
    },
    botanicalName: 'Vaccinium corymbosum',
    layer: 'SHRUB',
    roles: ['EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.5,
    maxDistanceM: 3.5,
    spreadM: 1.5,
    heightM: 1.8,
    perennial: true,
    notes: {
      en: 'The Highbush Blueberry star shrub used as an edible understory in acidic guilds. Lacks root hairs and relies on ericoid mycorrhizal fungi, sharing the same low-pH, humus-rich niche and mycorrhizal partners as Rhododendron, Lingonberry and Wintergreen. Its bell-shaped late-spring flowers are buzz-pollinated by bumblebees, and the summer berries add a high-value yield on the bright eastern drip line. Mulch 8–10 cm with pine bark or needles; never lime.',
      de: 'Der Kulturheidelbeer-Star als essbarer Unterwuchs in sauren Gilden. Besitzt keine Wurzelhaare und lebt mit ericoiden Mykorrhizapilzen – dieselbe saure, humusreiche Nische und dieselben Mykorrhiza-Partner wie Rhododendron, Preiselbeere und Scheinbeere. Die glockenförmigen Blüten im Spätfrühling werden von Hummeln durch Vibrationsbestäubung besucht, die Sommerbeeren liefern einen wertvollen Ertrag an der hellen östlichen Traufkante. 8–10 cm mit Kiefernrinde oder Nadelstreu mulchen; niemals kalken.'
    },
    color: '#2563eb',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-blueberry.webp?v=2',
    suitableSoils: ['ACIDIC', 'SANDY'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Strict acidophile (pH 4.2–5.2) needing high organic matter and steady moisture. Iron chlorosis above pH 5.2; lethal on chalk. Juglone-sensitive.',
      de: 'Streng säureliebend (pH 4,2–5,2), braucht viel Humus und gleichmäßige Feuchte. Eisenchlorose über pH 5,2; auf Kalk nicht lebensfähig. Juglonempfindlich.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Mai) in saures Substrat',
      en: 'Autumn (Oct–Nov) or spring (Mar–May) in acidic soil'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug)',
      en: 'Mid-summer (Jul–Aug)'
    },
    recommendedForTrees: ['shrub-rhododendron', 'tree-chestnut']
  },
  {
    id: 'plant-blackcurrant',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Blackcurrant',
      de: 'Schwarze Johannisbeere'
    },
    botanicalName: 'Ribes nigrum',
    layer: 'SHRUB',
    roles: ['EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.8,
    maxDistanceM: 3.4,
    spreadM: 1.5,
    heightM: 1.5,
    perennial: true,
    notes: {
      en: 'The Blackcurrant star shrub used as a shade-tolerant edible understory on the cool northern drip line of taller fruit and nut trees, where light-hungry crops fail. Early-spring flowers are an important forage source for queen bumblebees and solitary bees, and the vitamin C-rich berries ripen in July–August. Prefers the same cool, moist, humus-rich soils as Black Alder and Linden guilds.',
      de: 'Der Schwarze-Johannisbeer-Star als schattenverträglicher essbarer Unterwuchs an der kühlen nördlichen Traufkante höherer Obst- und Nussbäume, wo lichthungrige Arten versagen. Die frühen Blüten sind wichtige Nahrung für Hummelköniginnen und Wildbienen, die Vitamin-C-reichen Beeren reifen im Juli–August. Liebt dieselben kühlen, feuchten, humosen Böden wie Schwarzerlen- und Lindengilden.'
    },
    color: '#312e81',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-blackcurrant.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Cool, moist, rich clay or fertile loam. Dry sandy soils promote mildew and fruit drop.',
      de: 'Kühler, feuchter, nährstoffreicher Ton- oder Lehmboden. Trockene Sandböden fördern Mehltau und Beerenabwurf.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug)',
      en: 'Mid-summer (Jul–Aug)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-plum', 'tree-hazelnut', 'tree-alder', 'tree-linden']
  },
  {
    id: 'plant-rhubarb',
    climateZones: ['BOREAL', 'TEMPERATE'],
    commonName: {
      en: 'Garden Rhubarb',
      de: 'Gemeiner Rhabarber'
    },
    botanicalName: 'Rheum rhabarbarum',
    layer: 'HERBACEOUS',
    roles: ['EDIBLE_UNDERSTORY', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.2,
    maxDistanceM: 3.5,
    spreadM: 1.2,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'The Garden Rhubarb star used as a long-lived, shade-tolerant edible understory perennial on the cool drip line of fruit trees. Its huge leaves shade out weeds, and after the stalk harvest ends (late June) the leaf blades can be cut and laid as mulch in place. Leaf blades are high in oxalic acid—do not eat them. As a heavy feeder it benefits from N-rich alder litter and comfrey mulch.',
      de: 'Der Rhabarber-Star als langlebige, schattenverträgliche essbare Staude an der kühlen Traufkante von Obstbäumen. Die riesigen Blätter beschatten Unkraut; nach dem Ernteende (Ende Juni) können die Blattspreiten abgeschnitten und direkt als Mulch ausgelegt werden. Blattspreiten sind oxalsäurereich – nicht verzehren. Als Starkzehrer profitiert er von stickstoffreichem Erlenlaub und Beinwell-Mulch.'
    },
    color: '#be123c',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-rhubarb.webp?v=2',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Heavy feeder needing deep, fertile, moisture-retentive loam or clay rich in compost. Crown rot on waterlogged spots; early dormancy on dry sand. Juglone-sensitive.',
      de: 'Starkzehrer für tiefgründigen, fruchtbaren, feuchten Lehm- oder Tonboden mit viel Kompost. Wurzelhalsfäule bei Staunässe; auf trockenem Sand frühe Ruhephase. Juglonempfindlich.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Okt–Nov) als Wurzelstock',
      en: 'Spring (Mar–Apr) or autumn (Oct–Nov) as crowns'
    },
    harvestTime: {
      de: 'Stiele Apr–24. Jun; danach Blätter als Mulch',
      en: 'Stalks Apr–Jun 24; afterwards leaves as mulch'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-alder', 'tree-linden']
  },
  {
    id: 'plant-sweet-alyssum',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Sweet Alyssum',
      de: 'Duftsteinrich'
    },
    botanicalName: 'Lobularia maritima',
    layer: 'GROUND_COVER',
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.0,
    maxDistanceM: 4.0,
    spreadM: 0.3,
    heightM: 0.2,
    perennial: false,
    notes: {
      en: 'Low, honey-scented annual that flowers from May until frost. Its tiny open flowers feed spiders, predatory bugs and parasitoid wasps. In Washington State field trials, apple trees next to alyssum had fewer woolly apple aphids within a week, and marked predators were shown moving from the flowers into the trees (Gontijo et al. 2013). Sow it along the drip line; it self-seeds lightly.',
      de: 'Niedrige, nach Honig duftende Einjährige, die von Mai bis zum Frost blüht. Die kleinen offenen Blüten ernähren Spinnen, Raubwanzen und Schlupfwespen. In Feldversuchen im US-Bundesstaat Washington hatten Apfelbäume neben Duftsteinrich schon nach einer Woche weniger Blutläuse; markierte Räuber wanderten nachweislich von den Blüten in die Bäume (Gontijo et al. 2013). An der Traufkante aussäen; sät sich schwach selbst aus.'
    },
    color: '#f5f5f4',
    iconName: 'Flower',
    imageUrl: '/images/plants/plant-sweet-alyssum.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Prefers well-drained, moderately fertile soil in full sun; rots in waterlogged clay.',
      de: 'Bevorzugt durchlässigen, mäßig nährstoffreichen Boden in voller Sonne; fault in nassem Ton.'
    },
    plantingTime: {
      de: 'Direktsaat Apr–Mai (Lichtkeimer, nur andrücken)',
      en: 'Direct sow Apr–May (needs light to germinate, press in only)'
    },
    harvestTime: {
      de: 'Blüte Mai bis Frost',
      en: 'Flowers May until frost'
    },
    recommendedForTrees: ['tree-apple']
  },
  {
    id: 'plant-wild-carrot',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Wild Carrot',
      de: 'Wilde Möhre'
    },
    botanicalName: 'Daucus carota',
    layer: 'HERBACEOUS',
    roles: ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 2.0,
    maxDistanceM: 6.0,
    spreadM: 0.4,
    heightM: 0.8,
    perennial: false,
    notes: {
      en: 'Native biennial umbellifer and a core species of the perennial flower strips tested in 23 organic apple orchard blocks across Europe, where the strips lowered codling moth numbers and slowed the rise in fruit damage (Cahenzli et al. 2019). Its open umbels feed the codling moth parasitoid Ascogaster quadridentata, whose survival more than doubles on wild carrot flowers in the lab (Mátray & Herz 2022). Sow as part of a native mix in the alley; it self-seeds.',
      de: 'Heimischer, zweijähriger Doldenblütler und Kernart der mehrjährigen Blühstreifen, die in 23 Bio-Apfelanlagen in ganz Europa getestet wurden: Die Streifen senkten die Apfelwickler-Zahlen und bremsten den Anstieg der Fruchtschäden (Cahenzli et al. 2019). Die offenen Dolden ernähren die Wickler-Schlupfwespe Ascogaster quadridentata, deren Lebensdauer sich im Labor mit Möhrenblüten mehr als verdoppelt (Mátray & Herz 2022). Als Teil einer heimischen Mischung in der Fahrgasse aussäen; sät sich selbst aus.'
    },
    color: '#fafaf9',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-wild-carrot.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['ACIDIC'],
    soilNotes: {
      en: 'Thrives on lean, dry, sunny and often calcareous ground; the deep taproot tolerates drought. Out-competed on rich, wet soils.',
      de: 'Gedeiht auf mageren, trockenen, sonnigen und oft kalkhaltigen Böden; die tiefe Pfahlwurzel verträgt Trockenheit. Auf nährstoffreichen, nassen Böden wird sie verdrängt.'
    },
    plantingTime: {
      de: 'Aussaat Sep–Okt oder Mär–Apr (Kaltkeimer)',
      en: 'Sow Sep–Oct or Mar–Apr (needs cold to germinate)'
    },
    harvestTime: {
      de: 'Blüte Jun–Sep im zweiten Jahr',
      en: 'Flowers Jun–Sep in the second year'
    },
    recommendedForTrees: ['tree-apple', 'tree-quince']
  },
  {
    id: 'plant-sainfoin',
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Sainfoin',
      de: 'Esparsette'
    },
    botanicalName: 'Onobrychis viciifolia',
    layer: 'HERBACEOUS',
    roles: ['NITROGEN_FIXER', 'POLLINATOR_MAGNET', 'LIVING_MULCH', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.0,
    maxDistanceM: 5.0,
    spreadM: 0.5,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Deep-rooted, nitrogen-fixing native legume of dry limestone grassland and an outstanding bee plant. It made up 43 % of the permanent vineyard ground cover (with perennial ryegrass and white clover) that reduced downy and powdery mildew by up to over 90 % in unsprayed plots, mainly by stopping rain from splashing spores onto the vines (Hasanaliyeva et al. 2024). Mow high once after flowering and leave the cuttings.',
      de: 'Tiefwurzelnde, stickstoffbindende heimische Leguminose der Kalkmagerrasen und hervorragende Bienenweide. Sie machte 43 % der dauerhaften Weinberg-Begrünung aus (mit Deutschem Weidelgras und Weißklee), die Falschen und Echten Mehltau in unbehandelten Parzellen um bis zu über 90 % senkte – vor allem, weil sie verhindert, dass Regen Sporen auf die Reben spritzt (Hasanaliyeva et al. 2024). Nach der Blüte einmal hoch mähen und das Schnittgut liegen lassen.'
    },
    color: '#db2777',
    iconName: 'Flower',
    imageUrl: '/images/plants/plant-sainfoin.webp',
    suitableSoils: ['CHALKY', 'LOAM', 'SANDY'],
    unsuitableSoils: ['ACIDIC', 'CLAY'],
    soilNotes: {
      en: 'Needs dry, well-drained, calcareous soil (pH 6.5–8); fails on acidic or waterlogged ground. Inoculate seed with Onobrychis rhizobia on new sites.',
      de: 'Braucht trockenen, durchlässigen, kalkhaltigen Boden (pH 6,5–8); versagt auf sauren oder staunassen Böden. Auf neuen Flächen das Saatgut mit Esparsetten-Rhizobien impfen.'
    },
    plantingTime: {
      de: 'Aussaat Apr–Mai oder Aug (ungeschältes Saatgut, 2–3 cm tief)',
      en: 'Sow Apr–May or Aug (hulled seed, 2–3 cm deep)'
    },
    harvestTime: {
      de: 'Blüte Mai–Jul; Schnitt nach der Blüte',
      en: 'Flowers May–Jul; cut after flowering'
    },
    recommendedForTrees: ['vine-grape']
  },
  {
    id: 'plant-sicklepod',
    climateZones: ['SUBTROPICAL', 'TROPICAL'],
    commonName: {
      en: 'Sicklepod (Foetid Cassia)',
      de: 'Sichelhülse (Stinkende Kassie)'
    },
    botanicalName: 'Senna tora',
    layer: 'HERBACEOUS',
    roles: ['PEST_REPELLER', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.8,
    maxDistanceM: 3.0,
    spreadM: 0.6,
    heightM: 1.0,
    perennial: false,
    notes: {
      en: 'Warm-season annual legume (it does not fix nitrogen) used between tea rows in China. In field trials, tea intercropped with sicklepod had significantly fewer tea green leafhoppers (Empoasca onukii), because its volatiles repel the leafhopper and it harbours spiders (Zhang et al. 2014, 2017). Only for subtropical or very warm sites; it needs heat and does not survive frost. Cut before seeds ripen, as it can self-seed weedily.',
      de: 'Wärmeliebende einjährige Leguminose (bindet keinen Stickstoff), die in China zwischen Teereihen angebaut wird. In Feldversuchen hatte Tee mit Sichelhülse deutlich weniger Grüne Teezikaden (Empoasca onukii), weil ihre Duftstoffe die Zikade abwehren und sie Spinnen beherbergt (Zhang et al. 2014, 2017). Nur für subtropische oder sehr warme Standorte; braucht Wärme und ist nicht frosthart. Vor der Samenreife schneiden, da sie sich stark aussäen kann.'
    },
    color: '#eab308',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-sicklepod.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Grows on most warm, well-drained soils including the acidic soils of tea gardens.',
      de: 'Wächst auf den meisten warmen, durchlässigen Böden, auch auf den sauren Böden von Teegärten.'
    },
    plantingTime: {
      de: 'Aussaat nach den letzten Frösten (Mai), Boden > 18 °C',
      en: 'Sow after last frost (May), soil > 18 °C'
    },
    harvestTime: {
      de: 'Blüte Jul–Okt; vor Samenreife schneiden',
      en: 'Flowers Jul–Oct; cut before seeds ripen'
    },
    recommendedForTrees: ['tree-tea-sinensis', 'tree-tea-assamica']
  },
  {
    id: 'plant-soybean',
    climateZones: ['TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Soybean',
      de: 'Sojabohne'
    },
    botanicalName: 'Glycine max',
    layer: 'HERBACEOUS',
    roles: ['NITROGEN_FIXER', 'EDIBLE_UNDERSTORY', 'BIOMASS_PRODUCER'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.8,
    maxDistanceM: 3.0,
    spreadM: 0.4,
    heightM: 0.8,
    perennial: false,
    notes: {
      en: 'Annual nitrogen-fixing legume sown between young tea rows. A tea–soybean intercrop reduced tea blister blight in a field study (Shao et al. 2026). After the bean harvest the haulm is laid as nitrogen-rich mulch. Grows poorly below soil pH 5.5, so use it only on the less acidic tea sites.',
      de: 'Einjährige, stickstoffbindende Leguminose zwischen jungen Teereihen. Ein Tee-Soja-Mischanbau senkte in einer Feldstudie den Tee-Blasenrost (Shao et al. 2026). Nach der Bohnenernte das Kraut als stickstoffreichen Mulch auslegen. Wächst unter pH 5,5 schlecht, daher nur auf den weniger sauren Tee-Standorten verwenden.'
    },
    color: '#a3a635',
    iconName: 'Bean',
    imageUrl: '/images/plants/plant-soybean.webp',
    suitableSoils: ['LOAM', 'SILT', 'SANDY'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Warm, well-drained loam at pH 5.5–7; nodulates poorly on very acidic or cold soils. Inoculate with Bradyrhizobium japonicum where soy has not grown before.',
      de: 'Warmer, durchlässiger Lehm mit pH 5,5–7; bildet auf sehr sauren oder kalten Böden kaum Knöllchen. Wo noch nie Soja stand, mit Bradyrhizobium japonicum impfen.'
    },
    plantingTime: {
      de: 'Aussaat Mitte Mai, Boden > 10 °C',
      en: 'Sow mid-May, soil > 10 °C'
    },
    harvestTime: {
      de: 'Sep–Okt (reife Bohnen)',
      en: 'Sep–Oct (dry beans)'
    },
    recommendedForTrees: ['tree-tea-sinensis']
  }
];
