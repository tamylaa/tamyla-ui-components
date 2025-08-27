export default NotificationController;
declare class NotificationController {
    constructor(options?: {});
    notifications: Map<any, any>;
    queue: any[];
    visibleCount: number;
    nextId: number;
    options: {
        maxVisible: number;
        queueSize: number;
        defaultPosition: string;
        defaultDuration: number;
        enableSound: boolean;
        enableAnimations: boolean;
        validateData: boolean;
    };
    /**
     * Initialize notification containers for each position
     */
    initializeContainer(): void;
    containers: {} | undefined;
    /**
     * Position notification container
     */
    positionContainer(container: any, position: any): void;
    /**
     * Show a notification
     */
    show(notificationData: any): number;
    /**
     * Add notification to queue
     */
    addToQueue(notification: any): void;
    /**
     * Display notification immediately
     */
    displayNotification(notification: any): void;
    /**
     * Create notification DOM element
     */
    createNotificationElement(notification: any): HTMLDivElement;
    /**
     * Format notification value
     */
    formatValue(notification: any): string;
    /**
     * Animate notification in
     */
    animateIn(element: any): void;
    /**
     * Animate notification out
     */
    animateOut(element: any, callback: any): void;
    /**
     * Hide notification
     */
    hide(notificationId: any): void;
    /**
     * Process notification queue
     */
    processQueue(): void;
    /**
     * Play notification sound
     */
    playNotificationSound(type: any): void;
    /**
     * Show XP notification
     */
    showXP(amount: any, source?: string): number;
    /**
     * Show achievement notification
     */
    showAchievement(achievement: any): number;
    /**
     * Show level up notification
     */
    showLevelUp(level: any, xp?: null): number;
    /**
     * Show badge notification
     */
    showBadge(badge: any): number;
    /**
     * Show custom notification
     */
    showCustom(config: any): number;
    /**
     * Clear all notifications
     */
    clearAll(): void;
    /**
     * Clear notifications by type
     */
    clearByType(type: any): void;
    /**
     * Validate notification data
     */
    validateNotification(notification: any): boolean;
    /**
     * Bind global events
     */
    bindEvents(): void;
    /**
     * Reposition containers on window resize
     */
    repositionContainers(): void;
    /**
     * Get notification statistics
     */
    getStatistics(): {
        visible: number;
        queued: number;
        total: number;
        byType: {};
    };
    /**
     * Get statistics by type
     */
    getStatsByType(): {};
    /**
     * Update notification options
     */
    updateOptions(newOptions: any): void;
    /**
     * Destroy notification system
     */
    destroy(): void;
}
//# sourceMappingURL=notification-controller.d.ts.map