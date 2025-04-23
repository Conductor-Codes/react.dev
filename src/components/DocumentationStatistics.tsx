import React from 'react';
import {useRouter} from 'next/router';

// Simulated analytics data for demonstration purposes
const pageViewData = [
  {
    path: '/learn/describing-the-ui',
    views: 143500,
    completionRate: 0.72,
    avgTimeSpent: 340,
    lastUpdated: '2024-12-10',
    difficulty: 'beginner',
  },
  {
    path: '/learn/adding-interactivity',
    views: 98200,
    completionRate: 0.68,
    avgTimeSpent: 450,
    lastUpdated: '2024-11-25',
    difficulty: 'beginner',
  },
  {
    path: '/learn/managing-state',
    views: 120400,
    completionRate: 0.65,
    avgTimeSpent: 520,
    lastUpdated: '2024-12-05',
    difficulty: 'intermediate',
  },
  {
    path: '/learn/escape-hatches',
    views: 67800,
    completionRate: 0.58,
    avgTimeSpent: 380,
    lastUpdated: '2024-10-15',
    difficulty: 'advanced',
  },
  {
    path: '/reference/react',
    views: 215600,
    completionRate: 0.81,
    avgTimeSpent: 290,
    lastUpdated: '2025-01-20',
    difficulty: 'intermediate',
  },
  {
    path: '/reference/react-dom',
    views: 187300,
    completionRate: 0.77,
    avgTimeSpent: 310,
    lastUpdated: '2025-01-05',
    difficulty: 'intermediate',
  },
  {
    path: '/reference/react/useState',
    views: 198700,
    completionRate: 0.79,
    avgTimeSpent: 270,
    lastUpdated: '2025-02-10',
    difficulty: 'beginner',
  },
  {
    path: '/reference/react/useEffect',
    views: 185400,
    completionRate: 0.75,
    avgTimeSpent: 340,
    lastUpdated: '2025-02-10',
    difficulty: 'intermediate',
  },
  {
    path: '/reference/react/useContext',
    views: 112800,
    completionRate: 0.67,
    avgTimeSpent: 380,
    lastUpdated: '2025-01-15',
    difficulty: 'intermediate',
  },
  {
    path: '/reference/react/useReducer',
    views: 89500,
    completionRate: 0.64,
    avgTimeSpent: 420,
    lastUpdated: '2025-01-18',
    difficulty: 'advanced',
  },
  {
    path: '/reference/react/useMemo',
    views: 103700,
    completionRate: 0.71,
    avgTimeSpent: 300,
    lastUpdated: '2025-01-25',
    difficulty: 'advanced',
  },
  {
    path: '/reference/react/useCallback',
    views: 98200,
    completionRate: 0.7,
    avgTimeSpent: 310,
    lastUpdated: '2025-01-25',
    difficulty: 'advanced',
  },
  {
    path: '/reference/react/useRef',
    views: 115900,
    completionRate: 0.73,
    avgTimeSpent: 290,
    lastUpdated: '2025-01-20',
    difficulty: 'intermediate',
  },
  {
    path: '/blog/2023/03/16/introducing-react-dev',
    views: 85400,
    completionRate: 0.62,
    avgTimeSpent: 540,
    lastUpdated: '2023-03-16',
    difficulty: 'beginner',
  },
  {
    path: '/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022',
    views: 72600,
    completionRate: 0.58,
    avgTimeSpent: 620,
    lastUpdated: '2022-06-15',
    difficulty: 'intermediate',
  },
  {
    path: '/community/conferences',
    views: 28900,
    completionRate: 0.51,
    avgTimeSpent: 180,
    lastUpdated: '2024-12-20',
    difficulty: 'beginner',
  },
  {
    path: '/community/meetups',
    views: 19500,
    completionRate: 0.48,
    avgTimeSpent: 150,
    lastUpdated: '2024-11-10',
    difficulty: 'beginner',
  },
  // ... assume more entries exist
];

// This component has a single identified performance issue:
// Heavy inline data processing performed during each render.
const DocumentationStatistics = ({
  sections = ['learn', 'reference', 'blog', 'community'],
  sortBy = 'views',
  sortOrder = 'desc',
  difficultyFilter = 'all',
  includeOutdated = true,
  minimumViews = 0,
  minimumCompletionRate = 0,
  displayLimit = 10,
}) => {
  const router = useRouter();

  // Heavy inline computation in render cycle:
  const processedData = pageViewData
    // Filter by sections (based on the first segment of the path)
    .filter((page) => {
      const pageSection = page.path.split('/')[1];
      return sections.includes(pageSection);
    })
    // Filter by difficulty if specified
    .filter((page) => {
      return difficultyFilter === 'all' || page.difficulty === difficultyFilter;
    })
    // Optionally filter out outdated content
    .filter((page) => {
      if (includeOutdated) return true;
      const lastUpdated = new Date(page.lastUpdated);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return lastUpdated > sixMonthsAgo;
    })
    // Apply metric thresholds
    .filter((page) => {
      if (minimumViews > 0 && page.views < minimumViews) return false;
      if (
        minimumCompletionRate > 0 &&
        page.completionRate < minimumCompletionRate / 100
      )
        return false;
      return true;
    })
    // Compute an engagement score for demonstration purposes (heavy computation)
    .map((page) => {
      const viewsNorm = Math.min(page.views / 250000, 1);
      const completionNorm = page.completionRate;
      const timeSpentNorm = Math.min(page.avgTimeSpent / 600, 1);

      // Freshness factor computed from last update date
      const lastUpdated = new Date(page.lastUpdated);
      const monthsOld = (new Date() - lastUpdated) / (30 * 24 * 60 * 60 * 1000);
      const freshnessScore = Math.max(0, 1 - monthsOld / 24);

      // Difficulty multiplier for weighting
      let difficultyMultiplier = 1;
      if (page.difficulty === 'beginner') difficultyMultiplier = 0.9;
      if (page.difficulty === 'intermediate') difficultyMultiplier = 1.0;
      if (page.difficulty === 'advanced') difficultyMultiplier = 1.2;

      // Compute weighted engagement score
      const engagementScore =
        (0.4 * viewsNorm +
          0.3 * completionNorm +
          0.2 * timeSpentNorm +
          0.1 * Math.pow(freshnessScore, 2)) *
        difficultyMultiplier;

      return {
        ...page,
        engagementScore,
      };
    })
    // Sort the computed results
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'views') {
        comparison = b.views - a.views;
      } else if (sortBy === 'completion') {
        comparison = b.completionRate - a.completionRate;
      } else if (sortBy === 'timeSpent') {
        comparison = b.avgTimeSpent - a.avgTimeSpent;
      } else if (sortBy === 'engagement') {
        comparison = b.engagementScore - a.engagementScore;
      } else if (sortBy === 'lastUpdated') {
        comparison = new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    })
    // Limit the results to displayLimit entries.
    .slice(0, displayLimit);

  return (
    <div className="documentation-statistics">
      <h2>Documentation Analytics Dashboard</h2>
      <div className="stats-summary">
        <p>
          Showing top {processedData.length} pages by {sortBy}
        </p>
      </div>
      <div className="stats-table">
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Views</th>
              <th>Completion Rate</th>
              <th>Avg. Time Spent</th>
              <th>Engagement Score</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((page) => (
              <tr key={page.path}>
                <td>{page.path}</td>
                <td>{page.views.toLocaleString()}</td>
                <td>{(page.completionRate * 100).toFixed(1)}%</td>
                <td>{page.avgTimeSpent}s</td>
                <td>{page.engagementScore.toFixed(3)}</td>
                <td>{page.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentationStatistics;
