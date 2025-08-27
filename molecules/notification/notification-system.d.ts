/**
 * Notification Factory
 * Creates modular toast notifications with stacking support
 */
export function NotificationFactory(props?: {}): {
    render: (targetContainer?: any) => any;
    show: () => any;
    hide: () => any;
    destroy: () => void;
    updateContent: (newProps?: {}) => any;
    setTitle: (newTitle: any) => any;
    setMessage: (newMessage: any) => any;
    setType: (newType: any) => any;
    pause: () => any;
    resume: () => any;
    extend: (additionalTime?: number) => any;
    persist: () => any;
    getController: () => any;
    getElement: () => any;
    isVisible: () => any;
    getTimeRemaining: () => any;
};
/**
 * Convenience functions for common notification types
 */
/**
 * Show success notification
 */
export function showSuccess(message: any, options?: {}): {
    render: (targetContainer?: any) => any;
    show: () => any;
    hide: () => any;
    destroy: () => void;
    updateContent: (newProps?: {}) => any;
    setTitle: (newTitle: any) => any;
    setMessage: (newMessage: any) => any;
    setType: (newType: any) => any;
    pause: () => any;
    resume: () => any;
    extend: (additionalTime?: number) => any;
    persist: () => any;
    getController: () => any;
    getElement: () => any;
    isVisible: () => any;
    getTimeRemaining: () => any;
};
/**
 * Show error notification
 */
export function showError(message: any, options?: {}): {
    render: (targetContainer?: any) => any;
    show: () => any;
    hide: () => any;
    destroy: () => void;
    updateContent: (newProps?: {}) => any;
    setTitle: (newTitle: any) => any;
    setMessage: (newMessage: any) => any;
    setType: (newType: any) => any;
    pause: () => any;
    resume: () => any;
    extend: (additionalTime?: number) => any;
    persist: () => any;
    getController: () => any;
    getElement: () => any;
    isVisible: () => any;
    getTimeRemaining: () => any;
};
/**
 * Show warning notification
 */
export function showWarning(message: any, options?: {}): {
    render: (targetContainer?: any) => any;
    show: () => any;
    hide: () => any;
    destroy: () => void;
    updateContent: (newProps?: {}) => any;
    setTitle: (newTitle: any) => any;
    setMessage: (newMessage: any) => any;
    setType: (newType: any) => any;
    pause: () => any;
    resume: () => any;
    extend: (additionalTime?: number) => any;
    persist: () => any;
    getController: () => any;
    getElement: () => any;
    isVisible: () => any;
    getTimeRemaining: () => any;
};
/**
 * Show info notification
 */
export function showInfo(message: any, options?: {}): {
    render: (targetContainer?: any) => any;
    show: () => any;
    hide: () => any;
    destroy: () => void;
    updateContent: (newProps?: {}) => any;
    setTitle: (newTitle: any) => any;
    setMessage: (newMessage: any) => any;
    setType: (newType: any) => any;
    pause: () => any;
    resume: () => any;
    extend: (additionalTime?: number) => any;
    persist: () => any;
    getController: () => any;
    getElement: () => any;
    isVisible: () => any;
    getTimeRemaining: () => any;
};
/**
 * Show loading notification
 */
export function showLoading(message?: string, options?: {}): {
    render: (targetContainer?: any) => any;
    show: () => any;
    hide: () => any;
    destroy: () => void;
    updateContent: (newProps?: {}) => any;
    setTitle: (newTitle: any) => any;
    setMessage: (newMessage: any) => any;
    setType: (newType: any) => any;
    pause: () => any;
    resume: () => any;
    extend: (additionalTime?: number) => any;
    persist: () => any;
    getController: () => any;
    getElement: () => any;
    isVisible: () => any;
    getTimeRemaining: () => any;
};
/**
 * Show undo notification
 */
export function showUndo(message: any, onUndo: any, options?: {}): {
    render: (targetContainer?: any) => any;
    show: () => any;
    hide: () => any;
    destroy: () => void;
    updateContent: (newProps?: {}) => any;
    setTitle: (newTitle: any) => any;
    setMessage: (newMessage: any) => any;
    setType: (newType: any) => any;
    pause: () => any;
    resume: () => any;
    extend: (additionalTime?: number) => any;
    persist: () => any;
    getController: () => any;
    getElement: () => any;
    isVisible: () => any;
    getTimeRemaining: () => any;
};
/**
 * Notification Manager for handling multiple notifications
 */
export class NotificationManager {
    constructor(options?: {});
    options: {
        maxNotifications: number;
        defaultPosition: string;
        defaultDuration: number;
        stackOldest: string;
    };
    notifications: Map<any, any>;
    containers: Map<any, any>;
    idCounter: number;
    /**
     * Create and show notification
     */
    show(type: any, message: any, options?: {}): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    /**
     * Show success notification
     */
    success(message: any, options?: {}): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    /**
     * Show error notification
     */
    error(message: any, options?: {}): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    /**
     * Show warning notification
     */
    warning(message: any, options?: {}): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    /**
     * Show info notification
     */
    info(message: any, options?: {}): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    /**
     * Hide notification by id
     */
    hide(id: any): void;
    /**
     * Remove notification from manager
     */
    remove(id: any): void;
    /**
     * Clear all notifications
     */
    clear(position?: null): void;
    /**
     * Enforce notification limit
     */
    enforceLimit(position: any): void;
    /**
     * Generate unique notification id
     */
    generateId(): string;
    /**
     * Get notification count
     */
    getCount(position?: null): number;
    /**
     * Check if position has notifications
     */
    hasNotifications(position: any): boolean;
}
export const notificationManager: NotificationManager;
export namespace toast {
    function success(message: any, options: any): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    function error(message: any, options: any): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    function warning(message: any, options: any): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    function info(message: any, options: any): {
        id: string;
        notification: {
            render: (targetContainer?: any) => any;
            show: () => any;
            hide: () => any;
            destroy: () => void;
            updateContent: (newProps?: {}) => any;
            setTitle: (newTitle: any) => any;
            setMessage: (newMessage: any) => any;
            setType: (newType: any) => any;
            pause: () => any;
            resume: () => any;
            extend: (additionalTime?: number) => any;
            persist: () => any;
            getController: () => any;
            getElement: () => any;
            isVisible: () => any;
            getTimeRemaining: () => any;
        };
    };
    function loading(message: any, options: any): {
        render: (targetContainer?: any) => any;
        show: () => any;
        hide: () => any;
        destroy: () => void;
        updateContent: (newProps?: {}) => any;
        setTitle: (newTitle: any) => any;
        setMessage: (newMessage: any) => any;
        setType: (newType: any) => any;
        pause: () => any;
        resume: () => any;
        extend: (additionalTime?: number) => any;
        persist: () => any;
        getController: () => any;
        getElement: () => any;
        isVisible: () => any;
        getTimeRemaining: () => any;
    };
    function undo(message: any, onUndo: any, options: any): {
        render: (targetContainer?: any) => any;
        show: () => any;
        hide: () => any;
        destroy: () => void;
        updateContent: (newProps?: {}) => any;
        setTitle: (newTitle: any) => any;
        setMessage: (newMessage: any) => any;
        setType: (newType: any) => any;
        pause: () => any;
        resume: () => any;
        extend: (additionalTime?: number) => any;
        persist: () => any;
        getController: () => any;
        getElement: () => any;
        isVisible: () => any;
        getTimeRemaining: () => any;
    };
    function clear(position: any): void;
}
export default NotificationFactory;
//# sourceMappingURL=notification-system.d.ts.map