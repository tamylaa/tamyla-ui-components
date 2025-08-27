/**
 * Advanced File List Factory
 * Creates file list components with selection state management and filtering
 */
export class FileListAdapter {
    cardFactory: CardFactory;
    create(props?: {}): {
        element: HTMLDivElement;
        getSelected: () => any[];
        setSelected: (newSelected: any) => void;
        getFiles: () => any[];
        setFiles: (newFiles: any) => void;
        addFile: (file: any) => void;
        removeFile: (fileId: any) => void;
        clearSelection: () => void;
        destroy: () => void;
    };
}
export const fileListAdapter: FileListAdapter;
import { CardFactory } from '../../atoms/card/card-system.js';
//# sourceMappingURL=file-list-adapter.d.ts.map