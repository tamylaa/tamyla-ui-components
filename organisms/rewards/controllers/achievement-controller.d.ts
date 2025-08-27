export default AchievementController;
declare class AchievementController {
    constructor(options?: {});
    achievements: Map<any, any>;
    userProgress: Map<any, any>;
    listeners: Map<any, any>;
    options: {
        autoSave: boolean;
        validateData: boolean;
        trackProgress: boolean;
    };
    /**
     * Initialize achievements from configuration
     */
    initializeAchievements(): void;
    /**
     * Register a new achievement
     */
    registerAchievement(achievement: any): any;
    /**
     * Update progress for an achievement
     */
    updateProgress(achievementId: any, progress: any, metadata?: {}): boolean;
    /**
     * Calculate progress based on achievement requirements
     */
    calculateProgress(achievement: any, value: any, metadata: any): any;
    /**
     * Check if achievement requirements are met
     */
    isAchievementEarned(achievement: any, progress: any, metadata: any): any;
    /**
     * Evaluate a single condition
     */
    evaluateCondition(condition: any, metadata: any): any;
    /**
     * Evaluate named conditions
     */
    evaluateNamedCondition(conditionName: any, metadata: any): any;
    /**
     * Evaluate complex requirements
     */
    evaluateComplexRequirements(conditions: any, metadata: any): any;
    /**
     * Mark achievement as earned
     */
    earnAchievement(achievementId: any): boolean;
    /**
     * Get maximum progress value for achievement
     */
    getMaxProgress(achievement: any): any;
    /**
     * Get achievement progress percentage
     */
    getProgressPercentage(achievementId: any): number;
    /**
     * Get all achievements for a category
     */
    getAchievementsByCategory(category: any): any[];
    /**
     * Get all achievements by rarity
     */
    getAchievementsByRarity(rarity: any): any[];
    /**
     * Get user's earned achievements
     */
    getEarnedAchievements(): any[];
    /**
     * Get user's progress on all achievements
     */
    getAllProgress(): any[];
    /**
     * Award XP points to user
     */
    awardXP(points: any, source?: string): void;
    /**
     * Validate achievement data
     */
    validateAchievement(achievement: any): boolean;
    /**
     * Load user data from storage
     */
    loadUserData(): void;
    /**
     * Save user data to storage
     */
    saveUserData(): void;
    /**
     * Event system
     */
    on(event: any, callback: any): void;
    off(event: any, callback: any): void;
    emit(event: any, data: any): void;
    /**
     * Reset all achievement progress
     */
    reset(): void;
    /**
     * Get achievement statistics
     */
    getStatistics(): {
        total: number;
        earned: number;
        completion: number;
        byCategory: {};
        byRarity: {};
        totalPoints: any;
    };
    /**
     * Get statistics by category
     */
    getStatsByCategory(): {};
    /**
     * Get statistics by rarity
     */
    getStatsByRarity(): {};
}
//# sourceMappingURL=achievement-controller.d.ts.map