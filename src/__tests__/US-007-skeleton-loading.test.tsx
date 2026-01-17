/**
 * US-007: Experience Fast, Skeleton Loading States
 * 
 * As a user with potentially slow internet, I want to see skeleton 
 * placeholders while content loads, so that I know the app is working 
 * and can anticipate the layout.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlightList } from '@/components/FlightList';

// Mock store with loading state
vi.mock('@/store/flightStore', () => ({
    useFlightStore: vi.fn(),
}));

import { useFlightStore } from '@/store/flightStore';

describe('US-007: Experience Fast, Skeleton Loading States', () => {
    it('AC-1: Flight card skeletons appear during loading', () => {
        (useFlightStore as any).mockReturnValue({
            isLoading: true,
            hasSearched: true,
            error: null,
            getFilteredResults: () => [],
            getCheapestFlightId: () => null,
            filters: {},
        });

        const { container } = render(<FlightList />);

        // Check for shimmer animation class
        const skeletons = container.querySelectorAll('.animate-shimmer');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('AC-2: Multiple skeleton cards are shown for perceived completeness', () => {
        (useFlightStore as any).mockReturnValue({
            isLoading: true,
            hasSearched: true,
            error: null,
            getFilteredResults: () => [],
            getCheapestFlightId: () => null,
            filters: {},
        });

        const { container } = render(<FlightList />);

        // Should show 3 skeleton cards
        const skeletonCards = container.querySelectorAll('.rounded-xl');
        expect(skeletonCards.length).toBeGreaterThanOrEqual(3);
    });

    it('AC-3: Error state replaces skeleton if API fails', () => {
        (useFlightStore as any).mockReturnValue({
            isLoading: false,
            hasSearched: true,
            error: 'Network error occurred',
            getFilteredResults: () => [],
            getCheapestFlightId: () => null,
            filters: {},
        });

        render(<FlightList />);

        expect(screen.getByText(/Network error occurred/i)).toBeInTheDocument();
    });

    it('AC-4: Actual content replaces skeleton when loaded', () => {
        const mockFlight = {
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
            destinationAirport: 'LAX',
            segments: [],
        };

        (useFlightStore as any).mockReturnValue({
            isLoading: false,
            hasSearched: true,
            error: null,
            getFilteredResults: () => [mockFlight],
            getCheapestFlightId: () => '1',
            filters: {},
        });

        render(<FlightList />);

        expect(screen.getByText('American Airlines')).toBeInTheDocument();
        expect(screen.getByText('$300.00')).toBeInTheDocument();
    });
});
