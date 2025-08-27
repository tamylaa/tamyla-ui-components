/**
 * Get icon by name with fallback
 */
export function getCardIcon(iconName: any, fallback?: string): any;
/**
 * Get icon HTML with styling
 */
export function createCardIconHTML(iconName: any, className?: string): string;
export namespace cardIcons {
    let chevronRight: string;
    let chevronDown: string;
    let externalLink: string;
    let heart: string;
    let heartOutline: string;
    let share: string;
    let bookmark: string;
    let bookmarkOutline: string;
    let download: string;
    let clock: string;
    let calendar: string;
    let user: string;
    let users: string;
    let location: string;
    let eye: string;
    let star: string;
    let starOutline: string;
    let checkCircle: string;
    let xCircle: string;
    let exclamationCircle: string;
    let infoCircle: string;
    let photograph: string;
    let film: string;
    let musicNote: string;
    let document: string;
    let plus: string;
    let minus: string;
    let x: string;
    let dotsVertical: string;
    let dotsHorizontal: string;
    let chat: string;
    let mail: string;
    let tag: string;
    let collection: string;
}
export namespace cardIconUtils {
    /**
     * Create an icon element with proper styling
     */
    function create(iconName: any, options?: {}): HTMLSpanElement | null;
    /**
     * Get available icon names
     */
    function getAvailable(): string[];
    /**
     * Get icon SVG string
     */
    function getSVG(iconName: any): any;
    /**
     * Create star rating display
     */
    function createStarRating(rating: any, maxStars?: number, options?: {}): HTMLDivElement;
    /**
     * Create status badge with icon
     */
    function createStatusBadge(status: any, options?: {}): HTMLSpanElement | null;
}
export namespace cardIconCollections {
    let actions: string[];
    let meta: string[];
    let status: string[];
    let media: string[];
    let navigation: string[];
    let communication: string[];
    let organization: string[];
}
export default cardIcons;
//# sourceMappingURL=card-icons.d.ts.map