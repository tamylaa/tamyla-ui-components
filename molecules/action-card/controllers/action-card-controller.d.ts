/**
 * Action Card Controller
 * Handles interactions, state management, and business logic
 */
/**
 * Action Card Controller Class
 */
export class ActionCardController {
    constructor(element: any, props: any);
    element: any;
    props: any;
    isDestroyed: boolean;
    /**
     * Initialize controller
     */
    init(): void;
    /**
     * Setup accessibility features
     */
    setupAccessibility(): void;
    /**
     * Attach event listeners
     */
    attachEventListeners(): void;
    /**
     * Setup hover effects
     */
    setupHoverEffects(): void;
    /**
     * Setup click handling
     */
    setupClickHandling(): void;
    /**
     * Setup keyboard interaction
     */
    setupKeyboardInteraction(): void;
    /**
     * Setup focus management
     */
    setupFocusManagement(): void;
    /**
     * Handle mouse enter
     */
    handleMouseEnter(): void;
    /**
     * Handle mouse leave
     */
    handleMouseLeave(): void;
    /**
     * Handle click events
     */
    handleClick(event: any): void;
    /**
     * Handle keyboard events
     */
    handleKeydown(event: any): void;
    /**
     * Handle focus events
     */
    handleFocus(): void;
    /**
     * Handle blur events
     */
    handleBlur(): void;
    /**
     * Create ripple effect on interaction
     */
    createRippleEffect(event: any): void;
    /**
     * Track analytics
     */
    trackAnalytics(): void;
    /**
     * Trigger callback functions
     */
    triggerCallbacks(event: any): void;
    /**
     * Dispatch custom event
     */
    dispatchCustomEvent(event: any): void;
    /**
     * Update progress
     */
    updateProgress(progress: any): void;
    /**
     * Mark card as completed
     */
    markAsCompleted(): void;
    /**
     * Destroy controller and cleanup
     */
    destroy(): void;
}
export namespace actionCardUtils {
    /**
     * Build CSS classes for the card
     */
    function buildCardClasses(props: any): string;
    /**
     * Validate props
     */
    function validateProps(props: any): string[];
}
//# sourceMappingURL=action-card-controller.d.ts.map