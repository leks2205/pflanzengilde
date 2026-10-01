import { GuildPlant, GuildRole, LocalizedString, RoleCoverageReport } from '../types/guild';

export const ALL_ROLES: { role: GuildRole; displayName: LocalizedString; description: LocalizedString }[] = [
  {
    role: 'NITROGEN_FIXER',
    displayName: {
      en: 'Nitrogen Fixer',
      de: 'Stickstoff-Fixierer'
    },
    description: {
      en: 'Root-nodule bacteria fix atmospheric nitrogen in the plant; neighbours benefit mainly when its leaves, roots or cuttings decompose.',
      de: 'Knöllchenbakterien binden Luftstickstoff in der Pflanze; Nachbarn profitieren vor allem, wenn ihr Laub, ihre Wurzeln oder ihr Schnittgut verrotten.'
    }
  },
  {
    role: 'DYNAMIC_ACCUMULATOR',
    displayName: {
      en: 'Dynamic Accumulator',
      de: 'Dynamischer Akkumulator'
    },
    description: {
      en: 'Plants with a documented deep root system or mineral-rich leaves or litter, used as mulch: in field trials chicory took up nitrogen from 1.2 m depth and fodder radish rooted deeper than 2.4 m, and pasture herbs such as chicory, plantain and dandelion contain more minerals than grass and clover. Cutting them returns these nutrients to the topsoil; the permaculture idea that living plants pump subsoil minerals up to their neighbours is popular but little tested.',
      de: 'Pflanzen mit belegtem tiefem Wurzelwerk oder mineralstoffreichem Laub bzw. Streu, das als Mulch dient: In Feldversuchen nahm Wegwarte Stickstoff aus 1,2 m Tiefe auf und Ölrettich wurzelte tiefer als 2,4 m, und Weidekräuter wie Wegwarte, Spitzwegerich und Löwenzahn enthalten mehr Mineralstoffe als Gras und Klee. Der Schnitt bringt diese Nährstoffe in den Oberboden zurück; die Permakultur-Idee, dass lebende Pflanzen Mineralstoffe aus dem Unterboden für ihre Nachbarn nach oben pumpen, ist verbreitet, aber kaum geprüft.'
    }
  },
  {
    role: 'POLLINATOR_MAGNET',
    displayName: {
      en: 'Pollinator & Beneficial Magnet',
      de: 'Bestäuber- & Nützlingsmagnet'
    },
    description: {
      en: 'Flowers documented to be visited by bees or by natural enemies such as hoverflies and parasitoid wasps. Fewer orchard pests have been shown for diverse flower strips, not for single species.',
      de: 'Blüten, für die Besuche von Bienen oder Nützlingen wie Schwebfliegen und Schlupfwespen belegt sind. Weniger Schädlinge im Obstbau sind für artenreiche Blühstreifen belegt, nicht für einzelne Arten.'
    }
  },
  {
    role: 'PEST_REPELLER',
    displayName: {
      en: 'Pest Repeller & Aromatic Confuser',
      de: 'Schädlingsabwehr & Verwirrpflanze'
    },
    description: {
      en: 'Plants after which field trials measured fewer pests on a specific crop, either because they repel the pest (e.g. rosemary against the tea geometrid) or because they feed and shelter its natural enemies such as parasitoid wasps, ladybirds and spiders (e.g. sweet alyssum against the woolly apple aphid, or a green vineyard floor against the grapevine moth). The effect does not carry over to other pests or trees; the popular claim that aromatic herbs in general repel pests is unproven. See the pest evidence guide.',
      de: 'Pflanzen, nach denen Feldversuche an einer bestimmten Kultur weniger Schädlinge gemessen haben – entweder weil sie den Schädling abwehren (z. B. Rosmarin gegen den Teespanner) oder weil sie seine Gegenspieler wie Schlupfwespen, Marienkäfer und Spinnen ernähren und beherbergen (z. B. Duftsteinrich gegen die Blutlaus oder eine grüne Rebgasse gegen den Traubenwickler). Die Wirkung lässt sich nicht auf andere Schädlinge oder Bäume übertragen; die verbreitete Annahme, Duftkräuter wehrten Schädlinge allgemein ab, ist nicht belegt. Siehe den Schädlings-Faktencheck.'
    }
  },
  {
    role: 'LIVING_MULCH',
    displayName: {
      en: 'Living Mulch / Ground Cover',
      de: 'Lebendiger Mulch / Bodendecker'
    },
    description: {
      en: 'Low, dense plants that keep the soil covered. How much they suppress weeds has rarely been measured for single species.',
      de: 'Niedrige, dichte Pflanzen, die den Boden bedeckt halten. Wie stark sie Unkraut unterdrücken, ist für einzelne Arten kaum gemessen.'
    }
  },
  {
    role: 'GRASS_BARRIER',
    displayName: {
      en: 'Grass Barrier / Bulb Ring',
      de: 'Grasbarriere / Zwiebelring'
    },
    description: {
      en: 'Dense plantings shown in field trials to suppress weeds in the tree strip, e.g. peppermint and nasturtium as living mulch under apple trees, subterranean clover in an apricot orchard, or hemp against annual weeds. The trials mostly measured annual weeds in the planted strip; none tested whether such plants keep established lawn grass from creeping in, and some living mulches compete with young trees. Mulching the tree basin remains the most reliable way to keep turf away.',
      de: 'Dichte Pflanzungen, die in Feldversuchen Unkraut im Baumstreifen unterdrückt haben, z. B. Pfefferminze und Kapuzinerkresse als lebender Mulch unter Apfelbäumen, Bodenfrüchtiger Klee in einer Aprikosenanlage oder Hanf gegen einjährige Unkräuter. Gemessen wurden meist einjährige Unkräuter im bepflanzten Streifen; ob solche Pflanzen eingewachsenen Rasen abhalten, wurde nicht geprüft, und manche lebenden Mulche konkurrieren mit jungen Bäumen. Mulchen der Baumscheibe bleibt der verlässlichste Weg, Rasen fernzuhalten.'
    }
  },
  {
    role: 'ANTIFUNGAL',
    displayName: {
      en: 'Antifungal Ally',
      de: 'Natürlicher Pilzhemmer'
    },
    description: {
      en: 'Plants that reduced plant diseases in field or container trials, as living cover, mixed crop or green manure (e.g. vineyard covers against mildew and grey mould, mustard and radish against apple replant disease). No study was found showing that living companions reduce apple scab.',
      de: 'Pflanzen, die in Feld- oder Containerversuchen als lebende Begrünung, Mischkultur oder Gründüngung Pflanzenkrankheiten verringerten (z. B. Weinbergbegrünungen gegen Mehltau und Grauschimmel, Senf und Rettich gegen die Apfel-Nachbaukrankheit). Eine Studie, nach der lebende Begleiter Apfelschorf verringern, wurde nicht gefunden.'
    }
  },
  {
    role: 'BIOMASS_PRODUCER',
    displayName: {
      en: 'Biomass / Chop & Drop Mulch',
      de: 'Biomasse / Chop & Drop Mulch'
    },
    description: {
      en: 'Vigorous plants that are cut, coppiced or lopped for mulch on site, or whose litter or crop residues are laid as mulch.',
      de: 'Wuchsfreudige Pflanzen, die für Mulch vor Ort geschnitten, auf den Stock gesetzt oder geschneitelt werden, oder deren Laub bzw. Ernterückstände als Mulch dienen.'
    }
  },
  {
    role: 'EDIBLE_UNDERSTORY',
    displayName: {
      en: 'Edible Understory & Yield',
      de: 'Essbarer Unterwuchs & Ertrag'
    },
    description: {
      en: 'Secondary crops (berries, herbs, greens) that make productive use of the space under the canopy.',
      de: 'Ertragreiche Begleiter (Beeren, Kräuter, Wildgemüse), die den Raum unter der Baumkrone produktiv nutzen.'
    }
  }
];

export function calculateRoleCoverage(selectedPlants: GuildPlant[]): RoleCoverageReport[] {
  return ALL_ROLES.map(roleDef => {
    const matchingPlants = selectedPlants.filter(p => p.roles.includes(roleDef.role));
    return {
      role: roleDef.role,
      displayName: roleDef.displayName,
      description: roleDef.description,
      covered: matchingPlants.length > 0,
      plantCount: matchingPlants.length,
      plants: matchingPlants,
      seasonalGaps: []
    };
  });
}

export interface MultiFunctionalHero {
  plant: GuildPlant;
  roleCount: number;
  rolesFulfilled: GuildRole[];
}

export function detectMultiFunctionalHeroes(selectedPlants: GuildPlant[]): MultiFunctionalHero[] {
  return selectedPlants
    .filter(p => p.roles.length >= 2)
    .map(p => ({
      plant: p,
      roleCount: p.roles.length,
      rolesFulfilled: p.roles
    }))
    .sort((a, b) => b.roleCount - a.roleCount);
}

export function calculateGuildEfficiencyScore(selectedPlants: GuildPlant[]): {
  coveredRoleCount: number;
  totalRoles: number;
  efficiencyPercent: number;
  isFullyCovered: boolean;
  uncoveredRoles: GuildRole[];
} {
  const coverage = calculateRoleCoverage(selectedPlants);
  const covered = coverage.filter(c => c.covered).length;
  const total = ALL_ROLES.length;
  const uncovered = coverage.filter(c => !c.covered).map(c => c.role);

  return {
    coveredRoleCount: covered,
    totalRoles: total,
    efficiencyPercent: Math.round((covered / total) * 100),
    isFullyCovered: covered === total,
    uncoveredRoles: uncovered
  };
}
