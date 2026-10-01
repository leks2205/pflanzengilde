/** localStorage key of the garden planner state (GardenPlannerPage; App's JSON import writes it too). */
export const STORAGE_KEY_GARDEN_GRID = 'permaculture_garden_grid_v1';

/**
 * The garden's saved "automatic conflict resolution" preference (default on), so the radial plan's
 * multi-star preview resolves conflicts exactly like the garden it hands the cluster to.
 */
export function readSavedAutoResolvePreference(): boolean {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_GARDEN_GRID) : null;
    if (!raw) return true;
    const data = JSON.parse(raw);
    return typeof data?.autoResolveEnabled === 'boolean' ? data.autoResolveEnabled : true;
  } catch {
    return true;
  }
}
