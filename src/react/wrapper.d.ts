/**
 * Higher-order component that wraps vanilla JS components for React
 */
export function createReactWrapper(componentLoader: any, defaultOptions?: {}): React.ForwardRefExoticComponent<React.RefAttributes<any>>;
/**
 * React hooks for component management
 */
export function useTamylaComponent(componentLoader: any, options?: {}): {
    component: null;
    loading: boolean;
    error: null;
    containerRef: React.MutableRefObject<null>;
    reload: () => Promise<void>;
};
/**
 * Provider component for Tamyla UI
 */
export function TamylaUIProvider({ children, theme, config }: {
    children: any;
    theme?: {} | undefined;
    config?: {} | undefined;
}): React.JSX.Element;
/**
 * Hook to use Tamyla UI context
 */
export function useTamylaUI(): {
    theme: {};
    config: {};
    components: {};
};
/**
 * Context for global Tamyla UI configuration
 */
export const TamylaUIContext: React.Context<{
    theme: {};
    config: {};
    components: {};
}>;
import React from 'react';
//# sourceMappingURL=wrapper.d.ts.map