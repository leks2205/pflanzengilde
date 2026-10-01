import { GuildPlant } from '../types/guild';

/**
 * All companion entries, including retired ones. Share codes encode indices into this array,
 * so entries may only be appended, never removed or reordered. Use ACTIVE_GUILD_PLANTS for
 * anything a user can pick or is recommended.
 */
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
    roles: ['DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 0.8,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Russian comfrey does not produce viable seed, so the cultivar Bocking 14 does not spread by self-seeding. A liquid feed made from its leaves is high in nitrogen and potassium, at levels comparable to commercial tomato feeds, and its low C:N ratio makes cut leaves break down quickly as mulch or compost activator. Excellent chop-and-drop green manure. Deciduous in winter. In a Garden Organic survey of UK gardeners, 74% said they grow comfrey because it is good for attracting bees; the report rates it as highly effective for both long- and short-tongued bees thanks to its long flowering period.',
      de: 'Hybrid-Beinwell bildet keine keimfähigen Samen, daher versamt sich die Sorte Bocking 14 nicht. Eine Jauche aus den Blättern ist reich an Stickstoff und Kalium, vergleichbar mit handelsüblichem Tomatendünger, und dank des engen C:N-Verhältnisses zersetzen sich geschnittene Blätter als Mulch oder Kompoststarter schnell. Hervorragender Chop-and-Drop-Mulchlieferant. Im Winter eingezogen. In einer Umfrage von Garden Organic unter britischen Gärtnerinnen und Gärtnern gaben 74 % an, Beinwell auch wegen der Bienen anzubauen; der Bericht stuft ihn dank seiner langen Blütezeit als sehr wirksam für lang- wie kurzrüsselige Bienen ein.'
    },
    color: '#059669',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-comfrey.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in deep, moist clay or loam with its deep, fleshy root system.',
      de: 'Gedeiht mit ihrem tiefreichenden, fleischigen Wurzelsystem in feuchtem, tiefgründigem Ton- und Lehmboden.'
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
      'herb-hemp', 'shrub-red-currant', 'tree-linden', 'shrub-rhododendron'],
    sources: [
      'Garden Organic (n.d.). Survey of comfrey use. Garden Organic, Coventry, UK. https://garden-organic.files.svdcdn.com/production/documents/Experiment-1-Survey-of-comfrey-use-report.pdf'
    ]
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
    roles: ['NITROGEN_FIXER', 'LIVING_MULCH', 'POLLINATOR_MAGNET'],
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
      en: 'Low-growing living carpet that fixes atmospheric nitrogen in symbiosis with Rhizobium leguminosarum bv. trifolii. Semi-evergreen, keeping soil covered through cold months. A major nectar plant: in Britain, white clover is one of four species that together supply over half of all nectar, visited mainly by bumblebees. Listed as juglone-tolerant by the Ontario Ministry of Agriculture and UW–Madison Extension (observation-based lists).',
      de: 'Flach wachsender Teppich, der in Symbiose mit Knöllchenbakterien (Rhizobium leguminosarum bv. trifolii) Luftstickstoff bindet. Wintergrün für ganzjährigen Bodenschutz. Bedeutende Nektarpflanze: In Großbritannien liefert Weißklee zusammen mit drei weiteren Arten über die Hälfte des gesamten Nektarangebots, besucht vor allem von Hummeln. Vom Landwirtschaftsministerium Ontarios und von UW–Madison Extension als juglontolerant gelistet (Beobachtungslisten).'
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
      'herb-hemp', 'shrub-red-currant', 'tree-linden'],
    sources: [
      'Svenning, M. M., Junttila, O., & Solheim, B. (1991). Symbiotic growth of indigenous white clover (Trifolium repens) with local Rhizobium leguminosarum biovar trifolii. Physiologia Plantarum, 83(3), 381–389. doi:10.1034/j.1399-3054.1991.830308.x',
      'Baude, M., Kunin, W. E., Boatman, N. D., Conyers, S., Davies, N., Gillespie, M. A. K., Morton, R. D., Smart, S. M., & Memmott, J. (2016). Historical nectar assessment reveals the fall and rise of floral resources in Britain. Nature, 530(7588), 85–88. doi:10.1038/nature16532',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/'
    ]
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
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: [],
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
      en: 'Flat flower heads with feathery aromatic foliage. It is often recommended for attracting beneficial insects, but in olfactometer tests yarrow flowers actually repelled three parasitoid wasp species. Fewer aphids and codling moths with less fruit damage have been shown in apple orchards with sown multi-species perennial flower strips, not with single plants. Listed as juglone-tolerant by Penn State Extension (observation-based list). It spreads by rhizomes and seed and can be used as a ground cover or lawn alternative in low-traffic areas.',
      de: 'Flache Blütenstände und gefiedertes, würzig duftendes Laub. Wird oft als Nützlingsmagnet empfohlen, doch in Olfaktometer-Versuchen wirkten Schafgarbenblüten auf drei Schlupfwespenarten sogar abstoßend. Weniger Blattläuse und Apfelwickler mit geringeren Fruchtschäden sind in Apfelanlagen nur für eingesäte, artenreiche mehrjährige Blühstreifen belegt, nicht für Einzelpflanzen. Von Penn State Extension als juglontolerant gelistet (Beobachtungsliste). Sie breitet sich über Rhizome und Samen aus und eignet sich als Bodendecker oder Rasenersatz für wenig betretene Flächen.'
    },
    color: '#eab308',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-yarrow.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT', 'CLAY', 'ACIDIC'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'An extensive fibrous, rhizomatous root system thrives in dry sand and poor alkaline chalk. Highly drought-tolerant once rooted.',
      de: 'Das weitreichende, faserige Wurzel- und Rhizomsystem gedeiht in trockenem Sand und kargem Kalk. Sehr trockenheitsresistent.'
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
      'herb-hemp', 'shrub-red-currant', 'tree-linden'],
    sources: [
      'Wäckers, F. L. (2004). Assessing the suitability of flowering herbs as parasitoid food sources: flower attractiveness and nectar accessibility. Biological Control, 29(3), 307–314. doi:10.1016/j.biocontrol.2003.08.005',
      'Cahenzli, F., Sigsgaard, L., Daniel, C., Herz, A., Jamar, L., Kelderer, M., Jacobsen, S. K., Kruczyńska, D., Matray, S., Porcel, M., Sekrecka, M., Świergiel, W., Tasin, M., Telfser, J., & Pfiffner, L. (2019). Perennial flower strips for pest control in organic apple orchards – A pan-European study. Agriculture, Ecosystems & Environment, 278, 43–53. doi:10.1016/j.agee.2019.03.011',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'NC State Extension (n.d.). Achillea millefolium. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/achillea-millefolium/',
      'Mann, A., Majeski, M., & Pokorny, M. (2022). Plant Guide for common yarrow (Achillea millefolium L.). USDA-NRCS, Bridger Plant Materials Center. https://plants.sc.egov.usda.gov/DocumentLibrary/plantguide/pdf/pg_acmi2.pdf'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.5,
    maxDistanceM: 1.5,
    spreadM: 0.3,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'The ultimate permaculture workhorse. Forms dense, fibrous clumps (claims that they hold back turf grass have not been measured). The popular idea that its sulfur compounds suppress apple scab (Venturia inaequalis) or black spot is unproven. The flowers are frequently visited by many types of bees.',
      de: 'Das ultimative Permakultur-Arbeitstier. Bildet dichte, büschelige Horste (eine Hemmung von Rasengräsern wurde nie gemessen). Die verbreitete Annahme, seine Schwefelverbindungen hemmten Apfelschorf (Venturia inaequalis) oder Pilzkrankheiten, ist unbewiesen. Die Blüten werden häufig von vielen Bienenarten besucht.'
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
      'herb-hemp', 'shrub-red-currant', 'shrub-rhododendron'],
    sources: [
      'UC Master Gardeners of Santa Clara County (n.d.). Chives. University of California Agriculture and Natural Resources. https://ucanr.edu/site/uc-master-gardeners-santa-clara-county/chives'
    ]
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
    roles: ['EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.3,
    maxDistanceM: 1.2,
    spreadM: 0.2,
    heightM: 0.5,
    perennial: false,
    notes: {
      en: 'Damaged tissue releases allicin, a sulfur defence compound that inhibits bacteria and fungi in lab tests; claims that the growing plant deters trunk borers or aphids are unproven. Traditionally planted in Zone 1 (0.3–1.0 m ring) without root disturbance to the tree, but suppression of apple scab or trunk pests has not been shown.',
      de: 'Verletztes Gewebe setzt Allicin frei, eine schwefelhaltige Abwehrsubstanz, die im Labor Bakterien und Pilze hemmt; dass die wachsende Pflanze Stammbohrer oder Läuse abwehrt, ist unbewiesen. Traditionell im Ring um den Stammkragen gepflanzt, ohne die Baumwurzeln zu stören, eine Hemmung von Apfelschorf oder Schädlingen am Stammfuß ist jedoch nicht belegt.'
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
    recommendedForTrees: ['tree-apple', 'tree-peach', 'tree-apricot', 'tree-plum', 'tree-cherry', 'shrub-blackcurrant', 'herb-rhubarb', 'shrub-red-currant'],
    sources: [
      'Borlinghaus, J., Albrecht, F., Gruhlke, M., Nwachukwu, I., & Slusarenko, A. (2014). Allicin: Chemistry and biological properties. Molecules, 19(8), 12591–12618. doi:10.3390/molecules190812591'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      floweringSeasons: ['EARLY_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
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
      en: 'Bulbs contain toxic Amaryllidaceae alkaloids (e.g. lycorine). In feeding trials with captive prairie voles, daffodil bulbs resisted feeding both fresh and as dried powder mixed into food. Often planted shoulder-to-shoulder in Zone 1, but protection of the tree root collar from voles is unproven. Flowering from early March, the wild daffodil provides nectar for early pollinators such as bumblebees (stated by the Woodland Trust; no field study of its flower visitors was found).',
      de: 'Die Zwiebeln enthalten giftige Amaryllidaceen-Alkaloide (z. B. Lycorin). In Fraßversuchen mit Präriewühlmäusen wurden Narzissenzwiebeln weder frisch noch als getrocknetes, ins Futter gemischtes Pulver nennenswert gefressen. Wird oft dicht im 1-Meter-Ring gepflanzt, ein Schutz der Baumwurzeln vor Wühlmäusen oder Rasengräsern ist jedoch unbewiesen. Da die Wilde Narzisse ab Anfang März blüht, bietet sie frühen Bestäubern wie Hummeln Nektar (Angabe des Woodland Trust; eine Feldstudie zu ihren Blütenbesuchern wurde nicht gefunden).'
    },
    color: '#fbbf24',
    iconName: 'ShieldAlert',
    imageUrl: '/images/plants/plant-daffodil.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CHALKY', 'CLAY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Highly adaptable spring bulb. Listed as juglone-tolerant by Penn State Extension and the Ontario Ministry of Agriculture (observation-based lists).',
      de: 'Sehr robuster Frühlingsblüher. Von Penn State Extension und dem Landwirtschaftsministerium Ontarios als juglontolerant gelistet (Beobachtungslisten).'
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
      'tree-tea-sinensis', 'tree-linden', 'shrub-rhododendron'],
    sources: [
      'Bastida, J., Lavilla, R., & Viladomat, F. (2006). Chemical and biological aspects of Narcissus alkaloids. The Alkaloids: Chemistry and Biology, 63, 87–179. doi:10.1016/S1099-4831(06)63003-4',
      'Curtis, P. D., Curtis, G. B., & Miller, W. B. (2009). Relative resistance of ornamental flowering bulbs to feeding damage by voles. HortTechnology, 19(3), 499–503. doi:10.21273/horttech.19.3.499',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity',
      'Woodland Trust (n.d.). Wild daffodil (Narcissus pseudonarcissus). https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/plants/wild-flowers/wild-daffodil/'
    ]
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
    roles: ['LIVING_MULCH', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'], // Dies with first frost and creates rich biomass blanket
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 0.9,
    heightM: 0.3,
    perennial: false,
    notes: {
      en: 'Often called an aphid trap crop, but there is no evidence that it draws aphids away from trees or that its mustard oils confuse woolly apple aphids and whiteflies. Dies down as winter mulch. Trailing types can be grown as a ground cover.',
      de: 'Gilt oft als Fangpflanze für Blattläuse, doch es gibt keinen Beleg, dass sie Läuse von Gehölzen weglockt oder ihre Senföle Schädlinge verwirren. Bildet im Herbst nahrhaften Frostmulch. Rankende Sorten lassen sich als Bodendecker ziehen.'
    },
    color: '#f97316',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-nasturtium.webp',
    suitableSoils: ['SANDY', 'LOAM', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Plant in well-drained soil in full sun. Avoid fertilizing except on very poor soil: high fertilization promotes leaf growth and reduces flowering.',
      de: 'In durchlässigen Boden in voller Sonne pflanzen. Nur auf sehr armen Böden düngen: Starke Düngung fördert das Blattwachstum und mindert die Blüte.'
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
    ],
    sources: [
      'Mahr, S. (n.d.). Nasturtium, Tropaeolum species. Wisconsin Horticulture, University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/nasturtium-tropaeolum-majus/'
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.9,
    maxDistanceM: 2.1,
    spreadM: 0.5,
    heightM: 0.6,
    perennial: false,
    notes: {
      en: 'Prolific self-seeder. A strong bee plant: in a Polish field study, each flower produced on average 4.0 mg of nectar (31.5% sugar), bees made up 73% of all flower visits, and flowering lasted about eight weeks from late June.',
      de: 'Versamt sich zuverlässig selbst. Starke Bienenweide: In einer polnischen Feldstudie lieferte jede Blüte im Mittel 4,0 mg Nektar (31,5 % Zucker), Bienen stellten 73 % aller Blütenbesuche, und die Blüte dauerte ab Ende Juni rund acht Wochen.'
    },
    color: '#3b82f6',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-borage.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Prefers loose, well-drained sandy or loamy soils; dislikes stagnant water.',
      de: 'Bevorzugt lockeren, durchlässigen Sand- oder Lehmboden; meidet Staunässe.'
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
      'herb-hemp', 'shrub-red-currant'],
    sources: [
      'Stawiarz, E., Wróblewska, A., Masierowska, M., & Sadowska, D. (2020). Flowering, forage value, and insect pollination in borage (Borago officinalis L.) cultivated in SE Poland. Journal of Apicultural Science, 64(1), 77–89. doi:10.2478/jas-2020-0005'
    ]
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
    roles: ['DYNAMIC_ACCUMULATOR', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING'],
      harvestSeasons: ['AUTUMN', 'WINTER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.2,
    maxDistanceM: 2.7,
    spreadM: 0.8,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Roots yield allyl isothiocyanate (AITC). As a concentrated vapour, AITC controlled blue mould (Penicillium expansum) on stored pears and killed stored-grain pests, but there is no evidence that horseradish growing near stone fruit reduces Monilia brown rot. In classic root excavations its thick, fleshy taproot reached 3–4.3 m deep (at most about 4.6 m) but spread little sideways.',
      de: 'Die Wurzeln liefern Allylsenföl (Allylisothiocyanat, AITC). Als konzentrierter Dampf hemmte AITC Blauschimmel (Penicillium expansum) an gelagerten Birnen und tötete Vorratsschädlinge, doch dass Meerrettich neben Steinobst die Monilia-Fruchtfäule mindert, ist nicht belegt. In klassischen Wurzelgrabungen reichte die dicke, fleischige Pfahlwurzel 3–4,3 m tief (höchstens etwa 4,6 m), breitete sich seitlich aber kaum aus.'
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
    recommendedForTrees: ['tree-apple', 'tree-peach', 'tree-apricot', 'tree-plum', 'tree-quince'],
    sources: [
      'Wu, H., Zhang, G.-A., Zeng, S., & Lin, K.-C. (2009). Extraction of allyl isothiocyanate from horseradish (Armoracia rusticana) and its fumigant insecticidal activity on four stored-product pests of paddy. Pest Management Science, 65(9), 1003–1008. doi:10.1002/ps.1786',
      'Mari, M., Leoni, O., Iori, R., & Cembali, T. (2002). Antifungal vapour-phase activity of allyl-isothiocyanate against Penicillium expansum on pears. Plant Pathology, 51(2), 231–236. doi:10.1046/j.1365-3059.2002.00667.x',
      'Weaver, J. E., & Bruner, W. E. (1927). Root Development of Vegetable Crops, Chapter XVI: Horse-radish. McGraw-Hill, New York. https://soilandhealth.org/wp-content/uploads/01aglibrary/010137veg.roots/010137ch16.html'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 0.6,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Evergreen aromatic shrub whose essential oil consists mainly of linalool and linalyl acetate. In a lab olfactometer, lavender oil was the best of 27 oils at stopping newly hatched codling moth larvae from moving towards apples, but a field effect of growing plants on codling moths or aphids is unproven. Plant on warm southern sun skirt. Its flowers are foraged mainly by bumblebees: in a UK study they made up 92% of the bees on lavender, honey bees only 8%.',
      de: 'Wintergrüner Duftstrauch, dessen ätherisches Öl hauptsächlich aus Linalool und Linalylacetat besteht. Im Labor-Olfaktometer hielt Lavendelöl frisch geschlüpfte Apfelwicklerlarven von 27 getesteten Ölen am besten davon ab, zu Äpfeln zu wandern; eine Wirkung lebender Pflanzen auf Wickler oder Läuse im Freiland ist jedoch unbewiesen. An sonnigen Südrändern pflanzen. Die Blüten werden vor allem von Hummeln besucht: In einer britischen Studie stellten sie 92 % der Bienen an Lavendel, Honigbienen nur 8 %.'
    },
    color: '#8b5cf6',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-lavender.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Drought-tolerant herb for lean, free-draining sandy or chalky soil. Rots in wet clay.',
      de: 'Trockenheitsverträgliches Kraut für durchlässigen, mageren Kalk- oder Sandboden. Verfault in nassem Ton.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach den Frösten)',
      en: 'Spring (Apr–May after frost)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug, kurz vor dem Aufblühen der Knospen)',
      en: 'Mid-summer (Jul–Aug, just as flower buds open)'
    },
    recommendedForTrees: ['tree-fig', 'tree-seabuckthorn-star'],
    sources: [
      'Rai, V. K., Sinha, P., Yadav, K. S., Shukla, A., Saxena, A., Bawankule, D. U., Tandon, S., Khan, F., Chanotiya, C. S., & Yadav, N. P. (2020). Anti-psoriatic effect of Lavandula angustifolia essential oil and its major components linalool and linalyl acetate. Journal of Ethnopharmacology, 261, 113127. doi:10.1016/j.jep.2020.113127',
      'Landolt, P. J., Hofstetter, R. W., & Biddick, L. L. (1999). Plant essential oils as arrestants and repellents for neonate larvae of the codling moth (Lepidoptera: Tortricidae). Environmental Entomology, 28(6), 954–960. doi:10.1093/ee/28.6.954',
      'Balfour, N. J., Garbuzov, M., & Ratnieks, F. L. W. (2013). Longer tongues and swifter handling: why do more bumble bees (Bombus spp.) than honey bees (Apis mellifera) forage on lavender (Lavandula spp.)? Ecological Entomology, 38(4), 323–329. doi:10.1111/een.12019'
    ]
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
    roles: ['NITROGEN_FIXER', 'EDIBLE_UNDERSTORY'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.8,
    maxDistanceM: 3.7,
    spreadM: 1.8,
    heightM: 1.8,
    perennial: true,
    notes: {
      en: 'Actinorhizal shrub: like other Elaeagnus species it forms root nodules with Frankia bacteria that fix atmospheric nitrogen (how much of it reaches a neighbouring fruit tree has not been measured). Its berries contain vitamin C and carotenoids including lycopene.',
      de: 'Actinorhiza-Strauch: Wie andere Elaeagnus-Arten bildet er Wurzelknöllchen mit Frankia-Bakterien, die Luftstickstoff binden (wie viel davon einem benachbarten Obstbaum zugutekommt, wurde nicht gemessen). Die Beeren enthalten Vitamin C und Carotinoide, darunter Lycopin.'
    },
    color: '#ea580c',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-goumi.webp',
    suitableSoils: ['LOAM', 'SANDY', 'ACIDIC', 'SILT'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Nitrogen-fixing shrub for poor, sandy or slightly acidic soils.',
      de: 'Stickstoffbindender Strauch für magere, sandige oder leicht saure Böden.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug, süß-herbe rote Beeren)',
      en: 'Mid-summer (Jul–Aug, ripe red speckled berries)'
    },
    recommendedForTrees: ['tree-chestnut'],
    sources: [
      'Gardner, I. C. (1958). Nitrogen fixation in Elaeagnus root nodules. Nature, 181(4610), 717–718. doi:10.1038/181717a0',
      'Lachowicz-Wiśniewska, S., Bieniek, A., Stinco, C. M., Meléndez Martínez, A. J., Kapusta, I., Wiśniewski, R., & Ochmian, I. (2026). Phytochemical and bioactivities comparison of three cultivars of goumi (Elaeagnus multiflora Thunb.) berry juice sediments and pomace: a waste valorisation perspective. Food Chemistry, 517, 149515. doi:10.1016/j.foodchem.2026.149515'
    ]
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
    roles: ['NITROGEN_FIXER', 'EDIBLE_UNDERSTORY'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 2.1,
    maxDistanceM: 4.3,
    spreadM: 1.8,
    heightM: 2.4,
    perennial: true,
    notes: {
      en: 'Pioneer shrub that fixes nitrogen in root nodules with Frankia and is used as a windbreak and to stabilise sand dunes, suiting the windy western orchard quadrant. Bright orange berries are rich in vitamins C and E, and the pulp oil contains the omega-7 fatty acid palmitoleic acid (about 12–39%).',
      de: 'Pioniergehölz, das in Wurzelknöllchen mit Frankia Stickstoff bindet und als Windschutz sowie zur Dünenbefestigung genutzt wird – passend für windige Westlagen. Die orangefarbenen Beeren sind reich an Vitamin C und E; das Fruchtfleischöl enthält die Omega-7-Fettsäure Palmitoleinsäure (etwa 12–39 %).'
    },
    color: '#f59e0b',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-seabuckthorn.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Coastal and dune pioneer that fixes nitrogen on sandy soils and grows with as little as 250–800 mm of annual rainfall; avoid stagnant clay.',
      de: 'Küsten- und Dünenpionier mit Stickstoff bindenden Wurzelknöllchen für sandige Böden; gedeiht schon bei 250–800 mm Jahresniederschlag. Verträgt keine verdichtete Staunässe.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Okt–Nov)',
      en: 'Spring (Mar–May) or autumn (Oct–Nov)'
    },
    harvestTime: {
      de: 'Frühherbst bis Winter (Sep–Dez, nach erstem Frost)',
      en: 'Early autumn to winter (Sep–Dec, after first frost)'
    },
    recommendedForTrees: ['tree-chestnut'],
    sources: [
      'Baker, D. (1993). Hippophaë rhamnoides: an NFT valued for centuries. NFTA 93-02 (June 1993). Forest, Farm, and Community Tree Network (FACT Net), Winrock International. https://winrock.org/hippophae-rhamnoides-an-nft-valued-for-centuries/',
      'Yang, B., & Kallio, H. P. (2001). Fatty acid composition of lipids in sea buckthorn (Hippophaë rhamnoides L.) berries of different origins. Journal of Agricultural and Food Chemistry, 49(4), 1939–1947. doi:10.1021/jf001059s',
      'Kallio, H., Yang, B., & Peippo, P. (2002). Effects of different origins and harvesting time on vitamin C, tocopherols, and tocotrienols in sea buckthorn (Hippophaë rhamnoides) berries. Journal of Agricultural and Food Chemistry, 50(21), 6136–6142. doi:10.1021/jf020421v'
    ]
  },
  {
    id: 'plant-lupine',
    climateZones: ['BOREAL','TEMPERATE'],
    commonName: {
      en: 'Wild Perennial Lupine',
      de: 'Ausdauernde Lupine'
    },
    botanicalName: 'Lupinus perennis',
    layer: 'HERBACEOUS',
    roles: ['NITROGEN_FIXER', 'POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      chopAndDropSeasons: ['LATE_SPRING'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.2,
    maxDistanceM: 2.4,
    spreadM: 0.6,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Long-lived, nitrogen-fixing perennial with a thick, deep taproot. Pollinated by bumble bees, honey bees and carpenter bees. Prefers slightly acidic soils.',
      de: 'Langlebige, Stickstoff bindende Staude mit dicker, tiefer Pfahlwurzel. Wird von Hummeln, Honigbienen und Holzbienen bestäubt. Bevorzugt leicht sauren Boden.'
    },
    color: '#6366f1',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-lupine.webp',
    suitableSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Grows mainly in well-drained, sandy, slightly acidic soils (e.g. pH 4.2–5.6 at Michigan sites; over 80% sand at Wisconsin sites), though it has also been reported on neutral soils.',
      de: 'Wächst vor allem auf durchlässigen, sandigen, leicht sauren Böden (z. B. pH 4,2–5,6 an Fundorten in Michigan; über 80 % Sand in Wisconsin), wurde aber auch auf neutralen Böden gefunden.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Spätsommer (Aug–Sep) per Aussaat',
      en: 'Spring (Mar–May) or late summer (Aug–Sep) by seed'
    },
    harvestTime: {
      de: 'Nicht essbar (Zierlupine)! Blütezeit: Mai bis Juli (Stickstoffanreicherung)',
      en: 'Non-edible (ornamental lupine)! Bloom: May to July (nitrogen enrichment)'
    },
    recommendedForTrees: ['shrub-blueberry', 'shrub-rhododendron'],
    sources: [
      'Meyer, R. (2006). Lupinus perennis. In: Fire Effects Information System. U.S. Department of Agriculture, Forest Service, Rocky Mountain Research Station, Fire Sciences Laboratory. doi:10.2737/feis-species-review-lupper (https://www.fs.usda.gov/database/feis/plants/forb/lupper/all.html)'
    ]
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
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.8,
    maxDistanceM: 3.4,
    spreadM: 1.2,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Prefers full sun but also crops well in partial shade, e.g. against a north-facing wall (fruit ripens a little later and is less sweet), so it suits the eastern drip line with morning sun and afternoon shade. Early greenish-yellow flower racemes open in spring; late frosts can damage them. Listed as juglone-tolerant by Penn State and UW–Madison Extension (observation-based lists). In an Italian mountain study the flowers attracted mostly solitary bees and hoverflies, although few pollinators were seen and fruit set did not differ between bagged and open branches.',
      de: 'Bevorzugt volle Sonne, trägt aber auch im Halbschatten gut, etwa vor einer Nordwand (die Früchte reifen dann etwas später und sind weniger süß) – passend für den östlichen Kronentrauf mit Morgensonne und Nachmittagsschatten. Grünlich-gelbe Blütentrauben öffnen sich im Frühjahr; Spätfröste können sie schädigen. Von Penn State und UW–Madison Extension als juglontolerant gelistet (Beobachtungslisten). In einer Studie im italienischen Bergland lockten die Blüten vor allem Wildbienen und Schwebfliegen an; es wurden jedoch nur wenige Bestäuber beobachtet, und der Fruchtansatz unterschied sich nicht zwischen eingetüteten und offenen Zweigen.'
    },
    color: '#dc2626',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-red-currant.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Prefers cool, moist, organic-rich soil; on poor soil, add compost or well-rotted manure when planting. Grows in heavy loam and clay understorey.',
      de: 'Liebt kühlen, feuchten, humosen Boden; auf armem Boden beim Pflanzen Kompost oder gut verrotteten Mist einarbeiten. Wächst auch im Unterwuchs auf Lehm und Ton.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Vorfrühling (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug, um den Johannistag)',
      en: 'Mid-summer (Jul–Aug, around St. John’s Day)'
    },
    recommendedForTrees: ['tree-walnut', 'tree-pear', 'tree-apple', 'tree-plum', 'tree-cherry', 'tree-hazelnut', 'tree-pawpaw', 'shrub-elderberry', 'tree-ginkgo', 'tree-alder', 'tree-linden'],
    sources: [
      'Royal Horticultural Society (n.d.). How to grow redcurrants. RHS. https://www.rhs.org.uk/fruit/redcurrants/grow-your-own',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/',
      'Prodorutti, D., & Frilli, F. (2008). Entomophilous pollination of raspberry, red currant and highbush blueberry in a mountain area of Friuli-Venezia Giulia (north-eastern Italy). Acta Horticulturae, 777, 429–434. doi:10.17660/ActaHortic.2008.777.64'
    ]
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
    roles: ['POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 2.4,
    maxDistanceM: 4.3,
    spreadM: 2.1,
    heightM: 3,
    perennial: true,
    notes: {
      en: 'Tough woodland buffer shrub with large flat flower heads that are open to many insects. The closely related American elder (Sambucus canadensis) is listed as juglone-tolerant by Penn State Extension (observation-based list), which is why elder is used in Black Walnut guilds; Sambucus nigra itself has not been tested. Its flowers have no nectar, but their strong, musky scent attracts beetles, flies and honey bees as pollinators.',
      de: 'Robuster Pufferstrauch für den Waldrand mit großen, flachen, für viele Insekten zugänglichen Blütenständen. Der nah verwandte Kanadische Holunder (Sambucus canadensis) wird von Penn State Extension als juglontolerant gelistet (Beobachtungsliste), daher wird Holunder in Walnussgilden verwendet; Sambucus nigra selbst wurde nicht geprüft. Die Blüten bilden keinen Nektar, ihr kräftiger, moschusartiger Duft lockt aber Käfer, Fliegen und Honigbienen als Bestäuber an.'
    },
    color: '#475569',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-elderberry.webp',
    suitableSoils: ['CLAY', 'LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Native hedgerow pioneer thriving in heavy, rich, damp clay and loam soils.',
      de: 'Robuster Pionierstrauch für schwere, feuchte Ton- und Lehmböden.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Blüten: Mai–Jun; Beeren: Aug–Okt',
      en: 'Blossoms: May–Jun; Berries: Aug–Oct'
    },
    recommendedForTrees: ['tree-walnut', 'tree-chestnut', 'tree-alder'],
    sources: [
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Forbes, R. S. (n.d.). Sambucus nigra L. Fermanagh species accounts. Botanical Society of Britain & Ireland. https://bsbi.org/in-your-area/local-botany/co-fermanagh/fermanagh-species-accounts/sambucus-nigra-l'
    ]
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
    roles: ['LIVING_MULCH', 'EDIBLE_UNDERSTORY'],
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
      en: 'Creeping woodland ground cover that thrives under dense shade and deciduous leaf litter. Listed as juglone-tolerant by Penn State and UW–Madison Extension (observation-based lists). Its sweet, hay-like scent comes mainly from coumarin, which forms from bound precursors as the leaves wilt and dry.',
      de: 'Wald-Bodendecker für dichten Schatten und Falllaub. Von Penn State und UW–Madison Extension als juglontolerant gelistet (Beobachtungslisten). Der süße, heuartige Duft stammt vor allem von Cumarin, das beim Welken und Trocknen der Blätter aus gebundenen Vorstufen entsteht.'
    },
    color: '#15803d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-woodruff.webp',
    suitableSoils: ['LOAM', 'SILT', 'CLAY', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilNotes: {
      en: 'Woodland shade carpet requiring humus-rich, moist, slightly acidic to neutral woodland soil.',
      de: 'Waldschatten-Teppich für feuchte, humusreiche, schwach saure bis neutrale Waldböden.'
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
      'tree-tea-sinensis', 'shrub-red-currant', 'tree-linden', 'shrub-rhododendron'],
    sources: [
      'Herre, I., & Stegemann, T. (2026). Sweet woodruff (Galium odoratum L.)—More than just coumarin: From fundamental to biomass valorization. Molecules, 31(16), 2920. doi:10.3390/molecules31162920',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/'
    ]
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
    roles: ['LIVING_MULCH', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.6,
    maxDistanceM: 1.8,
    spreadM: 0.5,
    heightM: 0.1,
    perennial: true,
    notes: {
      en: 'Dense, evergreen aromatic mat providing winter soil cover. Its essential oil varies strongly between chemotypes (wild Lithuanian plants were dominated by 1,8-cineole, germacrene B and other compounds rather than thymol). As a vapour in lab chambers, the oil inhibited brown rot fungi (Monilinia spp.), but a pest- or disease-repelling effect of the living plant is unproven. Drought resistant on the southern sun skirt. Bees and butterflies are attracted to the nectar of its flowers.',
      de: 'Dichter, wintergrüner Duftteppich für Bodenschutz im Winter. Sein ätherisches Öl unterscheidet sich stark zwischen Chemotypen (wilde Pflanzen aus Litauen enthielten vor allem 1,8-Cineol, Germacren B und andere Stoffe statt Thymol). Als Dampf hemmte das Öl im Laborversuch Monilia-Fruchtfäulepilze, eine Abwehr von Schädlingen oder Krankheiten durch die lebende Pflanze ist jedoch unbewiesen. Trockenheitsresistent am sonnigen Südrand. Bienen und Schmetterlinge besuchen die Blüten wegen ihres Nektars.'
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
    ],
    sources: [
      'Ložionė, K., & Venskutonis, P. R. (2006). Chemical composition of the essential oil of Thymus serpyllum L. ssp. serpyllum growing wild in Lithuania. Journal of Essential Oil Research, 18(2), 206–211. doi:10.1080/10412905.2006.9699067',
      'Álvarez-García, S., Moumni, M., & Romanazzi, G. (2023). Antifungal activity of volatile organic compounds from essential oils against the postharvest pathogens Botrytis cinerea, Monilinia fructicola, Monilinia fructigena, and Monilinia laxa. Frontiers in Plant Science, 14, 1274770. doi:10.3389/fpls.2023.1274770',
      'NC State Extension (n.d.). Thymus serpyllum. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/thymus-serpyllum/'
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
    roles: ['POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: ['LATE_SPRING', 'SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.6,
    maxDistanceM: 2.0,
    spreadM: 0.6,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Aromatic evergreen subshrub. A sprayed sage extract controlled grapevine downy mildew (Plasmopara viticola) in greenhouse trials and in one of two field seasons, but was easily washed off by rain; whether a living sage plant protects nearby vines has not been tested. In lab tests, sage extracts also reduced egg-laying by the diamondback moth on cabbage leaves. Violet flower spikes are visited by bees. Requires a sunny, dry microclimate on the southern drip line.',
      de: 'Aromatischer, immergrüner Halbstrauch. Ein gespritzter Salbeiextrakt bekämpfte Falschen Mehltau der Rebe (Plasmopara viticola) im Gewächshaus und in einer von zwei Freilandsaisons, wurde aber leicht vom Regen abgewaschen; ob eine lebende Salbeipflanze benachbarte Reben schützt, wurde nie geprüft. Im Labor verringerten Salbeiextrakte zudem die Eiablage der Kohlmotte auf Kohlblättern. Violette Blütenähren werden von Bienen besucht. Bevorzugt trockene, sonnige Standorte am Südrand.'
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
    ],
    sources: [
      'Dagostin, S., Formolo, T., Giovannini, O., Pertot, I., & Schmitt, A. (2010). Salvia officinalis extract can protect grapevine against Plasmopara viticola. Plant Disease, 94(5), 575–580. doi:10.1094/PDIS-94-5-0575',
      'Dover, J. W. (1985). The responses of some Lepidoptera to labiate herb and white clover extracts. Entomologia Experimentalis et Applicata, 39(2), 177–182. doi:10.1111/j.1570-7458.1985.tb03560.x'
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.6,
    maxDistanceM: 2.4,
    spreadM: 0.3,
    heightM: 0.2,
    perennial: true,
    notes: {
      en: 'Low, clumping woodland strawberry. Everbearing (alpine) forms carry a mutation in the TFL1 flowering-repressor gene and keep flowering throughout the favourable season, giving small crops of tiny, aromatic berries intermittently over the summer. In Lithuania its flowers were visited by solitary bees, ants and flies in comparable numbers. Runner-forming types spread into a low ground cover, while runnerless alpine cultivars stay as clumps.',
      de: 'Niedrige, horstbildende Walderdbeere. Immertragende Monatserdbeeren tragen eine Mutation im Blühhemmer-Gen TFL1 und blühen die ganze günstige Jahreszeit hindurch; sie liefern über den Sommer verteilt immer wieder kleine Mengen winziger, aromatischer Beeren. In Litauen wurden die Blüten von Wildbienen, Ameisen und Fliegen in vergleichbarer Zahl besucht. Ausläufer bildende Formen breiten sich zu einem niedrigen Bodendecker aus, ausläuferlose Monatserdbeeren bleiben dagegen horstig.'
    },
    color: '#ef4444',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-strawberry.webp?v=2',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Prefers fertile, humus-rich, well-drained, slightly acidic to neutral loam with steady moisture.',
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
    recommendedForTrees: ['tree-plum'],
    sources: [
      'Iwata, H., Gaston, A., Remay, A., Thouroude, T., Jeauffre, J., Kawamura, K., Hibrand-Saint Oyant, L., Araki, T., Denoyes, B., & Foucher, F. (2012). The TFL1 homologue KSN is a regulator of continuous flowering in rose and strawberry. The Plant Journal, 69(1), 116–125. doi:10.1111/j.1365-313X.2011.04776.x',
      'Royal Horticultural Society (n.d.). How to grow strawberries. RHS. https://www.rhs.org.uk/fruit/strawberries/grow-your-own',
      'Blažytė-Čereškienė, L., Būda, V., & Bagdonaitė, E. (2012). Three wild Lithuanian strawberry species and their pollinators. Plant Systematics and Evolution, 298(4), 819–826. doi:10.1007/s00606-012-0593-9'
    ]
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
    roles: ['LIVING_MULCH', 'POLLINATOR_MAGNET'],
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
      en: 'Evergreen to semi-evergreen mat spreading by runners; in cool, shady areas where grass will not grow it forms a thick ground cover (suppression of established grasses has not been measured). Blue flower spikes attract bumblebees. Listed as juglone-tolerant by Penn State Extension (observation-based list).',
      de: 'Immergrüner bis halbimmergrüner, sich über Ausläufer ausbreitender Teppich; an kühlen, schattigen Stellen, an denen kein Gras wächst, bildet er eine dichte Bodendecke (eine Unterdrückung etablierter Gräser wurde nicht gemessen). Blaue Blütenkerzen locken Hummeln an. Von Penn State Extension als juglontolerant gelistet (Beobachtungsliste).'
    },
    color: '#2563eb',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-bugleweed.webp',
    suitableSoils: ['LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CLAY'],
    soilNotes: {
      en: 'Vigorous evergreen runner for moist soil in partial shade; avoid wet, heavy soils, where crown rot can be a problem.',
      de: 'Wüchsiger, wintergrüner Ausläuferbildner für feuchten Boden im Halbschatten; nasse, schwere Böden meiden, dort droht Kronenfäule.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Spätsommer (Aug–Okt)',
      en: 'Spring (Mar–May) or late summer (Aug–Oct)'
    },
    harvestTime: {
      de: 'Mai bis Juni (Blüten und Blätter während der Blüte)',
      en: 'May to June (leaves and flowering spikes)'
    },
    recommendedForTrees: ['tree-hazelnut', 'tree-alder', 'shrub-elderberry'],
    sources: [
      'North Carolina State Extension (n.d.). Ajuga reptans. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/ajuga-reptans/',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
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
      en: 'Blooms in late winter to early spring, well before fruit trees, and attracts pollinating insects, mainly honey bees, in lawn plantings. Note: in feeding trials, voles readily ate crocus corms mixed into food. Listed as juglone-tolerant by Penn State and UW–Madison Extension (observation-based lists).',
      de: 'Blüht im Spätwinter bis Vorfrühling, lange vor den Obstbäumen, und lockt in Rasenpflanzungen Bestäuber an, vor allem Honigbienen. Hinweis: In Fraßversuchen fraßen Wühlmäuse ins Futter gemischte Krokusknollen bereitwillig. Von Penn State und UW–Madison Extension als juglontolerant gelistet (Beobachtungslisten).'
    },
    color: '#7c3aed',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-crocus.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Enjoys sun and good drainage; prefers sandy soils and does poorly in poorly drained clay.',
      de: 'Liebt Sonne und gute Drainage; bevorzugt sandige Böden und gedeiht schlecht in staunassem Ton.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov, 6–8 cm tief)',
      en: 'Autumn (Sep–Nov, 6–8 cm deep)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Februar bis April (früheste Bienenweide)',
      en: 'Non-edible! Bloom: February to April (first crucial pollen bridge)'
    },
    recommendedForTrees: ['tree-apricot', 'tree-hazelnut'],
    sources: [
      'Wisdom, M. M., Richardson, M. D., Karcher, D. E., Steinkraus, D. C., & McDonald, G. V. (2019). Flowering persistence and pollinator attraction of early-spring bulbs in warm-season lawns. HortScience, 54(10), 1853–1859. doi:10.21273/HORTSCI14259-19',
      'Royal Horticultural Society (n.d.). How to grow crocuses. RHS. https://www.rhs.org.uk/plants/crocus/growing-guide',
      'North Carolina State Extension (n.d.). Crocus tommasinianus. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/crocus-tommasinianus/',
      'Curtis, P. D., Curtis, G. B., & Miller, W. B. (2009). Relative resistance of ornamental flowering bulbs to feeding damage by voles. HortTechnology, 19(3), 499–503. doi:10.21273/horttech.19.3.499',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
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
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 0.3,
    maxDistanceM: 1.2,
    spreadM: 0.1,
    heightM: 0.2,
    perennial: true,
    notes: {
      en: 'One of the earliest flowers of the year (February–March), often while snow is still present; bumblebees collect its pollen. Bulbs resisted vole feeding in feeding trials. Listed as juglone-tolerant by Penn State Extension (observation-based list). Thrives in cool shade along the northern drip line.',
      de: 'Eine der frühesten Blüten des Jahres (Februar–März), oft noch bei Schnee; Hummeln sammeln ihren Pollen. In Fraßversuchen wurden die Zwiebeln von Wühlmäusen gemieden. Von Penn State Extension als juglontolerant gelistet (Beobachtungsliste). Gedeiht im kühlen Schatten am Nordrand der Traufe.'
    },
    color: '#e2e8f0',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-snowdrop.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Grows best in clay or loam with high organic matter (e.g. deciduous leaf mould) and good drainage, though it tolerates occasionally wet sites.',
      de: 'Gedeiht am besten in Ton- oder Lehmboden mit viel organischer Substanz (z. B. Laubhumus) und guter Drainage, verträgt aber zeitweise nasse Stellen.'
    },
    plantingTime: {
      de: 'Frühherbst (Sep–Nov, 5–8 cm tief als Zwiebel)',
      en: 'Early autumn (Sep–Nov, 5–8 cm deep bulbs)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Januar bis März (Schneeglöckchen-Nektar)',
      en: 'Non-edible! Bloom: January to March (winter/spring sentinel)'
    },
    recommendedForTrees: ['tree-hazelnut', 'tree-chestnut'],
    sources: [
      'Prokop, P., Ježová, Z., Mešková, M., Vanerková, V., Zvaríková, M., & Fedor, P. (2023). Flower angle favors pollen export efficiency in the snowdrop Galanthus nivalis (Linnaeus, 1753) but not in the lesser celandine Ficaria verna (Huds, 1762). Plant Signaling & Behavior, 18(1), 2163065. doi:10.1080/15592324.2022.2163065',
      'North Carolina State Extension (n.d.). Galanthus nivalis. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/galanthus-nivalis/',
      'Curtis, P. D., Curtis, G. B., & Miller, W. B. (2009). Relative resistance of ornamental flowering bulbs to feeding damage by voles. HortTechnology, 19(3), 499–503. doi:10.21273/horttech.19.3.499',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
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
      en: 'Succulent leaves and flat flowerheads that open in autumn, a late food source for bees and butterflies in pollinator gardens. Listed as juglone-tolerant by Penn State Extension (observation-based list).',
      de: 'Sukkulente Blätter und flache Blütenstände, die sich im Herbst öffnen – eine späte Nahrungsquelle für Bienen und Schmetterlinge im Bestäubergarten. Von Penn State Extension als juglontolerant gelistet (Beobachtungsliste).'
    },
    color: '#db2777',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-sedum.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Drought- and salt-tolerant succulent for well-drained or gravelly soil in sun; wet soils cause rot.',
      de: 'Trockenheits- und salzverträgliche Sukkulente für durchlässige oder kiesige Böden in der Sonne; nasse Böden führen zu Fäulnis.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Jun) oder Frühherbst (Aug–Okt)',
      en: 'Spring (Apr–Jun) or early autumn (Aug–Oct)'
    },
    harvestTime: {
      de: 'Mai bis September (junge Triebspitzen als lebender Mulch/Salat)',
      en: 'May to September (young shoot tips)'
    },
    recommendedForTrees: ['tree-fig', 'tree-seabuckthorn-star'],
    sources: [
      'North Carolina State Extension (n.d.). Hylotelephium spectabile. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/hylotelephium-spectabile/',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
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
      en: 'Late-season bloomer producing masses of purple daisy flowers from late summer into autumn; a good bee plant providing nectar in autumn and also visited by butterflies. Listed as juglone-tolerant by Penn State and UW–Madison Extension (observation-based lists).',
      de: 'Spätblüher mit zahlreichen violetten Korbblüten vom Spätsommer bis in den Herbst; gute Bienenpflanze mit Herbstnektar, auch von Schmetterlingen besucht. Von Penn State und UW–Madison Extension als juglontolerant gelistet (Beobachtungslisten).'
    },
    color: '#9333ea',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-aster.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Found in moist prairies and meadows; needs well-drained soil and prefers rich loam or clay, in sun or partial shade.',
      de: 'Wächst in feuchten Prärien und Wiesen; braucht durchlässigen Boden und bevorzugt nährstoffreichen Lehm oder Ton, in Sonne oder Halbschatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Spätsommer (Aug–Sep)',
      en: 'Spring (Apr–May) or late summer (Aug–Sep)'
    },
    harvestTime: {
      de: 'Spätsommer bis Spätherbst (Aug–Nov, späte Nektarweide)',
      en: 'Late summer to late autumn (Aug–Nov, late pollinator fuel)'
    },
    recommendedForTrees: ['tree-walnut'],
    sources: [
      'Moore, L. M. (2002, edited 2006). Plant Guide: New England aster, Symphyotrichum novae-angliae. USDA NRCS National Plant Data Center. https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_syno2.pdf',
      'North Carolina State Extension (n.d.). Symphyotrichum novae-angliae. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/symphyotrichum-novae-angliae/',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/'
    ]
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
      en: 'Immense broad leaves cast dense shade in deep shade under walnut or dense canopy trees (weed or grass suppression has not been measured). Listed as juglone-tolerant by Penn State, UW–Madison (some varieties) and Ontario (observation-based lists). Mainly ornamental, but in Korea and Japan the leaves of some species (e.g. Hosta sieboldiana) are cooked and eaten. Caution: in Japan, poisonous Veratrum and Colchicum are mistaken for edible hosta. NC State Extension recommends small and medium-sized hostas as groundcovers; bees, butterflies and hummingbirds visit the flowers.',
      de: 'Riesige Schmuckblätter beschatten den Boden im tiefen Schatten unter Walnussbäumen dicht (eine Unkraut- oder Grasunterdrückung wurde nie gemessen). Von Penn State, UW–Madison (einige Sorten) und Ontario als juglontolerant gelistet (Beobachtungslisten). Vor allem Zierpflanze, doch in Korea und Japan werden die Blätter einiger Arten (z. B. Hosta sieboldiana) gegart gegessen. Vorsicht: In Japan werden giftiger Germer (Veratrum) und Herbstzeitlose (Colchicum) mit essbarer Funkie verwechselt. NC State Extension empfiehlt kleine und mittelgroße Funkien als Bodendecker; Bienen, Schmetterlinge und Kolibris besuchen die Blüten.'
    },
    color: '#16a34a',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-hosta.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilNotes: {
      en: 'Performs well in dappled shade in moist, slightly acidic soil rich in organic matter, such as shaded clay or woodland loam.',
      de: 'Gedeiht im lichten Schatten in feuchtem, leicht saurem, humusreichem Boden wie schattigem Ton- oder Waldboden.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Frühherbst (Aug–Okt)',
      en: 'Spring (Mar–May) or early autumn (Aug–Oct)'
    },
    harvestTime: {
      de: 'April bis Mai (junge gerollte Blatttriebe als Urwald-Spargel)',
      en: 'April to May (young furled spring shoots edible)'
    },
    recommendedForTrees: ['tree-walnut', 'tree-pawpaw', 'tree-linden', 'shrub-rhododendron'],
    sources: [
      'North Carolina State Extension (n.d.). Hosta. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/hosta/',
      'Kikkawa, H. S., & Tsuge, K. (2026). Identification of toxic plants from poisonous samples using massively parallel sequencing. Forensic Toxicology, 44(1), 231–240. doi:10.1007/s11419-025-00748-x',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity'
    ]
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
    roles: ['POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.8,
    maxDistanceM: 3,
    spreadM: 0.6,
    heightM: 1.5,
    perennial: true,
    notes: {
      en: 'Yellow umbels attract a wide range of beneficial insects: in field studies they drew hoverflies, ladybeetles, ichneumon wasps and predatory bugs, and also lacewings, social wasps and bees (orchard pest control is field-proven for mixed perennial flower strips, not single plants). Feathery aromatic foliage.',
      de: 'Gelbe Dolden locken viele Nützlinge an: In Feldstudien zogen sie Schwebfliegen, Marienkäfer, Schlupfwespen (Ichneumonidae) und Raubwanzen an, außerdem Florfliegen, soziale Wespen und Bienen (im Obstbau ist eine Schädlingsbekämpfung nur für artenreiche mehrjährige Blühstreifen belegt, nicht für Einzelpflanzen). Gefiedertes, aromatisches Laub.'
    },
    color: '#ca8a04',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-fennel.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Taprooted; thrives in warm, free-draining, fertile sandy loam and chalky soil.',
      de: 'Pfahlwurzler; gedeiht in warmem, durchlässigem Sand- und Kalklehm.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai per Direktsaat)',
      en: 'Spring (Apr–May direct seed)'
    },
    harvestTime: {
      de: 'Kraut: Jun–Sep; Samen: Aug–Okt; Knollen: Sep–Nov',
      en: 'Herb: Jun–Sep; Seeds: Aug–Oct; Bulbs: Sep–Nov'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-linden'],
    sources: [
      'Kopta, T., Pokluda, R., & Psota, V. (2012). Attractiveness of flowering plants for natural enemies. Horticultural Science (Prague), 39(2), 89–96. doi:10.17221/26/2011-HORTSCI',
      'Skaldina, O. (2020). Insects associated with sweet fennel: beneficial visitors attracted by a generalist plant. Arthropod-Plant Interactions, 14(3), 399–407. doi:10.1007/s11829-020-09752-x',
      'Cahenzli, F., Sigsgaard, L., Daniel, C., Herz, A., Jamar, L., Kelderer, M., Jacobsen, S. K., Kruczyńska, D., Matray, S., Porcel, M., Sekrecka, M., Świergiel, W., Tasin, M., Telfser, J., & Pfiffner, L. (2019). Perennial flower strips for pest control in organic apple orchards – A pan-European study. Agriculture, Ecosystems & Environment, 278, 43–53. doi:10.1016/j.agee.2019.03.011'
    ]
  },
  {
    id: 'plant-southernwood',
    retired: true, // no supported guild role left (owner decision 2026-10); kept for share-code indices
    climateZones: ['TEMPERATE','SUBTROPICAL'],
    commonName: {
      en: 'Southernwood',
      de: 'Eberraute'
    },
    botanicalName: 'Artemisia abrotanum',
    layer: 'SHRUB',
    roles: [],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['EARLY_SPRING'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.9,
    maxDistanceM: 1.8,
    spreadM: 0.8,
    heightM: 0.9,
    perennial: true,
    notes: {
      en: 'Feathery grey-green foliage with a pungent, camphor-like scent; the essential oil varies by origin (e.g. piperitone-dominated in Lithuanian plants). Traditional companion for peach, apricot, and plum trees, though claims that its scent masks trees from wood-boring beetles or codling moths are unproven.',
      de: 'Gefiedertes, graugrünes Laub mit stechendem, kampferartigem Duft; das ätherische Öl variiert je nach Herkunft (z. B. bei litauischen Pflanzen von Piperiton dominiert). Traditioneller Partner für Steinobst, eine Abwehr von Holzbohrern oder Wicklern durch Duftüberdeckung ist jedoch unbewiesen.'
    },
    color: '#15803d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-southernwood.webp',
    suitableSoils: ['SANDY', 'CHALKY', 'LOAM'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Very drought-tolerant woody Artemisia for sunny sites with well-drained sandy or limestone soil; prone to rot in moist, poorly drained soil.',
      de: 'Sehr trockenheitsverträglicher Halbstrauch für sonnige Lagen mit durchlässigem Sand- oder Kalkboden; fault in feuchten, schlecht drainierten Böden.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Frühherbst (Sep–Okt)',
      en: 'Spring (Apr–May) or early autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Mai bis September (aromatische Eberraute-Triebe)',
      en: 'May to September (aromatic shoots)'
    },
    recommendedForTrees: [],
    sources: [
      'North Carolina State Extension (n.d.). Artemisia abrotanum. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/artemisia-abrotanum/',
      'Saunoriūtė, S., Ragažinskienė, O., Ivanauskas, L., & Marksa, M. (2020). Essential oil composition of Artemisia abrotanum L. during different vegetation stages in Lithuania. Chemija, 31(1). doi:10.6001/chemija.v31i1.4171'
    ]
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.9,
    maxDistanceM: 2.4,
    spreadM: 1.2,
    heightM: 0.2,
    perennial: false,
    notes: {
      en: 'Vigorous trailing, heat-loving vine that forms a dense ground-covering carpet in warm summer months while producing edible storage roots; plant only after the soil has warmed and frost danger has passed.',
      de: 'Wuchsfreudige, wärmeliebende Kriechpflanze, die im Hochsommer dichte, bodendeckende Teppiche bildet und essbare Speicherwurzeln liefert; erst pflanzen, wenn der Boden warm und keine Frostgefahr mehr ist.'
    },
    color: '#c2410c',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-sweet-potato.webp',
    suitableSoils: ['SANDY', 'LOAM', 'SILT'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Storage roots develop best in well-drained sandy or loamy soil. Heavy clay or rocky soil gives misshapen roots; poorly drained soil lowers yields and can rot the roots.',
      de: 'Speicherwurzeln entwickeln sich am besten in durchlässigem Sand- oder Lehmboden. Schwerer Ton oder steiniger Boden führt zu missgebildeten Knollen, schlecht drainierter Boden zu geringeren Erträgen und Knollenfäule.'
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
    ],
    sources: [
      'Harvey, L. M., & Shankle, M. W. (rev.) (2022). Growing Sweet Potatoes at Home (Publication 2784, POD-01-22). Mississippi State University Extension. https://extension.msstate.edu/publications/growing-sweet-potatoes-home'
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
    roles: ['POLLINATOR_MAGNET'],
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
      en: 'One of the earliest nectar and pollen sources in temperate gardens, long before fruit tree blossom. In Lublin (Poland), golden cup flowers bloomed from early February to the end of March, each producing about 1.2 mg of nectar with around 72% sugar; bees visit them for nectar and pollen. Listed as juglone-tolerant by Penn State Extension (observation-based list).',
      de: 'Eine der frühesten Nektar- und Pollenquellen im Garten, lange vor der Obstblüte. In Lublin (Polen) blühten die gelben Schalenblüten von Anfang Februar bis Ende März und lieferten je etwa 1,2 mg Nektar mit rund 72 % Zucker; Bienen besuchen sie für Nektar und Pollen. Von Penn State Extension als juglontolerant gelistet (Beobachtungsliste).'
    },
    color: '#eab308',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-winter-aconite.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['ACIDIC'],
    soilNotes: {
      en: 'Needs humus-rich, well-drained soil, preferably alkaline, kept moist during the growing season. Goes dormant by late spring.',
      de: 'Braucht humusreichen, durchlässigen, möglichst kalkhaltigen Boden, der während der Wachstumszeit feucht bleibt. Zieht bis zum späten Frühjahr ein.'
    },
    plantingTime: {
      de: 'Frühherbst (Sep–Nov, Knöllchen vor Pflanzung einweichen)',
      en: 'Early autumn (Sep–Nov, soak tubers before planting)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Januar bis März (Winterling-Pollenweide)',
      en: 'Non-edible! Bloom: January to March (winter pollen lifeline)'
    },
    recommendedForTrees: ['tree-apple', 'tree-apricot', 'tree-peach', 'tree-plum', 'tree-pear', 'tree-hazelnut'],
    sources: [
      'Rysiak, K., & Żuraw, B. (2011). The biology of flowering of winter aconite (Eranthis hyemalis (L.) Salisb.). Acta Agrobotanica, 64(2), 25–32. doi:10.5586/aa.2011.014',
      'North Carolina State Extension (n.d.). Eranthis hyemalis. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/eranthis-hyemalis/',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants'
    ]
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
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['WINTER', 'EARLY_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
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
      en: 'Winter-blooming evergreen perennial: flowers around Christmas in mild regions and in early spring in cooler areas. The white flowers are insect-pollinated; in wild Slovenian populations, bees were the main pollinators at one site and small flies at another. Leathery leaves provide year-round living mulch. Leaves and roots are poisonous, but claims that the plant deters voles and rabbits are unproven. Listed as juglone-tolerant by Penn State Extension (observation-based list).',
      de: 'Winterblühende, immergrüne Staude: blüht in milden Regionen um Weihnachten, in kühleren im Vorfrühling. Die weißen Blüten werden von Insekten bestäubt; in wilden Populationen in Slowenien waren an einem Standort Bienen, am anderen kleine Fliegen die wichtigsten Bestäuber. Ledrige Blätter schützen den Boden ganzjährig. Blätter und Wurzeln sind giftig, eine Vertreibung von Wühlmäusen oder Kaninchen ist jedoch unbewiesen. Von Penn State Extension als juglontolerant gelistet (Beobachtungsliste).'
    },
    color: '#f8fafc',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-hellebore.webp',
    suitableSoils: ['LOAM', 'CLAY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['ACIDIC', 'SANDY'],
    soilNotes: {
      en: 'Forest-understorey perennial of the Limestone Alps with a strong preference for carbonate bedrock and base-rich soils; plant in humus-rich, well-drained loam or clay. Tolerates heavy shade.',
      de: 'Waldstaude der Kalkalpen mit deutlicher Vorliebe für Karbonatgestein und basenreiche Böden; in humusreichen, durchlässigen Lehm oder Ton pflanzen. Verträgt tiefen Schatten.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Sep–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Nicht essbar! Blütezeit: Dezember bis April (Christrose / Schneerose)',
      en: 'Non-edible! Bloom: December to April (winter/spring flowering)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-walnut', 'tree-hazelnut', 'tree-plum', 'tree-linden'],
    sources: [
      'Šušek, A., & Ivančič, A. (2006). Pollinators of Helleborus niger in Slovenian naturally occurring populations. Acta Agriculturae Slovenica, 87(2). doi:10.14720/aas.2006.87.2.15074',
      'Záveská, E., Kirschner, P., Frajman, B., Wessely, J., Willner, W., Gattringer, A., Hülber, K., Lazić, D., Dobeš, C., & Schönswetter, P. (2021). Evidence for glacial refugia of the forest understorey species Helleborus niger (Ranunculaceae) in the Southern as well as in the Northern Limestone Alps. Frontiers in Plant Science, 12, 683043. doi:10.3389/fpls.2021.683043',
      'North Carolina State Extension (n.d.). Helleborus niger. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/helleborus-niger/',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants'
    ]
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
    roles: ['BIOMASS_PRODUCER', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['WINTER', 'EARLY_SPRING'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['WINTER', 'EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      pestDeterrenceSeasons: [],
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
      en: 'Permaculture biomass champion. Cut back to a stool while dormant in winter, it regrows many new stems; in short-rotation coppice trials in Poland, osier willow clones yielded on average about 17 t of dry matter per hectare and year (up to 23 t), which can be chipped into ramial woodchip mulch. Claims that its salicylic acid strengthens nearby fruit trees against fungal pathogens are unproven. Listed as juglone-tolerant by UW–Madison Extension and the Morton Arboretum (observation-based lists). Willows flower very early in spring: in a Canadian common-garden study of native willows, the catkins (especially male ones) were visited by wild bees such as Andrena and by hoverflies, before fruit crops bloom.',
      de: 'Der Biomasse-Champion der Permakultur. Im Winter während der Ruhezeit auf den Stock gesetzt, treibt sie zahlreiche neue Ruten; in polnischen Kurzumtriebsversuchen lieferten Korbweiden-Klone im Mittel rund 17 t Trockenmasse pro Hektar und Jahr (bis 23 t), die sich zu Häckselmulch verarbeiten lassen. Dass ihre Salicylsäure die Abwehrkräfte der Obstbäume gegen Schorf und Pilzkrankheiten stärkt, ist unbewiesen. Von UW–Madison Extension und dem Morton Arboretum als juglontolerant gelistet (Beobachtungslisten). Weiden blühen sehr früh im Jahr: In einem kanadischen Vergleichsgarten mit heimischen Weidenarten wurden die (vor allem männlichen) Kätzchen noch vor der Obstblüte von Wildbienen wie Andrena und von Schwebfliegen besucht.'
    },
    color: '#84cc16',
    iconName: 'Scissors',
    imageUrl: '/images/plants/plant-willow.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY', 'SANDY'],
    soilNotes: {
      en: 'Thrives in heavy, moist clay or silt. Roots tolerate flooding well: after 4 weeks of waterlogging, root growth resumed as soon as the soil drained.',
      de: 'Gedeiht in schwerem, feuchtem Ton und Lehm. Die Wurzeln vertragen Überflutung gut: Nach 4 Wochen Staunässe wuchsen sie weiter, sobald der Boden abtrocknete.'
    },
    plantingTime: {
      de: 'Spätherbst bis Vorfrühling (Nov–Mär als unbewurzelte Steckhölzer)',
      en: 'Late autumn to late winter (Nov–Mar as dormant hardwood cuttings)'
    },
    harvestTime: {
      de: 'Winter bis Vorfrühling (Dez–Mär für Flechtweiden; Sommer für Chop & Drop)',
      en: 'Winter (Dec–Mar for weaving rods; summer for chop-and-drop biomass)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-chestnut', 'tree-walnut'],
    sources: [
      'Forest Research (n.d.). Short rotation coppice. Forest Research, UK. https://www.forestresearch.gov.uk/tools-and-resources/fthr/biomass-energy-resources/fuel/energy-crops/short-rotation-coppice/',
      'Szczukowski, S., Stolarski, M., Tworkowski, J., Przyborowski, J., & Klasa, A. (2005). Productivity of willow coppice plants grown in short rotations. Plant, Soil and Environment, 51(9), 423–430. doi:10.17221/3607-PSE',
      'Jackson, M. B., & Attwood, P. A. (1996). Roots of willow (Salix viminalis L.) show marked tolerance to oxygen shortage in flooded soils and in solution culture. Plant and Soil, 187(1), 37–45. doi:10.1007/BF00011655',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/',
      'Morton Arboretum (n.d.). Black walnut toxicity. https://mortonarb.org/plant-and-protect/tree-plant-care/plant-care-resources/black-walnut-toxicity/',
      'Ostaff, D. P., Mosseler, A., Johns, R. C., Javorek, S., Klymko, J., & Ascher, J. S. (2015). Willows (Salix spp.) as pollen and nectar sources for sustaining fruit and berry pollinating insects. Canadian Journal of Plant Science, 95(3), 505–516. doi:10.4141/cjps-2014-339'
    ]
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
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['WINTER', 'EARLY_SPRING', 'SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
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
      en: 'Deciduous shrub that forms nitrogen-fixing root nodules with actinomycetes (Frankia). Can be coppiced in late winter or early spring for green mulch. Its berries ripen in late summer to autumn and are very rich in lycopene (15–54 mg per 100 g fresh fruit, versus about 3 mg in tomato). Invasive in parts of North America, especially on dry sandy soils. Listed as juglone-tolerant by the Ontario Ministry of Agriculture (observation-based list). It is open-pollinated, often by insects.',
      de: 'Sommergrüner Strauch, der mit Strahlenpilzen (Frankia) Stickstoff bindende Wurzelknöllchen bildet. Lässt sich im Spätwinter oder Vorfrühling für Mulch auf den Stock setzen. Die Beeren reifen vom Spätsommer bis in den Herbst und sind sehr lycopinreich (15–54 mg pro 100 g Frischfrucht, Tomate etwa 3 mg). In Teilen Nordamerikas invasiv, besonders auf trockenen Sandböden. Vom Landwirtschaftsministerium Ontarios als juglontolerant gelistet (Beobachtungsliste). Sie wird frei, häufig durch Insekten bestäubt.'
    },
    color: '#065f46',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-elaeagnus.webp',
    suitableSoils: ['SANDY', 'LOAM', 'CLAY', 'CHALKY', 'ACIDIC'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Rugged pioneer shrub that grows on dry to moist sandy soils (pH 5–7 in Ontario); its nitrogen fixation gives it an advantage on infertile soils.',
      de: 'Robuste Pionierpflanze für trockene bis frische Sandböden (pH 5–7 in Ontario); die Stickstofffixierung verschafft ihr auf kargen Böden einen Vorteil.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Herbst (Sep–Nov, essbare vitaminreiche Ölweidenfrüchte)',
      en: 'Autumn (Sep–Nov, nutrient-dense silverberries)'
    },
    recommendedForTrees: ['tree-apple', 'tree-apricot', 'tree-peach', 'tree-pear', 'tree-plum', 'tree-chestnut'],
    sources: [
      'Munger, G. T. (2003). Elaeagnus umbellata. In: Fire Effects Information System. U.S. Department of Agriculture, Forest Service, Rocky Mountain Research Station, Fire Sciences Laboratory. https://www.fs.usda.gov/database/feis/plants/shrub/elaumb/all.html',
      'Fordham, I. M., Clevidence, B. A., Wiley, E. R., & Zimmerman, R. H. (2001). Fruit of autumn olive: A rich source of lycopene. HortScience, 36(6), 1136–1137. doi:10.21273/HORTSCI.36.6.1136',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity'
    ]
  },
  {
    id: 'plant-miners-lettuce',
    climateZones: ['TEMPERATE'],
    commonName: {
      en: "Miner's Lettuce",
      de: 'Winterportulak (Tellerkraut)'
    },
    botanicalName: 'Claytonia perfoliata',
    layer: 'GROUND_COVER',
    roles: ['EDIBLE_UNDERSTORY', 'LIVING_MULCH'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.8,
    maxDistanceM: 2.5,
    spreadM: 0.3,
    heightM: 0.15,
    perennial: false,
    notes: {
      en: 'Cold-hardy winter or spring annual salad green: often overwinters unprotected in USDA zone 6 and can be grown as a winter crop in zone 7. Sown from late summer to mid-autumn, it forms juicy leaf rosettes under dormant fruit trees through winter; the leaves are a good source of vitamin C. A prolific seeder that readily self-sows.',
      de: 'Frostharter ein- bis überjähriger Wintersalat: überwintert in USDA-Zone 6 oft ungeschützt und lässt sich in Zone 7 als Winterkultur ziehen. Von Spätsommer bis Mitte Herbst gesät, bildet er unter laublosen Obstbäumen den Winter über saftige Blattrosetten; die Blätter sind eine gute Vitamin-C-Quelle. Samt sich reichlich selbst aus.'
    },
    color: '#16a34a',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-miners-lettuce.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Usually found on moist or vernally moist sites; prefers cool, moist, humus-rich soil. Forms natural winter living mulch.',
      de: 'Wächst meist an feuchten oder im Frühjahr feuchten Standorten; bevorzugt kühlen, feuchten, humosen Boden. Bildet im Winter lebendigen Bodenschutz.'
    },
    plantingTime: {
      de: 'Spätsommer bis Frühherbst (Aug–Okt) oder Vorfrühling (Feb–Mär)',
      en: 'Late summer to early autumn (Aug–Oct) or late winter (Feb–Mar)'
    },
    harvestTime: {
      de: 'Spätherbst bis Vorfrühling (Nov–Apr, vitaminreiches Wintergrün)',
      en: 'Late autumn to early spring (Nov–Apr, winter salad greens)'
    },
    recommendedForTrees: ['tree-apple', 'tree-walnut', 'tree-hazelnut', 'tree-pear', 'tree-plum'],
    sources: [
      'Matthews, R. F. (1993). Claytonia perfoliata. In: Fire Effects Information System. U.S. Department of Agriculture, Forest Service, Rocky Mountain Research Station, Fire Sciences Laboratory. https://www.fs.usda.gov/database/feis/plants/forb/claper/all.html',
      'Cornell University (n.d.). Claytonia (miner\'s lettuce, winter purslane), Claytonia perfoliata. Cornell Home Gardening – Vegetable Growing Guides. http://www.gardening.cornell.edu/homegardening/scene483b.html'
    ]
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
    roles: ['EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['WINTER', 'EARLY_SPRING', 'LATE_SPRING'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['WINTER', 'EARLY_SPRING', 'LATE_SPRING'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['SUMMER', 'AUTUMN', 'EARLY_SPRING'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.3,
    maxDistanceM: 1.5,
    spreadM: 0.25,
    heightM: 0.3,
    perennial: true,
    notes: {
      en: 'Native woodland allium whose active growth (3.5–4 months) starts between late February and early March, before the tree canopy leafs out. Forms dense spring carpets with white flowers (usually April to mid-May) and a gourmet spring harvest; claims of pest deterrence or protection against tree canker are unproven. In field studies, honeybees and ants were the main flower visitors, and the flowers give honeybees nectar and pollen in spring.',
      de: 'Einheimisches Waldzwiebelgewächs, dessen aktive Wachstumszeit (3,5–4 Monate) zwischen Ende Februar und Anfang März beginnt, noch vor dem Laubaustrieb der Bäume. Bildet dichte Frühjahrsteppiche mit weißen Blüten (meist April bis Mitte Mai) und beliebtem Speisewert; eine Schädlingsabwehr oder ein Schutz vor Rindenpilzen ist unbewiesen. In Feldstudien waren Honigbienen und Ameisen die wichtigsten Blütenbesucher; die Blüten liefern Honigbienen im Frühjahr Nektar und Pollen.'
    },
    color: '#15803d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-wild-garlic.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY', 'ACIDIC'],
    soilNotes: {
      en: 'Flourishes best in light to medium, nutrient-rich, damp but well-drained soils in full shade or semi-shade. As a spring ephemeral it completes its above-ground growth before the canopy closes and then goes dormant.',
      de: 'Gedeiht am besten in leichten bis mittelschweren, nährstoffreichen, feuchten, aber durchlässigen Böden im Schatten oder Halbschatten. Als Frühjahrsgeophyt schließt er sein oberirdisches Wachstum vor dem Kronenschluss ab und zieht dann ein.'
    },
    plantingTime: {
      de: 'Spätsommer bis Herbst (Aug–Nov als Zwiebeln) oder Vorfrühling',
      en: 'Late summer to autumn (Aug–Nov as dormant bulbs)'
    },
    harvestTime: {
      de: 'Vorfrühling bis Mai (Mär–Mai vor der Blüte)',
      en: 'Early spring to May (Mar–May prior to full bloom)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-plum', 'tree-hazelnut', 'tree-walnut', 'shrub-elderberry', 'tree-linden'],
    sources: [
      'Sobolewska, D., Podolak, I., & Makowska-Wąs, J. (2015). Allium ursinum: botanical, phytochemical and pharmacological overview. Phytochemistry Reviews, 14(1), 81–97. doi:10.1007/s11101-013-9334-0',
      'Lapointe, L. (2001). How phenology influences physiology in deciduous forest spring ephemerals. Physiologia Plantarum, 113(2), 151–157. doi:10.1034/j.1399-3054.2001.1130201.x',
      'Farkas, Á., Molnár, R., Morschhauser, T., & Hahn, I. (2012). Variation in nectar volume and sugar concentration of Allium ursinum L. ssp. ucrainicum in three habitats. The Scientific World Journal, 2012, 138579. doi:10.1100/2012/138579'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.5,
    maxDistanceM: 2.0,
    spreadM: 0.5,
    heightM: 0.6,
    perennial: true,
    notes: {
      en: 'Ancient medicinal subshrub whose essential oil is usually dominated by isopinocamphone (about 43–51%) and pinocamphone, although some varieties are rich in linalool instead. In lab tests, hyssop extracts reduced egg-laying by the diamondback moth on brassica leaves, but there is no evidence that hyssop plants deter flea beetles, leafhoppers or mildew in vineyards or orchards. Flowers attract bees, butterflies and other beneficial insects.',
      de: 'Alter Heil-Halbstrauch, dessen ätherisches Öl meist von Isopinocamphon (etwa 43–51 %) und Pinocamphon dominiert wird; manche Varietäten enthalten stattdessen vor allem Linalool. Im Labor verringerten Ysop-Extrakte die Eiablage der Kohlmotte auf Kohlblättern, doch für eine Abwehr von Erdflöhen, Zikaden oder Mehltau durch Ysop-Pflanzen in Wein- oder Obstbau gibt es keinen Beleg. Die Blüten locken Bienen, Schmetterlinge und andere Nützlinge an.'
    },
    color: '#3b82f6',
    iconName: 'Bug',
    imageUrl: '/images/plants/plant-hyssop.webp',
    suitableSoils: ['CHALKY', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Prefers well-drained, fertile loam but also does well in dry sandy soil; traditionally sown in light calcareous soil. Avoid standing water and cold heavy clay.',
      de: 'Bevorzugt durchlässigen, fruchtbaren Lehm, kommt aber auch mit trockenem Sandboden zurecht; traditionell in leichten Kalkboden gesät. Staunässe und kalten, schweren Ton meiden.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Herbst (Sep–Okt)',
      en: 'Spring (Apr–May) or autumn (Sep–Oct)'
    },
    harvestTime: {
      de: 'Juni bis September (würziges Kraut kurz vor oder während der Blüte)',
      en: 'June to September (leaves and flower shoots before full bloom)'
    },
    recommendedForTrees: ['vine-grape', 'tree-peach', 'tree-apple', 'tree-apricot', 'tree-cherry'],
    sources: [
      'Kizil, S., Toncer, O., Ipek, A., Arslan, N., Saglam, S., & Khawar, K. M. (2008). Blooming stages of Turkish hyssop (Hyssopus officinalis L.) affect essential oil composition. Acta Agriculturae Scandinavica, Section B – Soil & Plant Science, 58(3), 273–279. doi:10.1080/09064710701647297',
      'Salvatore, G., D\'Andrea, A., & Nicoletti, M. (1998). A pinocamphone poor oil of Hyssopus officinalis L. var. decumbens from France (Barton). Journal of Essential Oil Research, 10(5), 563–567. doi:10.1080/10412905.1998.9700972',
      'Dover, J. W. (1985). The responses of some Lepidoptera to labiate herb and white clover extracts. Entomologia Experimentalis et Applicata, 39(2), 177–182. doi:10.1111/j.1570-7458.1985.tb03560.x',
      'Sharifi-Rad, J., Quispe, C., Kumar, M., Akram, M., Amin, M., Iqbal, M., Koirala, N., Sytar, O., Kregiel, D., Nicola, S., Ertani, A., Victoriano, M., Khosravi-Dehaghi, N., Martorell, M., Alshehri, M. M., Butnariu, M., Pentea, M., Rotariu, L. S., Calina, D., Cruz-Martins, N., & Cho, W. C. (2022). Hyssopus essential oil: An update of its phytochemistry, biological activities, and safety profile. Oxidative Medicine and Cellular Longevity, 2022, 8442734. doi:10.1155/2022/8442734',
      'North Carolina State Extension (n.d.). Hyssopus officinalis. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/hyssopus-officinalis/'
    ]
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.3,
    maxDistanceM: 1.5,
    spreadM: 0.6,
    heightM: 0.15,
    perennial: true,
    notes: {
      en: 'Low, trailing evergreen ericaceous ground cover forming a dense living mulch. Like blueberries and other Ericaceae it forms ericoid mycorrhizas, which were found in the roots of all cultivated cranberry samples tested and are thought to aid nitrogen nutrition; whether it protects blueberry roots from weeds or drying has not been tested.',
      de: 'Niedriger, kriechender, immergrüner Zwergstrauch, der einen dichten lebenden Mulch bildet. Wie Heidelbeeren und andere Heidekrautgewächse bildet er eine ericoide Mykorrhiza, die in allen untersuchten Wurzelproben kultivierter Cranberries gefunden wurde und vermutlich die Stickstoffversorgung unterstützt; ob er Heidelbeerwurzeln vor Unkraut oder Austrocknung schützt, wurde nicht geprüft.'
    },
    color: '#991b1b',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-cranberry.webp',
    suitableSoils: ['ACIDIC', 'SANDY'],
    unsuitableSoils: ['CHALKY', 'CLAY', 'LOAM'],
    soilNotes: {
      en: 'Acid-loving (soil pH needs to be 4.0–5.2); usually grown in wet, boggy, peaty or sandy conditions and tolerates periodic flooding. Prone to chlorosis if soil pH is too high.',
      de: 'Säureliebend (Boden-pH 4,0–5,2 erforderlich); wird meist in nassem, moorigem, torfigem oder sandigem Boden kultiviert und verträgt zeitweise Überflutung. Bei zu hohem pH-Wert chloroseanfällig.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) in saurem Feuchtboden',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) in acidic moist soil'
    },
    harvestTime: {
      de: 'Frühherbst bis Spätherbst (Sep–Nov)',
      en: 'Early autumn to late autumn (Sep–Nov)'
    },
    recommendedForTrees: ['shrub-blueberry', 'tree-chestnut', 'shrub-rhododendron'],
    sources: [
      'North Carolina State Extension (n.d.). Vaccinium macrocarpon. NC Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/vaccinium-macrocarpon/',
      'Kosola, K. R., & Workmaster, B. A. A. (2007). Mycorrhizal colonization of cranberry: Effects of cultivar, soil type, and leaf litter composition. Journal of the American Society for Horticultural Science, 132(1), 134–141. doi:10.21273/JASHS.132.1.134',
      'Read, D. J. (1996). The structure and function of the ericoid mycorrhizal root. Annals of Botany, 77(4), 365–374. doi:10.1006/anbo.1996.0044'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.2,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'Potent aromatic perennial whose essential oil occurs in several chemotypes, such as β-thujone, trans-chrysanthenyl acetate and camphor/β-thujone types. In a lab barrier test, tansy oil was among the four strongest repellents of newly hatched codling moth larvae, but repelling codling moths, fruit flies, beetles, ants or aphids as a living plant is unproven. An extension guide lists tansy flowers as attracting tachinid flies, parasitoid wasps, lacewings and lady beetles.',
      de: 'Stark duftende Wildstaude, deren ätherisches Öl in mehreren Chemotypen vorkommt, etwa als β-Thujon-, trans-Chrysanthenylacetat- und Kampfer/β-Thujon-Typ. In einem Labor-Barrieretest gehörte Rainfarnöl zu den vier stärksten Repellents gegen frisch geschlüpfte Apfelwicklerlarven, eine Vertreibung von Apfelwicklern, Fruchtfliegen, Käfern, Ameisen oder Blattläusen durch die lebende Pflanze ist jedoch unbewiesen. Ein Beratungsleitfaden führt Rainfarnblüten als Anziehungspunkt für Raupenfliegen, Schlupfwespen, Florfliegen und Marienkäfer.'
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
    recommendedForTrees: ['tree-cherry', 'tree-peach', 'tree-apple', 'tree-plum', 'vine-grape'],
    sources: [
      'De Pooter, H. L., Vermeesch, J., & Schamp, N. M. (1989). The essential oils of Tanacetum vulgare L. and Tanacetum parthenium (L.) Schultz-Bip. Journal of Essential Oil Research, 1(1), 9–13. doi:10.1080/10412905.1989.9699438',
      'Landolt, P. J., Hofstetter, R. W., & Biddick, L. L. (1999). Plant essential oils as arrestants and repellents for neonate larvae of the codling moth (Lepidoptera: Tortricidae). Environmental Entomology, 28(6), 954–960. doi:10.1093/ee/28.6.954',
      'Amarasekare, K. (2020). Plants that attract insect predators and parasitoids (ANR-E2-2020). Tennessee State University Cooperative Extension. https://www.tnstate.edu/extension/documents/Plants%20that%20attract%20insect%20predators%20and%20parasitoids%20-Kaushalya%20Amarasekare.pdf'
    ]
  },
  {
    id: 'plant-hyacinth',
    commonName: {
      de: 'Garten-Hyazinthe',
      en: 'Common Hyacinth'
    },
    botanicalName: 'Hyacinthus orientalis',
    layer: 'BULB_ROOT',
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ["EARLY_SPRING","LATE_SPRING"],
      floweringSeasons: ['EARLY_SPRING'],
      foliageSeasons: ["EARLY_SPRING","LATE_SPRING"],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
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
      de: 'Robuster Frühlingsblüher. Die Zwiebeln enthalten Calciumoxalat-Kristalle, die bei fast jedem Hautkontakt Juckreiz auslösen; in Fraßversuchen mieden Wühlmäuse frische Zwiebeln nur teilweise und fraßen ins Futter gemischtes Hyazinthenzwiebel-Pulver bereitwillig, sie schützen Baumwurzeln also womöglich nicht vor Wühlmäusen. Im Frühjahr (in Lublin ab April, 14–24 Tage lang) liefert jede Blüte im Mittel 1,6 mg Nektarzucker und 3,5 mg Pollen und wird von Honigbienen und Hummeln besucht. Von Purdue Extension als juglontolerant gelistet (Beobachtungsliste).',
      en: 'Hardy spring bloomer. Bulbs contain calcium oxalate crystals that make almost anyone\'s skin itch on contact, but in feeding trials voles showed only some resistance to fresh bulbs and readily ate dried hyacinth bulb mixed into food, so they may not protect tree roots from voles. In spring (from April for 14–24 days in Lublin, Poland) each flower offers on average 1.6 mg of nectar sugar and 3.5 mg of pollen and is visited by honey bees and bumblebees. Listed as juglone-tolerant by Purdue Extension (observation-based list).'
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
      "tree-tea-sinensis", 'tree-linden'],
    sources: [
      'Bruynzeel, D. P. (1997). Bulb dermatitis. Contact Dermatitis, 37(2), 70–77. doi:10.1111/j.1600-0536.1997.tb00042.x',
      'Curtis, P. D., Curtis, G. B., & Miller, W. B. (2009). Relative resistance of ornamental flowering bulbs to feeding damage by voles. HortTechnology, 19(3), 499–503. doi:10.21273/horttech.19.3.499',
      'Bożek, M. (2019). Nectar secretion and pollen production in Hyacinthus orientalis ‘Sky Jacket’ (Asparagaceae). Acta Agrobotanica, 72(4). doi:10.5586/aa.1796',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf'
    ]
  },
  {
    id: 'plant-tea-sinensis',
    commonName: {
      de: 'Chinesischer Teestrauch',
      en: 'Chinese Tea Bush'
    },
    botanicalName: 'Camellia sinensis var. sinensis',
    layer: 'SHRUB',
    roles: ['EDIBLE_UNDERSTORY'],
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
    jugloneTolerance: 'NEUTRAL',
    climateZones: ["TEMPERATE","SUBTROPICAL"],
    minDistanceM: 2,
    maxDistanceM: 4,
    spreadM: 1.2,
    heightM: 1.8,
    perennial: true,
    notes: {
      de: 'Wertvoller immergrüner Strauch (Zone 3, Ost-Morgensonne / lichter Kronenschatten) unter lichten Stickstoff- oder Tiefwurzler-Bäumen wie Schwarzerle oder Ginkgo. Beschattung verändert die Blattchemie: Im Schatten gezogener Tee (Tencha) enthielt weniger Epigallocatechin und Epicatechin als Sonnentee und schmeckt umamireicher und weniger adstringierend; stärkere und längere Beschattung erhöhte die freien Aminosäuren. L-Theanin wird vor allem in den Wurzeln gebildet und in die Triebe transportiert, Beschattung fördert seine Bildung in der Wurzel. Der Teestrauch nimmt aus sauren Böden große Mengen Aluminium und Fluorid auf.',
      en: 'Valuable evergreen understory shrub (Zone 3, East morning sun / dappled canopy shade) beneath light-canopy nitrogen fixers or deep-rooted trees such as Black Alder or Ginkgo. Shading changes leaf chemistry: shade-grown tea (tencha) contained less epigallocatechin and epicatechin than sun-grown green tea and tastes more umami and less astringent, and heavier, longer shading raised free amino acids. L-theanine is synthesized mainly in the roots and transported to the shoots; shading promotes its synthesis in the roots. The tea plant takes up large amounts of aluminium and fluoride from acidic soils.'
    },
    color: '#15803d',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-tea-sinensis.webp',
    suitableSoils: ["ACIDIC","LOAM","SILT"],
    unsuitableSoils: ["CHALKY"],
    soilNotes: {
      de: 'Braucht sauren Boden: pH 4,5–5,5 gilt als optimal, in Nährlösung wuchs Tee bei pH 5,0 am besten. Bevorzugt Ammonium (NH4+), das 2- bis 3,4-mal schneller aufgenommen wird als Nitrat und in den Wurzeln mit hoher Glutaminsynthetase-Aktivität verarbeitet wird. Teeplantagen mit Mineraldüngung versauern den Boden stark, ökologisch bewirtschaftete kaum.',
      en: 'Needs acidic soil: pH 4.5–5.5 is considered optimal, and in solution culture tea grew best at pH 5.0. Prefers ammonium (NH4+), which it absorbs 2–3.4 times faster than nitrate and assimilates in the roots with high glutamine synthetase activity. Tea plantations given chemical fertilizer acidify the soil strongly, organic ones hardly at all.'
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
    ],
    sources: [
      'Ku, K. M., Choi, J. N., Kim, J., Kim, J. K., Yoo, L. G., Lee, S. J., Hong, Y.-S., & Lee, C. H. (2010). Metabolomics analysis reveals the compositional differences of shade grown tea (Camellia sinensis L.). Journal of Agricultural and Food Chemistry, 58(1), 418–426. doi:10.1021/jf902929h',
      'Ji, H.-G., Lee, Y.-R., Lee, M.-S., Hwang, K. H., Park, C. Y., Kim, E.-H., Park, J. S., & Hong, Y.-S. (2018). Diverse metabolite variations in tea (Camellia sinensis L.) leaves grown under various shade conditions revisited: A metabolomics study. Journal of Agricultural and Food Chemistry, 66(8), 1889–1897. doi:10.1021/acs.jafc.7b04768',
      'Yang, T., Xie, Y., Lu, X., Yan, X., Wang, Y., Ma, J., Cheng, X., Lin, S., Bao, S., Wan, X., Lucas, W. J., & Zhang, Z. (2021). Shading promoted theanine biosynthesis in the roots and allocation in the shoots of the tea plant (Camellia sinensis L.) cultivar Shuchazao. Journal of Agricultural and Food Chemistry, 69(16), 4795–4803. doi:10.1021/acs.jafc.1c00641',
      'Ruan, J., Gerendás, J., Härdter, R., & Sattelmacher, B. (2007). Effect of nitrogen form and root-zone pH on growth and nitrogen uptake of tea (Camellia sinensis) plants. Annals of Botany, 99(2), 301–310. doi:10.1093/aob/mcl258',
      'Yan, P., Wu, L., Wang, D., Fu, J., Shen, C., Li, X., Zhang, L., Zhang, L., Fan, L., & Han, W. (2020). Soil acidification in Chinese tea plantations. Science of the Total Environment, 715, 136963. doi:10.1016/j.scitotenv.2020.136963',
      'Wong, M. H., Fung, K. F., & Carr, H. P. (2003). Aluminium and fluoride contents of tea, with emphasis on brick tea and their health implications. Toxicology Letters, 137(1–2), 111–120. doi:10.1016/S0378-4274(02)00385-5'
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
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
      en: 'Well-known nematode cover crop. Its roots release alpha-terthienyl; grown densely for at least two months before the following crop on the same spot, it suppresses mainly root-knot (Meloidogyne spp.) and lesion nematodes (Pratylenchus spp.). Intercropping marigold with other crops does not appear to be effective, so no nematode protection should be expected for neighbouring trees. Claims that its scent masks trees from whiteflies and aphids are also unproven. Flowers continuously until the autumn frosts. Listed as juglone-tolerant by UW–Madison Extension (observation-based list). In a US trial its flowers were visited by hoverflies, honey bees and wild bees; single-flowered French marigold cultivars were among the most visited, crested ones among the least.',
      de: 'Bekannte Nematoden-Vorkultur. Die Wurzeln geben alpha-Terthienyl ab; dicht gesät und mindestens zwei Monate vor der Folgekultur am selben Platz angebaut, senkt sie vor allem Wurzelgallenälchen (Meloidogyne spp.) und Wurzelläsionsnematoden (Pratylenchus spp.). Als Mischkultur neben anderen Pflanzen scheint sie nicht zu wirken, ein Nematodenschutz für benachbarte Bäume ist also nicht zu erwarten. Eine Duftmaskierung gegen Weiße Fliegen und Blattläuse ist ebenfalls unbewiesen. Blüht durchgehend bis zu den ersten Herbstfrösten. Von UW–Madison Extension als juglontolerant gelistet (Beobachtungsliste). In einem US-Versuch besuchten Schwebfliegen, Honigbienen und Wildbienen die Blüten; einfach blühende Sorten der Studentenblume gehörten zu den meistbesuchten, Sorten mit Kammblüten zu den am wenigsten besuchten.'
    },
    color: '#f59e0b',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-marigold.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Thrives in any sunny, well-draining garden soil.',
      de: 'Gedeiht in jedem durchlässigen, sonnigen Gartenboden.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai nach den Eisheiligen als Aussaat oder Setzling)',
      en: 'Spring (Apr–May after last frosts as seeds or transplants)'
    },
    harvestTime: {
      de: 'Juni bis Oktober (durchgehende Blütezeit)',
      en: 'June to October (continuous flowering)'
    },
    recommendedForTrees: [
      'tree-fig',
      'tree-peach',
      'tree-apricot',
      'tree-plum',
      'tree-apple',
      'tree-quince'
    ],
    sources: [
      'Krueger, R., Dover, K. E., McSorley, R., & Wang, K.-H. (2019). Marigolds (Tagetes spp.) for Nematode Management (ENY-056/NG045). UF/IFAS Extension. https://edis.ifas.ufl.edu/publication/NG045',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/',
      'Browning, A., Smitley, D., Studyvin, J., Runkle, E. S., Huang, Z. Y., & Hotchkiss, E. (2023). Variation in pollinator visitation among garden cultivars of marigold, portulaca, and bidens. Journal of Economic Entomology, 116(3), 872–881. doi:10.1093/jee/toad050'
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
    roles: ['BIOMASS_PRODUCER', 'DYNAMIC_ACCUMULATOR', 'GRASS_BARRIER', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'NORTH_SHADE',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.8,
    maxDistanceM: 4.5,
    spreadM: 0.7,
    heightM: 2.8,
    perennial: false,
    notes: {
      en: 'Vigorous annual with a strong taproot; in field trials roots reached 1.3–2 m depth, although about half the root biomass stays in the top 20–50 cm. Dense, tall stands suppress many annual weeds without herbicides. Wind-pollinated and nectarless, but its abundant pollen is collected by bees in late summer when few other plants flower. High biomass producer for carbon-rich chop and drop.',
      de: 'Wüchsige einjährige Pflanze mit kräftiger Pfahlwurzel; in Feldversuchen reichten die Wurzeln 1,3–2 m tief, wobei rund die Hälfte der Wurzelmasse in den oberen 20–50 cm liegt. Dichte, hohe Bestände unterdrücken viele einjährige Unkräuter ohne Herbizide. Windbestäubt und nektarlos, doch der reichliche Pollen wird im Spätsommer, wenn wenig anderes blüht, von Bienen gesammelt. Liefert viel Biomasse für kohlenstoffreichen Chop & Drop.'
    },
    color: '#15803d',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-hemp.webp',
    suitableSoils: ['LOAM', 'SILT', 'SANDY', 'CHALKY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Requires deep, loose, well-drained loam or silt (pH about 6.0–7.5). Avoid wet, heavy clay (prone to crusting and compaction) and strongly acidic soils.',
      de: 'Bevorzugt tiefgründige, lockere, gut drainierte Lehm- und Lössböden (pH etwa 6,0–7,5). Meidet nasse, schwere Tonböden (Verkrustung, Verdichtung) und stark saure Standorte.'
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
    ],
    sources: [
      'Amaducci, S., et al. (2008). Characterisation of hemp (Cannabis sativa L.) roots under different growing conditions. Plant and Soil, 313(1–2), 227–235. doi:10.1007/s11104-008-9695-0',
      'Jankauskienė, Z., Gruzdevienė, E., & Lazauskas, S. (2014). Potential of industrial hemp (Cannabis sativa L.) genotypes to suppress weeds. Zemdirbyste-Agriculture, 101(3), 265–270. doi:10.13080/z-a.2014.101.034',
      'O’Brien, C., & Arathi, H. S. (2019). Bee diversity and abundance on flowers of industrial hemp (Cannabis sativa L.). Biomass and Bioenergy, 122, 331–335. doi:10.1016/j.biombioe.2019.01.015',
      'Flicker, N. R., Poveda, K., & Grab, H. (2020). The bee community of Cannabis sativa and corresponding effects of landscape composition. Environmental Entomology, 49(1), 197–202. doi:10.1093/ee/nvz141',
      'Alberti, P. (2019). A Introduction to Hemp Production [Industrial Hemp Production Workshop, Sterling, IL]. University of Illinois Extension. https://extension.illinois.edu/sites/default/files/jsw_industrial_hemp_grain_and_fiber.pdf',
      'Scott, H. R., McDonald, L. M., & Skousen, J. (n.d.). Industrial Hemp Planting and Production [Fact sheet]. West Virginia Department of Agriculture. https://agriculture.wv.gov/wp-content/uploads/Hemp-Fact-Sheet-5-19.pdf'
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
    roles: ['PEST_REPELLER', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.5,
    maxDistanceM: 4.5,
    spreadM: 1.0,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Evergreen Mediterranean shrub whose essential oil is dominated by alpha-pinene and 1,8-cineole, with verbenone and camphor varying by chemotype. Intercropped in tea plantations, rosemary suppressed the tea geometrid moth (Ectropis obliqua), whose host-finding its odour disturbs; protection of fruit trees from tortricid moths and aphids is unproven. Its spring flowers are popular with bees and other pollinators.',
      de: 'Immergrüner mediterraner Halbstrauch; das ätherische Öl wird von alpha-Pinen und 1,8-Cineol dominiert, Verbenon und Kampfer schwanken je nach Chemotyp. Als Zwischenpflanzung in Teeplantagen unterdrückte Rosmarin den Tee-Spanner (Ectropis obliqua), dessen Wirtsfindung sein Duft stört; ein Schutz von Obstbäumen vor Wicklern und Blattläusen ist unbewiesen. Die Frühjahrsblüten werden gern von Bienen und anderen Bestäubern besucht.'
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
    ],
    sources: [
      'Satyal, P., et al. (2017). Chemotypic characterization and biological activity of Rosmarinus officinalis. Foods, 6(3), 20. doi:10.3390/foods6030020',
      'Zhang, Z.-Q., et al. (2013). Identification and field evaluation of non-host volatiles disturbing host location by the tea geometrid, Ectropis obliqua. Journal of Chemical Ecology, 39(10), 1284–1296. doi:10.1007/s10886-013-0344-6',
      'Royal Horticultural Society (n.d.). How to grow rosemary. RHS Grow Your Own. https://www.rhs.org.uk/herbs/rosemary/grow-your-own'
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
    roles: ['POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'ANY',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 0.7,
    perennial: true,
    notes: {
      en: 'Leaf oil is dominated by citral (geranial and neral) with citronellal and geraniol. Citral and geraniol are also key components of the honeybee Nasonov orientation pheromone, but there is no evidence that the foliage lures bees or improves fruit set of pears or other fruit trees. The small summer flowers are rich in nectar and much visited by bees.',
      de: 'Das Blattöl wird von Citral (Geranial und Neral) dominiert, daneben Citronellal und Geraniol. Citral und Geraniol sind auch Hauptkomponenten des Nasonov-Orientierungspheromons der Honigbiene; dass das Laub Bienen anlockt oder den Fruchtansatz von Birnen oder anderen Obstbäumen verbessert, ist jedoch nicht belegt. Die kleinen Sommerblüten sind nektarreich und werden stark von Bienen beflogen.'
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
    ],
    sources: [
      'Petrișor, G., et al. (2022). Melissa officinalis: Composition, pharmacological effects and derived release systems—A review. International Journal of Molecular Sciences, 23(7), 3591. doi:10.3390/ijms23073591',
      'Free, J. B., Ferguson, A. W., & Pickett, J. A. (1981). Evaluation of the various components of the Nasonov pheromone used by clustering honeybees. Physiological Entomology, 6(3), 263–268. doi:10.1111/j.1365-3032.1981.tb00270.x',
      'Royal Horticultural Society (n.d.). How to grow lemon balm. RHS Grow Your Own. https://www.rhs.org.uk/herbs/lemon-balm/grow-your-own'
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
    roles: ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING'],
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
      en: 'Shade-tolerant perennial umbellifer whose leaf oil is dominated by (E)-anethole, giving its anise scent. Creamy-white umbels open in May–June and are pollinated by bees. Forms a substantial taproot. Listed as juglone-tolerant by Purdue Extension (observation-based list).',
      de: 'Schattentoleranter, mehrjähriger Doldenblütler, dessen Blattöl von (E)-Anethol dominiert wird (Anisduft). Die cremeweißen Dolden öffnen sich im Mai–Juni und werden von Bienen bestäubt. Bildet eine kräftige Pfahlwurzel. Von Purdue Extension als juglontolerant gelistet (Beobachtungsliste).'
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
    ],
    sources: [
      'Uusitalo, J. S., et al. (1999). Essential leaf oil composition of Myrrhis odorata (L.) Scop. grown in Finland. Journal of Essential Oil Research, 11(4), 423–425. doi:10.1080/10412905.1999.9701174',
      'Dobravalskytė, D., et al. (2012). Essential oil composition of Myrrhis odorata (L.) Scop. leaves grown in Lithuania and France. Journal of Essential Oil Research, 25(1), 44–48. doi:10.1080/10412905.2012.744703',
      'University of Oxford, Department of Biology (n.d.). Myrrhis odorata. Oxford University Plants 400. https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/MN/Myrrhis',
      'Chicago Botanic Garden (n.d.). Myrrhis odorata (sweet cicely). Plant Finder. https://www.chicagobotanic.org/plant-information/plant-finder/myrrhis-odorata-sweet-cicely',
      'Bebeau, G. D. (2015). Sweet Cicely, Myrrhis odorata (L.) Scop. Friends of the Wildflower Garden. https://www.friendsofeloisebutler.org/pages/plants/sweetcicely.html',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf'
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
    roles: ['DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
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
      en: 'Deep-taproot pioneer: the taproot usually reaches 15–30 cm but can grow to about 90 cm, helping it survive drought. Flowers very early in spring and is an important early nectar source for bees when little else blooms. Its pollen is used mainly by Asteraceae-specialist bees; for bumblebees it is a poor sole pollen diet, so it works best within a diverse spring flower mix. Listed as juglone-tolerant by the Ontario Ministry of Agriculture (observation-based list).',
      de: 'Tiefwurzelnder Pionier: Die Pfahlwurzel reicht meist 15–30 cm tief, kann aber bis etwa 90 cm lang werden und hilft so bei Trockenheit. Blüht sehr früh im Jahr und ist eine wichtige frühe Nektarquelle für Bienen, wenn sonst wenig blüht. Der Pollen wird vor allem von auf Korbblütler spezialisierten Wildbienen genutzt; für Hummeln ist er als alleinige Pollenquelle wenig geeignet, daher am besten in einem vielfältigen Frühjahrsblühangebot. Vom Landwirtschaftsministerium Ontarios als juglontolerant gelistet (Beobachtungsliste).'
    },
    color: '#eab308',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-dandelion.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SANDY', 'CHALKY', 'SILT', 'ACIDIC'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Universal pioneer that grows on almost any soil.',
      de: 'Universelle Pionierpflanze, die auf nahezu jedem Boden wächst.'
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
    ],
    sources: [
      'Mahr, S. (2026). Dandelion, Taraxacum officinale. Wisconsin Horticulture, University of Wisconsin–Madison Extension. https://hort.extension.wisc.edu/articles/dandelion-taraxacum-officinale/',
      'Vanderplanck, M., et al. (2020). Asteraceae paradox: Chemical and mechanical protection of Taraxacum pollen. Insects, 11(5), 304. doi:10.3390/insects11050304',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity'
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      chopAndDropSeasons: ['SUMMER'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER'],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.6,
    maxDistanceM: 2.5,
    spreadM: 0.3,
    heightM: 0.5,
    perennial: false,
    notes: {
      en: 'Self-seeding annual medicinal herb; its flowers contain an essential oil with alpha-bisabolol, bisabolol oxides and matricin, which is converted to chamazulene. Its flowers attract mostly bees and flies.',
      de: 'Selbstaussäende einjährige Heilpflanze; die Blüten enthalten ätherisches Öl mit alpha-Bisabolol, Bisabololoxiden und Matricin, das zu Chamazulen umgewandelt wird. Die Blüten locken vor allem Bienen und Fliegen an.'
    },
    color: '#fde047',
    iconName: 'Sparkles',
    imageUrl: '/images/plants/plant-chamomile.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CLAY', 'CHALKY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Undemanding: prefers open, sunny, loose loam to sandy-loam soils with good drainage; tolerates poor, alkaline and even saline soils.',
      de: 'Anspruchslos: bevorzugt sonnige, offene, lockere Lehm- bis sandige Lehmböden mit guter Drainage; verträgt auch magere, alkalische und sogar salzhaltige Böden.'
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
      'tree-cherry', 'shrub-red-currant', 'shrub-rhododendron'],
    sources: [
      'Srivastava, J. K., Shankar, E., & Gupta, S. (2010). Chamomile: A herbal medicine of the past with bright future. Molecular Medicine Reports, 3(6), 895–901. doi:10.3892/mmr.2010.377',
      'Chauhan, R., et al. (2021). A comprehensive review on biology, genetic improvement, agro and process technology of German chamomile (Matricaria chamomilla L.). Plants, 11(1), 29. doi:10.3390/plants11010029',
      'NC State Extension (n.d.). Matricaria chamomilla. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/matricaria-chamomilla/'
    ]
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
    roles: ['LIVING_MULCH', 'POLLINATOR_MAGNET', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['LATE_SPRING'],
      harvestSeasons: ['SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.7,
    maxDistanceM: 3.0,
    spreadM: 0.5,
    heightM: 0.4,
    perennial: true,
    notes: {
      en: 'Aromatic, woody-based groundcover. Oil chemistry varies strongly by subspecies: Greek oregano (subsp. hirtum) is rich in carvacrol, whereas native wild marjoram (subsp. vulgare) is often a sabinyl/cymyl type rich in terpinen-4-ol. In lab and tomato trials, carvacrol-rich oregano oil, carvacrol and thymol inhibited spore germination and mycelial growth of grey mould (Botrytis cinerea) by making fungal membranes leaky; a protective effect of living plants on nearby vines or berry shrubs has not been shown. In a five-year UK trial of 111 garden plants, wild marjoram ranked sixth for pollinator visits, mostly by honey bees but also by bumblebees and butterflies.',
      de: 'Aromatischer Halbstrauch-Bodendecker. Die Ölzusammensetzung schwankt stark je nach Unterart: Griechischer Oregano (subsp. hirtum) ist carvacrolreich, der heimische Dost (subsp. vulgare) dagegen oft ein Sabinyl/Cymyl-Typ mit viel Terpinen-4-ol. In Labor- und Tomatenversuchen hemmten carvacrolreiches Oreganoöl, Carvacrol und Thymol Sporenkeimung und Myzelwachstum von Grauschimmel (Botrytis cinerea), indem sie die Pilzmembranen durchlässig machten; eine Schutzwirkung lebender Pflanzen auf benachbarte Reben oder Beerensträucher ist nicht belegt. In einem fünfjährigen britischen Versuch mit 111 Gartenpflanzen lag Wilder Majoran bei den Bestäuberbesuchen auf Platz sechs, vor allem durch Honigbienen, aber auch durch Hummeln und Schmetterlinge.'
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
      'tree-seabuckthorn-star', 'shrub-red-currant'],
    sources: [
      'Hou, H., Zhang, X., Zhao, T., & Zhou, L. (2020). Effects of Origanum vulgare essential oil and its two main components, carvacrol and thymol, on the plant pathogen Botrytis cinerea. PeerJ, 8, e9626. doi:10.7717/peerj.9626',
      'Zhang, J., et al. (2019). Antifungal activity of thymol and carvacrol against postharvest pathogens Botrytis cinerea. Journal of Food Science and Technology, 56(5), 2611–2620. doi:10.1007/s13197-019-03747-0',
      'Kosakowska, O., et al. (2021). Antioxidant and antibacterial activity of essential oils and hydroethanolic extracts of Greek oregano (O. vulgare L. subsp. hirtum (Link) Ietswaart) and common oregano (O. vulgare L. subsp. vulgare). Molecules, 26(4), 988. doi:10.3390/molecules26040988',
      'Rollings, R., & Goulson, D. (2019). Quantifying the attractiveness of garden flowers for pollinators. Journal of Insect Conservation, 23(5–6), 803–817. doi:10.1007/s10841-019-00177-3'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['SUMMER', 'AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_2_MID',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 0.8,
    perennial: true,
    notes: {
      en: 'Produces nepetalactone, which repels mosquitoes and flies by activating the insect irritant receptor TRPA1; catnip oil strongly repelled stable flies and house flies in lab tests. Nepetalactone is also an aphid sex-pheromone component: in field trap trials, nepetalactone lures attracted aphid parasitoids of the genus Praon (mainly in autumn) and males of Chrysopa lacewings, but deterred common green lacewings (Chrysoperla carnea). Bees of all kinds, wasps, flies and many butterflies visit its nectar-rich flowers.',
      de: 'Bildet Nepetalacton, das Stechmücken und Fliegen über den Reizrezeptor TRPA1 der Insekten abschreckt; Katzenminzenöl wirkte im Labor stark abschreckend auf Wadenstecher und Stubenfliegen. Nepetalacton ist zugleich Bestandteil des Blattlaus-Sexualpheromons: In Fallenversuchen lockte es Blattlaus-Schlupfwespen der Gattung Praon (vor allem im Herbst) und Männchen von Chrysopa-Florfliegen an, schreckte aber die Gemeine Florfliege (Chrysoperla carnea) ab. Bienen aller Art, Wespen, Fliegen und viele Schmetterlinge besuchen die nektarreichen Blüten.'
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
      'tree-fig', 'tree-linden'],
    sources: [
      'Melo, N., et al. (2021). The irritant receptor TRPA1 mediates the mosquito repellent effect of catnip. Current Biology, 31(9), 1988–1994.e5. doi:10.1016/j.cub.2021.02.010',
      'Zhu, J., et al. (2009). Efficacy and safety of catnip (Nepeta cataria) as a novel filth fly repellent. Medical and Veterinary Entomology, 23(3), 209–216. doi:10.1111/j.1365-2915.2009.00809.x',
      'Hardie, J., et al. (1994). The responses of Praon spp. parasitoids to aphid sex pheromone components in the field. Entomologia Experimentalis et Applicata, 71(2), 95–99. doi:10.1111/j.1570-7458.1994.tb01775.x',
      'Koczor, S., et al. (2010). Attraction of Chrysoperla carnea complex and Chrysopa spp. lacewings (Neuroptera: Chrysopidae) to aphid sex pheromone components and a synthetic blend of floral compounds in Hungary. Pest Management Science, 66(12), 1374–1379. doi:10.1002/ps.2030',
      'Mahr, S. (n.d., revised 2026). Catnip, Nepeta cataria. Wisconsin Horticulture, University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/catnip-nepeta-cataria/'
    ]
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
    roles: ['LIVING_MULCH', 'POLLINATOR_MAGNET'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.4,
    maxDistanceM: 3.5,
    spreadM: 0.8,
    heightM: 0.08,
    perennial: true,
    notes: {
      en: 'Forms a dense, prostrate, semi-evergreen mat that covers moist soil. Its yellow flowers offer floral oil and pollen to specialist oil-collecting bees (Macropis). Spreads vigorously and is considered invasive in some regions, so keep it contained.',
      de: 'Bildet einen dichten, niederliegenden, halbimmergrünen Teppich, der feuchten Boden bedeckt. Die gelben Blüten bieten Blütenöl und Pollen für spezialisierte Öl-Bienen (Macropis). Breitet sich stark aus und gilt regional als invasiv, daher eingrenzen.'
    },
    color: '#4ade80',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-creeping-jenny.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in moist to wet soils, including heavy loam and clay, in sun or partial shade.',
      de: 'Gedeiht auf frischen bis nassen Böden, auch schweren Lehm- und Tonböden, in Sonne oder Halbschatten.'
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
    ],
    sources: [
      'NC State Extension (n.d.). Lysimachia nummularia (Creeping Jenny). North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/lysimachia-nummularia/',
      'Radchenko, V. G., et al. (2025). Structural and functional co-adaptation of plants of the genus Lysimachia L. (Primulaceae) and pollinating insects of the genus Macropis Panzer (Hymenoptera, Melittidae). Ecology and Evolution, 15(12), e72544. doi:10.1002/ece3.72544',
      'Michez, D., & Patiny, S. (2005). World revision of the oil-collecting bee genus Macropis Panzer 1809 (Hymenoptera: Apoidea: Melittidae) with a description of a new species from Laos. Annales de la Société entomologique de France (N.S.), 41(1), 15–28. doi:10.1080/00379271.2005.10697439'
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
    roles: ['POLLINATOR_MAGNET', 'BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.5,
    maxDistanceM: 4.0,
    spreadM: 1.0,
    heightM: 2.0,
    perennial: true,
    notes: {
      en: 'Tall perennial umbellifer that can reach 2 m by mid- to late summer, with a well-developed root system. Produces plenty of leafy biomass for cutting and chop and drop; the greenish-yellow umbels are pollinator-friendly.',
      de: 'Hoher, mehrjähriger Doldenblütler, der bis zum Hoch- oder Spätsommer 2 m erreichen kann, mit kräftigem Wurzelsystem. Liefert reichlich Blattmasse für Schnitt und Chop-and-Drop; die grünlich-gelben Dolden sind bestäuberfreundlich.'
    },
    color: '#16a34a',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-lovage.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Grows best in rich, moist soil that does not dry out or become waterlogged.',
      de: 'Wächst am besten in nährstoffreichem, frischem Boden, der weder austrocknet noch staunass wird.'
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
    ],
    sources: [
      'Royal Horticultural Society (n.d.). How to grow lovage. RHS Grow Your Own. https://www.rhs.org.uk/herbs/lovage/grow-your-own'
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
      en: 'Menthol- and menthone-rich aromatic groundcover. In a field trial, peppermint intercrops reduced spotted-wing drosophila emergence from fruit and supported more predators and pollinators than a ryegrass/clover mix; potted peppermint did not reduce green peach aphids. The oil repelled spider mites in lab tests. Vigorous stoloniferous living mulch, listed as tolerant of black walnut (juglone).',
      de: 'Bodendecker reich an Menthol und Menthon. In einem Feldversuch verringerte Pfefferminze als Zwischenkultur den Schlupf der Kirschessigfliege aus Früchten und förderte mehr Räuber und Bestäuber als eine Weidelgras-Klee-Mischung; auf Grüne Pfirsichblattläuse hatte sie im Topfversuch keinen Effekt. Das ätherische Öl wirkte im Labor abschreckend auf Spinnmilben. Wüchsiger, Ausläufer bildender Bodendecker, gilt als tolerant gegenüber Walnuss-Juglon.'
    },
    color: '#0d9488',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-peppermint.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Prefers moist, humus-rich, near-neutral soils in sun or partial shade.',
      de: 'Bevorzugt frische, humose, annähernd neutrale Böden in Sonne bis Halbschatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Mai) oder Herbst (Sep–Okt) über Wurzelausläufer',
      en: 'Spring (Mar–May) or autumn (Sep–Oct) via stolon cuttings'
    },
    harvestTime: {
      de: 'Mai bis September (Ölertrag und Mentholgehalt am höchsten um die Vollblüte)',
      en: 'May to September (oil yield and menthol peak around full bloom)'
    },
    recommendedForTrees: [
      'tree-tea-sinensis',
      'tree-tea-assamica',
      'tree-walnut',
      'tree-apple',
      'tree-pear',
      'tree-hazelnut'
    ],
    sources: [
      'Ben Issa, R., Gautier, H., Costagliola, G., & Gomez, L. (2016). Which companion plants affect the performance of green peach aphid on host plants? Testing of 12 candidate plants under laboratory conditions. Entomologia Experimentalis et Applicata, 160(2), 164–178. doi:10.1111/eea.12473',
      'Momen, F. M., Amer, S. A. A., & Refaat, A. M. (2001). Influence of mint and peppermint on Tetranychus urticae and some predacious mites of the family Phytoseiidae (Acari: Tetranychidae: Phytoseiidae). Acta Phytopathologica et Entomologica Hungarica, 36(1–2), 143–153. doi:10.1556/aphyt.36.2001.1-2.17',
      'Gowton, C. M., Cabra-Arias, C., & Carrillo, J. (2021). Intercropping with peppermint increases ground dwelling insect and pollinator abundance and decreases Drosophila suzukii in fruit. Frontiers in Sustainable Food Systems, 5, 700842. doi:10.3389/fsufs.2021.700842',
      'Rohloff, J., Dragland, S., Mordal, R., & Iversen, T.-H. (2005). Effect of harvest time and drying method on biomass production, essential oil yield, and quality of peppermint (Mentha × piperita L.). Journal of Agricultural and Food Chemistry, 53(10), 4143–4148. doi:10.1021/jf047998s',
      'Morton Arboretum (n.d.). Black walnut toxicity. https://mortonarb.org/plant-and-protect/tree-plant-care/plant-care-resources/black-walnut-toxicity/',
      'NC State Extension (n.d.). Mentha x piperita. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/mentha-x-piperita/'
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
      en: 'Deep-rooted perennial legume fixing nitrogen with Sinorhizobium meliloti; reported fixation ranges widely (about 45–470 kg N/ha/yr) and drops when soil N is plentiful. The taproot can exceed 4.5 m in unrestricted soils, but compacted pans stop it, so loosen hardpans before sowing. The growth regulator triacontanol was first isolated from alfalfa meal, which boosted growth of several crops. Observed to be juglone-sensitive; keep away from walnuts. It is bee-pollinated: bees collecting nectar or pollen trip the flowers, and leafcutter bees are the preferred pollinators for seed crops.',
      de: 'Tiefwurzelnde, mehrjährige Leguminose, die mit Sinorhizobium meliloti Stickstoff bindet; die berichtete Bindung schwankt stark (ca. 45–470 kg N/ha/Jahr) und sinkt bei hohem Bodenstickstoff. Die Pfahlwurzel kann in ungestörten Böden über 4,5 m tief reichen, wird aber von Verdichtungen gestoppt – Verdichtungen vor der Saat lockern. Aus Luzernemehl wurde erstmals der Wuchsregulator Triacontanol isoliert; das Mehl förderte das Wachstum mehrerer Kulturen. Gilt als juglonempfindlich – Abstand zu Walnüssen halten. Sie wird von Bienen bestäubt: Bienen, die Nektar oder Pollen sammeln, lösen den Schnellmechanismus der Blüte aus; für die Saatgutvermehrung gelten Blattschneiderbienen als bevorzugte Bestäuber.'
    },
    color: '#6366f1',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-alfalfa.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT'],
    unsuitableSoils: ['ACIDIC', 'CLAY'],
    soilNotes: {
      en: 'Requires deep, well-drained soils without hardpans; pH 6.5–7.0 (lime acidic soils) for good establishment and nodulation.',
      de: 'Benötigt tiefgründige, gut dränierte Böden ohne Verdichtungen; pH 6,5–7,0 (saure Böden aufkalken) für gute Etablierung und Knöllchenbildung.'
    },
    plantingTime: {
      de: 'April bis Mai oder August als Direktsaat',
      en: 'April to May or August by direct seeding'
    },
    harvestTime: {
      de: 'Mai bis Oktober (mehrere Mulchschnitte pro Jahr)',
      en: 'May to October (several chop-and-drop cuts per year)'
    },
    recommendedForTrees: [
      'herb-hemp',
      'tree-apple',
      'tree-pear',
      'tree-cherry'
    ],
    sources: [
      'Russelle, M. (2004). The environmental impacts of N2 fixation by alfalfa. In Proceedings, 2004 National Alfalfa Symposium, San Diego, CA (pp. 57–62). UC Cooperative Extension. https://www.ars.usda.gov/ARSUserFiles/50621000/2004/Russelle.pdf',
      'Jones, K. M., et al. (2007). How rhizobial symbionts invade plants: the Sinorhizobium–Medicago model. Nature Reviews Microbiology, 5(8), 619–633. doi:10.1038/nrmicro1705',
      'Kubesch, J. (2026). Establishing alfalfa for forage (FSA15). University of Arkansas Division of Agriculture. https://www.uaex.uada.edu/publications/pdf/FSA-15.pdf',
      'Ries, S. K., Wert, V. F., Sweeley, C. C., & Leavitt, R. A. (1977). Triacontanol: A new naturally occurring plant growth regulator. Science, 195(4284), 1339–1341. doi:10.1126/science.195.4284.1339',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf',
      'Canadian Food Inspection Agency (2012). The Biology of Medicago sativa L. (Alfalfa). Biology document, Directive 94-08. Government of Canada. https://inspection.canada.ca/en/plant-varieties/plants-novel-traits/applicants/directive-94-08/biology-documents/medicago-sativa'
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.0,
    maxDistanceM: 3.5,
    spreadM: 0.8,
    heightM: 1.5,
    perennial: true,
    notes: {
      en: 'Protein-, calcium- and iron-rich foliage makes nutrient-dense chop-and-drop mulch. Nettle patches act as a reservoir for natural enemies: the specialist nettle aphid (Microlophium carnosum) builds up in spring and feeds ladybirds, anthocorid and mirid bugs and hoverflies before pest aphids appear on crops; ladybirds then disperse to nearby habitats. Cutting patches in mid-June may push predators onto nearby pests.',
      de: 'Eiweiß-, calcium- und eisenreiches Laub ergibt nährstoffreichen Schnittmulch. Brennnesselbestände sind ein Reservoir für Nützlinge: Die spezialisierte Brennnesselblattlaus (Microlophium carnosum) vermehrt sich im Frühjahr und ernährt Marienkäfer, Blumen- und Weichwanzen sowie Schwebfliegen, bevor Schadläuse an Kulturen auftreten; Marienkäfer wandern danach in benachbarte Lebensräume ab. Ein Rückschnitt Mitte Juni kann Räuber auf nahe Schädlinge lenken.'
    },
    color: '#15803d',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-nettle.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives on moist, richly fertile, weakly acid to weakly basic soils; growth is checked where phosphate is scarce. Moderately shade-tolerant.',
      de: 'Gedeiht auf frischen bis feuchten, sehr nährstoffreichen, schwach sauren bis schwach basischen Böden; bei Phosphatmangel kümmert sie. Mäßig schattenverträglich.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Sep–Okt) über Rhizomstücke',
      en: 'Spring (Mar–Apr) or autumn (Sep–Oct) via rhizome divisions'
    },
    harvestTime: {
      de: 'April bis September (mehrere Mulchschnitte vor der Samenreife)',
      en: 'April to September (several chop-and-drop cuts prior to seed set)'
    },
    recommendedForTrees: [
      'shrub-elderberry',
      'tree-walnut',
      'shrub-blackcurrant',
      'tree-apple',
      'tree-plum',
      'tree-alder', 'shrub-red-currant', 'tree-linden'],
    sources: [
      'Rutto, L. K., Xu, Y., Ramirez, E., & Brandt, M. (2013). Mineral properties and dietary value of raw and processed stinging nettle (Urtica dioica L.). International Journal of Food Science, 2013, 857120. doi:10.1155/2013/857120',
      'Perrin, R. M. (1975). The role of the perennial stinging nettle, Urtica dioica, as a reservoir of beneficial natural enemies. Annals of Applied Biology, 81(3), 289–297. doi:10.1111/j.1744-7348.1975.tb01644.x',
      'Rand, T. A., & Tscharntke, T. (2007). Contrasting effects of natural habitat loss on generalist and specialist aphid natural enemies. Oikos, 116(8), 1353–1362. doi:10.1111/j.2007.0030-1299.15871.x',
      'Alhmedi, A., Haubruge, E., & Francis, F. (2009). Effect of stinging nettle habitats on aphidophagous predators and parasitoids in wheat and green pea fields with special attention to the invader Harmonia axyridis Pallas (Coleoptera: Coccinellidae). Entomological Science, 12(4), 349–358. doi:10.1111/j.1479-8298.2009.00342.x',
      'Taylor, K. (2009). Biological Flora of the British Isles: Urtica dioica L. Journal of Ecology, 97(6), 1436–1458. doi:10.1111/j.1365-2745.2009.01575.x'
    ]
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
    roles: ['LIVING_MULCH', 'EDIBLE_UNDERSTORY'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.3,
    maxDistanceM: 2.0,
    spreadM: 0.4,
    heightM: 0.15,
    perennial: true,
    notes: {
      en: 'Acid-loving evergreen groundcover for deep to dappled shade. Like blueberries and cranberries it forms ericoid mycorrhizae, and these fungi show little host specificity among heath-family plants. Leaves, stems and berries are rich in salicylates, mostly as gaultherin (a methyl salicylate glycoside, source of the wintergreen aroma). Edible red winter berries.',
      de: 'Säureliebender, immergrüner Bodendecker für lichten bis tiefen Schatten. Bildet wie Heidelbeere und Moosbeere eine ericoide Mykorrhiza; diese Pilze sind zwischen Heidekrautgewächsen kaum wirtsspezifisch. Blätter, Stängel und Beeren sind reich an Salicylaten, vor allem Gaultherin (ein Methylsalicylat-Glykosid, Quelle des Wintergrün-Aromas). Essbare rote Winterbeeren.'
    },
    color: '#dc2626',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-wintergreen.webp?v=2',
    suitableSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Requires acidic (pH below 6), humus-rich, moist but well-drained soil; not for limy ground.',
      de: 'Benötigt sauren (pH unter 6), humosen, frischen, aber durchlässigen Boden; nicht für kalkhaltige Standorte.'
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
    ],
    sources: [
      'NC State Extension (n.d.). Gaultheria procumbens. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/gaultheria-procumbens/',
      'Massicotte, H. B., Melville, L. H., & Peterson, R. L. (2005). Structural characteristics of root-fungal interactions for five ericaceous species in eastern Canada. Canadian Journal of Botany, 83(8), 1057–1064. doi:10.1139/b05-046',
      'Walker, J. F., et al. (2011). Diverse Helotiales associated with the roots of three species of Arctic Ericaceae provide no evidence for host specificity. New Phytologist, 191(2), 515–527. doi:10.1111/j.1469-8137.2011.03703.x',
      'Ribnicky, D. M., Poulev, A., & Raskin, I. (2003). The determination of salicylates in Gaultheria procumbens for use as a natural aspirin alternative. Journal of Nutraceuticals, Functional & Medical Foods, 4(1), 39–52. doi:10.1300/J133v04n01_05'
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.4,
    maxDistanceM: 2.2,
    spreadM: 0.4,
    heightM: 0.25,
    perennial: true,
    notes: {
      en: 'Compact evergreen dwarf shrub spreading by rhizomes; a close relative of highbush blueberry that thrives in the same acidic conditions, forming a low understory beneath them. Its ericoid mycorrhizal fungi, which are not host-specific among heath-family plants, can mobilise nitrogen and phosphorus from organic matter. Berries are rich in antioxidants. Bees, bumblebees, flies, butterflies and other flying insects pollinate it, and its rhizomes spread to cover a planted bed by the fourth or fifth year.',
      de: 'Kompakter immergrüner Zwergstrauch, der sich über Rhizome ausbreitet; enger Verwandter der Kulturheidelbeere, der unter denselben sauren Bedingungen gedeiht und eine niedrige Unterschicht bildet. Seine ericoiden Mykorrhizapilze sind unter Heidekrautgewächsen nicht wirtsspezifisch und können Stickstoff und Phosphor aus organischer Substanz mobilisieren. Die Beeren sind reich an Antioxidantien. Bienen, Hummeln, Fliegen, Schmetterlinge und andere Fluginsekten bestäuben sie, und ihre Rhizome bedecken ein Beet bis zum vierten oder fünften Jahr.'
    },
    color: '#b91c1c',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-lingonberry.webp',
    suitableSoils: ['ACIDIC', 'SANDY', 'LOAM'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Most productive at pH 4.3–5.5 with 2–6 % organic matter in the topsoil; keep a 10–15 cm organic mulch (bark, needle litter, sawdust).',
      de: 'Am ertragreichsten bei pH 4,3–5,5 und 2–6 % Humus im Oberboden; 10–15 cm organischen Mulch (Rinde, Nadelstreu, Sägemehl) halten.'
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
    ],
    sources: [
      'Penhallegon, R. (2006). Lingonberry production guide for the Pacific Northwest (PNW 583-E). Oregon State University Extension Service. https://s3.wp.wsu.edu/uploads/sites/2056/2023/05/Lingonberry-Production.pdf',
      'Walker, J. F., et al. (2011). Diverse Helotiales associated with the roots of three species of Arctic Ericaceae provide no evidence for host specificity. New Phytologist, 191(2), 515–527. doi:10.1111/j.1469-8137.2011.03703.x',
      'Read, D. J., & Pérez-Moreno, J. (2003). Mycorrhizas and nutrient cycling in ecosystems – a journey towards relevance? New Phytologist, 157(3), 475–492. doi:10.1046/j.1469-8137.2003.00704.x'
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 2.0,
    maxDistanceM: 8.0,
    spreadM: 0.25,
    heightM: 0.25,
    perennial: true,
    notes: {
      en: 'Golden spring flowers give early nectar to bees and other insects; the plant depends entirely on insect visitors for pollination and is a food plant of the Duke of Burgundy butterfly. Shade-intolerant: place on sunny meadow edges, woodland rides or in front of the canopy line of hazelnut, sweet chestnut and apple rather than beneath it. Primroses (Primula spp., polyanthus primrose, Primula vulgaris) are listed as juglone-tolerant by Penn State, Purdue and Ontario (observation-based lists); the cowslip itself is not named.',
      de: 'Goldgelbe Frühlingsblüten liefern Bienen und anderen Insekten frühen Nektar; die Art ist vollständig auf Insektenbestäubung angewiesen und Futterpflanze des Schlüsselblumen-Würfelfalters. Schattenunverträglich: an sonnige Wiesensäume, Waldwege oder vor die Kronentraufe von Hasel, Esskastanie und Apfel pflanzen, nicht darunter. Primeln (Primula spp., Garten-Primel, Primula vulgaris) werden von Penn State, Purdue und Ontario als juglontolerant gelistet (Beobachtungslisten); die Schlüsselblume selbst wird nicht genannt.'
    },
    color: '#facc15',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-cowslip.webp',
    suitableSoils: ['LOAM', 'CHALKY', 'CLAY', 'SILT'],
    unsuitableSoils: ['ACIDIC'],
    soilNotes: {
      en: 'Thrives on well-drained, base-rich or calcareous loam or clay in sun; drought-tolerant, avoids waterlogged soils.',
      de: 'Gedeiht auf durchlässigen, basen- bis kalkreichen Lehm- oder Tonböden in sonniger Lage; trockenheitsverträglich, meidet Staunässe.'
    },
    plantingTime: {
      de: 'Herbst (Sep–Nov) als Kaltkeimer-Saat oder Jungpflanze',
      en: 'Autumn (Sep–Nov) as cold-stratified seed or plug plants'
    },
    harvestTime: {
      de: 'April bis Mai (Blütezeit; Wildvorkommen besonders geschützt – nur aus eigenem Anbau)',
      en: 'April to May (bloom period; wild plants specially protected in Germany – use nursery stock)'
    },
    recommendedForTrees: [
      'tree-hazelnut',
      'tree-apple',
      'tree-chestnut',
      'tree-pear',
      'tree-cherry',
      'tree-walnut'
    ],
    sources: [
      'Brys, R., & Jacquemyn, H. (2009). Biological Flora of the British Isles: Primula veris L. Journal of Ecology, 97(3), 581–600. doi:10.1111/j.1365-2745.2009.01495.x',
      'Woodland Trust (n.d.). Cowslip (Primula veris). https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/plants/wild-flowers/cowslip/',
      'Bundesministerium der Justiz (2005). Bundesartenschutzverordnung (BArtSchV), Anlage 1. https://www.gesetze-im-internet.de/bartschv_2005/anlage_1.html',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity'
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
    roles: ['POLLINATOR_MAGNET', 'LIVING_MULCH'],
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
      en: 'Early spring nectar plant whose flowers shift from pink-violet to blue as they age (a study of cultivars found no vacuolar alkalization; metal-ion interactions are suspected). In Central Europe it is mainly pollinated by long-tongued Anthophora bees such as the hairy-footed flower bee, elsewhere by bumblebees and bee-flies. Bristly foliage forms a durable shade groundcover under Ginkgo, Plum and Hazelnut; listed as juglone-tolerant.',
      de: 'Frühe Nektarpflanze, deren Blüten beim Altern von Rosa-Violett nach Blau umfärben (eine Studie an Sorten fand keine Alkalisierung der Vakuole; vermutet werden Metallionen-Wechselwirkungen). In Mitteleuropa vor allem von langrüsseligen Pelzbienen (Anthophora, z. B. Frühlings-Pelzbiene) bestäubt, andernorts von Hummeln und Wollschwebern. Bildet einen dichten, rauen Blätterteppich im Halbschatten unter Ginkgo, Pflaume und Hasel; gilt als juglontolerant.'
    },
    color: '#a855f7',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-lungwort.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Forest-understorey plant of relatively humid to wet, humus-rich loams with good water retention.',
      de: 'Waldbodenpflanze auf frischen bis feuchten, humosen Lehmböden mit guter Wasserführung.'
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
      'tree-walnut', 'tree-linden'],
    sources: [
      'Mizuno, T., Akita, Y., Uehara, A., & Iwashina, T. (2021). Identification of anthocyanins and phenolic acid in the flowers of three lungwort (Pulmonaria) cultivars and their comparisons during flower developmental stage. Bulletin of the National Museum of Nature and Science, Series B (Botany), 47(3), 143–151. doi:10.50826/bnmnsbot.47.3_143',
      'Meeus, S., Honnay, O., & Jacquemyn, H. (2013). Differences in fine-scale spatial genetic structure across the distribution range of the distylous forest herb Pulmonaria officinalis (Boraginaceae). BMC Genetics, 14, 101. doi:10.1186/1471-2156-14-101',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf'
    ]
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
    roles: ['LIVING_MULCH'],
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
      en: 'Hardy semi-evergreen woodland groundcover from a genus centred in East Asia (mostly China). Spreads by shallow rhizomes that cope with root competition from surrounding trees; established plants tolerate deep shade and drought. Listed as tolerant of black walnut (juglone).',
      de: 'Robuster, halbimmergrüner Waldstauden-Bodendecker aus einer Gattung mit Schwerpunkt in Ostasien (überwiegend China). Breitet sich über flache Rhizome aus, die die Wurzelkonkurrenz umgebender Bäume vertragen; eingewachsene Pflanzen ertragen tiefen Schatten und Trockenheit. Gilt als tolerant gegenüber Walnuss-Juglon.'
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
    ],
    sources: [
      'NC State Extension (n.d.). Epimedium. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/epimedium/',
      'Morton Arboretum (n.d.). Black walnut toxicity. https://mortonarb.org/plant-and-protect/tree-plant-care/plant-care-resources/black-walnut-toxicity/'
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
    roles: ['LIVING_MULCH'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
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
      en: 'Evergreen groundcover of shady broadleaf woods. Contains (E)-asarone and nephrotoxic aristolochic acid analogues; poisonings have been reported, so it is not for consumption. Seeds carry elaiosomes and are carried off by Myrmica ants, though removal rates in field trials were modest. Listed as juglone-tolerant; suits shade under Walnut, Hazelnut and Pawpaw.',
      de: 'Immergrüner Bodendecker schattiger Laubwälder. Enthält (E)-Asaron und nierenschädigende Aristolochiasäure-Analoga; Vergiftungen sind beschrieben, daher nicht zum Verzehr. Die Samen tragen Elaiosomen und werden von Knotenameisen (Myrmica) verschleppt, im Feldversuch allerdings nur in mäßigem Umfang. Gilt als juglontolerant; geeignet für den Schatten unter Walnuss, Hasel und Pawpaw.'
    },
    color: '#065f46',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-wild-ginger.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Needs moist, humus-rich woodland soil in shade.',
      de: 'Benötigt frische, humose Waldböden im Schatten.'
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
    ],
    sources: [
      'Michl, J., et al. (2017). Medicinally used Asarum species: High-resolution LC-MS analysis of aristolochic acid analogs and in vitro toxicity screening in HK-2 cells. Frontiers in Pharmacology, 8, 215. doi:10.3389/fphar.2017.00215',
      'Wilczewska, A. Z., et al. (2008). Comparison of volatile constituents of Acorus calamus and Asarum europaeum obtained by different techniques. Journal of Essential Oil Research, 20(5), 390–395. doi:10.1080/10412905.2008.9700038',
      'Prokop, P., Fančovičová, J., & Hlúšková, Z. (2022). Seed dispersal by ants in three early-flowering plants. Insects, 13(4), 386. doi:10.3390/insects13040386',
      'Kovalenko, I., Klymenko, H. O., & Hozhenko, K. H. (2017). Population analysis of Asarum europaeum in the Northeast of Ukraine. Biosystems Diversity, 25(3), 210–215. doi:10.15421/011732',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf'
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
    roles: ['BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: [],
      foliageSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING']
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
      en: 'Vigorous colonial fern recommended for planting beneath black walnut; ferns appear on extension lists of juglone-tolerant plants, though these lists are observational. Yields prized fiddleheads in spring (must be thoroughly cooked) and leaves abundant frond litter as autumn mulch.',
      de: 'Wüchsiger, Kolonien bildender Farn, der für die Pflanzung unter Schwarznuss empfohlen wird; Farne stehen auf Beratungslisten juglontoleranter Pflanzen, die allerdings auf Beobachtungen beruhen. Liefert im Frühjahr begehrte Fiddleheads (nur gründlich gegart essen) und im Herbst reichlich Farnlaub als Mulch.'
    },
    color: '#047857',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-ostrich-fern.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['CHALKY', 'SANDY'],
    soilNotes: {
      en: 'Requires constantly moist, humus-rich soils such as stream banks, floodplains and damp woodland in cool shade.',
      de: 'Erfordert dauerhaft frische bis feuchte, humusreiche Böden wie Bach- und Flussufer, Auen und feuchte Wälder im kühlen Schatten.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Okt–Nov) als Wurzelstock',
      en: 'Spring (Mar–Apr) or autumn (Oct–Nov) as bare-root crowns'
    },
    harvestTime: {
      de: 'April bis Mai (eingerollte Fiddleheads; ca. 15 Min. kochen – roh oder zu kurz gegart unverträglich; Wildbestände besonders geschützt, nur aus eigenem Anbau)',
      en: 'April to May (tightly coiled fiddleheads; boil about 15 min – raw or undercooked ones cause illness; wild stands specially protected in Germany)'
    },
    recommendedForTrees: [
      'tree-walnut',
      'tree-alder',
      'tree-pawpaw',
      'shrub-elderberry',
      'tree-hazelnut',
      'shrub-rhododendron'
    ],
    sources: [
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf',
      'Benoit, D. J. (2026). Planting under trees. University of Vermont Extension. https://www.uvm.edu/extension/news/planting-under-trees',
      'Bolton, J., et al. (2023). Facts on fiddleheads (Bulletin #4198). University of Maine Cooperative Extension. https://extension.umaine.edu/publications/4198e/',
      'NC State Extension (n.d.). Matteuccia struthiopteris. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/matteuccia-struthiopteris/',
      'Bundesministerium der Justiz (2005). Bundesartenschutzverordnung (BArtSchV), Anlage 1. https://www.gesetze-im-internet.de/bartschv_2005/anlage_1.html'
    ]
  },
  {
    id: 'plant-sweet-flag',
    retired: true, // no supported guild role left (owner decision 2026-10); kept for share-code indices
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Sweet Flag / Calamus',
      de: 'Echter Kalmus'
    },
    botanicalName: 'Acorus calamus',
    layer: 'HERBACEOUS',
    roles: [],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['AUTUMN'],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['AUTUMN']
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'ANY',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.6,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'Semi-aquatic reed herb of wet ground with intensely aromatic rhizomes. Their essential oil is dominated by beta-asarone, which is insecticidal and repellent to pest insects in lab tests; a repellent effect on soil larvae in the garden has not been shown. Beta-asarone is considered carcinogenic, so the rhizome is not food. Suited to moist swales and rain-catchment basins.',
      de: 'Sumpf- und Feuchtzonenpflanze mit intensiv würzigem Wurzelstock. Dessen ätherisches Öl besteht überwiegend aus beta-Asaron, das im Labor insektizid und abschreckend auf Schadinsekten wirkt; eine Wirkung gegen Bodenlarven im Garten ist nicht belegt. Beta-Asaron gilt als krebserregend, der Wurzelstock ist daher kein Lebensmittel. Geeignet für feuchte Mulden und Regenrückhaltebecken.'
    },
    color: '#65a30d',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-sweet-flag.webp',
    suitableSoils: ['CLAY', 'LOAM', 'SILT', 'ACIDIC'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Thrives in waterlogged clay, silt or pond margins; tolerates shallow standing water up to about 20 cm.',
      de: 'Gedeiht in staunassen Ton- und Schlickböden sowie an Teichrändern; verträgt flach stehendes Wasser bis etwa 20 cm.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Herbst (Sep–Okt) durch Rhizomteilung',
      en: 'Spring (Apr–May) or autumn (Sep–Oct) via rhizome sections'
    },
    harvestTime: {
      de: 'Oktober bis November (aromatische Rhizome im Spätherbst)',
      en: 'October to November (aromatic rhizomes dug in late autumn)'
    },
    recommendedForTrees: [],
    sources: [
      'Parki, A., et al. (2017). Seasonal variation in essential oil compositions and antioxidant properties of Acorus calamus L. accessions. Medicines, 4(4), 81. doi:10.3390/medicines4040081',
      'Wang, R., et al. (2022). The toxicity, sublethal effects, and biochemical mechanism of β-asarone, a potential plant-derived insecticide, against Bemisia tabaci. International Journal of Molecular Sciences, 23(18), 10462. doi:10.3390/ijms231810462',
      'Aryal, S., et al. (2023). Insecticidal toxicity of essential oil of Nepalese Acorus calamus (Acorales: Acoraceae) against Sitophilus zeamais (Coleoptera: Curculionidae). Heliyon, 9(11), e22130. doi:10.1016/j.heliyon.2023.e22130',
      'NC State Extension (n.d.). Acorus calamus \'Variegatus\'. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/acorus-calamus-variegatus/'
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
    roles: ['POLLINATOR_MAGNET'],
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
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.8,
    maxDistanceM: 3.5,
    spreadM: 0.7,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Rich in salicylic-acid derivatives (mainly salicylaldehyde and methyl salicylate) and tannins. Claims that it creates a fungistatic root environment protecting fruit tree root collars from Phytophthora are unproven. Its creamy, scented flower panicles are a summer pollen source for hoverflies such as Eristalis and other insects.',
      de: 'Reich an Salicylsäure-Verbindungen (v. a. Salicylaldehyd und Methylsalicylat) und Gerbstoffen. Ein Schutz der Obstbaum-Wurzelhälse vor Phytophthora durch ein fungistatisches Milieu ist unbewiesen. Die cremeweißen Duftrispen sind im Sommer eine Pollenquelle für Schwebfliegen wie Eristalis und andere Insekten.'
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
      'tree-pear',
      'tree-walnut', 'shrub-red-currant'],
    sources: [
      'Farzaneh, A., et al. (2022). Filipendula ulmaria (L.) Maxim. (Meadowsweet): a review of traditional uses, phytochemistry and pharmacology. Research Journal of Pharmacognosy, 9(3), 85–106. doi:10.22127/rjp.2021.302028.1781',
      'Ložienė, K., et al. (2023). Variations in yield, essential oil, and salicylates of Filipendula ulmaria inflorescences at different blooming stages. Plants, 12(2), 300. doi:10.3390/plants12020300',
      'Lucas, A., et al. (2018). Generalisation and specialisation in hoverfly (Syrphidae) grassland pollen transport networks revealed by DNA metabarcoding. Journal of Animal Ecology, 87(4), 1008–1021. doi:10.1111/1365-2656.12828'
    ]
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
    roles: ['ANTIFUNGAL', 'EDIBLE_UNDERSTORY'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'LATE_SPRING'],
      harvestSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN', 'WINTER']
    },
    preferredZone: 'ZONE_1_BULB',
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 0.4,
    maxDistanceM: 1.8,
    spreadM: 0.3,
    heightM: 0.5,
    perennial: true,
    notes: {
      en: 'Perennial, non-bulbing allium kept as a clump at the root collar. Its foliage emits sulfur-containing volatiles, which become stronger when the leaves are cut or crushed. In experiments, soil cultivated with Welsh onion suppressed Fusarium wilt of cucumber via antagonistic rhizosphere bacteria (Flavobacterium). Protection of fruit trees from Fusarium, root rot or clearwing borers (Synanthedon spp.) is unproven.',
      de: 'Ausdauernde, nicht zwiebelbildende Heckenzwiebel für den Wurzelhalsbereich. Das Laub gibt schwefelhaltige Duftstoffe ab, verstärkt beim Schneiden oder Quetschen. In Versuchen unterdrückte mit Winterheckenzwiebel bepflanzter Boden die Fusarium-Welke an Gurken durch antagonistische Rhizosphärenbakterien (Flavobacterium). Ein Schutz von Obstbäumen vor Fusarium, Wurzelfäule oder Glasflüglern (Synanthedon spp.) ist unbewiesen.'
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
      'tree-cherry', 'shrub-red-currant'],
    sources: [
      'Kusano, M., et al. (2016). Unbiased profiling of volatile organic compounds in the headspace of Allium plants using an in-tube extraction device. BMC Research Notes, 9, 133. doi:10.1186/s13104-016-1942-5',
      'Nishioka, T., et al. (2019). Microbial basis of Fusarium wilt suppression by Allium cultivation. Scientific Reports, 9, 1715. doi:10.1038/s41598-018-37559-7'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
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
      en: 'Prairie composite with a tough rhizome that readily forms arbuscular mycorrhiza; in a greenhouse trial, colonisation by Rhizophagus irregularis (formerly Glomus intraradices) increased shoot and root growth. Its open disc florets secrete nectar over several days and are visited by many bee species during the long summer bloom. Listed as juglone-tolerant by Penn State Extension and the Morton Arboretum (observation-based lists).',
      de: 'Präriestaude mit zähem Wurzelstock, die bereitwillig arbuskuläre Mykorrhiza bildet; im Gewächshausversuch steigerte die Besiedlung mit Rhizophagus irregularis (früher Glomus intraradices) das Spross- und Wurzelwachstum. Die offenen Scheibenblüten sondern über mehrere Tage Nektar ab und werden während der langen Sommerblüte von vielen Bienenarten besucht. Von Penn State Extension und dem Morton Arboretum als juglontolerant gelistet (Beobachtungslisten).'
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
    ],
    sources: [
      'Araim, G., et al. (2009). Root colonization by an arbuscular mycorrhizal (AM) fungus increases growth and secondary metabolism of purple coneflower, Echinacea purpurea (L.) Moench. Journal of Agricultural and Food Chemistry, 57(6), 2255–2258. doi:10.1021/jf803173x',
      'Wist, T. J., & Davis, A. R. (2006). Floral nectar production and nectary anatomy and ultrastructure of Echinacea purpurea (Asteraceae). Annals of Botany, 97(2), 177–193. doi:10.1093/aob/mcj027',
      'Lowenstein, D. M., et al. (2014). Humans, bees, and pollination services in the city: the case of Chicago, IL (USA). Biodiversity and Conservation, 23(11), 2857–2874. doi:10.1007/s10531-014-0752-0',
      'Stevens, M., & Anderson, M. K. (2000). Eastern purple coneflower, Echinacea purpurea (L.) Moench (Plant Guide). USDA NRCS. https://plants.usda.gov/DocumentLibrary/plantguide/pdf/pg_ecpu.pdf',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Morton Arboretum (n.d.). Black walnut toxicity. https://mortonarb.org/plant-and-protect/tree-plant-care/plant-care-resources/black-walnut-toxicity/'
    ]
  },
  {
    id: 'plant-wormwood',
    retired: true, // no supported guild role left (owner decision 2026-10); kept for share-code indices
    climateZones: ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'],
    commonName: {
      en: 'Wormwood / Absinthe',
      de: 'Echter Wermut'
    },
    botanicalName: 'Artemisia absinthium',
    layer: 'HERBACEOUS',
    roles: [],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING'],
      harvestSeasons: ['SUMMER']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'WEST_WIND',
    jugloneTolerance: 'NEUTRAL',
    minDistanceM: 1.5,
    maxDistanceM: 4.5,
    spreadM: 0.8,
    heightM: 1.2,
    perennial: true,
    notes: {
      en: 'Aromatic woody subshrub containing the bitter lactone absinthin, blue chamazulene and, depending on chemotype, thujone. In a lab test on codling moth larvae, only a related species (Artemisia arborescens) and pure alpha-thujone deterred fruit infestation, not wormwood extract; protection of trees against caterpillars, sawflies or rust fungi is unproven. Suits the sunny, dry outer edge of the guild.',
      de: 'Aromatischer Halbstrauch mit dem Bitterstoff Absinthin, blauem Chamazulen und – je nach Chemotyp – Thujon. In einem Laborversuch mit Apfelwicklerlarven verhinderten nur eine verwandte Art (Artemisia arborescens) und reines alpha-Thujon den Fruchtbefall, nicht der Wermut-Extrakt; ein Schutz der Bäume vor Wicklerraupen, Blattwespen oder Rostpilzen ist unbewiesen. Passt an den sonnigen, trockenen Außenrand der Gilde.'
    },
    color: '#94a3b8',
    iconName: 'Shield',
    imageUrl: '/images/plants/plant-wormwood.webp',
    suitableSoils: ['SANDY', 'LOAM', 'CHALKY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Loves dry, poor, stony ground in full sun, such as wasteland and roadsides; very drought-tolerant.',
      de: 'Liebt trockene, magere, steinige Böden in voller Sonne wie Brachen und Wegränder; sehr trockenheitsverträglich.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) durch Aussaat oder Stecklinge',
      en: 'Spring (Apr–May) by seed or softwood cuttings'
    },
    harvestTime: {
      de: 'Juli bis September (blühende Triebspitzen)',
      en: 'July to September (flowering shoot tips)'
    },
    recommendedForTrees: [],
    sources: [
      'Szopa, A., et al. (2020). Artemisia absinthium L.—Importance in the history of medicine, the latest advances in phytochemistry and therapeutical, cosmetological and culinary uses. Plants, 9(9), 1063. doi:10.3390/plants9091063',
      'Kosakowska, O., et al. (2025). Intraspecific variability of wormwood (Artemisia absinthium L.) occurring in Poland in respect of developmental and chemical traits. Molecules, 30(14), 2915. doi:10.3390/molecules30142915',
      'Creed, C., et al. (2015). Artemisia arborescens "Powis Castle" extracts and α-thujone prevent fruit infestation by codling moth neonates. Pharmaceutical Biology, 53(10), 1458–1464. doi:10.3109/13880209.2014.985796'
    ]
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
    roles: ['LIVING_MULCH'],
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
      en: 'Evergreen, acid-loving woodland shrub (about pH 4.5–6.0) whose dense leathery foliage gives year-round cover on the cool northern/eastern edge of acidic guilds. Its very fine hair roots lack root hairs and host intracellular ericoid mycorrhizal fungi (e.g. Oidiodendron maius and the Hyaloscypha/Pezoloma ericae group) that release proteases and phosphatases to unlock organic nutrients; the same fungal group colonises blueberries and cranberries. Not a reliable bee plant: the nectar of some species (e.g. R. ponticum) contains grayanotoxin that is lethal or sublethal to honeybees and solitary bees. Strictly non-edible (contains grayanotoxins).',
      de: 'Immergrüner, säureliebender Waldstrauch (etwa pH 4,5–6,0), dessen dichtes, ledriges Laub ganzjährig Deckung am kühlen Nord-/Ostrand saurer Gilden bietet. Seine sehr feinen Haarwurzeln bilden keine Wurzelhaare und beherbergen intrazelluläre ericoide Mykorrhizapilze (z. B. Oidiodendron maius und die Hyaloscypha-/Pezoloma-ericae-Gruppe), die über Proteasen und Phosphatasen organische Nährstoffe erschließen; dieselbe Pilzgruppe besiedelt auch Heidel- und Moosbeeren. Keine verlässliche Bienenweide: Der Nektar mancher Arten (z. B. R. ponticum) enthält Grayanotoxin, das für Honigbienen und Solitärbienen tödlich oder schädlich ist. Giftpflanze (Grayanotoxine – nicht zum Verzehr).'
    },
    color: '#9333ea',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-rhododendron.webp',
    suitableSoils: ['ACIDIC', 'LOAM', 'SILT'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Calcifuge (about pH 4.5–6.0) requiring cool, humus-rich, well-drained and well-aerated acidic soil with pine bark or leaf-mould mulch; plant shallowly. Sensitive to Black Walnut juglone and to lime.',
      de: 'Kalkflüchter (etwa pH 4,5–6,0) für kühle, humose, durchlässige und gut belüftete saure Böden mit Rinden- oder Laubkompostmulch; flach pflanzen. Empfindlich gegen Walnuss-Juglon und Kalk.'
    },
    plantingTime: {
      de: 'Frühjahr (Apr–Mai) oder Frühherbst (Sep–Okt) flach in sauren Waldboden',
      en: 'Spring (Apr–May) or early autumn (Sep–Oct) planted shallowly in acidic soil'
    },
    harvestTime: {
      de: 'Nicht essbar (Giftpflanze: Grayanotoxine)! Blüte: Mai bis Juni',
      en: 'Non-edible (toxic grayanotoxins)! Bloom: May to June'
    },
    recommendedForTrees: [
      'shrub-blueberry',
      'tree-tea-sinensis',
      'tree-tea-assamica',
      'tree-chestnut',
      'tree-alder',
      'tree-ginkgo',
      'vine-kiwi'
    ],
    sources: [
      'Polomski, R. F., Bir, R. E., & Beasley, J. (2016). Rhododendron. Clemson Cooperative Extension, Home & Garden Information Center. https://hgic.clemson.edu/factsheet/rhododendron/',
      'Wei, X., et al. (2022). Ericoid mycorrhizal fungi as biostimulants for improving propagation and production of ericaceous plants. Frontiers in Plant Science, 13, 1027390. doi:10.3389/fpls.2022.1027390',
      'Jansen, S. A., et al. (2012). Grayanotoxin poisoning: \'Mad honey disease\' and beyond. Cardiovascular Toxicology, 12(3), 208–215. doi:10.1007/s12012-012-9162-2',
      'Egan, P. A., Stevenson, P. C., & Stout, J. C. (2022). Pollinator selection against toxic nectar as a key facilitator of a plant invasion. Philosophical Transactions of the Royal Society B, 377(1853), 20210168. doi:10.1098/rstb.2021.0168',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity. University of Wisconsin–Madison Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/'
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
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 3.0,
    maxDistanceM: 7.0,
    spreadM: 3.0,
    heightM: 6.0,
    perennial: true,
    notes: {
      en: 'The Black Alder star tree kept as a coppiced or pollarded nurse tree on the outer windward flank of a guild. Actinorhizal Frankia root nodules let alders fix from a few up to roughly 300 kg N/ha/yr depending on site, enriching the soil; neighbours benefit mainly through leaf litter and summer chop & drop. Its light crown provides dappled shade, and shading of tea is known to lower bitter catechins and raise L-theanine. Black alder resprouts readily from the stool: coppice or pollard on a short rotation so the crown never over-shades the star plant. Listed as juglone-sensitive by Purdue, UW–Madison, Ontario and the Morton Arboretum (observation-based lists), so keep it away from walnuts.',
      de: 'Der Schwarzerlen-Leitbaum als auf den Stock gesetzter oder geschneitelter Ammenbaum an der äußeren Windseite der Gilde. Aktinorhizale Frankia-Knöllchen ermöglichen Erlen je nach Standort eine Bindung von wenigen bis rund 300 kg N/ha und Jahr, die den Boden anreichert; Nachbargehölze profitieren vor allem über Falllaub und Sommerschnitt-Mulch. Die lichte Krone spendet Streuschatten, und Beschattung senkt beim Teestrauch bekanntermaßen bittere Catechine und erhöht L-Theanin. Die Schwarzerle treibt willig aus dem Stock aus: in kurzem Umtrieb auf den Stock setzen oder köpfen, damit die Krone die Star-Pflanze nie überschattet. Von Purdue, UW–Madison, Ontario und dem Morton Arboretum als juglonempfindlich gelistet (Beobachtungslisten) – Abstand zu Walnüssen halten.'
    },
    color: '#15803d',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-alder.webp',
    suitableSoils: ['CLAY', 'SILT', 'LOAM'],
    unsuitableSoils: ['SANDY', 'CHALKY'],
    soilNotes: {
      en: 'Thrives on moist to wet, deep riparian soils with a high water table and tolerates seasonal flooding, but not stagnant water or strongly acidic soil. Needs groundwater access or high rainfall; fails on dry, porous sand.',
      de: 'Gedeiht auf feuchten bis nassen, tiefgründigen Ufer- und Auenböden mit hohem Grundwasserstand und verträgt zeitweise Überflutung, nicht aber stehende Nässe oder stark saure Böden. Braucht Grundwasseranschluss oder hohe Niederschläge; versagt auf trockenem, durchlässigem Sand.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Vorfrühling (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Sommerschnitt als Laubmulch (Jun–Jul); Niederwaldschnitt für Zweighäcksel im Spätwinter (Jan–Mär)',
      en: 'Summer leaf-pollard for mulch (Jun–Jul); winter coppice for ramial chipped wood (Jan–Mar)'
    },
    recommendedForTrees: ['tree-tea-sinensis', 'shrub-rhododendron', 'tree-apple', 'tree-pear'],
    sources: [
      'Tobita, H., et al. (2016). Responses of symbiotic N2 fixation in Alnus species to the projected elevated CO2 environment. Trees, 30(2), 523–537. doi:10.1007/s00468-015-1297-x',
      'Kajba, D., & Gračan, J. (2003). EUFORGEN Technical Guidelines for genetic conservation and use for black alder (Alnus glutinosa). International Plant Genetic Resources Institute, Rome. https://www.euforgen.org/fileadmin/templates/euforgen.org/upload/Publications/Technical_guidelines/Technical_guidelines_Alnus_glutinosa.pdf',
      'Claessens, H., et al. (2010). A review of the characteristics of black alder (Alnus glutinosa (L.) Gaertn.) and their implications for silvicultural practices. Forestry, 83(2), 163–175. doi:10.1093/forestry/cpp038',
      'Sano, T., et al. (2018). Effect of shading intensity on morphological and color traits and on chemical components of new tea (Camellia sinensis L.) shoots under direct covering cultivation. Journal of the Science of Food and Agriculture, 98(15), 5666–5676. doi:10.1002/jsfa.9112',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity',
      'Morton Arboretum (n.d.). Black walnut toxicity. https://mortonarb.org/plant-and-protect/tree-plant-care/plant-care-resources/black-walnut-toxicity/'
    ]
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
      en: 'Fast-growing actinorhizal (Frankia) pioneer of Himalayan and SW Chinese mountains that colonises landslides, and a classic N-fixing shade tree for large cardamom and highland tea. In a Yunnan field study, alders interplanted into mature var. assamica tea raised tea yield by 50–72% and soil fungal and bacterial biomass compared with tea monoculture (Mortimer et al., 2015). Plant on the sun side of the tea row and pollard or lop side branches to keep shade light; its leaf litter is N-rich (about 3.4–3.7% N). Native range lies at about 500–3,000 m with mean annual temperatures of 13–26 °C.',
      de: 'Schnellwüchsiger aktinorhizaler (Frankia) Pionierbaum der Gebirge des Himalaya und Südwestchinas, der Rutschhänge besiedelt, und klassischer stickstofffixierender Schattenbaum für Großen Kardamom und Hochland-Tee. In einer Feldstudie in Yunnan steigerten in reife var.-assamica-Teegärten gepflanzte Erlen den Teeertrag um 50–72 % sowie die Pilz- und Bakterienbiomasse im Boden gegenüber der Tee-Monokultur (Mortimer et al., 2015). Auf der Sonnenseite der Teereihe pflanzen und köpfen oder Seitenäste schneiteln, um den Schatten licht zu halten; das Falllaub ist N-reich (etwa 3,4–3,7 % N). Natürliches Areal etwa 500–3.000 m bei 13–26 °C Jahresmitteltemperatur.'
    },
    color: '#166534',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-nepal-alder.webp',
    suitableSoils: ['ACIDIC', 'LOAM', 'SILT', 'CLAY'],
    unsuitableSoils: ['CHALKY'],
    soilNotes: {
      en: 'Colonises poor, eroded or landslide soils on moist mountain slopes; prefers moist, permeable loam to gravelly soils but not waterlogged ground. Alder-based agroforestry has improved soil organic carbon and microbial biomass.',
      de: 'Besiedelt magere, erodierte oder Rutschhang-Böden an feuchten Berghängen; bevorzugt frische, durchlässige Lehm- bis Kiesböden, aber keine Staunässe. Erlen-Agroforstsysteme verbesserten organischen Bodenkohlenstoff und mikrobielle Biomasse.'
    },
    plantingTime: {
      de: 'Zu Beginn der Monsun-/Regenzeit (Mai–Jul)',
      en: 'At the onset of the monsoon/rainy season (May–Jul)'
    },
    harvestTime: {
      de: 'Schneitelung der Seitenäste in der kühlen Trockenzeit (Dez–Feb) als Mulch',
      en: 'Lop side branches in the cool dry season (Dec–Feb) for mulch'
    },
    recommendedForTrees: ['tree-tea-assamica'],
    sources: [
      'Mortimer, P. E., et al. (2015). Alder trees enhance crop productivity and soil microbial biomass in tea plantations. Applied Soil Ecology, 96, 25–32. doi:10.1016/j.apsoil.2015.05.012',
      'Orwa, C., et al. (2009). Agroforestree Database: a tree reference and selection guide version 4.0 – Alnus nepalensis. World Agroforestry Centre, Kenya. https://apps.worldagroforestry.org/treedb/AFTPDFS/Alnus_nepalensis.PDF',
      'Joshi, R. K., & Garkoti, S. C. (2021). Dynamics of ecosystem carbon stocks in a chronosequence of nitrogen-fixing Nepalese alder (Alnus nepalensis D. Don.) forest stands in the central Himalayas. Land Degradation & Development, 32(14), 4067–4086. doi:10.1002/ldr.3901',
      'Meetei, T. T., et al. (2020). Effect of 25 years old agroforestry practices on soil quality attributes in the north eastern Himalayan region of India. International Journal of Chemical Studies, 8(1), 2371–2379. doi:10.22271/chemi.2020.v8.i1aj.8623'
    ]
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
      en: 'The traditional leguminous "Sau" shade tree of Indian tea gardens, notably in Assam. It is nitrogen-fixing, and its fine bipinnate foliage casts light, filtered shade over the tea. Shed leaves, twigs and pods return organic matter; it is planted for soil improvement. Tolerates frequent pruning: grown to about 7 m and cut back to about 4 m (Orwa et al., 2009). Humid tropical/subtropical monsoon climates up to 1,800 m; tolerates light frost. It is listed among tropical agroforestry trees whose flowers provide nectar for bees.',
      de: 'Der traditionelle Leguminosen-Schattenbaum („Sau-Baum“) indischer Teegärten, besonders in Assam. Er bindet Luftstickstoff, und das feine doppelt gefiederte Laub wirft lichten Filterschatten über den Tee. Abgeworfene Blätter, Zweige und Hülsen führen organische Substanz zurück; er wird zur Bodenverbesserung gepflanzt. Verträgt häufigen Rückschnitt: auf ca. 7 m wachsen lassen und auf ca. 4 m zurückschneiden (Orwa et al., 2009). Feuchte tropische/subtropische Monsunklimate bis 1.800 m; verträgt leichten Frost. Sie wird unter den tropischen Agroforst-Bäumen geführt, deren Blüten Bienen Nektar liefern.'
    },
    color: '#65a30d',
    iconName: 'Sprout',
    imageUrl: '/images/plants/plant-albizia.webp',
    suitableSoils: ['ACIDIC', 'LOAM', 'SILT', 'CLAY', 'SANDY', 'CHALKY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Needs 1,000–5,000 mm annual rainfall. Adapted to poor soils, including lateritic alluvium and sandy sites, and tolerates high pH and some salinity.',
      de: 'Braucht 1.000–5.000 mm Jahresniederschlag. An magere Böden angepasst, auch lateritische Schwemmböden und sandige Standorte, und verträgt hohen pH-Wert sowie etwas Salz.'
    },
    plantingTime: {
      de: 'Zu Beginn der Regenzeit (Mai–Jul)',
      en: 'At the onset of the rainy season (May–Jul)'
    },
    harvestTime: {
      de: 'Rückschnitt/Schneitelung in der kühlen Trockenzeit (Dez–Feb); Blüte Mär–Mai',
      en: 'Lopping/cut-back in the cool dry season (Dec–Feb); flowering Mar–May'
    },
    recommendedForTrees: ['tree-tea-assamica'],
    sources: [
      'Orwa, C., et al. (2009). Agroforestree Database: a tree reference and selection guide version 4.0 – Albizia chinensis. World Agroforestry Centre, Kenya. https://apps.worldagroforestry.org/treedb/AFTPDFS/Albizia_chinensis.PDF',
      'Wilkinson, K., & Elevitch, C. (1999). The Overstory #40: Bees and Agroforestry. Agroforestry.org. https://agroforestry.org/the-overstory/224-overstory-40-bees-and-agroforestry'
    ]
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
      floweringSeasons: ['LATE_SPRING', 'SUMMER'],
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
      en: 'The Small-leaved Linden star tree kept as a pollarded or coppiced hedgerow tree on the outer flank of a fruit-tree guild. Its profuse June–July blossom gives nectar and pollen to bees after fruit-tree bloom and yields valued honey. Its calcium-rich leaf litter is linked to more earthworms, faster forest-floor turnover and higher soil pH (Reich et al., 2005). Limes resprout readily and have been coppiced for millennia: pollard or coppice in winter, or cut leafy summer shoots for chop & drop. Can raise topsoil pH, so keep away from tea, blueberry and rhododendron guilds. Lime-flower tea is made from the dried blossom.',
      de: 'Der Winterlinden-Leitbaum als geköpfter oder auf den Stock gesetzter Heckenbaum am äußeren Rand einer Obstbaumgilde. Die üppige Blüte im Juni–Juli liefert Bienen nach der Obstblüte Nektar und Pollen und ergibt geschätzten Lindenhonig. Das calciumreiche Falllaub geht mit mehr Regenwürmern, schnellerem Streuabbau und höherem Boden-pH einher (Reich et al., 2005). Linden treiben willig wieder aus und werden seit Jahrtausenden auf den Stock gesetzt: im Winter köpfen oder auf den Stock setzen oder belaubte Sommertriebe als Chop & Drop schneiden. Kann den pH-Wert im Oberboden heben – daher von Tee-, Heidelbeer- und Rhododendron-Gilden fernhalten. Aus den getrockneten Blüten wird Lindenblütentee bereitet.'
    },
    color: '#65a30d',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-linden.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT', 'CHALKY'],
    unsuitableSoils: [],
    soilNotes: {
      en: 'Deep, fresh to moist loam, silt or clay; also grows on calcareous soils, podzols and brown earths and is fairly drought-tolerant. Buffers acidic topsoil through calcium-rich litter.',
      de: 'Tiefgründige, frische bis feuchte Lehm-, Löss- oder Tonböden; wächst auch auf Kalkböden, Podsolen und Braunerden und ist recht trockenheitsverträglich. Puffert saure Oberböden durch calciumreiches Laub.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Blüten Jun–Jul; Kopfschnitt im Winter (Dez–Feb)',
      en: 'Blossoms Jun–Jul; pollarding in winter (Dec–Feb)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-cherry', 'tree-plum'],
    sources: [
      'Reich, P. B., et al. (2005). Linking litter calcium, earthworms and soil properties: a common garden test with 14 tree species. Ecology Letters, 8(8), 811–818. doi:10.1111/j.1461-0248.2005.00779.x',
      'Schelfhout, S., et al. (2017). Tree species identity shapes earthworm communities. Forests, 8(3), 85. doi:10.3390/f8030085',
      'Eaton, E., Caudullo, G., & de Rigo, D. (2016). Tilia cordata, Tilia platyphyllos and other limes in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the European Union. https://forest.jrc.ec.europa.eu/media/atlas/Tilia_spp.pdf',
      'Woodland Trust (n.d.). Small-leaved lime (Tilia cordata). https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/small-leaved-lime/'
    ]
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
      en: 'The Highbush Blueberry star shrub used as an edible understory in acidic guilds. Its roots form no root hairs and depend on ericoid mycorrhizal fungi – the same symbiosis as other heath-family plants such as Rhododendron, Lingonberry and Wintergreen, which share its low-pH, humus-rich niche. Its bell-shaped late-spring flowers are buzz-pollinated, mainly by bumblebees, and the summer berries add a high-value yield on the bright eastern drip line. Mulch with pine bark, wood chips or needles, starting at 5–8 cm and building up to 10–15 cm on mature bushes; lime only if a soil test shows pH below 4.5.',
      de: 'Der Kulturheidelbeer-Star als essbarer Unterwuchs in sauren Gilden. Die Wurzeln bilden keine Wurzelhaare und sind auf ericoide Mykorrhizapilze angewiesen – dieselbe Symbiose wie bei anderen Heidekrautgewächsen wie Rhododendron, Preiselbeere und Scheinbeere, die ihre saure, humusreiche Nische teilen. Die glockenförmigen Blüten im Spätfrühling werden durch Vibration bestäubt, vor allem von Hummeln; die Sommerbeeren liefern einen wertvollen Ertrag an der hellen östlichen Traufkante. Mit Kiefernrinde, Holzhäcksel oder Nadelstreu mulchen, anfangs 5–8 cm, bei älteren Sträuchern bis 10–15 cm; nur kalken, wenn eine Bodenprobe einen pH unter 4,5 zeigt.'
    },
    color: '#2563eb',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-blueberry.webp?v=2',
    suitableSoils: ['ACIDIC', 'SANDY'],
    unsuitableSoils: ['CHALKY', 'CLAY'],
    soilNotes: {
      en: 'Strict acidophile (pH 4.5–5.5) needing high organic matter (over 4 %) and steady moisture. Above this range the leaves turn yellow with green veins; fails on chalky or alkaline soils. Juglone-sensitive.',
      de: 'Streng säureliebend (pH 4,5–5,5), braucht viel organische Substanz (über 4 %) und gleichmäßige Feuchte. Darüber werden die Blätter gelb mit grünen Adern; auf kalkhaltigen oder alkalischen Böden nicht lebensfähig. Juglonempfindlich.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder Frühjahr (Mär–Mai) in saures Substrat',
      en: 'Autumn (Oct–Nov) or spring (Mar–May) in acidic soil'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug)',
      en: 'Mid-summer (Jul–Aug)'
    },
    recommendedForTrees: ['shrub-rhododendron', 'tree-chestnut'],
    sources: [
      'Wei, X., et al. (2022). Ericoid mycorrhizal fungi as biostimulants for improving propagation and production of ericaceous plants. Frontiers in Plant Science, 13, 1027390. doi:10.3389/fpls.2022.1027390',
      'Cooley, H., & Vallejo-Marín, M. (2021). Buzz-pollinated crops: A global review and meta-analysis of the effects of supplemental bee pollination in tomato. Journal of Economic Entomology, 114(2), 505–519. doi:10.1093/jee/toab009',
      'Lukas, S., Davis, A., Dixon, E., Detweiler, A. J., & Sanchez, N. (2025). Growing blueberries in your home garden (EC 1304). Oregon State University Extension Service. https://extension.oregonstate.edu/catalog/ec-1304-growing-blueberries-your-home-garden',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf'
    ]
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
    preferredSector: 'EAST_MORNING',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 1.8,
    maxDistanceM: 3.4,
    spreadM: 1.5,
    heightM: 1.5,
    perennial: true,
    notes: {
      en: 'The Blackcurrant star shrub used as an edible understory on the eastern drip line of taller fruit and nut trees, with morning sun and afternoon shade; it prefers sun but tolerates light shade. The early-spring flowers are visited and pollinated by bumblebees and mason bees, and the vitamin C-rich berries ripen in July–August. Currants (Ribes) are listed as juglone-tolerant by Penn State and UW–Madison Extension (observation-based lists).',
      de: 'Der Schwarze-Johannisbeer-Star als essbarer Unterwuchs an der östlichen Traufkante höherer Obst- und Nussbäume mit Morgensonne und Nachmittagsschatten; bevorzugt Sonne, verträgt aber lichten Schatten. Die Blüten im zeitigen Frühjahr werden von Hummeln und Mauerbienen besucht und bestäubt, die Vitamin-C-reichen Beeren reifen im Juli–August. Johannisbeeren (Ribes) werden von Penn State und UW–Madison Extension als juglontolerant gelistet (Beobachtungslisten).'
    },
    color: '#312e81',
    iconName: 'Apple',
    imageUrl: '/images/plants/plant-blackcurrant.webp',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Prefers well-drained but moisture-retentive, fertile loam or clay; copes with most other soils.',
      de: 'Bevorzugt durchlässigen, aber feuchtigkeitshaltenden, nährstoffreichen Lehm- oder Tonboden; kommt mit den meisten anderen Böden zurecht.'
    },
    plantingTime: {
      de: 'Herbst (Okt–Nov) oder zeitiges Frühjahr (Mär–Apr)',
      en: 'Autumn (Oct–Nov) or early spring (Mar–Apr)'
    },
    harvestTime: {
      de: 'Hochsommer (Jul–Aug)',
      en: 'Mid-summer (Jul–Aug)'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-plum', 'tree-hazelnut', 'tree-alder', 'tree-linden'],
    sources: [
      'Royal Horticultural Society (n.d.). How to grow blackcurrants. RHS Grow Your Own. https://www.rhs.org.uk/fruit/blackcurrants/grow-your-own',
      'Fliszkiewicz, M., Giejdasz, K., & Wilkaniec, Z. (2011). The importance of male red mason bee (Osmia rufa L.) and male bufftailed bumblebee (Bombus terrestris L.) pollination in blackcurrant (Ribes nigrum L.). The Journal of Horticultural Science and Biotechnology, 86(5), 457–460. doi:10.1080/14620316.2011.11512788',
      'Hancock, R. D., et al. (2007). L-Ascorbic acid accumulation in fruit of Ribes nigrum occurs by in situ biosynthesis via the L-galactose pathway. Functional Plant Biology, 34(12), 1080–1091. doi:10.1071/FP07221',
      'Roman, D., & Sellmer, J. (n.d.). Landscaping and Gardening Around Walnuts and Other Juglone Producing Plants. Penn State Extension (updated 16 Feb 2026). https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants',
      'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity (UW Plant Disease Facts D0021, last revised 28 Feb 2024). University of Wisconsin–Madison Division of Extension. https://hort.extension.wisc.edu/articles/black-walnut-toxicity/'
    ]
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
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'SENSITIVE',
    minDistanceM: 1.2,
    maxDistanceM: 3.5,
    spreadM: 1.2,
    heightM: 1.0,
    perennial: true,
    notes: {
      en: 'The Garden Rhubarb star used as a long-lived edible understory perennial on the drip line of fruit trees; it crops earliest in full sun, away from shading trees. Its huge leaves shade out weeds, and after the stalk harvest ends (late June) the leaf blades can be cut and laid as mulch in place. Leaf blades contain oxalic acid – do not eat them. As a heavy feeder it benefits from compost and nitrogen-rich mulch such as comfrey.',
      de: 'Der Rhabarber-Star als langlebige essbare Staude an der Traufkante von Obstbäumen; am frühesten treibt er in voller Sonne ohne Baumschatten aus. Die riesigen Blätter beschatten Unkraut; nach dem Ernteende (Ende Juni) können die Blattspreiten abgeschnitten und direkt als Mulch ausgelegt werden. Blattspreiten enthalten Oxalsäure – nicht verzehren. Als Starkzehrer profitiert er von Kompost und stickstoffreichem Mulch wie Beinwell.'
    },
    color: '#be123c',
    iconName: 'Leaf',
    imageUrl: '/images/plants/plant-rhubarb.webp?v=2',
    suitableSoils: ['LOAM', 'CLAY', 'SILT'],
    unsuitableSoils: ['SANDY'],
    soilNotes: {
      en: 'Heavy feeder needing fertile, well-drained loam with good organic matter; work in plenty of compost or well-rotted manure. Prone to crown rot where water stands. Juglone-sensitive.',
      de: 'Starkzehrer für fruchtbaren, durchlässigen Lehmboden mit viel organischer Substanz; reichlich Kompost oder gut verrotteten Mist einarbeiten. Bei Staunässe anfällig für Wurzelhalsfäule. Juglonempfindlich.'
    },
    plantingTime: {
      de: 'Frühjahr (Mär–Apr) oder Herbst (Okt–Nov) als Wurzelstock',
      en: 'Spring (Mar–Apr) or autumn (Oct–Nov) as crowns'
    },
    harvestTime: {
      de: 'Stiele Apr–24. Jun; danach Blätter als Mulch',
      en: 'Stalks Apr–Jun 24; afterwards leaves as mulch'
    },
    recommendedForTrees: ['tree-apple', 'tree-pear', 'tree-alder', 'tree-linden'],
    sources: [
      'Riofrio, M., Lyon, E., & Young, C. E. (2021). Growing rhubarb in the home garden. Ohioline, The Ohio State University. https://cfaes.osu.edu/fact-sheet/growing-rhubarb-home-garden',
      'Dana, M. N., & Lerner, B. R. (2001). Black walnut toxicity (HO-193-W). Purdue University Cooperative Extension Service. https://www.purdue.edu/hla/sites/yardandgarden/wp-content/uploads/sites/2/2016/10/HO-193.pdf'
    ]
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
      en: 'Low, honey-scented annual that flowers from late spring well into autumn. Its tiny open flowers feed spiders, predatory bugs and hoverflies. In Washington State field trials, apple trees next to alyssum had fewer woolly apple aphids within a week, and predators marked on the flowers were later caught in the trees (Gontijo et al. 2013). Sow it along the drip line; it self-seeds lightly. Being shallow-rooted, low and spreading, it makes a good living mulch or seasonal ground cover.',
      de: 'Niedrige, nach Honig duftende Einjährige, die vom späten Frühjahr bis weit in den Herbst blüht. Die kleinen offenen Blüten ernähren Spinnen, Raubwanzen und Schwebfliegen. In Feldversuchen im US-Bundesstaat Washington hatten Apfelbäume neben Duftsteinrich schon nach einer Woche weniger Blutläuse; auf den Blüten markierte Räuber wurden später in den Bäumen gefangen (Gontijo et al. 2013). An der Traufkante aussäen; sät sich schwach selbst aus. Flach wurzelnd, niedrig und ausladend, eignet es sich gut als lebender Mulch oder saisonaler Bodendecker.'
    },
    color: '#f5f5f4',
    iconName: 'Flower',
    imageUrl: '/images/plants/plant-sweet-alyssum.webp',
    suitableSoils: ['LOAM', 'SANDY', 'SILT', 'CHALKY'],
    unsuitableSoils: ['CLAY'],
    soilNotes: {
      en: 'Prefers average, well-drained soil in full sun; avoid waterlogged clay.',
      de: 'Bevorzugt durchschnittlichen, durchlässigen Boden in voller Sonne; nasse Tonböden meiden.'
    },
    plantingTime: {
      de: 'Direktsaat Apr–Mai (Lichtkeimer, nur andrücken)',
      en: 'Direct sow Apr–May (needs light to germinate, press in only)'
    },
    harvestTime: {
      de: 'Blüte spätes Frühjahr bis Herbst',
      en: 'Flowers late spring to autumn'
    },
    recommendedForTrees: ['tree-apple'],
    sources: [
      'Gontijo, L. M., Beers, E. H., & Snyder, W. E. (2013). Flowers promote aphid suppression in apple orchards. Biological Control, 66(1), 8–15. doi:10.1016/j.biocontrol.2013.03.007',
      'Mahr, S. (2026). Sweet alyssum, Lobularia maritima. Wisconsin Horticulture, University of Wisconsin–Madison Extension. https://hort.extension.wisc.edu/articles/sweet-alyssum-lobularia-maritima/'
    ]
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
    roles: ['POLLINATOR_MAGNET'],
    seasonalActivity: {
      activeSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      floweringSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: [],
      pestDeterrenceSeasons: [],
      plantingSeasons: ['EARLY_SPRING', 'AUTUMN'],
      harvestSeasons: ['LATE_SPRING', 'SUMMER', 'AUTUMN']
    },
    preferredZone: 'ZONE_4_OUTER',
    preferredSector: 'SOUTH_SUN',
    jugloneTolerance: 'TOLERANT',
    minDistanceM: 2.0,
    maxDistanceM: 6.0,
    spreadM: 0.4,
    heightM: 0.8,
    perennial: false,
    notes: {
      en: 'Native biennial umbellifer and one of the native flowers used in perennial alley flower strips tested in 23 organic apple orchard blocks across Europe, where the strips lowered codling moth numbers and slowed the rise in fruit damage (Cahenzli et al. 2019). Its open umbels feed the codling moth parasitoid Ascogaster quadridentata, which lived more than twice as long with wild carrot flowers in the lab (Mátray & Herz 2022). Sow as part of a native mix in the alley; it self-seeds. Listed as juglone-tolerant by the Ontario Ministry of Agriculture (observation-based list).',
      de: 'Heimischer, zweijähriger Doldenblütler und eine der heimischen Arten der mehrjährigen Blühstreifen, die in 23 Bio-Apfelanlagen-Blöcken in ganz Europa getestet wurden: Die Streifen senkten die Apfelwickler-Zahlen und bremsten den Anstieg der Fruchtschäden (Cahenzli et al. 2019). Die offenen Dolden ernähren die Wickler-Schlupfwespe Ascogaster quadridentata, die im Labor mit Möhrenblüten mehr als doppelt so lange lebte (Mátray & Herz 2022). Als Teil einer heimischen Mischung in der Fahrgasse aussäen; sät sich selbst aus. Vom Landwirtschaftsministerium Ontarios als juglontolerant gelistet (Beobachtungsliste).'
    },
    color: '#fafaf9',
    iconName: 'Flower2',
    imageUrl: '/images/plants/plant-wild-carrot.webp',
    suitableSoils: ['LOAM', 'SANDY', 'CHALKY', 'SILT'],
    unsuitableSoils: ['ACIDIC'],
    soilNotes: {
      en: 'Prefers sunny, well-drained, rather lean ground; does poorly on wet soils.',
      de: 'Bevorzugt sonnige, durchlässige, eher magere Böden; auf nassen Böden kümmert sie.'
    },
    plantingTime: {
      de: 'Aussaat Sep–Okt oder Mär–Apr',
      en: 'Sow Sep–Oct or Mar–Apr'
    },
    harvestTime: {
      de: 'Blüte Jun–Sep im zweiten Jahr',
      en: 'Flowers Jun–Sep in the second year'
    },
    recommendedForTrees: ['tree-apple', 'tree-quince'],
    sources: [
      'Cahenzli, F., et al. (2019). Perennial flower strips for pest control in organic apple orchards – A pan-European study. Agriculture, Ecosystems & Environment, 278, 43–53. doi:10.1016/j.agee.2019.03.011',
      'Herz, A., et al. (2019). Managing floral resources in apple orchards for pest control: Ideas, experiences and future directions. Insects, 10(8), 247. doi:10.3390/insects10080247',
      'Mátray, S., & Herz, A. (2022). Flowering plants serve nutritional needs of Ascogaster quadridentata (Hymenoptera: Braconidae), a key parasitoid of codling moth. Biological Control, 171, 104950. doi:10.1016/j.biocontrol.2022.104950',
      'Ontario Ministry of Agriculture, Food and Agribusiness (2022, updated 2026). Walnut toxicity. Government of Ontario. https://www.ontario.ca/page/walnut-toxicity'
    ]
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
      chopAndDropSeasons: ['LATE_SPRING'],
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
      en: 'Deep-rooted, nitrogen-fixing legume of dry limestone grassland and an outstanding bee plant with abundant nectar. It made up 43 % of an autumn-sown vineyard cover crop (with perennial ryegrass and white clover) that, in unsprayed plots, cut powdery mildew by over 80 % and downy mildew slightly; cover crops in the same study reduced rain splash from the ground that carries spores (Hasanaliyeva et al. 2024). Mow high once around full bloom and leave the cuttings.',
      de: 'Tiefwurzelnde, stickstoffbindende Leguminose der Kalkmagerrasen und hervorragende Bienenweide mit reichlich Nektar. Sie machte 43 % einer im Herbst gesäten Weinberg-Begrünung aus (mit Deutschem Weidelgras und Weißklee), die in unbehandelten Parzellen den Echten Mehltau um über 80 % und den Falschen Mehltau leicht senkte; Begrünungen verringerten in derselben Studie das Aufspritzen von Regentropfen, die Sporen vom Boden tragen (Hasanaliyeva et al. 2024). Um die Vollblüte einmal hoch mähen und das Schnittgut liegen lassen.'
    },
    color: '#db2777',
    iconName: 'Flower',
    imageUrl: '/images/plants/plant-sainfoin.webp',
    suitableSoils: ['CHALKY', 'LOAM', 'SANDY'],
    unsuitableSoils: ['ACIDIC', 'CLAY'],
    soilNotes: {
      en: 'Needs deep, dry, well-drained, calcareous soil (pH about 6.6–8); fails on acidic or waterlogged ground. Inoculate seed with sainfoin-specific rhizobia.',
      de: 'Braucht tiefgründigen, trockenen, durchlässigen, kalkhaltigen Boden (pH etwa 6,6–8); versagt auf sauren oder staunassen Böden. Saatgut mit esparsettenspezifischen Rhizobien impfen.'
    },
    plantingTime: {
      de: 'Aussaat Apr–Mai oder Aug (ungeschältes Saatgut in der Hülse, max. 2 cm tief)',
      en: 'Sow Apr–May or Aug (unhulled seed in its pod, max. 2 cm deep)'
    },
    harvestTime: {
      de: 'Blüte Mai–Jul; Schnitt um die Vollblüte',
      en: 'Flowers May–Jul; cut around full bloom'
    },
    recommendedForTrees: ['vine-grape'],
    sources: [
      'Hasanaliyeva, G., Furiosi, M., Rossi, V., & Caffi, T. (2024). Cover crops lower the dispersal of grapevine foliar pathogens from the ground and contribute to early-season disease management. Frontiers in Plant Science, 15, 1498848. doi:10.3389/fpls.2024.1498848',
      'Tilley, D., Ogle, D., & St. John, L. (2008). Plant guide: Sainfoin, Onobrychis viciifolia. USDA NRCS Plant Materials Center, Aberdeen, ID. https://agresearch.montana.edu/wtarc/producerinfo/agronomy-nutrient-management/Sainfoin/NRCSPLantGuide.pdf',
      'Government of Alberta (n.d.). Sainfoin. Alberta Agriculture. https://www.alberta.ca/sainfoin'
    ]
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
    roles: ['PEST_REPELLER'],
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
      en: 'Warm-season annual legume (it does not form nodules or fix nitrogen) used between tea rows in China. In field trials, tea intercropped with sicklepod had significantly fewer tea green leafhoppers (Empoasca onukii); its volatiles repel the leafhopper and the intercrop increased spiders, ladybirds and lacewings (Zhang et al. 2014, 2017). Only for subtropical or very warm sites; it needs heat and does not survive frost. Cut before seeds ripen, as it can self-seed.',
      de: 'Wärmeliebende einjährige Leguminose (bildet keine Knöllchen und bindet keinen Stickstoff), die in China zwischen Teereihen angebaut wird. In Feldversuchen hatte Tee mit Sichelhülse deutlich weniger Grüne Teezikaden (Empoasca onukii); ihre Duftstoffe wehren die Zikade ab, und der Mischanbau förderte Spinnen, Marienkäfer und Florfliegen (Zhang et al. 2014, 2017). Nur für subtropische oder sehr warme Standorte; braucht Wärme und ist nicht frosthart. Vor der Samenreife schneiden, da sie sich selbst aussät.'
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
      de: 'Aussaat nach den letzten Frösten (Mai) in warmen Boden',
      en: 'Sow after last frost (May) into warm soil'
    },
    harvestTime: {
      de: 'Blüte Jul–Okt; vor Samenreife schneiden',
      en: 'Flowers Jul–Oct; cut before seeds ripen'
    },
    recommendedForTrees: ['tree-tea-sinensis', 'tree-tea-assamica'],
    sources: [
      'Zhang, Z., Sun, X., Luo, Z., Bian, L., & Chen, Z. (2014). Dual action of Catsia tora in tea plantations: repellent volatiles and augmented natural enemy population provide control of tea green leafhopper. Phytoparasitica, 42(5), 595–607. doi:10.1007/s12600-014-0400-y',
      'Zhang, Z., et al. (2017). Effects of intercropping tea with aromatic plants on population dynamics of arthropods in Chinese tea plantations. Journal of Pest Science, 90(1), 227–237. doi:10.1007/s10340-016-0783-2',
      'Cannon, S. B., et al. (2015). Multiple polyploidy events in the early radiation of nodulating and nonnodulating legumes. Molecular Biology and Evolution, 32(1), 193–210. doi:10.1093/molbev/msu296'
    ]
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
      en: 'Annual nitrogen-fixing legume sown between tea rows. In a field study, a tea–soybean intercrop reduced foliar diseases of tea such as anthracnose (Shao et al. 2026). After the bean harvest the haulm can be laid as mulch. Low soil pH impairs its nodulation, so use it only on the least acidic tea sites.',
      de: 'Einjährige, stickstoffbindende Leguminose zwischen Teereihen. In einer Feldstudie senkte ein Tee-Soja-Mischanbau Blattkrankheiten des Tees wie die Anthraknose (Shao et al. 2026). Nach der Bohnenernte kann das Kraut als Mulch ausgelegt werden. Niedriger Boden-pH beeinträchtigt die Knöllchenbildung, daher nur auf den am wenigsten sauren Tee-Standorten verwenden.'
    },
    color: '#a3a635',
    iconName: 'Bean',
    imageUrl: '/images/plants/plant-soybean.webp',
    suitableSoils: ['LOAM', 'SILT', 'SANDY'],
    unsuitableSoils: ['CLAY', 'ACIDIC'],
    soilNotes: {
      en: 'Warm, well-drained loam, ideally around pH 6–7; nodulation suffers on acidic soils. Inoculate with Bradyrhizobium japonicum where soy has not grown before or where soil pH is below 6.',
      de: 'Warmer, durchlässiger Lehm, ideal um pH 6–7; auf sauren Böden leidet die Knöllchenbildung. Wo noch nie Soja stand oder der pH unter 6 liegt, mit Bradyrhizobium japonicum impfen.'
    },
    plantingTime: {
      de: 'Aussaat Mitte Mai, Boden etwa 13 °C oder wärmer',
      en: 'Sow mid-May, soil about 13 °C or warmer'
    },
    harvestTime: {
      de: 'Sep–Okt (reife Bohnen)',
      en: 'Sep–Oct (dry beans)'
    },
    recommendedForTrees: ['tree-tea-sinensis'],
    sources: [
      'Shao, S., et al. (2026). Tea–soybean intercropping enhances tea yield and foliar disease suppression associated with phyllosphere Pseudomonas enrichment and apoplastic metabolic shifts. Industrial Crops and Products, 251, 124159. doi:10.1016/j.indcrop.2026.124159',
      'Orlowski, S., Ketterings, Q., Czymmek, K., Cerosaletti, P., & Stanyard, M. (2012). Fertility management of soybeans (Agronomy Fact Sheet 74). Cornell University Cooperative Extension. http://nmsp.cals.cornell.edu/publications/factsheets/factsheet74.pdf',
      'Iowa State University Extension and Outreach (n.d.). Seed inoculation. Integrated Crop Management Encyclopedia. https://crops.extension.iastate.edu/encyclopedia/seed-inoculation',
      'Lin, M.-H., Gresshoff, P. M., & Ferguson, B. J. (2012). Systemic regulation of soybean nodulation by acidic growth conditions. Plant Physiology, 160(4), 2028–2039. doi:10.1104/pp.112.204149',
      'Bauder, S. (2024). Delayed planting due to soil temperatures? SDSU Extension. https://extension.sdstate.edu/delayed-planting-due-soil-temperatures'
    ]
  }
];

/** Companions that may be offered, recommended or suggested (retired entries excluded). */
export const ACTIVE_GUILD_PLANTS: GuildPlant[] = GUILD_PLANTS.filter(p => !p.retired);

const RETIRED_PLANT_IDS = new Set(GUILD_PLANTS.filter(p => p.retired).map(p => p.id));

/** True for companions that were retired from the catalogue. */
export const isRetiredPlantId = (id: string): boolean => RETIRED_PLANT_IDS.has(id);
