/**
 * Notification Adapter
 * Adapted from legacy/TamylaNotification.js React patterns
 * Separated from monolithic react-pattern-adapters.js
 */
/**
 * Notification Factory
 * Creates notification components with auto-dismiss timing and type-based styling
 */
export class NotificationAdapter {
    notifications: Map<any, any>;
    container: HTMLElement | HTMLDivElement | null;
    createContainer(): void;
    create(props?: {}): {
        element: HTMLDivElement;
        close: () => void;
        extend: (additionalTime: any) => void;
        getId: () => any;
        getType: () => any;
    };
    info(message: any, options?: {}): {
        element: HTMLDivElement;
        close: () => void;
        extend: (additionalTime: any) => void;
        getId: () => any;
        getType: () => any;
    };
    success(message: any, options?: {}): {
        element: HTMLDivElement;
        close: () => void;
        extend: (additionalTime: any) => void;
        getId: () => any;
        getType: () => any;
    };
    warning(message: any, options?: {}): {
        element: HTMLDivElement;
        close: () => void;
        extend: (additionalTime: any) => void;
        getId: () => any;
        getType: () => any;
    };
    error(message: any, options?: {}): {
        element: HTMLDivElement;
        close: () => void;
        extend: (additionalTime: any) => void;
        getId: () => any;
        getType: () => any;
    };
    confirm(message: any, options?: {}): Promise<any>;
    prompt(message: any, defaultValue?: string, options?: {}): Promise<any>;
    clearAll(): void;
    clearByType(type: any): void;
    getCount(): number;
    getActiveNotifications(): {
        id: any;
        element: any;
        type: any;
    }[];
}
export const notificationAdapter: NotificationAdapter;
//# sourceMappingURL=notification-adapter.d.ts.map