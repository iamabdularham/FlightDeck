/**
 * US-006: Identify Best Value Flight
 * 
 * As a price-conscious traveler, I want to quickly see which flight 
 * offers the best value, so that I don't have to manually compare all options.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';

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
    createMockFlight('1', 450),
    createMockFlight('2', 250), // Cheapest
    createMockFlight('3', 350),
    createMockFlight('4', 550),
];

describe('US-006: Identify Best Value Flight', () => {
    beforeEach(() => {
        useFlightStore.getState().clearSearch();
        useFlightStore.getState().setSearchResults(mockFlights, {});
    });

    it('AC-1: Cheapest flight is correctly identified', () => {
        const store = useFlightStore.getState();
        const cheapestId = store.getCheapestFlightId();

        expect(cheapestId).toBe('2');
    });

    it('AC-2: Cheapest flight updates when filters change', () => {
        const store = useFlightStore.getState();

        // Filter to exclude the cheapest flight (price > 300)
        store.updateFilter('priceRange', [300, 600]);
        const cheapestId = store.getCheapestFlightId();

        expect(cheapestId).toBe('3'); // 350 is now cheapest
    });

    it('AC-3: Returns null when no flights match filters', () => {
        const store = useFlightStore.getState();

        store.updateFilter('priceRange', [1000, 2000]);
        const cheapestId = store.getCheapestFlightId();

        expect(cheapestId).toBeNull();
    });

    it('AC-4: Correctly handles single flight result', () => {
        useFlightStore.getState().clearSearch();
        useFlightStore.getState().setSearchResults([createMockFlight('solo', 999)], {});

        const cheapestId = useFlightStore.getState().getCheapestFlightId();

        expect(cheapestId).toBe('solo');
    });

    it('AC-5: Handles tie-breaker (first cheapest wins)', () => {
        useFlightStore.getState().clearSearch();
        useFlightStore.getState().setSearchResults([
            createMockFlight('tie1', 200),
            createMockFlight('tie2', 200),
        ], {});

        const cheapestId = useFlightStore.getState().getCheapestFlightId();

        // First one in list should win
        expect(cheapestId).toBe('tie1');
    });
});
