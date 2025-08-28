export function TamylaButton({ children, onClick, variant, size, disabled, ...props }: {
    [x: string]: any;
    children: any;
    onClick: any;
    variant?: string | undefined;
    size?: string | undefined;
    disabled?: boolean | undefined;
}): import('react').JSX.Element;
export function TamylaCampaignSelector({ onSelectionChanged, maxSelections, enableRecommendations, ...props }: {
    [x: string]: any;
    onSelectionChanged: any;
    maxSelections?: number | undefined;
    enableRecommendations?: boolean | undefined;
}): import('react').JSX.Element;
export const Button: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export const Input: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export const Card: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export const ContentCard: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export const SearchBar: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export const EnhancedSearch: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export const CampaignSelector: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
export const ContentManager: import('react').ForwardRefExoticComponent<import('react').RefAttributes<any>>;
declare namespace _default {
    export { Button };
    export { Input };
    export { Card };
    export { ContentCard };
    export { SearchBar };
    export { EnhancedSearch };
    export { CampaignSelector };
    export { ContentManager };
    export { TamylaButton };
    export { TamylaCampaignSelector };
    export { createReactWrapper };
    export let useTamylaComponent: any;
    export let TamylaUIProvider: any;
    export let useTamylaUI: any;
}
export default _default;
import { createReactWrapper } from './wrapper.js';
export { createReactWrapper, useTamylaComponent, TamylaUIProvider, useTamylaUI } from './wrapper.js';
//# sourceMappingURL=index.d.ts.map
