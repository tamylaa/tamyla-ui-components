export default ProgressController;
declare class ProgressController {
    constructor(options?: {});
    progressBars: Map<any, any>;
    animationQueue: any[];
    isAnimating: boolean;
    options: {
        enableAnimations: boolean;
        batchUpdates: boolean;
        validateData: boolean;
    };
    /**
     * Create a new progress indicator
     */
    createProgress(containerId: any, config: any): any;
    /**
     * Update progress value
     */
    updateProgress(progressId: any, current: any, total?: null, options?: {}): boolean;
    /**
     * Animate progress change
     */
    animateProgress(progressId: any, fromValue: any, toValue: any, duration?: number): void;
    /**
     * Process animation queue
     */
    processAnimationQueue(): void;
    /**
     * Render complete progress indicator
     */
    renderProgress(progressId: any): void;
    /**
     * Render linear progress bar
     */
    renderLinearProgress(container: any, progress: any): void;
    /**
     * Render circular progress indicator
     */
    renderCircularProgress(container: any, progress: any): void;
    /**
     * Render steps progress indicator
     */
    renderStepsProgress(container: any, progress: any): void;
    /**
     * Update only the progress display (for animations)
     */
    updateProgressDisplay(progressId: any, currentValue: any): void;
    /**
     * Update steps display
     */
    updateStepsDisplay(container: any, currentValue: any, total: any, steps: any): void;
    /**
     * Format progress value
     */
    formatValue(progress: any): any;
    /**
     * Generate default steps for steps progress
     */
    generateDefaultSteps(total: any): {
        label: string;
        icon: number;
    }[];
    /**
     * Get circular progress size
     */
    getCircularSize(size: any): any;
    /**
     * Validate progress configuration
     */
    validateProgressConfig(config: any): boolean;
    /**
     * Remove progress indicator
     */
    removeProgress(progressId: any): void;
    /**
     * Get progress data
     */
    getProgress(progressId: any): any;
    /**
     * Get all progress indicators
     */
    getAllProgress(): any[];
    /**
     * Set progress color
     */
    setColor(progressId: any, color: any): void;
    /**
     * Set progress size
     */
    setSize(progressId: any, size: any): void;
    /**
     * Reset progress to zero
     */
    reset(progressId: any): void;
    /**
     * Complete progress (set to 100%)
     */
    complete(progressId: any): void;
}
//# sourceMappingURL=progress-controller.d.ts.map