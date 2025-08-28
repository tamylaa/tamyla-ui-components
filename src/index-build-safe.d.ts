export * from '../core/design-tokens.js';
export * from '../core/shared-utilities.js';
export { ButtonFactory } from '../atoms/button/button-system.js';
export { InputFactory } from '../atoms/input/input-system.js';
export { CardFactory } from '../atoms/card/card-system.js';
export { StatusIndicatorFactory } from '../atoms/status-indicator/status-indicator-system.js';
export { ActionCardFactory } from '../molecules/action-card/action-card-system.js';
export { default as TamylaUISystem } from '../tamyla-ui-system.js';
export const VERSION: '2.0.0';
export const BUILD_DATE: string;
export const FEATURES: string[];
export namespace COMPONENT_REGISTRY {
    namespace atoms {
        function Button(): Promise<typeof import('../atoms/button/button-system.js')>;
        function Input(): Promise<typeof import('../atoms/input/input-system.js')>;
        function Card(): Promise<typeof import('../atoms/card/card-system.js')>;
        function StatusIndicator(): Promise<typeof import('../atoms/status-indicator/status-indicator-system.js')>;
    }
    namespace molecules {
        function ActionCard(): Promise<typeof import('../molecules/action-card/action-card-system.js')>;
    }
}
declare namespace _default {
    export let ButtonFactory: any;
    export let InputFactory: any;
    export let CardFactory: any;
    export let StatusIndicatorFactory: any;
    export let ActionCardFactory: any;
    export let TamylaUISystem: any;
    export { VERSION };
    export { BUILD_DATE };
    export { FEATURES };
    export { COMPONENT_REGISTRY };
}
export default _default;
//# sourceMappingURL=index-build-safe.d.ts.map
