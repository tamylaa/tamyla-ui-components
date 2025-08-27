/**
 * Action Card Factory - Creates gamified action cards with Trading Portal sophistication
 */
export class ActionCardFactory {
    defaultProps: {
        title: string;
        description: string;
        icon: string;
        reward: string;
        progress: null;
        status: string;
        color: string;
        size: string;
        interactive: boolean;
        showProgress: boolean;
        showReward: boolean;
        analytics: boolean;
    };
    config: {
        statuses: string[];
        colors: string[];
        sizes: string[];
        animations: {
            ripple: number;
            completion: number;
            hover: number;
            focus: number;
        };
        accessibility: {
            tabIndex: {
                enabled: string;
                disabled: string;
            };
            /**
             * Mark card as completed
             */
            roles: {
                interactive: string;
                static: string;
            };
        };
        classNames: {
            base: string;
            status: string;
            color: string;
            size: string;
            interactive: string;
            withProgress: string;
            hovering: string;
            focused: string;
            completing: string;
        };
    };
    validation: {
        validateStatus(status: any): boolean;
        validateColor(color: any): boolean;
        validateSize(size: any): boolean;
        validateProgress(progress: any): boolean;
        validateProps(props: any): string[];
    };
    /**
     * Ensure CSS is loaded
     */
    ensureCSS(): void;
    /**
     * Create enhanced action card with Trading Portal patterns
     */
    create(props?: {}): HTMLDivElement;
    /**
     * Update card progress
     */
    updateProgress(card: any, progress: any): void;
    /**
     * Mark card as completed
     */
    markAsCompleted(card: any): void;
    /**
     * Destroy card and cleanup resources
     */
    destroy(card: any): void;
    /**
     * Shorthand creation methods
     */
    createAvailable(props: any): HTMLDivElement;
    createCompleted(props: any): HTMLDivElement;
    createLocked(props: any): HTMLDivElement;
    createWithProgress(props: any): HTMLDivElement;
}
export const actionCardFactory: ActionCardFactory;
//# sourceMappingURL=action-card-system.d.ts.map