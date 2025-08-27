export function loadApplication(appName: any): Promise<any>;
export function getApplicationInfo(appName: any): any;
export function getApplicationDependencies(appName: any): any;
export function loadApplications(appNames: any): Promise<{}>;
export function createApplication(appName: any, container: any, options?: {}): Promise<any>;
export { EnhancedSearchApplicationFactory } from "./enhanced-search/enhanced-search-system.js";
export { CampaignSelectorSystem } from "./campaign-selector/campaign-selector-system.js";
export { ContentManagerApplicationFactory } from "./content-manager/content-manager-system.js";
export const AVAILABLE_APPLICATIONS: string[];
export const APPLICATION_CONFIGS: {
    'enhanced-search': {
        name: string;
        description: string;
        version: string;
        dependencies: string[];
    };
    'campaign-selector': {
        name: string;
        description: string;
        version: string;
        dependencies: string[];
    };
    'content-manager': {
        name: string;
        description: string;
        version: string;
        dependencies: string[];
    };
};
declare namespace _default {
    export function EnhancedSearch(): Promise<typeof import("./enhanced-search/enhanced-search-system.js")>;
    export function CampaignSelector(): Promise<typeof import("./campaign-selector/campaign-selector-system.js")>;
    export function ContentManager(): Promise<typeof import("./content-manager/content-manager-system.js")>;
    export { loadApplication };
    export { loadApplications };
    export { createApplication };
    export { getApplicationInfo };
    export { getApplicationDependencies };
    export { AVAILABLE_APPLICATIONS };
    export { APPLICATION_CONFIGS };
}
export default _default;
//# sourceMappingURL=index.d.ts.map