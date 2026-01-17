import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';

const mockFlights: Flight[] = [
    {
        id: '1',
        carrierCode: 'AA',
        carrierName: 'American Airlines',
        price: 300,
        currency: 'USD',
        departureTime: '2026-02-15T10:00:00',
        arrivalTime: '2026-02-15T12:00:00',
        duration: 120,
        durationFormatted: '2h 0m',
        stopCount: 0,
        originAirport: 'JFK',
        destinationAirport: 'MIA',
        segments: [],
    },
    {
        id: '2',
        carrierCode: 'UA',
        carrierName: 'United Airlines',
        price: 450,
        currency: 'USD',
        departureTime: '2026-02-15T14:00:00',
        arrivalTime: '2026-02-15T17:00:00',
        duration: 180,
        durationFormatted: '3h 0m',
        stopCount: 1,
        originAirport: 'JFK',
        destinationAirport: 'MIA',
        segments: [],
    },
];

describe('FlightStore', () => {
    beforeEach(() => {
        useFlightStore.getState().clearSearch();
    });

    it('filters by stops correctly', () => {
        const store = useFlightStore.getState();
        store.setSearchResults(mockFlights, {});

        // Filter to only non-stop (0 stops)
        store.updateFilter('stops', [0]);

        expect(store.getFilteredResults()).toHaveLength(1);
        expect(store.getFilteredResults()[0].id).toBe('1');

        // Filter to only 1 stop
        store.updateFilter('stops', [1]);
        expect(store.getFilteredResults()).toHaveLength(1);
        expect(store.getFilteredResults()[0].id).toBe('2');
    });

    it('filters by price correctly', () => {
        const store = useFlightStore.getState();
        store.setSearchResults(mockFlights, {});

        store.updateFilter('priceRange', [0, 400]);
        expect(store.getFilteredResults()).toHaveLength(1);
        expect(store.getFilteredResults()[0].price).toBe(300);
    });

    it('filters by airline correctly', () => {
        const store = useFlightStore.getState();
        store.setSearchResults(mockFlights, {});

        store.updateFilter('airlines', ['UA']);
        expect(store.getFilteredResults()).toHaveLength(1);
        expect(store.getFilteredResults()[0].carrierCode).toBe('UA');
    });

    it('identifies cheapest flight correctly', () => {
        const store = useFlightStore.getState();
        store.setSearchResults(mockFlights, {});

        expect(store.getCheapestFlightId()).toBe('1');
    });
});
