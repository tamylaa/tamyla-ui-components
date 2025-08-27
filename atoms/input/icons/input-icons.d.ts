export namespace inputIcons {
    let search: string;
    let user: string;
    let email: string;
    let phone: string;
    let location: string;
    let lock: string;
    let lockOpen: string;
    let key: string;
    let creditCard: string;
    let currency: string;
    let calendar: string;
    let clock: string;
    let check: string;
    let x: string;
    let exclamation: string;
    let info: string;
    let upload: string;
    let download: string;
    let attachment: string;
    let chat: string;
    let chevronDown: string;
    let chevronUp: string;
    let eye: string;
    let eyeOff: string;
}
export namespace iconUtils {
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
}
export namespace iconCollections {
    let auth: string[];
    let contact: string[];
    let payment: string[];
    let temporal: string[];
    let file: string[];
    let status: string[];
    let visibility: string[];
}
export default inputIcons;
//# sourceMappingURL=input-icons.d.ts.map