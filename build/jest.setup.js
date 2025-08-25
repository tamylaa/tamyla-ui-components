/**
 * Jest setup file
 * Global test configuration and utilities
 */

// Mock DOM APIs that aren't available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock CSS.supports
if (!CSS.supports) {
  CSS.supports = jest.fn(() => false);
}

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received && document.body.contains(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in the document`,
        pass: false,
      };
    }
  },
  
  toHaveClass(received, className) {
    const pass = received && received.classList.contains(className);
    if (pass) {
      return {
        message: () => `expected ${received} not to have class ${className}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to have class ${className}`,
        pass: false,
      };
    }
  }
});

// Global test utilities
global.createTestContainer = () => {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  return container;
};

global.cleanupTestContainer = (container) => {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
};

// Mock console methods in tests to avoid noise
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Clean up DOM
  document.body.innerHTML = '';
  
  // Clear timers
  jest.clearAllTimers();
});

// Set up fake timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
