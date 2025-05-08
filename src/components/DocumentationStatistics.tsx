import React, {useState} from 'react';
import {useRouter} from 'next/router';

// Simulated analytics data for demonstration purposes

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
  const [selectedDifficulty, setSelectedDifficulty] =
    useState(difficultyFilter);
  const [selectedSortMethod, setSelectedSortMethod] = useState(sortBy);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // This will code-split the data into a separate chunk
        const module = await import('../data/pageViewData');
        setData(module.default);
      } catch (error) {
        console.error('Failed to load page view data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const processedData = data
    // Filter by sections (based on the first segment of the path)
    .filter((page) => {
      const pageSection = page.path.split('/')[1];
      return sections.includes(pageSection);
    })
    // Filter by difficulty if specified
    .filter((page) => {
      return (
        selectedDifficulty === 'all' || page.difficulty === selectedDifficulty
      );
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
    // Compute an engagement score for demonstration purposes
    .map((page) => {
      const viewsNorm = Math.min(page.views / 250000, 1);
      const completionNorm = page.completionRate;
      const timeSpentNorm = Math.min(page.avgTimeSpent / 600, 1);

// Compute freshness factor and engagement score using useMemo
const { freshnessScore, difficultyMultiplier, engagementScore } = React.useMemo(() => {
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
    
  return { freshnessScore, difficultyMultiplier, engagementScore };
}, [page.lastUpdated, page.difficulty, viewsNorm, completionNorm, timeSpentNorm]);

      return {
        ...page,
        engagementScore,
      };
    })
    // Sort the computed results
    .sort((a, b) => {
      let comparison = 0;
      if (selectedSortMethod === 'views') {
        comparison = b.views - a.views;
      } else if (selectedSortMethod === 'completion') {
        comparison = b.completionRate - a.completionRate;
      } else if (selectedSortMethod === 'timeSpent') {
        comparison = b.avgTimeSpent - a.avgTimeSpent;
      } else if (selectedSortMethod === 'engagement') {
        comparison = b.engagementScore - a.engagementScore;
      } else if (selectedSortMethod === 'lastUpdated') {
        comparison = new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    })
    // Limit the results to displayLimit entries.
    .slice(0, displayLimit);

  const filterControls = (
    <div
      className="filter-controls"
      style={{marginBottom: '20px', display: 'flex', gap: '15px'}}>
      <div>
        <label htmlFor="difficulty-filter" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
          Filter by difficulty level:
        </label>
        <select
          id="difficulty-filter"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: '#f7f7f7',
            color: '#333',
          }}>
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <select
          value={selectedSortMethod}
          onChange={(e) => setSelectedSortMethod(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: '#f7f7f7',
            color: '#333',
          }}>
          <option value="views">Sort by Views</option>
          <option value="completion">Sort by Completion Rate</option>
          <option value="timeSpent">Sort by Avg Time Spent</option>
          <option value="engagement">Sort by Engagement</option>
          <option value="lastUpdated">Sort by Last Updated</option>
        </select>
      </div>

      <button
        onClick={() => {
          setSelectedDifficulty('all');
          setSelectedSortMethod('views');
        }}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0969da',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}>
        <span className="icon">↺</span>
      </button>
    </div>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#2196F3';
      case 'advanced':
        return '#F44336';
      default:
        return 'grey';
    }
  };

  const getEfficiencyClass = (completionRate, timeSpent) => {
    const efficiency = (completionRate * 100) / (timeSpent / 60);
    if (efficiency > 15) return '#4CAF50';
    if (efficiency > 10) return '#FFC107';
    return '#F44336';
  };

  return (
    <div
      className="documentation-statistics"
      style={{
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
      <h2
        style={{
          fontSize: '1.8rem',
          marginBottom: '16px',
          background: 'linear-gradient(90deg, #0969da, #8e44ad)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
        }}>
        Documentation Analytics Dashboard
      </h2>

      <div className="stats-summary" style={{marginBottom: '20px'}}>
        <p style={{fontSize: '0.9rem', color: '#555'}}>
          Showing top {processedData.length} pages filtered by{' '}
          {selectedDifficulty !== 'all'
            ? selectedDifficulty
            : 'all difficulties'}
          , sorted by {selectedSortMethod}
        </p>
      </div>

      {filterControls}

<div
        className="stats-chart"
        style={{
          marginBottom: '30px',
          height: '120px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
        }}>
        {processedData.slice(0, 7).map((page, idx) => (
          <div
            key={idx}
            style={{
              height: `${Math.max(5, (page.views / 250000) * 100)}%`,
              backgroundColor: getDifficultyColor(page.difficulty),
              flex: 1,
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              cursor: 'pointer',
              minHeight: '4px',
              transition: 'height 0.3s ease-out',
            }}
            onClick={() => router.push(page.path)}
            onMouseEnter={() => setHoveredRow(page.path)}
            onMouseLeave={() => setHoveredRow(null)}>
            {hoveredRow === page.path && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#ddd',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                }}>
                {page.path.split('/').pop()}: {page.views.toLocaleString()}{' '}
                views
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="stats-table" style={{overflowX: 'auto'}}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
          <thead>
            <tr style={{backgroundColor: '#f1f5f9'}}>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '2px solid #e2e8f0',
                }}>
                Page
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  borderBottom: '2px solid #e2e8f0',
                }}>
                Views
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  borderBottom: '2px solid #e2e8f0',
                }}>
                Completion
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  borderBottom: '2px solid #e2e8f0',
                }}>
                Time Spent
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  borderBottom: '2px solid #e2e8f0',
                }}>
                Difficulty
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  borderBottom: '2px solid #e2e8f0',
                }}>
                Engagement
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  borderBottom: '2px solid #e2e8f0',
                }}>
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((page, idx) => (
              <tr
                key={page.path}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={() => setHoveredRow(page.path)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => router.push(page.path)}>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#0969da',
                    fontWeight: hoveredRow === page.path ? 'bold' : 'normal',
                  }}>
                  {page.path}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    textAlign: 'right',
                    fontWeight:
                      selectedSortMethod === 'views' ? 'bold' : 'normal',
                  }}>
                  {page.views.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    textAlign: 'right',
                    fontWeight:
                      selectedSortMethod === 'completion' ? 'bold' : 'normal',
                  }}>
                  {(page.completionRate * 100).toFixed(1)}%
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    textAlign: 'right',
                    fontWeight:
                      selectedSortMethod === 'timeSpent' ? 'bold' : 'normal',
                  }}>
                  {page.avgTimeSpent}s
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    textAlign: 'center',
                  }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getDifficultyColor(page.difficulty),
                      marginRight: '6px',
                    }}></span>
                  {page.difficulty}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    textAlign: 'right',
                    color: getEfficiencyClass(
                      page.completionRate,
                      page.avgTimeSpent
                    ),
                    fontWeight:
                      selectedSortMethod === 'engagement' ? 'bold' : 'normal',
                  }}>
                  {page.engagementScore.toFixed(3)}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    textAlign: 'right',
                    fontWeight:
                      selectedSortMethod === 'lastUpdated' ? 'bold' : 'normal',
                  }}>
                  {page.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

<div style={{textAlign: 'center', marginTop: '20px'}}>
        <img
          src="/images/meta-gradient.png"
          width="800"
          height="3"
          style={{height: '3px', width: '50%'}}
        />
      </div>
    </div>
  );
};

export default DocumentationStatistics;
