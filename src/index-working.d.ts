export namespace Button {
    import create = TamylaUI.createButton;
    export { create };
}
export namespace Input {
    import create_1 = TamylaUI.createInput;
    export { create_1 as create };
}
export namespace Card {
    import create_2 = TamylaUI.createCard;
    export { create_2 as create };
}
export const System: {
    Atom: (type: any, props: any, id: any) => any;
    Button: (props: any, id: any) => any;
    Input: (props: any, id: any) => any;
    Card: (props: any, id: any) => any;
    Molecule: (type: any, props: any, id: any) => any;
    SearchBar: (props: any, id: any) => any;
    ContentCard: (props: any, id: any) => any;
    ContentGrid: (props: any, id: any) => any;
    Organism: (type: any, props: any, id: any) => any;
    SearchInterface: (props: any, id: any) => any;
    Application: (type: any, props: any, id: any) => any;
    EnhancedSearch: (props: any, id: any) => any;
    ContentManager: (props: any, id: any) => any;
};
export default TamylaUI;
declare namespace TamylaUI {
    export { TamylaUISystem as System };
    export function createButton(options: any): HTMLButtonElement;
    export function createInput(options: any): HTMLInputElement;
    export function createCard(options: any): HTMLDivElement;
    export let version: string;
    export let name: string;
}
import TamylaUISystem from '../tamyla-ui-system.js';
//# sourceMappingURL=index-working.d.ts.map