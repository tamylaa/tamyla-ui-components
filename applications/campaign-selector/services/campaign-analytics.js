/**
 * Campaign Analytics Service
 * Extracted business logic for campaign performance analysis
 */

export class CampaignAnalytics {
  constructor() {
    this.performanceThresholds = {
      high: 0.8,
      medium: 0.6,
      low: 0.0
    };
  }

  /**
   * Calculate performance level based on engagement score
   * Legacy algorithm preserved for consistency
   */
  getPerformanceLevel(score) {
    if (score >= this.performanceThresholds.high) {
      return { level: 'high', label: 'High', color: '#10B981' };
    }
    if (score >= this.performanceThresholds.medium) {
      return { level: 'medium', label: 'Good', color: '#F59E0B' };
    }
    return { level: 'low', label: 'Low', color: '#EF4444' };
  }

  /**
   * Smart content recommendation algorithm
   * Combines performance metrics with campaign context
   */
  async generateRecommendations(campaignType, apiBase) {
    try {
      const response = await fetch(`${apiBase}/recommendations?type=${campaignType}&algorithm=v2`);
      const data = await response.json();

      return this.enhanceRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Recommendation engine failed:', error);
      return [];
    }
  }

  /**
   * Enhance recommendations with performance insights
   */
  enhanceRecommendations(recommendations) {
    return recommendations.map(rec => ({
      ...rec,
      performance: this.getPerformanceLevel(rec.engagement_score || 0),
      confidenceScore: Math.min(rec.confidence * 100, 100),
      reasonSummary: this.generateReasonSummary(rec)
    }));
  }

  generateReasonSummary(recommendation) {
    const reasons = [];
    if (recommendation.engagement_score > 0.7) reasons.push('High engagement');
    if (recommendation.recent_performance) reasons.push('Trending content');
    if (recommendation.topic_match > 0.8) reasons.push('Perfect topic match');

    return reasons.join(' • ') || 'AI recommendation';
  }

  calculateAveragePerformance(items) {
    if (items.length === 0) return null;

    const totalScore = items.reduce((sum, item) =>
      sum + (item.engagement_score || 0), 0);

    const avgScore = totalScore / items.length;
    return this.getPerformanceLevel(avgScore);
  }

  estimateReach(items) {
    // Simplified reach estimation algorithm
    const baseReach = items.reduce((sum, item) =>
      sum + (item.historical_reach || 1000), 0);

    return Math.floor(baseReach * 0.8); // Conservative estimate
  }
}
