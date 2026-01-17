/**
 * US-002: Filter Flights by Number of Stops
 * 
 * As a busy traveler, I want to filter flights by the number of stops 
 * (non-stop, 1 stop, 2+ stops), so that I can find flights that match 
 * my schedule preferences.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';

const createMockFlight = (id: string, stopCount: number): Flight => ({
    id,
    carrierCode: 'AA',
    carrierName: 'American Airlines',
    price: 300 + stopCount * 50,
    currency: 'USD',
    departureTime: '2026-02-15T10:00:00',
    arrivalTime: '2026-02-15T12:00:00',
    duration: 120 + stopCount * 60,
    durationFormatted: `${2 + stopCount}h 0m`,
    stopCount,
    originAirport: 'JFK',
    destinationAirport: 'LAX',
    segments: [],
});

const mockFlights: Flight[] = [
    createMockFlight('1', 0), // Non-stop
    createMockFlight('2', 0), // Non-stop
    createMockFlight('3', 1), // 1 stop
    createMockFlight('4', 1), // 1 stop
    createMockFlight('5', 2), // 2+ stops
];

describe('US-002: Filter Flights by Number of Stops', () => {
    beforeEach(() => {
        useFlightStore.getState().clearSearch();
        useFlightStore.getState().setSearchResults(mockFlights, {});
    });

    it('AC-1: All stop options are available (0, 1, 2+)', () => {
        const store = useFlightStore.getState();

        // By default, all stops should be selected
        expect(store.filters.stops).toEqual([0, 1, 2]);
    });

    it('AC-2: Filtering by non-stop (0 stops) returns only non-stop flights', () => {
        const store = useFlightStore.getState();

        store.updateFilter('stops', [0]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(2);
        expect(filtered.every(f => f.stopCount === 0)).toBe(true);
    });

    it('AC-3: Filtering by 1 stop returns only 1-stop flights', () => {
        const store = useFlightStore.getState();

        store.updateFilter('stops', [1]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(2);
        expect(filtered.every(f => f.stopCount === 1)).toBe(true);
    });

    it('AC-4: Filtering by 2+ stops returns only 2+ stop flights', () => {
        const store = useFlightStore.getState();

        store.updateFilter('stops', [2]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(1);
        expect(filtered.every(f => f.stopCount >= 2)).toBe(true);
    });

    it('AC-5: Multiple stop filters can be combined', () => {
        const store = useFlightStore.getState();

        store.updateFilter('stops', [0, 1]);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(4);
        expect(filtered.every(f => f.stopCount === 0 || f.stopCount === 1)).toBe(true);
    });

    it('AC-6: Empty result when no stops match', () => {
        const store = useFlightStore.getState();

        store.updateFilter('stops', []);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(0);
    });
});
