export default RewardSystem;
declare class RewardSystem {
    constructor(options?: {});
    options: {
        preset: string;
        autoInitialize: boolean;
        enableAchievements: boolean;
        enableProgress: boolean;
        enableNotifications: boolean;
        enableXP: boolean;
        enableLeveling: boolean;
    };
    initialized: boolean;
    userData: {
        xp: number;
        level: number;
        achievements: Map<any, any>;
        statistics: {
            totalXP: number;
            achievementsEarned: number;
            currentStreak: number;
            maxStreak: number;
            joinedAt: number;
        };
    };
    controllers: {};
    /**
     * Initialize the reward system
     */
    initialize(): Promise<void>;
    /**
     * Load CSS styles
     */
    loadStyles(): Promise<any>;
    /**
     * Apply gamification preset
     */
    applyPreset(presetName: any): void;
    xpMultiplier: any;
    /**
     * Bind achievement controller events
     */
    bindAchievementEvents(): void;
    /**
     * Handle achievement earned
     */
    handleAchievementEarned(data: any): void;
    /**
     * Handle progress updated
     */
    handleProgressUpdated(data: any): void;
    /**
     * Award XP points
     */
    awardXP(points: any, source?: string): number | undefined;
    /**
     * Check and handle level up
     */
    checkLevelUp(): {
        level: number;
        currentXP: number;
        requiredXP: number;
        totalXP: any;
    } | null;
    /**
     * Create achievement badge
     */
    createAchievementBadge(containerId: any, achievementId: any): Promise<Element | null>;
    /**
     * Render achievement badge
     */
    renderAchievementBadge(containerId: any, achievement: any, progress: any): Promise<Element | null>;
    /**
     * Create progress indicator
     */
    createProgress(containerId: any, config: any): any;
    /**
     * Update progress
     */
    updateProgress(progressId: any, current: any, total?: null): any;
    /**
     * Show notification
     */
    showNotification(config: any): any;
    /**
     * Track user action for achievements
     */
    trackAction(action: any, metadata?: {}): void;
    /**
     * Update achievements by metric
     */
    updateAchievementsByMetric(metric: any, increment: any, metadata: any): void;
    /**
     * Get requirements text for achievement
     */
    getRequirementsText(achievement: any): string;
    /**
     * Get max progress for achievement
     */
    getMaxProgress(achievement: any): any;
    /**
     * Update progress ring SVG
     */
    updateProgressRing(progressRing: any, current: any, total: any): void;
    /**
     * Load HTML template
     */
    loadTemplate(templateName: any): Promise<any>;
    /**
     * Get fallback templates
     */
    getFallbackTemplate(templateName: any): any;
    /**
     * Load user data
     */
    loadUserData(): void;
    /**
     * Save user data
     */
    saveUserData(): void;
    /**
     * Get user statistics
     */
    getUserStats(): {
        level: number;
        xp: number;
        levelProgress: {
            level: number;
            currentXP: number;
            requiredXP: number;
            totalXP: any;
        };
        achievements: any;
        totalXP: number;
        achievementsEarned: number;
        currentStreak: number;
        maxStreak: number;
        joinedAt: number;
    };
    /**
     * Reset all data
     */
    reset(): void;
    /**
     * Event system
     */
    on(event: any, callback: any): void;
    listeners: Map<any, any> | undefined;
    off(event: any, callback: any): void;
    emit(event: any, data: any): void;
    /**
     * Destroy the reward system
     */
    destroy(): void;
}
//# sourceMappingURL=reward-system.d.ts.map