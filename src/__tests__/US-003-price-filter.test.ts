/**
 * US-003: Filter Flights by Price Range
 * 
 * As a budget-conscious traveler, I want to filter flights within a 
 * specific price range, so that I can find options that fit my budget.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';
import { getPriceRange } from '@/lib/utils';

const createMockFlight = (id: string, price: number): Flight => ({
    id,
    carrierCode: 'AA',
    carrierName: 'American Airlines',
    price,
    currency: 'USD',
    departureTime: '2026-02-15T10:00:00',
    arrivalTime: '2026-02-15T12:00:00',
    duration: 120,
    durationFormatted: '2h 0m',
    stopCount: 0,
    originAirport: 'JFK',
    destinationAirport: 'LAX',
    segments: [],
});

const mockFlights: Flight[] = [
    createMockFlight('1', 150),
    createMockFlight('2', 250),
    createMockFlight('3', 350),
    createMockFlight('4', 450),
    createMockFlight('5', 550),
];

describe('US-003: Filter Flights by Price Range', () => {
    beforeEach(() => {
        useFlightStore.getState().clearSearch();
        useFlightStore.getState().setSearchResults(mockFlights, {});
    });

    it('AC-1: Price range is calculated from search results', () => {
        const range = getPriceRange(mockFlights);

        expect(range[0]).toBe(150); // Min price
        expect(range[1]).toBe(550); // Max price
    });

    it('AC-2: Filtering by price range returns flights within range', () => {
        const store = useFlightStore.getState();

        store.updateFilter('priceRange', [200, 400]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(2);
        expect(filtered.every(f => f.price >= 200 && f.price <= 400)).toBe(true);
    });

    it('AC-3: Minimum price filter works correctly', () => {
        const store = useFlightStore.getState();

        store.updateFilter('priceRange', [300, 600]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(3);
        expect(filtered.every(f => f.price >= 300)).toBe(true);
    });

    it('AC-4: Maximum price filter works correctly', () => {
        const store = useFlightStore.getState();

        store.updateFilter('priceRange', [0, 300]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(2);
        expect(filtered.every(f => f.price <= 300)).toBe(true);
    });

    it('AC-5: Inclusive range boundaries', () => {
        const store = useFlightStore.getState();

        store.updateFilter('priceRange', [250, 350]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(2);
        expect(filtered.find(f => f.price === 250)).toBeDefined();
        expect(filtered.find(f => f.price === 350)).toBeDefined();
    });

    it('AC-6: Empty result when no flights in price range', () => {
        const store = useFlightStore.getState();

        store.updateFilter('priceRange', [600, 1000]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(0);
    });
});
