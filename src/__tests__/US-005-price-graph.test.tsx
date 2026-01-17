/**
 * US-005: View Live Price Graph ⭐ (Critical Feature)
 * 
 * As a data-driven traveler, I want to see a visual graph of flight 
 * prices by airline, so that I can quickly identify the best value options.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceGraph } from '@/components/PriceGraph';
import { transformToChartData } from '@/lib/utils';
import { Flight } from '@/lib/types';

const createMockFlight = (id: string, carrierCode: string, carrierName: string, price: number): Flight => ({
    id,
    carrierCode,
    carrierName,
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
    createMockFlight('1', 'AA', 'American Airlines', 300),
    createMockFlight('2', 'AA', 'American Airlines', 350),
    createMockFlight('3', 'UA', 'United Airlines', 250),
    createMockFlight('4', 'DL', 'Delta Air Lines', 400),
];

describe('US-005: View Live Price Graph (Critical Feature)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('AC-1: Chart data is correctly transformed from flights', () => {
        const chartData = transformToChartData(mockFlights);

        expect(chartData).toHaveLength(3); // 3 unique airlines
    });

    it('AC-2: Chart data shows minimum price per airline', () => {
        const chartData = transformToChartData(mockFlights);

        const aaData = chartData.find(d => d.carrierCode === 'AA');
        expect(aaData?.price).toBe(300); // Min of 300 and 350
    });

    it('AC-3: Chart data includes flight count per airline', () => {
        const chartData = transformToChartData(mockFlights);

        const aaData = chartData.find(d => d.carrierCode === 'AA');
        expect(aaData?.count).toBe(2);
    });

    it('AC-4: Chart data is sorted by price (ascending)', () => {
        const chartData = transformToChartData(mockFlights);

        const prices = chartData.map(d => d.price);
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    it('AC-5: PriceGraph renders with accessible description', () => {
        vi.mock('@/store/flightStore', () => ({
            useFlightStore: () => ({
                isLoading: false,
                hasSearched: true,
                getChartData: () => transformToChartData(mockFlights),
                updateFilter: vi.fn(),
                filters: {},
            }),
        }));

        render(<PriceGraph />);

        // Check for the chart container role
        const chartContainer = screen.getByRole('img');
        expect(chartContainer).toHaveAttribute('aria-label');
    });

    it('AC-6: Graph updates when filtered data changes', () => {
        // Filter to only United Airlines
        const filteredFlights = mockFlights.filter(f => f.carrierCode === 'UA');
        const chartData = transformToChartData(filteredFlights);

        expect(chartData).toHaveLength(1);
        expect(chartData[0].carrierCode).toBe('UA');
        expect(chartData[0].price).toBe(250);
    });
});
