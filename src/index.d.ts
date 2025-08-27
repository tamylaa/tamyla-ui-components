export function loadComponent(category: any, name: any): Promise<any>;
export function getAvailableComponents(): {};
export function initializeTamylaUI(config?: {}): {
    theme: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
    };
    breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    animation: {
        duration: string;
        easing: string;
    };
};
export * from "../core/design-tokens.js";
export * from "../core/shared-utilities.js";
export * from "../atoms/atom-factory.js";
export * from "../molecules/molecule-factory.js";
export * from "../organisms/organism-factory.js";
export { default as ReactPatternAdapters } from "../core/react-pattern-adapters.js";
export { ButtonFactory } from "../atoms/button/button-system.js";
export { InputFactory } from "../atoms/input/input-system.js";
export { CardFactory } from "../atoms/card/card-system.js";
export { InputGroupFactory } from "../atoms/input-group/input-group-system.js";
export { ContentCardFactory } from "../molecules/content-card/content-card-system.js";
export { FileListFactory } from "../molecules/file-list/file-list-system.js";
export { NotificationFactory } from "../molecules/notification/notification-system.js";
export { EnhancedSearchApplicationFactory } from "../applications/enhanced-search/enhanced-search-system.js";
export { CampaignSelectorSystem } from "../applications/campaign-selector/campaign-selector-system.js";
export { ContentManagerApplicationFactory } from "../applications/content-manager/content-manager-system.js";
export { SearchInterfaceFactory } from "../organisms/search-interface/search-interface-system.js";
export { default as RewardSystem } from "../organisms/rewards/reward-system.js";
export { default as TamylaUISystem } from "../tamyla-ui-system.js";
export const VERSION: "2.0.0";
export const BUILD_DATE: string;
export const FEATURES: string[];
export namespace COMPONENT_REGISTRY {
    namespace atoms {
        function Button(): Promise<typeof import("../atoms/button/button-system.js")>;
        function Input(): Promise<typeof import("../atoms/input/input-system.js")>;
        function Card(): Promise<typeof import("../atoms/card/card-system.js")>;
        function StatusIndicator(): Promise<typeof import("../atoms/status-indicator/status-indicator-system.js")>;
        function InputGroup(): Promise<typeof import("../atoms/input-group/input-group-system.js")>;
    }
    namespace molecules {
        function ActionCard(): Promise<typeof import("../molecules/action-card/action-card-system.js")>;
        function SearchBar(): Promise<typeof import("../molecules/search-bar/search-bar-system.js")>;
        function ContentCard(): Promise<typeof import("../molecules/content-card/content-card-system.js")>;
        function FileList(): Promise<typeof import("../molecules/file-list/file-list-system.js")>;
        function Notification(): Promise<typeof import("../molecules/notification/notification-system.js")>;
    }
    namespace organisms {
        function SearchInterface(): Promise<typeof import("../organisms/search-interface/search-interface-system.js")>;
    }
    namespace applications {
        function EnhancedSearch(): Promise<typeof import("../applications/enhanced-search/enhanced-search-system.js")>;
        function CampaignSelector(): Promise<typeof import("../applications/campaign-selector/campaign-selector-system.js")>;
        function ContentManager(): Promise<typeof import("../applications/content-manager/content-manager-system.js")>;
    }
}
export namespace TradingPortalIntegration {
    /**
     * Initialize enhanced components with Trading Portal patterns
     */
    function initialize(config?: {}): {
        enableMicroInteractions: boolean;
        enableAnalytics: boolean;
        enableHapticFeedback: boolean;
        theme: string;
        accessibility: {
            reducedMotion: boolean;
            highContrast: boolean;
            largeText: boolean;
        };
    };
    /**
     * Apply theme configuration to CSS custom properties
     */
    function applyThemeConfiguration(config: any): void;
    /**
     * Create enhanced component with Trading Portal patterns
     */
    function createEnhanced(componentType: any, factory: any, props?: {}): any;
}
export function createTradingPortalButton(props: any): any;
export function createTradingPortalActionCard(props: any): any;
export function createTradingPortalStatus(props: any): any;
export namespace TAMYLA_UI_CONFIG {
    namespace theme {
        let primary: string;
        let secondary: string;
        let success: string;
        let warning: string;
        let error: string;
    }
    namespace breakpoints {
        let sm: string;
        let md: string;
        let lg: string;
        let xl: string;
    }
    namespace animation {
        let duration: string;
        let easing: string;
    }
}
declare namespace _default {
    export function DesignTokens(): Promise<typeof import("../core/design-tokens.js")>;
    export function SharedUtilities(): Promise<typeof import("../core/shared-utilities.js")>;
    export function ReactPatternAdapters(): Promise<typeof import("../core/react-pattern-adapters.js")>;
    export function AtomFactory(): Promise<typeof import("../atoms/atom-factory.js")>;
    export function MoleculeFactory(): Promise<typeof import("../molecules/molecule-factory.js")>;
    export function OrganismFactory(): Promise<typeof import("../organisms/organism-factory.js")>;
    export function ButtonFactory(): Promise<typeof import("../atoms/button/button-system.js")>;
    export function ActionCardFactory(): Promise<typeof import("../molecules/action-card/action-card-system.js")>;
    export function StatusIndicatorFactory(): Promise<typeof import("../atoms/status-indicator/status-indicator-system.js")>;
    export function EnhancedSearch_1(): Promise<typeof import("../applications/enhanced-search/enhanced-search-system.js")>;
    export { EnhancedSearch_1 as EnhancedSearch };
    export function CampaignSelector_1(): Promise<typeof import("../applications/campaign-selector/campaign-selector-system.js")>;
    export { CampaignSelector_1 as CampaignSelector };
    export function ContentManager_1(): Promise<typeof import("../applications/content-manager/content-manager-system.js")>;
    export { ContentManager_1 as ContentManager };
    export { loadComponent };
    export { getAvailableComponents };
    export { initializeTamylaUI };
    export { TradingPortalIntegration };
    export { createTradingPortalButton };
    export { createTradingPortalActionCard };
    export { createTradingPortalStatus };
    export { VERSION };
    export { BUILD_DATE };
    export { FEATURES };
    export { COMPONENT_REGISTRY };
}
export default _default;
export { StatusIndicatorFactory, statusIndicatorFactory } from "../atoms/status-indicator/status-indicator-system.js";
export { ActionCardFactory, actionCardFactory } from "../molecules/action-card/action-card-system.js";
export { SearchBarFactory, searchBarFactory } from "../molecules/search-bar/search-bar-system.js";
//# sourceMappingURL=index.d.ts.map