/**
 * Content Filter Service
 * Advanced content filtering engine with React-inspired patterns
 */

export class ContentFilterEngine {
  constructor() {
    this.filters = {
      contentType: 'all',
      performance: 'all',
      recency: 'all',
      topics: [],
      tags: []
    };
  }

  /**
   * Apply multi-dimensional filtering
   * Inspired by React filtering patterns in legacy components
   */
  applyFilters(content, filters = this.filters) {
    let filtered = [...content];

    // Content type filter
    if (filters.contentType !== 'all') {
      filtered = filtered.filter(item => item.category === filters.contentType);
    }

    // Performance filter
    if (filters.performance !== 'all') {
      filtered = filtered.filter(item => {
        const performance = this.getPerformanceLevel(item.engagement_score || 0);
        return performance.level === filters.performance;
      });
    }

    // Recency filter
    if (filters.recency !== 'all') {
      const cutoffDays = this.getRecencyCutoff(filters.recency);
      const cutoffDate = new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at || item.uploadedAt);
        return itemDate >= cutoffDate;
      });
    }

    return filtered;
  }

  getRecencyCutoff(recency) {
    const recencyMap = {
      'week': 7,
      'month': 30,
      'quarter': 90,
      'year': 365
    };
    return recencyMap[recency] || 365;
  }

  updateFilter(filterName, value) {
    this.filters[filterName] = value;
    return { ...this.filters };
  }

  getFilterOptions() {
    return {
      contentType: [
        { value: 'all', label: 'All Types' },
        { value: 'image', label: 'Images' },
        { value: 'video', label: 'Videos' },
        { value: 'document', label: 'Documents' },
        { value: 'audio', label: 'Audio' }
      ],
      performance: [
        { value: 'all', label: 'All Performance' },
        { value: 'high', label: 'High Performing' },
        { value: 'medium', label: 'Good Performance' },
        { value: 'low', label: 'Needs Boost' }
      ],
      recency: [
        { value: 'all', label: 'All Time' },
        { value: 'week', label: 'Past Week' },
        { value: 'month', label: 'Past Month' },
        { value: 'quarter', label: 'Past Quarter' }
      ]
    };
  }

  // Helper method to access analytics functionality
  getPerformanceLevel(score) {
    // This would typically be injected or imported from analytics service
    if (score >= 0.8) return { level: 'high', label: 'High' };
    if (score >= 0.6) return { level: 'medium', label: 'Good' };
    return { level: 'low', label: 'Low' };
  }
}
