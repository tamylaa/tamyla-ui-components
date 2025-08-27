/**
 * Notification Molecule Controller
 * Complete notification behavior management with timing and stacking
 */
export class NotificationController {
    constructor(props?: {});
    props: {
        type: string;
        title: string;
        message: string;
        duration: number;
        position: string;
        showClose: boolean;
        showProgress: boolean;
        pauseOnHover: boolean;
        autoDismiss: boolean;
        actions: never[];
        onShow: null;
        onHide: null;
        onClick: null;
        onAction: null;
    };
    state: {
        isVisible: boolean;
        isExiting: boolean;
        isPaused: boolean;
        timeRemaining: number;
    };
    element: any;
    container: any;
    dismissTimer: NodeJS.Timeout | null;
    startTime: number | null;
    pausedTime: number | null;
    /**
     * Initialize notification controller
     */
    initialize(element: any): this;
    /**
     * Setup event listeners
     */
    setupEventListeners(): void;
    /**
     * Setup progress tracking for auto-dismiss
     */
    setupProgressTracking(): void;
    /**
     * Handle keyboard navigation
     */
    handleKeyDown(event: any): void;
    /**
     * Handle action button clicks
     */
    handleAction(action: any, event: any): void;
    /**
     * Show notification
     */
    show(): this;
    /**
     * Hide notification with animation
     */
    hide(): Promise<this>;
    /**
     * Pause auto-dismiss timer
     */
    pause(): this;
    /**
     * Resume auto-dismiss timer
     */
    resume(): this;
    /**
     * Start dismiss timer
     */
    startDismissTimer(duration?: number): void;
    /**
     * Clear dismiss timer
     */
    clearDismissTimer(): void;
    /**
     * Update notification content
     */
    updateContent(props?: {}): this;
    /**
     * Extend auto-dismiss duration
     */
    extend(additionalTime?: number): this;
    /**
     * Make notification persistent (disable auto-dismiss)
     */
    persist(): this;
    /**
     * State management
     */
    setState(newState: any): void;
    getState(): {
        isVisible: boolean;
        isExiting: boolean;
        isPaused: boolean;
        timeRemaining: number;
    };
    /**
     * Get remaining time before auto-dismiss
     */
    getTimeRemaining(): number;
    /**
     * Cleanup
     */
    destroy(): void;
}
//# sourceMappingURL=notification-controller.d.ts.map