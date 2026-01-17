/**
 * US-004: Filter Flights by Airline
 * 
 * As a frequent flyer with airline loyalty, I want to filter flights 
 * by specific airlines, so that I can earn miles and enjoy familiar service.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';
import { getUniqueAirlines } from '@/lib/utils';

const createMockFlight = (id: string, carrierCode: string, carrierName: string): Flight => ({
    id,
    carrierCode,
    carrierName,
    price: 300,
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
    createMockFlight('1', 'AA', 'American Airlines'),
    createMockFlight('2', 'AA', 'American Airlines'),
    createMockFlight('3', 'UA', 'United Airlines'),
    createMockFlight('4', 'DL', 'Delta Air Lines'),
    createMockFlight('5', 'DL', 'Delta Air Lines'),
    createMockFlight('6', 'DL', 'Delta Air Lines'),
];

describe('US-004: Filter Flights by Airline', () => {
    beforeEach(() => {
        useFlightStore.getState().clearSearch();
        useFlightStore.getState().setSearchResults(mockFlights, {});
    });

    it('AC-1: Dynamic list of airlines extracted from search results', () => {
        const airlines = getUniqueAirlines(mockFlights);

        expect(airlines).toHaveLength(3);
        expect(airlines.map(a => a.code)).toContain('AA');
        expect(airlines.map(a => a.code)).toContain('UA');
        expect(airlines.map(a => a.code)).toContain('DL');
    });

    it('AC-2: Each airline displays count of flights', () => {
        const airlines = getUniqueAirlines(mockFlights);

        const aaAirline = airlines.find(a => a.code === 'AA');
        const uaAirline = airlines.find(a => a.code === 'UA');
        const dlAirline = airlines.find(a => a.code === 'DL');

        expect(aaAirline?.count).toBe(2);
        expect(uaAirline?.count).toBe(1);
        expect(dlAirline?.count).toBe(3);
    });

    it('AC-3: Filtering by single airline returns only that airline flights', () => {
        const store = useFlightStore.getState();

        store.updateFilter('airlines', ['AA']);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(2);
        expect(filtered.every(f => f.carrierCode === 'AA')).toBe(true);
    });

    it('AC-4: Filtering by multiple airlines works correctly', () => {
        const store = useFlightStore.getState();

        store.updateFilter('airlines', ['AA', 'UA']);
        const filtered = store.getFilteredResults();

        expect(filtered).toHaveLength(3);
        expect(filtered.every(f => f.carrierCode === 'AA' || f.carrierCode === 'UA')).toBe(true);
    });

    it('AC-5: Empty airline filter shows all flights', () => {
        const store = useFlightStore.getState();

        store.updateFilter('airlines', []);
        const filtered = store.getFilteredResults();

        // Empty array means no filter applied
        expect(filtered).toHaveLength(6);
    });

    it('AC-6: Airlines are sorted by flight count (descending)', () => {
        const airlines = getUniqueAirlines(mockFlights);

        expect(airlines[0].code).toBe('DL'); // 3 flights
        expect(airlines[1].code).toBe('AA'); // 2 flights
        expect(airlines[2].code).toBe('UA'); // 1 flight
    });
});
