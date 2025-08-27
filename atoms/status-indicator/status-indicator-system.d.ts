/**
 * Status Indicator Factory - Creates professional status indicators
 */
export class StatusIndicatorFactory {
    defaultProps: {
        status: string;
        text: string;
        size: string;
        animated: boolean;
        showDot: boolean;
        showText: boolean;
        uppercase: boolean;
        interactive: boolean;
        analytics: boolean;
    };
    statusTypes: string[];
    sizes: string[];
    /**
     * Ensure CSS is loaded
     */
    ensureCSS(): void;
    /**
     * Create enhanced status indicator
     */
    create(props?: {}): HTMLSpanElement;
    /**
     * Build CSS classes for the status indicator
     */
    buildStatusClasses(props: any): string;
    /**
     * Setup accessibility features
     */
    setupAccessibility(element: any, props: any): void;
    /**
     * Get default text for status type
     */
    getDefaultStatusText(status: any): any;
    /**
     * Create status HTML template
     */
    createStatusTemplate(props: any): string;
    /**
     * Attach interactions for interactive status indicators
     */
    attachInteractions(element: any, props: any): void;
    /**
     * Track status clicks for analytics
     */
    trackStatusClick(props: any): void;
    /**
     * Update status dynamically
     */
    updateStatus(element: any, newStatus: any, newText?: null): void;
    /**
     * Create status with pulse animation for real-time updates
     */
    createRealTime(props?: {}): HTMLSpanElement;
    /**
     * Shorthand creation methods for common statuses
     */
    createPending(props?: {}): HTMLSpanElement;
    createSuccess(props?: {}): HTMLSpanElement;
    createError(props?: {}): HTMLSpanElement;
    createWarning(props?: {}): HTMLSpanElement;
    createConnected(props?: {}): HTMLSpanElement;
    createDisconnected(props?: {}): HTMLSpanElement;
    /**
     * Create status badge for Trading Portal style
     */
    createBadge(props?: {}): HTMLSpanElement;
}
export const statusIndicatorFactory: StatusIndicatorFactory;
//# sourceMappingURL=status-indicator-system.d.ts.map