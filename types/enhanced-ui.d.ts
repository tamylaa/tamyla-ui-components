/**
 * Enhanced TypeScript Definitions for @tamyla/ui-components
 *
 * This file provides comprehensive TypeScript support for the unified UI factory API,
 * including IntelliSense, type checking, and autocompletion for all component types.
 */

export interface BaseComponentProps {
  id?: string;
  className?: string;
  style?: Record<string, string>;
  disabled?: boolean;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  onClick?: (event: Event) => void;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  icon?: string;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  readonly?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  onChange?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  onBlur?: (event: Event) => void;
  error?: string;
  helperText?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  content?: string;
  headerActions?: HTMLElement[];
  footerActions?: HTMLElement[];
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export interface StatusIndicatorProps extends BaseComponentProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'loading';
  label?: string;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export interface SearchBarProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  enableVoice?: boolean;
  showFilters?: boolean;
  filters?: Array<{ label: string; value: string; active?: boolean }>;
  debounceMs?: number;
}

export interface ActionCardProps extends BaseComponentProps {
  title: string;
  content?: string;
  actionText: string;
  onAction?: (event: Event) => void;
  secondaryActions?: Array<{ text: string; onClick: (event: Event) => void }>;
  variant?: 'default' | 'urgent' | 'success';
  icon?: string;
}

export interface NotificationProps extends BaseComponentProps {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
  actions?: Array<{ text: string; onClick: () => void }>;
}

export interface SearchInterfaceProps extends BaseComponentProps {
  title?: string;
  placeholder?: string;
  enableVoice?: boolean;
  enableFilters?: boolean;
  showResultsCount?: boolean;
  onSearch?: (query: string, filters?: Record<string, any>) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  initialQuery?: string;
  filters?: Array<{
    type: 'select' | 'checkbox' | 'range' | 'date';
    label: string;
    key: string;
    options?: Array<{ label: string; value: any }>;
    min?: number;
    max?: number;
  }>;
}

export interface RewardSystemProps extends BaseComponentProps {
  preset?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  userId?: string;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
  }>;
  points?: number;
  level?: number;
  onAchievementUnlock?: (achievement: any) => void;
  showProgress?: boolean;
  theme?: 'default' | 'dark' | 'colorful';
}

export interface DashboardProps extends BaseComponentProps {
  type: 'widget' | 'grid' | 'full';
  title?: string;
  widgets?: Array<{
    id: string;
    type: string;
    title: string;
    data?: any;
    position?: { x: number; y: number; w: number; h: number };
  }>;
  layout?: 'auto' | 'manual';
  editable?: boolean;
  onWidgetAdd?: (widget: any) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onLayoutChange?: (layout: any) => void;
}

// Union type for all component props
export type ComponentProps =
  | ButtonProps
  | InputProps
  | CardProps
  | StatusIndicatorProps
  | SearchBarProps
  | ActionCardProps
  | NotificationProps
  | SearchInterfaceProps
  | RewardSystemProps
  | DashboardProps;

// Component type definitions
export type ComponentType =
  // Atoms
  | 'button'
  | 'input'
  | 'card'
  | 'status-indicator'
  // Molecules
  | 'search-bar'
  | 'action-card'
  | 'notification'
  // Organisms
  | 'search-interface'
  | 'reward-system'
  | 'dashboard';

// Variant type definitions
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type CardVariant = 'default' | 'elevated' | 'outlined';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type StatusType = 'online' | 'offline' | 'warning' | 'error' | 'loading';
export type DashboardType = 'widget' | 'grid' | 'full';
export type RewardPreset = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Factory method overloads for better IntelliSense
export interface UIFactory {
  /**
   * Create a UI component using the unified factory pattern
   * @param type The component type to create
   * @param props Props specific to the component type
   * @returns The created component element
   */
  create(type: 'button', props: ButtonProps): HTMLElement;
  create(type: 'input', props: InputProps): HTMLElement;
  create(type: 'card', props: CardProps): HTMLElement;
  create(type: 'status-indicator', props: StatusIndicatorProps): HTMLElement;
  create(type: 'search-bar', props: SearchBarProps): HTMLElement;
  create(type: 'action-card', props: ActionCardProps): HTMLElement;
  create(type: 'notification', props: NotificationProps): HTMLElement;
  create(type: 'search-interface', props: SearchInterfaceProps): HTMLElement;
  create(type: 'reward-system', props: RewardSystemProps): HTMLElement;
  create(type: 'dashboard', props: DashboardProps): HTMLElement;

  /**
   * Create multiple components at once
   * @param components Array of component configurations
   * @returns Array of created component elements
   */
  createMultiple(components: Array<{ type: ComponentType; props: ComponentProps }>): HTMLElement[];

  /**
   * Get all available component types organized by category
   */
  getAvailableTypes(): {
    atoms: string[];
    molecules: string[];
    organisms: string[];
    applications: string[];
  };

  /**
   * Get available variants for a specific component type
   * @param type The component type
   */
  getVariants(type: ComponentType): string[];

  /**
   * Check if a component type is available
   * @param type The component type to check
   */
  isAvailable(type: ComponentType): boolean;
}
