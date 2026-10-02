import { GuildPlant } from '../types/guild';

/**
 * Ground covers are planted or spread as an area, not as single plants.
 *
 * CARPET  continuous mat or sward (clover, woodruff, creeping thyme ...)
 * DRIFT   patches with natural gaps around the tree (naturalising bulbs, self-seeding annuals)
 * ALLEY   sown strip outside the drip line / between trees (orchard alley flower strips, vineyard
 *         inter-row covers, tea inter-row intercrops)
 *
 * Every plant without an entry stays a clump (point placement). The classification and the
 * parameters below come from the 2026-10-02 research pass (see Memory/guild_rules.md, section
 * "Ground covers"); values listed in `heuristic` have no direct source and are planning values.
 */
export type GroundCoverMode = 'CARPET' | 'DRIFT' | 'ALLEY';

/**
 * When the cover occupies the ground. Covers of different layers can share the same ground
 * because they grow at different times (spring ephemerals before canopy leaf-out: Muller &
 * Bormann 1976; cool-season covers die back in summer).
 */
export type CoverSeasonLayer = 'SUMMER' | 'SPRING_EPHEMERAL' | 'COOL_SEASON';

/**
 * Light preference. SHADE covers concentrate in the poleward shade of the canopy, SUN covers avoid
 * it, HALF and ANY covers ignore it. Ellenberg L values (1 deep shade … 9 full light) are given in
 * `ellenbergL` where published (Ellenberg et al. 1991; Hill et al. 1999).
 */
export type CoverLight = 'SHADE' | 'HALF' | 'SUN' | 'ANY';

/**
 * Clonal growth form (Lovett Doust 1981): GUERRILLA species send long runners that weave into
 * neighbouring covers (soft, wide blend band); PHALANX species advance as a dense front (near-hard
 * edge).
 */
export type CoverStrategy = 'GUERRILLA' | 'PHALANX';

export interface GroundCoverSpec {
  plantId: string;
  mode: GroundCoverMode;
  /** Outer edge as a multiple of the star's canopy radius (CARPET/DRIFT). */
  rOuterFactor: number;
  /** Extra bare ring beyond the trunk clearance (m), e.g. for vigorous colonies. */
  rInnerExtraM?: number;
  light: CoverLight;
  ellenbergL?: number;
  strategy: CoverStrategy;
  /** Lateral spread rate of runners (m per year), where measured. */
  stolonRateMPerYr?: number;
  /** HARD = contain it (root barrier / mown edge); never blends into neighbours. */
  edge: 'SOFT' | 'HARD';
  seasonLayer: CoverSeasonLayer;
  /** Fraction of the area actually covered once established (drives fill opacity and drift dots). */
  coverFraction: number;
  /** Dense, tall or vole-friendly cover: keep >= 0.5 m from the trunk even around established trees. */
  denseVoleFriendly?: boolean;
  /** Only on acidic ground (pH below about 5.5). */
  acidOnly?: boolean;
  /** Strip width for ALLEY covers (m). */
  stripWidthM?: number;
  /** Extra clearance this cover keeps around clump companions (m), e.g. smothering mats. */
  clumpClearanceExtraM?: number;
  /** Bulb drifts: drawn as clustered dots (Neyman–Scott process). */
  drift?: { parentsPerM2: number; childrenMean: number; sigmaM: number };
  /** Planting density as published. */
  density?: { min: number; max: number; unit: 'plants/m2' | 'g/m2' | 'kg/ha' | 'bulbs/m2' };
  /** Parameters without a direct source (planning values). */
  heuristic: Array<'coverFraction' | 'rOuterFactor' | 'stripWidthM' | 'drift' | 'clumpClearanceExtraM'>;
  sources: string[];
}

// ── Shared sources ──────────────────────────────────────────────────────────────────────────────
const S = {
  willoughby1999: 'Willoughby, I. (1999). Future alternatives to the use of herbicides in British forestry. Canadian Journal of Forest Research, 29(7), 866-874. doi:10.1139/x99-043',
  atucha2011: 'Atucha, A., Merwin, I. A., & Brown, M. G. (2011). Long-term Effects of Four Groundcover Management Systems in an Apple Orchard. HortScience, 46(8), 1176-1183. doi:10.21273/HORTSCI.46.8.1176',
  merwin1999: 'Merwin, I. A., Ray, J. A., & Curtis, P. D. (1999). Orchard Groundcover Management Systems Affect Meadow Vole Populations and Damage to Apple Trees. HortScience, 34(2), 271-274. doi:10.21273/HORTSCI.34.2.271',
  sullivan2018: 'Sullivan, T. P., Sullivan, D. S., & Granatstein, D. M. (2018). Influence of living mulches on vole populations and feeding damage to apple trees. Crop Protection, 108, 78-86. doi:10.1016/j.cropro.2018.02.007',
  lovettDoust1981: 'Doust, L. L. (1981). Population Dynamics and Local Specialization in a Clonal Perennial (Ranunculus Repens): I. The Dynamics of Ramets in Contrasting Habitats. The Journal of Ecology, 69(3), 743. doi:10.2307/2259633',
  hill1999: 'Hill, M. O., Mountford, J. O., Roy, D. B., & Bunce, R. G. H. (1999). Ellenberg\'s indicator values for British plants. ECOFACT Volume 2 Technical Annex. Institute of Terrestrial Ecology. https://shipunov.depo.msu.ru/shipunov/school/books/hill1999_ellenberg.pdf',
  mullerBormann1976: 'Muller, R. N., & Bormann, F. H. (1976). Role of Erythronium americanum Ker. in Energy Flow and Nutrient Dynamics of a Northern Hardwood Forest Ecosystem. Science, 193(4258), 1126-1128. doi:10.1126/science.193.4258.1126',
  rhsGroundCover: 'Royal Horticultural Society (n.d.). Ground cover plants. RHS Advice. https://www.rhs.org.uk/advice/profile?pid=818',
  rhsBulbsInGrass: 'Royal Horticultural Society (n.d.). Naturalising bulbs in grass. RHS. https://www.rhs.org.uk/plants/types/bulbs/naturalising-in-grass',
  curtis2009: 'Curtis, P. D., Curtis, G. B., & Miller, W. B. (2009). Relative Resistance of Ornamental Flowering Bulbs to Feeding Damage by Voles. HortTechnology, 19(3), 499-503. doi:10.21273/HORTTECH.19.3.499',
  mia2021: 'Mia, M., Furmanczyk, E., Golian, J., Kwiatkowska, J., Malusá, E., & Neri, D. (2021). Living Mulch with Selected Herbs for Soil Management in Organic Apple Orchards. Horticulturae, 7(3), 59. doi:10.3390/horticulturae7030059',
  golian2023: 'Golian, J., Anyszka, Z., & Kwiatkowska, J. (2023). Multifunctional living mulches for weeds control in organic apple orchards. Acta Scientiarum Polonorum Hortorum Cultus, 22(2), 73-84. doi:10.24326/asphc.2023.4473',
  cahenzli2019: 'Cahenzli, F., Sigsgaard, L., Daniel, C., Herz, A., Jamar, L., Kelderer, M., … Jacobsen, S. K. (2019). Perennial flower strips for pest control in organic apple orchards - A pan-European study. Agriculture, Ecosystems & Environment, 278, 43-53. doi:10.1016/j.agee.2019.03.011',
  fiblStrips: 'FiBL / EcoOrchard (2019). Perennial flower strips for pest control in fruit orchards. The Organic Grower, 47, 26–29. https://agricology.co.uk/sites/default/files/Perennial%20flower%20strips%20for%20pest%20control%20in%20fruit%20orchards.pdf',
  guerra2012: 'Guerra, B., & Steenwerth, K. (2012). Influence of Floor Management Technique on Grapevine Growth, Disease Pressure, and Juice and Wine Composition: A Review. American Journal of Enology and Viticulture, 63(2), 149-164. doi:10.5344/ajev.2011.10001',
  hasanaliyeva2024: 'Hasanaliyeva, G., Furiosi, M., Rossi, V., & Caffi, T. (2024). Cover crops lower the dispersal of grapevine foliar pathogens from the ground and contribute to early-season disease management. Frontiers in Plant Science, 15, 1498848. doi:10.3389/fpls.2024.1498848',
  zhang2017: 'Zhang, Z., Zhou, C., Xu, Y., Huang, X., Zhang, L., & Mu, W. (2017). Effects of intercropping tea with aromatic plants on population dynamics of arthropods in Chinese tea plantations. Journal of Pest Science, 90(1), 227-237. doi:10.1007/s10340-016-0783-2',
  sareBuckwheat: 'SARE (2007). Buckwheat. In Managing Cover Crops Profitably (3rd ed.). Sustainable Agriculture Research and Education. https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/buckwheat/',
  sareSubclover: 'SARE (2007). Subterranean clover. In Managing Cover Crops Profitably (3rd ed.). https://www.sare.org/publications/managing-cover-crops-profitably/legume-cover-crops/subterranean-clover/',
  sareBrassicas: 'SARE (2007). Brassicas and mustards. In Managing Cover Crops Profitably (3rd ed.). https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/brassicas-and-mustards/',
  sareSorghum: 'SARE (2007). Sorghum-sudangrass hybrids. In Managing Cover Crops Profitably (3rd ed.). https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/sorghum-sudangrass/',
  pirhoferWalzl2011: 'Pirhofer‐Walzl, K., Søegaard, K., Høgh‐Jensen, H., Eriksen, J., Sanderson, M. A., Rasmussen, J., & Rasmussen, J. (2011). Forage herbs improve mineral composition of grassland herbage. Grass and Forage Science, 66(3), 415-423. doi:10.1111/j.1365-2494.2011.00799.x',
  ncsu: (slug: string, name: string) => `NC State Extension (n.d.). ${name}. North Carolina Extension Gardener Plant Toolbox. https://plants.ces.ncsu.edu/plants/${slug}/`,
};

const SPECS: GroundCoverSpec[] = [
  // ── CARPETS ────────────────────────────────────────────────────────────────────────────────────
  {
    plantId: 'plant-white-clover', mode: 'CARPET', rOuterFactor: 1.3, light: 'SUN', ellenbergL: 8,
    strategy: 'GUERRILLA', stolonRateMPerYr: 0.18, edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.9,
    denseVoleFriendly: true, density: { min: 0.4, max: 1.9, unit: 'g/m2' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [
      'Coladonato, M. (1993). Trifolium repens. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-trirep',
      'Burdon, J. J. (1983). Trifolium repens L. The Journal of Ecology, 71(1), 307. doi:10.2307/2259979',
      'British Columbia Ministry of Agriculture (n.d.). White clover – cover crop factsheet. https://www2.gov.bc.ca/assets/gov/farming-natural-resources-and-industry/agriculture-and-seafood/agricultural-land-and-environment/soil-nutrients/cover-crops/white_clover_final.pdf',
      S.willoughby1999, S.merwin1999, S.hill1999,
      'Granatstein, D., & Mullinix, K. (2008). Mulching Options for Northwest Organic and Conventional Orchards. HortScience, 43(1), 45-50. doi:10.21273/HORTSCI.43.1.45'
    ]
  },
  {
    plantId: 'plant-woodruff', mode: 'CARPET', rOuterFactor: 1.0, light: 'SHADE', ellenbergL: 2,
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.9, denseVoleFriendly: true,
    density: { min: 9, max: 12, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('galium-odoratum', 'Galium odoratum'), S.rhsGroundCover, S.sullivan2018, S.hill1999]
  },
  {
    plantId: 'plant-thyme', mode: 'CARPET', rOuterFactor: 1.15, light: 'SUN', ellenbergL: 7,
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.85, denseVoleFriendly: true,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('thymus-serpyllum', 'Thymus serpyllum'), S.sullivan2018, S.hill1999, S.lovettDoust1981]
  },
  {
    plantId: 'plant-bugleweed', mode: 'CARPET', rOuterFactor: 1.0, light: 'HALF', ellenbergL: 6,
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.85,
    density: { min: 4, max: 6, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [
      S.ncsu('ajuga-reptans', 'Ajuga reptans'), S.rhsGroundCover, S.hill1999,
      'Dong, M., During, H. J., & Werger, M. J. (2002). Root and shoot plasticity of the stoloniferous herb Ajuga reptans L. planted in a heterogeneous environment. Flora - Morphology, Distribution, Functional Ecology of Plants, 197(1), 37-46. doi:10.1078/0367-2530-00010'
    ]
  },
  {
    plantId: 'plant-creeping-jenny', mode: 'CARPET', rOuterFactor: 1.1, light: 'ANY',
    strategy: 'GUERRILLA', edge: 'HARD', seasonLayer: 'SUMMER', coverFraction: 0.95, clumpClearanceExtraM: 0.2,
    density: { min: 4, max: 6, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor', 'clumpClearanceExtraM'],
    sources: ['Innes, R. J. (2011). Lysimachia nummularia. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-lysnum', S.ncsu('lysimachia-nummularia', 'Lysimachia nummularia'), S.rhsGroundCover]
  },
  {
    plantId: 'plant-strawberry', mode: 'CARPET', rOuterFactor: 1.05, light: 'HALF', ellenbergL: 7,
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.7,
    density: { min: 4, max: 6, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: ['Munger, G. T. (2007). Fragaria vesca. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-fraves', S.rhsGroundCover, S.golian2023, S.hill1999]
  },
  {
    plantId: 'plant-cranberry', mode: 'CARPET', rOuterFactor: 0.9, light: 'SUN',
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.9, acidOnly: true,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('vaccinium-macrocarpon', 'Vaccinium macrocarpon'), 'DeMoranville, C., Sandler, H., & Caruso, F. (n.d.). Planting new cranberry beds. UMass Cranberry Station. https://wpcdn.web.wsu.edu/wp-wsucahnrs/uploads/sites/2166/2025/07/Planting-New-Cranberry-Beds-1.pdf']
  },
  {
    plantId: 'plant-wild-garlic', mode: 'CARPET', rOuterFactor: 1.0, light: 'SHADE', ellenbergL: 2,
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SPRING_EPHEMERAL', coverFraction: 0.9,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: ['Oborny, B., Botta-Dukát, Z., Rudolf, K., & Morschhauser, T. (2011). Population ecology ofAllium ursinum, a space-monopolizing clonal plant. Acta Botanica Hungarica, 53(3-4), 371-388. doi:10.1556/abot.53.2011.3-4.18', S.mullerBormann1976, S.hill1999]
  },
  {
    plantId: 'plant-sweet-potato', mode: 'CARPET', rOuterFactor: 1.1, light: 'SUN',
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.8,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('ipomoea-batatas', 'Ipomoea batatas'), 'Mississippi State University Extension (n.d.). Growing sweet potatoes at home (Publication 2784). https://extension.msstate.edu/publications/growing-sweet-potatoes-home']
  },
  {
    plantId: 'plant-peppermint', mode: 'CARPET', rOuterFactor: 1.1, light: 'HALF',
    strategy: 'GUERRILLA', edge: 'HARD', seasonLayer: 'SUMMER', coverFraction: 0.9, clumpClearanceExtraM: 0.2,
    density: { min: 4, max: 6, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor', 'clumpClearanceExtraM'],
    sources: [S.ncsu('mentha-x-piperita', 'Mentha × piperita'), S.mia2021, S.golian2023, 'Royal Horticultural Society (n.d.). Mint: grow your own. https://www.rhs.org.uk/herbs/mint/grow-your-own']
  },
  {
    plantId: 'plant-nettle', mode: 'CARPET', rOuterFactor: 1.2, rInnerExtraM: 0.5, light: 'ANY',
    strategy: 'PHALANX', edge: 'HARD', seasonLayer: 'SUMMER', coverFraction: 1.0, clumpClearanceExtraM: 0.4,
    heuristic: ['coverFraction', 'rOuterFactor', 'clumpClearanceExtraM'],
    sources: ['Carey, J. H. (1995). Urtica dioica. Fire Effects Information System. USDA Forest Service. https://www.fs.usda.gov/database/feis/plants/forb/urtdio/all.html', 'Taylor, K. (2009). Biological Flora of the British Isles: Urtica dioica L. Journal of Ecology, 97(6), 1436-1458. doi:10.1111/j.1365-2745.2009.01575.x']
  },
  {
    plantId: 'plant-wintergreen', mode: 'CARPET', rOuterFactor: 0.9, light: 'SHADE',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.9, acidOnly: true,
    density: { min: 8, max: 16, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('gaultheria-procumbens', 'Gaultheria procumbens'), 'Coladonato, M. (1994). Gaultheria procumbens. Fire Effects Information System. USDA Forest Service. https://www.fs.usda.gov/database/feis/plants/shrub/gaupro/all.html']
  },
  {
    plantId: 'plant-lingonberry', mode: 'CARPET', rOuterFactor: 0.9, light: 'HALF', ellenbergL: 5,
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.9, acidOnly: true,
    density: { min: 1.4, max: 2.7, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: ['Penhallegon, R. (2006). Lingonberry production guide for the Pacific Northwest (PNW 583-E). Oregon State University. https://extension.oregonstate.edu/sites/default/files/documents/pnw583.pdf', 'Tirmenstein, D. (1991). Vaccinium vitis-idaea. Fire Effects Information System. USDA Forest Service. https://www.fs.usda.gov/database/feis/plants/shrub/vacvit/all.html', S.hill1999]
  },
  {
    plantId: 'plant-wild-ginger', mode: 'CARPET', rOuterFactor: 0.9, light: 'SHADE',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.85,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('asarum', 'Asarum'), 'Ihor, K., Iurii, S., Hanna, K., & Nataliia, K. (2019). Vitality Structure of the Populations of Vegetative Motile Plants of Forest Ecosystems of the North-East of Ukraine. The Open Agriculture Journal, 13(1), 125-132. doi:10.2174/1874331501913010125']
  },
  {
    plantId: 'plant-subterranean-clover', mode: 'CARPET', rOuterFactor: 1.3, light: 'SUN',
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'COOL_SEASON', coverFraction: 0.9, denseVoleFriendly: true,
    density: { min: 22, max: 34, unit: 'kg/ha' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.sareSubclover, 'Restuccia, A., Scavo, A., Lombardo, S., Pandino, G., Fontanazza, S., Anastasi, U., … Abbate, C. (2020). Long-Term Effect of Cover Crops on Species Abundance and Diversity of Weed Flora. Plants, 9(11), 1506. doi:10.3390/plants9111506']
  },
  {
    plantId: 'plant-ladys-mantle', mode: 'CARPET', rOuterFactor: 1.0, light: 'ANY',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.8,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('alchemilla-mollis', 'Alchemilla mollis'), S.mia2021, S.golian2023]
  },
  {
    plantId: 'plant-creeping-phlox', mode: 'CARPET', rOuterFactor: 1.2, light: 'SUN',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.85, clumpClearanceExtraM: 0.15,
    heuristic: ['coverFraction', 'rOuterFactor', 'clumpClearanceExtraM'],
    sources: [S.ncsu('phlox-subulata', 'Phlox subulata'), 'Eom, S. H., Senesac, A. F., Tsontakis-Bradley, I., & Weston, L. A. (2005). Evaluation of Herbaceous Perennials as Weed Suppressive Groundcovers for Use Along Roadsides or in Landscapes. Journal of Environmental Horticulture, 23(4), 198-203. doi:10.24266/0738-2898-23.4.198']
  },

  // ── DRIFTS ─────────────────────────────────────────────────────────────────────────────────────
  {
    plantId: 'plant-daffodil', mode: 'DRIFT', rOuterFactor: 0.8, light: 'ANY', ellenbergL: 8,
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SPRING_EPHEMERAL', coverFraction: 0.3,
    drift: { parentsPerM2: 0.8, childrenMean: 7, sigmaM: 0.12 }, heuristic: ['coverFraction', 'rOuterFactor', 'drift'],
    sources: ['Royal Horticultural Society (n.d.). Daffodils: growing guide. https://www.rhs.org.uk/plants/daffodils/growing-guide', S.rhsBulbsInGrass, 'Barkham, J. P. (1992). Population Dynamics of the Wild Daffodil (Narcissus Pseudonarcissus). IV. Clumps and Gaps. The Journal of Ecology, 80(4), 797. doi:10.2307/2260867', S.curtis2009, S.mullerBormann1976]
  },
  {
    plantId: 'plant-crocus', mode: 'DRIFT', rOuterFactor: 0.8, light: 'ANY',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SPRING_EPHEMERAL', coverFraction: 0.25,
    density: { min: 100, max: 120, unit: 'bulbs/m2' },
    drift: { parentsPerM2: 1.2, childrenMean: 9, sigmaM: 0.1 }, heuristic: ['coverFraction', 'rOuterFactor', 'drift'],
    sources: ['Royal Horticultural Society (n.d.). Crocus: growing guide. https://www.rhs.org.uk/plants/crocus/growing-guide', S.rhsBulbsInGrass, S.curtis2009]
  },
  {
    plantId: 'plant-snowdrop', mode: 'DRIFT', rOuterFactor: 0.8, light: 'ANY', ellenbergL: 5,
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SPRING_EPHEMERAL', coverFraction: 0.3,
    drift: { parentsPerM2: 1.0, childrenMean: 8, sigmaM: 0.1 }, heuristic: ['coverFraction', 'rOuterFactor', 'drift'],
    sources: ['Royal Horticultural Society (n.d.). Snowdrops: growing guide. https://www.rhs.org.uk/plants/snowdrops/growing-guide', S.ncsu('galanthus-nivalis', 'Galanthus nivalis'), S.mullerBormann1976, S.hill1999]
  },
  {
    plantId: 'plant-winter-aconite', mode: 'DRIFT', rOuterFactor: 0.8, light: 'ANY',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SPRING_EPHEMERAL', coverFraction: 0.35,
    drift: { parentsPerM2: 1.0, childrenMean: 10, sigmaM: 0.12 }, heuristic: ['coverFraction', 'rOuterFactor', 'drift'],
    sources: [S.ncsu('eranthis-hyemalis', 'Eranthis hyemalis'), S.mullerBormann1976]
  },
  {
    plantId: 'plant-miners-lettuce', mode: 'DRIFT', rOuterFactor: 1.0, light: 'HALF',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'COOL_SEASON', coverFraction: 0.5,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: ['Matthews, R. F. (1993). Claytonia perfoliata. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-claper']
  },
  {
    plantId: 'plant-nasturtium', mode: 'DRIFT', rOuterFactor: 1.15, light: 'SUN',
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.6,
    density: { min: 11, max: 16, unit: 'plants/m2' }, heuristic: ['coverFraction', 'rOuterFactor'],
    sources: ['Mahr, S. (n.d.). Nasturtium, Tropaeolum majus. University of Wisconsin–Madison Extension. https://hort.extension.wisc.edu/articles/nasturtium-tropaeolum-majus/', S.golian2023]
  },
  {
    plantId: 'plant-chamomile', mode: 'DRIFT', rOuterFactor: 1.2, light: 'SUN',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.5,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('matricaria-chamomilla', 'Matricaria chamomilla')]
  },
  {
    plantId: 'plant-yarrow', mode: 'DRIFT', rOuterFactor: 1.25, light: 'SUN',
    strategy: 'GUERRILLA', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.6,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: ['Aleksoff, K. C. (1999). Achillea millefolium. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-achmil', S.ncsu('achillea-millefolium', 'Achillea millefolium')]
  },
  {
    plantId: 'plant-oregano', mode: 'DRIFT', rOuterFactor: 1.15, light: 'SUN',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.6,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('origanum-vulgare', 'Origanum vulgare')]
  },
  {
    plantId: 'plant-tansy', mode: 'DRIFT', rOuterFactor: 1.3, light: 'SUN',
    strategy: 'PHALANX', edge: 'HARD', seasonLayer: 'SUMMER', coverFraction: 0.7, clumpClearanceExtraM: 0.2,
    heuristic: ['coverFraction', 'rOuterFactor', 'clumpClearanceExtraM'],
    sources: ['Gucker, C. L. (2009). Tanacetum vulgare. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-tanvul', S.ncsu('tanacetum-vulgare', 'Tanacetum vulgare')]
  },
  {
    plantId: 'plant-ostrich-fern', mode: 'DRIFT', rOuterFactor: 1.0, light: 'SHADE',
    strategy: 'PHALANX', edge: 'SOFT', seasonLayer: 'SUMMER', coverFraction: 0.6,
    heuristic: ['coverFraction', 'rOuterFactor'],
    sources: [S.ncsu('matteuccia-struthiopteris', 'Matteuccia struthiopteris'), 'Prange, R. K., & Aderkas, P. v. (1985). The Biological Flora of Canada 6. Matteuccia struthiopteris (L.) Todaro, Ostrich Fern. The Canadian field-naturalist, 99(4), 517-532. doi:10.5962/p.355493']
  },
];

// ── ALLEY STRIPS (sown, outside the drip line) ────────────────────────────────────────────────────
type AlleyEntry = [string, CoverSeasonLayer, number, number, string[]]; // id, season, strip width, cover, sources
const ALLEY: AlleyEntry[] = [
  ['plant-alfalfa', 'SUMMER', 1.2, 0.85, ['University of Arkansas Cooperative Extension (n.d.). Alfalfa production (FSA-15).', S.atucha2011]],
  ['plant-sweet-alyssum', 'SUMMER', 1.0, 0.8, ['Gontijo, L. M., Beers, E. H., & Snyder, W. E. (2013). Flowers promote aphid suppression in apple orchards. Biological Control, 66(1), 8-15. doi:10.1016/j.biocontrol.2013.03.007']],
  ['plant-wild-carrot', 'SUMMER', 1.2, 0.6, [S.cahenzli2019, S.fiblStrips]],
  ['plant-sainfoin', 'SUMMER', 1.2, 0.75, [S.hasanaliyeva2024, S.guerra2012]],
  ['plant-sicklepod', 'SUMMER', 0.8, 0.7, [S.zhang2017]],
  ['plant-soybean', 'SUMMER', 0.8, 0.75, ['Shao, S., Li, Z., Ma, X., Li, Y., Lan, B., Meng, Z., … Ye, J. (2026). Tea–soybean intercropping enhances tea yield and foliar disease suppression associated with phyllosphere Pseudomonas enrichment and apoplastic metabolic shifts. Industrial Crops and Products, 251, 124159. doi:10.1016/j.indcrop.2026.124159']],
  ['plant-sorghum-sudangrass', 'SUMMER', 1.5, 0.9, [S.sareSorghum]],
  ['plant-chicory', 'SUMMER', 1.2, 0.6, [S.pirhoferWalzl2011]],
  ['plant-ribwort-plantain', 'SUMMER', 1.2, 0.6, [S.pirhoferWalzl2011]],
  ['plant-salad-burnet', 'SUMMER', 1.2, 0.6, [S.pirhoferWalzl2011]],
  ['plant-buckwheat', 'SUMMER', 0.9, 0.85, [S.sareBuckwheat]],
  ['plant-phacelia', 'SUMMER', 1.0, 0.85, ['Smither-Kopperl, M. (2018). Plant guide for lacy phacelia (Phacelia tanacetifolia). USDA NRCS.', S.hasanaliyeva2024]],
  ['plant-fodder-radish', 'COOL_SEASON', 1.0, 0.9, [S.sareBrassicas]],
  ['plant-basil', 'SUMMER', 0.8, 0.6, ['Song, B., Tang, G., Sang, X., Zhang, J., Yao, Y., & Wiggins, N. (2013). Intercropping with aromatic plants hindered the occurrence ofAphis citricolain an apple orchard system by shifting predator–prey abundances. Biocontrol Science and Technology, 23(4), 381-395. doi:10.1080/09583157.2013.763904']],
  ['plant-summer-savory', 'SUMMER', 0.8, 0.6, ['Ontario Ministry of Agriculture, Food and Rural Affairs (n.d.). Summer savory. CropOp. https://omafra.gov.on.ca/CropOp/en/herbs/']],
  ['plant-cornflower', 'SUMMER', 1.0, 0.6, [S.cahenzli2019]],
  ['plant-pot-marigold', 'SUMMER', 0.8, 0.65, ['Cai, Z., Ouyang, F., Zhang, X., Chen, J., Xiao, Y., Ge, F., & Zhang, J. (2021). Biological control of Aphis spiraecola (Hemiptera: Aphididae) Using Three Different Flowering Plants in Apple Orchards. Journal of Economic Entomology, 114(3), 1128-1137. doi:10.1093/jee/toab064']],
  ['plant-african-marigold', 'SUMMER', 0.8, 0.65, ['Niu, Y., Han, S., Wu, Z., Pan, C., Wang, M., Tang, Y., … Zhang, Q. (2022). A push–pull strategy for controlling the tea green leafhopper (Empoasca flavescens F.) using semiochemicals from Tagetes erecta and Flemingia macrophylla. Pest Management Science, 78(6), 2161-2172. doi:10.1002/ps.6840']],
  ['plant-chinese-motherwort', 'SUMMER', 0.8, 0.6, [S.zhang2017]],
  ['plant-indian-mustard', 'COOL_SEASON', 1.0, 0.85, [S.sareBrassicas]],
  ['plant-common-vetch', 'COOL_SEASON', 1.2, 0.85, [S.guerra2012, S.hasanaliyeva2024]],
];
for (const [plantId, seasonLayer, stripWidthM, coverFraction, sources] of ALLEY) {
  SPECS.push({
    plantId, mode: 'ALLEY', rOuterFactor: 1, light: 'ANY', strategy: 'PHALANX', edge: 'SOFT',
    seasonLayer, coverFraction, stripWidthM, heuristic: ['coverFraction', 'stripWidthM'], sources,
  });
}

export const GROUND_COVER_SPECS: Readonly<Record<string, GroundCoverSpec>> = Object.freeze(
  Object.fromEntries(SPECS.map(s => [s.plantId, s]))
);

export function getGroundCoverSpec(plant: Pick<GuildPlant, 'id'> & { retired?: boolean }): GroundCoverSpec | null {
  if (plant.retired) return null;
  return GROUND_COVER_SPECS[plant.id] ?? null;
}

export function isAreaPlant(plant: Pick<GuildPlant, 'id'> & { retired?: boolean }): boolean {
  return getGroundCoverSpec(plant) !== null;
}
