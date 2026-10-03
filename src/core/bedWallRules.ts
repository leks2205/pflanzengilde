import { GuildPlant, GuildRole } from '../types/guild';

/**
 * What crosses the lined wall of a raised bed (research pass 2026-10-02).
 *
 * A raised bed counts as its own small garden. All beds are treated as lined with a solid
 * root-barrier film on walls and bottom, which stops roots, root fungi and soil water. Fungal threads
 * cross 40 µm mesh (Frey & Schüepp 1992) and porous PTFE membranes (Mader et al. 2000) but not
 * 0.45 µm membranes (Frey & Schüepp 1992); that a solid film stops them is an assumption. Companions that work through the soil therefore only help plants on the same
 * side. Flying insects and scents pass over the wall (bee foraging ranges: Gathmann & Tscharntke
 * 2002, Greenleaf et al. 2007; natural enemies from flower strips: Jacobsen et al. 2022; airborne
 * limonene from marigold: Conboy et al. 2019).
 */
export type BedWallCrossing = 'CROSSES' | 'BLOCKED';

export const ROLE_CROSSES_BED_WALL: Readonly<Record<GuildRole, BedWallCrossing>> = {
  NITROGEN_FIXER: 'BLOCKED',       // root exudates, nodule turnover, mycorrhizal networks (Thilakarathna et al. 2016)
  DYNAMIC_ACCUMULATOR: 'BLOCKED',  // only as cut mulch or litter where it grows
  POLLINATOR_MAGNET: 'CROSSES',    // flying visitors
  PEST_REPELLER: 'CROSSES',        // scents and natural enemies (exceptions below)
  LIVING_MULCH: 'BLOCKED',         // covers only the soil it grows on
  GRASS_BARRIER: 'BLOCKED',        // root/rhizome barrier; the lined wall is one itself
  ANTIFUNGAL: 'BLOCKED',           // splash barrier, biofumigation, root compounds (Hasanaliyeva et al. 2024; Matthiessen & Kirkegaard 2006)
  BIOMASS_PRODUCER: 'BLOCKED',     // mulch counted where the plant grows
  EDIBLE_UNDERSTORY: 'BLOCKED',    // no effect on neighbours
};

/** Plants whose pest role works through the soil (nematodes), although the role usually crosses. */
export const PLANT_BED_WALL_OVERRIDES: Readonly<Record<string, Partial<Record<GuildRole, BedWallCrossing>>>> = {
  // French marigold: its nematode effect is a dense pre-crop on the spot (Hooks et al. 2010), and its
  // ANTIFUNGAL role already keeps it on its side; its airborne limonene (Conboy et al. 2019) crosses.
  'plant-sorghum-sudangrass': { PEST_REPELLER: 'BLOCKED' }, // nematode green manure, worked into the soil
};

export function roleCrossesBedWall(plant: GuildPlant, role: GuildRole): boolean {
  return (PLANT_BED_WALL_OVERRIDES[plant.id]?.[role] ?? ROLE_CROSSES_BED_WALL[role]) === 'CROSSES';
}

/** A companion may serve guilds on both sides of a bed wall only if every role it fills crosses. */
export function plantCrossesBedWall(plant: GuildPlant): boolean {
  return plant.roles.length > 0 && plant.roles.every(r => roleCrossesBedWall(plant, r));
}

export const BED_WALL_SOURCES: readonly string[] = [
  'Frey, B., & Schüepp, H. (1992). Transfer of symbiotically fixed nitrogen from berseem (Trifolium alexandrinum L.) to maize via vesicular—arbuscular mycorrhizal hyphae. New Phytologist, 122(3), 447-454. doi:10.1111/j.1469-8137.1992.tb00072.x',
  'MÄDER, P., VIERHEILIG, H., STREITWOLF‐ENGEL, R., BOLLER, T., FREY, B., CHRISTIE, P., & WIEMKEN, A. (2000). Transport of 15N from a soil compartment separated by a polytetrafluoroethylene membrane to plant roots via the hyphae of arbuscular mycorrhizal fungi. New Phytologist, 146(1), 155-161. doi:10.1046/j.1469-8137.2000.00615.x',
  'Thilakarathna, M. S., McElroy, M. S., Chapagain, T., Papadopoulos, Y. A., & Raizada, M. N. (2016). Belowground nitrogen transfer from legumes to non-legumes under managed herbaceous cropping systems. A review. Agronomy for Sustainable Development, 36(4), 58. doi:10.1007/s13593-016-0396-4',
  'Gathmann, A., & Tscharntke, T. (2002). Foraging ranges of solitary bees. Journal of Animal Ecology, 71(5), 757-764. doi:10.1046/j.1365-2656.2002.00641.x',
  'Jacobsen, S. K., Sørensen, H., & Sigsgaard, L. (2022). Perennial flower strips in apple orchards promote natural enemies in their proximity. Crop Protection, 156, 105962. doi:10.1016/j.cropro.2022.105962',
  'Conboy, N. J. A., McDaniel, T., Ormerod, A., George, D., Gatehouse, A. M. R., Wharton, E., … Donohoe, P. (2019). Companion planting with French marigolds protects tomato plants from glasshouse whiteflies through the emission of airborne limonene. PLOS ONE, 14(3), e0213071. doi:10.1371/journal.pone.0213071',
  'Greenleaf, S. S., Williams, N. M., Winfree, R., & Kremen, C. (2007). Bee foraging ranges and their relationship to body size. Oecologia, 153(3), 589-596. doi:10.1007/s00442-007-0752-9',
  'Matthiessen, J. N., & Kirkegaard, J. A. (2006). Biofumigation and Enhanced Biodegradation: Opportunity and Challenge in Soilborne Pest and Disease Management. Critical Reviews in Plant Sciences, 25(3), 235-265. doi:10.1080/07352680600611543',
  'Hooks, C. R., Wang, K. H., Ploeg, A., & McSorley, R. (2010). Using marigold (Tagetes spp.) as a cover crop to protect crops from plant-parasitic nematodes. Applied Soil Ecology, 46(3), 307-320. doi:10.1016/j.apsoil.2010.09.005',
  'Hasanaliyeva, G., Furiosi, M., Rossi, V., & Caffi, T. (2024). Cover crops lower the dispersal of grapevine foliar pathogens from the ground and contribute to early-season disease management. Frontiers in Plant Science, 15, 1498848. doi:10.3389/fpls.2024.1498848',
];
