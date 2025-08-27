/**
 * Email Recipients Factory
 * Creates email recipient input components with chip-based multi-value pattern
 */
export class EmailRecipientsAdapter {
    inputFactory: InputFactory;
    buttonFactory: ButtonFactory;
    create(props?: {}): {
        element: HTMLDivElement;
        getValue: () => any[];
        setValue: (newValue: any) => void;
        addEmail: (email: any) => boolean;
        removeEmail: (email: any) => void;
        clear: () => void;
        destroy: () => void;
    };
}
export const emailRecipientsAdapter: EmailRecipientsAdapter;
import { InputFactory } from '../../atoms/input/input-system.js';
import { ButtonFactory } from '../../atoms/button/button-system.js';
//# sourceMappingURL=email-recipients-adapter.d.ts.map