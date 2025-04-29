import documentationStats from '../data/documentationStats.json';

/**
 * Synchronously loads documentation analytics data
 * This function is called at import/module load time
 * to preload the data before rendering
 */
export function fetchDocumentationStats() {
  // In a real application, this might include more complex logic:
  // - Transforming data
  // - Merging from multiple sources
  // - Calculating derived values
  // - Filtering out irrelevant entries

  // For now, we simply return the data
  return documentationStats;
}
