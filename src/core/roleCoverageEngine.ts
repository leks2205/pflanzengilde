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
      en: 'Plants with a documented deep taproot or nutrient-rich leaves or litter, used as mulch. The permaculture idea that they pump subsoil minerals up to neighbouring plants is popular but little tested.',
      de: 'Pflanzen mit belegter tiefer Pfahlwurzel oder nährstoffreichem Laub bzw. Streu, das als Mulch dient. Die Permakultur-Idee, dass sie Mineralstoffe aus dem Unterboden für Nachbarpflanzen nach oben holen, ist verbreitet, aber kaum geprüft.'
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
      en: 'Only plants that reduced a specific pest of a specific crop in field trials (e.g. rosemary against the tea geometrid). The effect does not carry over to other pests or trees; the popular claim that aromatic herbs in general repel pests is unproven. See the pest evidence guide.',
      de: 'Nur Pflanzen, die in Feldversuchen einen bestimmten Schädling einer bestimmten Kultur verringert haben (z. B. Rosmarin gegen den Tee-Spanner). Die Wirkung lässt sich nicht auf andere Schädlinge oder Bäume übertragen; die verbreitete Annahme, Duftkräuter wehrten Schädlinge allgemein ab, ist nicht belegt. Siehe den Schädlings-Faktencheck.'
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
      en: 'Dense stands shown in field trials to suppress weeds (e.g. hemp against annual weeds). That bulb or allium rings around a trunk hold back lawn grass is unproven; mulching the tree basin is more reliable.',
      de: 'Dichte Bestände, die in Feldversuchen Unkraut unterdrückt haben (z. B. Hanf gegen einjährige Unkräuter). Dass Zwiebel- oder Lauchringe um den Stamm Rasengras zurückhalten, ist nicht belegt; Mulchen der Baumscheibe ist verlässlicher.'
    }
  },
  {
    role: 'ANTIFUNGAL',
    displayName: {
      en: 'Antifungal Ally',
      de: 'Natürlicher Pilzhemmer'
    },
    description: {
      en: 'Plants whose cultivation suppressed a fungal disease in experiments (e.g. Welsh onion against Fusarium wilt of cucumber in the soil). Lab effects of extracts and oils do not show that a living companion protects a tree, and no study was found showing that companions reduce apple scab.',
      de: 'Pflanzen, deren Anbau in Versuchen eine Pilzkrankheit unterdrückt hat (z. B. Winterheckenzwiebel gegen Fusarium-Welke der Gurke im Boden). Laborwirkungen von Extrakten und Ölen zeigen nicht, dass ein lebender Begleiter einen Baum schützt, und eine Studie, nach der Begleiter Apfelschorf verringern, wurde nicht gefunden.'
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
