/**
 * Advanced Modal Factory
 * Creates modal components with backdrop handling and size variants
 */
export class ModalAdapter {
    buttonFactory: ButtonFactory;
    create(props?: {}): {
        element: HTMLDivElement;
        open: () => void;
        close: () => void;
        toggle: () => void;
        setContent: (newContent: any) => void;
        setTitle: (newTitle: any) => void;
        isOpen: () => any;
        destroy: () => void;
    };
    /**
     * Create specific modal types
     */
    createConfirmModal(props?: {}): {
        element: HTMLDivElement;
        open: () => void;
        close: () => void;
        toggle: () => void;
        setContent: (newContent: any) => void;
        setTitle: (newTitle: any) => void;
        isOpen: () => any;
        destroy: () => void;
    };
    createAlertModal(props?: {}): {
        element: HTMLDivElement;
        open: () => void;
        close: () => void;
        toggle: () => void;
        setContent: (newContent: any) => void;
        setTitle: (newTitle: any) => void;
        isOpen: () => any;
        destroy: () => void;
    };
}
export const modalAdapter: ModalAdapter;
import { ButtonFactory } from '../../atoms/button/button-system.js';
//# sourceMappingURL=modal-adapter.d.ts.map