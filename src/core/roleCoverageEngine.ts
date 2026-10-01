import { GuildPlant, GuildRole, LocalizedString, RoleCoverageReport } from '../types/guild';

export const ALL_ROLES: { role: GuildRole; displayName: LocalizedString; description: LocalizedString }[] = [
  {
    role: 'NITROGEN_FIXER',
    displayName: {
      en: 'Nitrogen Fixer',
      de: 'Stickstoff-Fixierer'
    },
    description: {
      en: 'Symbiotic root bacteria fix atmospheric nitrogen, feeding surrounding plants naturally.',
      de: 'Symbiotische Knöllchenbakterien binden Luftstickstoff und düngen umstehende Pflanzen auf natürliche Weise.'
    }
  },
  {
    role: 'DYNAMIC_ACCUMULATOR',
    displayName: {
      en: 'Dynamic Accumulator',
      de: 'Dynamischer Akkumulator'
    },
    description: {
      en: 'Deep taproots mine subsoil minerals (K, Ca, Mg) and cycle them to topsoil via mulch.',
      de: 'Tiefe Pfahlwurzeln erschließen Mineralstoffe (K, Ca, Mg) aus dem Unterboden und bringen sie als Mulch an die Oberfläche.'
    }
  },
  {
    role: 'POLLINATOR_MAGNET',
    displayName: {
      en: 'Pollinator & Beneficial Magnet',
      de: 'Bestäuber- & Nützlingsmagnet'
    },
    description: {
      en: 'Nectary flowers attract bees for pollination and predatory wasps/hoverflies for pest control.',
      de: 'Nektarblüten sichern die Bestäubung durch Bienen und locken Schwebfliegen und Schlupfwespen zur Schädlingsabwehr an.'
    }
  },
  {
    role: 'PEST_REPELLER',
    displayName: {
      en: 'Pest Repeller & Aromatic Confuser',
      de: 'Schädlingsabwehr & Verwirrpflanze'
    },
    description: {
      en: 'Volatile aromatic oils mask tree scents from moths and borers, or deter gnawing rodents.',
      de: 'Ätherische Öle überdecken den Baumgeruch vor Schadwicklern und Bohrern oder halten Wühlmäuse fern.'
    }
  },
  {
    role: 'LIVING_MULCH',
    displayName: {
      en: 'Living Mulch / Ground Cover',
      de: 'Lebendiger Mulch / Bodendecker'
    },
    description: {
      en: 'Dense weed-suppressing carpet that protects soil moisture, biology, and prevents erosion.',
      de: 'Dichter Teppich, der Unkraut unterdrückt, die Bodenfeuchtigkeit bewahrt und vor Erosion schützt.'
    }
  },
  {
    role: 'GRASS_BARRIER',
    displayName: {
      en: 'Grass Barrier / Bulb Ring',
      de: 'Grasbarriere / Zwiebelring'
    },
    description: {
      en: 'Dense root barrier around the trunk or drip line preventing invasive lawn grass encroachment.',
      de: 'Dichte Wurzelbarriere um den Stamm oder die Traufkante, die das Einwachsen von Rasengräsern blockiert.'
    }
  },
  {
    role: 'ANTIFUNGAL',
    displayName: {
      en: 'Antifungal Ally',
      de: 'Natürlicher Pilzhemmer'
    },
    description: {
      en: 'Sulfur and mustard oils in foliage/roots suppress fungal spores (apple scab, brown rot).',
      de: 'Schwefel- und Senföle in Wurzeln und Laub unterdrücken Schadpilze (Apfelschorf, Monilia-Fruchtfäule).'
    }
  },
  {
    role: 'BIOMASS_PRODUCER',
    displayName: {
      en: 'Biomass / Chop & Drop Mulch',
      de: 'Biomasse / Chop & Drop Mulch'
    },
    description: {
      en: 'Fast vegetative growth harvested multiple times per year for on-site fertility mulch.',
      de: 'Wuchsfreudige Pflanzenmasse, die mehrmals jährlich für nährstoffreichen Flächenmulch geschnitten wird.'
    }
  },
  {
    role: 'EDIBLE_UNDERSTORY',
    displayName: {
      en: 'Edible Understory & Yield',
      de: 'Essbarer Unterwuchs & Ertrag'
    },
    description: {
      en: 'Productive secondary crops (berries, herbs, greens) maximizing vertical space yields.',
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
