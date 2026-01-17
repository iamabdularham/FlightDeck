import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Mock ResizeObserver for Recharts (proper class implementation)
class ResizeObserverMock {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = ResizeObserverMock;

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});
