// Test utilities for the application
// This file provides common testing utilities and mocks

export interface MockUser {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'moderator';
}

export interface MockApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Mock user data for testing
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'user@test.com',
    username: 'testuser',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@test.com',
    username: 'testadmin',
    role: 'admin',
  },
  {
    id: '3',
    email: 'mod@test.com',
    username: 'testmod',
    role: 'moderator',
  },
];

// Mock API responses
export function createMockApiResponse<T>(
  data?: T,
  success: boolean = true,
  error?: string
): MockApiResponse<T> {
  return {
    success,
    data,
    error,
    message: success ? 'Operation successful' : error || 'Operation failed',
  };
}

// Mock localStorage for testing
export class MockLocalStorage {
  private store: { [key: string]: string } = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  get length(): number {
    return Object.keys(this.store).length;
  }
}

// Mock fetch for API testing
export function createMockFetch(responses: { [url: string]: any }) {
  return jest.fn((url: string, options?: RequestInit) => {
    const response = responses[url] || responses['*']; // '*' as fallback
    
    if (!response) {
      return Promise.reject(new Error(`No mock response defined for ${url}`));
    }

    return Promise.resolve({
      ok: response.status < 400,
      status: response.status || 200,
      statusText: response.statusText || 'OK',
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
      headers: new Headers(response.headers || {}),
    } as Response);
  });
}

// Test environment setup
export function setupTestEnvironment() {
  // Mock window.location
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: '',
      reload: jest.fn(),
      assign: jest.fn(),
    },
    writable: true,
  });

  // Mock window.localStorage
  Object.defineProperty(window, 'localStorage', {
    value: new MockLocalStorage(),
    writable: true,
  });

  // Mock window.sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: new MockLocalStorage(),
    writable: true,
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Async test helpers
export function waitFor(condition: () => boolean, timeout: number = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkCondition = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Condition not met within ${timeout}ms`));
      } else {
        setTimeout(checkCondition, 100);
      }
    };
    checkCondition();
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock crypto for environments that don't have it
if (typeof crypto === 'undefined') {
  (global as any).crypto = {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2),
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  };
}

// Environment variable mocks
export function mockEnvVars(vars: { [key: string]: string }) {
  const originalEnv = process.env;
  
  beforeEach(() => {
    process.env = { ...originalEnv, ...vars };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
}

// Common test data generators
export function generateRandomEmail(): string {
  return `test${Math.random().toString(36).substring(2)}@example.com`;
}

export function generateRandomString(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function generateRandomNumber(min: number = 0, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Performance testing helpers
export function measurePerformance<T>(fn: () => T, label?: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (label) {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (label) {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}
