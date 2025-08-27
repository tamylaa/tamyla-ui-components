/**
 * Campaign Analytics Service
 * Extracted business logic for campaign performance analysis
 */
export class CampaignAnalytics {
    performanceThresholds: {
        high: number;
        medium: number;
        low: number;
    };
    /**
     * Calculate performance level based on engagement score
     * Legacy algorithm preserved for consistency
     */
    getPerformanceLevel(score: any): {
        level: string;
        label: string;
        color: string;
    };
    /**
     * Smart content recommendation algorithm
     * Combines performance metrics with campaign context
     */
    generateRecommendations(campaignType: any, apiBase: any): Promise<any>;
    /**
     * Enhance recommendations with performance insights
     */
    enhanceRecommendations(recommendations: any): any;
    generateReasonSummary(recommendation: any): string;
    calculateAveragePerformance(items: any): {
        level: string;
        label: string;
        color: string;
    } | null;
    estimateReach(items: any): number;
}
//# sourceMappingURL=campaign-analytics.d.ts.map