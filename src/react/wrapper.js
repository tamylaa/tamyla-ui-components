/**
 * React Wrappers for Tamyla UI Components
 * Provides React compatibility layer for vanilla JS components
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Higher-order component that wraps vanilla JS components for React
 */
export function createReactWrapper(componentLoader, defaultOptions = {}) {
  return React.forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const componentInstanceRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    // Combine default options with props
    const options = { ...defaultOptions, ...props };
    
    // Extract React-specific props
    const { 
      children, 
      className, 
      style, 
      onMount,
      onUnmount,
      onError,
      ...componentOptions 
    } = options;

    // Load and initialize component
    useEffect(() => {
      let mounted = true;

      async function loadComponent() {
        try {
          const ComponentClass = await componentLoader();
          
          if (!mounted) return;

          // Initialize component
          let instance;
          if (typeof ComponentClass === 'function') {
            // Factory function pattern
            instance = ComponentClass(componentOptions);
          } else if (ComponentClass.prototype && ComponentClass.prototype.constructor === ComponentClass) {
            // Class pattern
            instance = new ComponentClass(componentOptions);
          } else {
            throw new Error('Invalid component format');
          }

          // Render component
          if (containerRef.current && instance.render) {
            instance.render(containerRef.current);
          } else if (containerRef.current && instance.element) {
            containerRef.current.appendChild(instance.element);
          }

          componentInstanceRef.current = instance;
          setIsLoaded(true);
          
          // Call onMount callback
          onMount?.(instance);

        } catch (err) {
          if (mounted) {
            setError(err);
            onError?.(err);
          }
        }
      }

      loadComponent();

      return () => {
        mounted = false;
        
        // Cleanup component
        if (componentInstanceRef.current) {
          if (componentInstanceRef.current.destroy) {
            componentInstanceRef.current.destroy();
          } else if (componentInstanceRef.current.unmount) {
            componentInstanceRef.current.unmount();
          }
          
          onUnmount?.(componentInstanceRef.current);
          componentInstanceRef.current = null;
        }
      };
    }, []);

    // Update component props when they change
    useEffect(() => {
      if (componentInstanceRef.current && isLoaded) {
        // Update component options if it supports it
        if (componentInstanceRef.current.updateOptions) {
          componentInstanceRef.current.updateOptions(componentOptions);
        }
      }
    }, [componentOptions, isLoaded]);

    // Expose component instance via ref
    React.useImperativeHandle(ref, () => ({
      getInstance: () => componentInstanceRef.current,
      getContainer: () => containerRef.current
    }), [isLoaded]);

    if (error) {
      return (
        <div className={`tamyla-error ${className || ''}`} style={style}>
          <div className="error-message">
            Failed to load component: {error.message}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={`tamyla-component-wrapper ${className || ''}`}
        style={style}
      >
        {!isLoaded && (
          <div className="tamyla-loading">
            Loading component...
          </div>
        )}
        {children}
      </div>
    );
  });
}

/**
 * React hooks for component management
 */
export function useTamylaComponent(componentLoader, options = {}) {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  const loadComponent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const ComponentClass = await componentLoader();
      let instance;

      if (typeof ComponentClass === 'function') {
        instance = ComponentClass(options);
      } else {
        instance = new ComponentClass(options);
      }

      setComponent(instance);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [componentLoader, options]);

  useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  useEffect(() => {
    if (component && containerRef.current) {
      if (component.render) {
        component.render(containerRef.current);
      } else if (component.element) {
        containerRef.current.appendChild(component.element);
      }
    }

    return () => {
      if (component?.destroy) {
        component.destroy();
      }
    };
  }, [component]);

  return {
    component,
    loading,
    error,
    containerRef,
    reload: loadComponent
  };
}

/**
 * Context for global Tamyla UI configuration
 */
export const TamylaUIContext = React.createContext({
  theme: {},
  config: {},
  components: {}
});

/**
 * Provider component for Tamyla UI
 */
export function TamylaUIProvider({ children, theme = {}, config = {} }) {
  const contextValue = {
    theme,
    config,
    components: {}
  };

  return (
    <TamylaUIContext.Provider value={contextValue}>
      {children}
    </TamylaUIContext.Provider>
  );
}

/**
 * Hook to use Tamyla UI context
 */
export function useTamylaUI() {
  const context = React.useContext(TamylaUIContext);
  if (!context) {
    throw new Error('useTamylaUI must be used within a TamylaUIProvider');
  }
  return context;
}
