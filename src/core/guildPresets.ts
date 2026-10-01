/** Guild presets offered in the star selector and the initial guild (star STAR_TREES[0]). Checked for
 * compatibility in scripts/test_conflicts.ts. */
export const GUILD_PRESETS: Record<'apple' | 'walnut' | 'apricot' | 'minimal', { treeId: string; plantIds: string[] }> = {
  apple: {
    treeId: 'tree-apple',
    plantIds: [
      'plant-comfrey',
      'plant-white-clover',
      'plant-chives',
      'plant-daffodil',
      'plant-yarrow',
      'plant-horseradish',
      'plant-red-currant',
      'plant-sedum',
    ],
  },
  walnut: {
    treeId: 'tree-walnut',
    plantIds: [
      'plant-comfrey',
      'plant-elderberry',
      'plant-woodruff',
      'plant-red-currant',
      'plant-chives',
      'plant-nettle',
      'plant-bugleweed',
      'plant-crocus',
    ],
  },
  apricot: {
    treeId: 'tree-apricot',
    plantIds: [
      'plant-chives',
      'plant-crocus',
      'plant-horseradish',
      'plant-comfrey',
      'plant-white-clover',
      'plant-dandelion',
      'plant-lavender',
      'plant-yarrow',
    ],
  },
  minimal: {
    treeId: 'tree-apple',
    plantIds: ['plant-comfrey', 'plant-white-clover', 'plant-chives'],
  },
};

/** Companions of the first-visit guild around STAR_TREES[0]. */
export const DEFAULT_GUILD_PLANT_IDS: readonly string[] = [
  'plant-comfrey',
  'plant-white-clover',
  'plant-chives',
  'plant-daffodil',
  'plant-yarrow'
];
