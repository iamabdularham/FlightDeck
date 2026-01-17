import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlightList } from '@/components/FlightList';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';

// Mock flight data
const mockFlight: Flight = {
    id: '1',
    carrierCode: 'AA',
    carrierName: 'American',
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
};

// Mock store module
vi.mock('@/store/flightStore', () => ({
    useFlightStore: vi.fn(),
}));

describe('FlightList Component', () => {
    it('renders flight card when results exist', () => {
        (useFlightStore as any).mockReturnValue({
            isLoading: false,
            hasSearched: true,
            error: null,
            getFilteredResults: () => [mockFlight],
            getCheapestFlightId: () => '1',
            filters: {},
        });

        render(<FlightList />);
        expect(screen.getByText('American')).toBeInTheDocument();
        expect(screen.getByText('$300.00')).toBeInTheDocument();
    });

    it('renders "Best Value" badge for cheapest flight', () => {
        (useFlightStore as any).mockReturnValue({
            isLoading: false,
            hasSearched: true,
            error: null,
            getFilteredResults: () => [mockFlight, { ...mockFlight, id: '2', price: 500 }],
            getCheapestFlightId: () => '1',
            filters: {},
        });

        render(<FlightList />);
        expect(screen.getByText('Best Value')).toBeInTheDocument();
    });

    it('renders loading skeletons', () => {
        (useFlightStore as any).mockReturnValue({
            isLoading: true,
            hasSearched: true,
            error: null,
            getFilteredResults: () => [],
            getCheapestFlightId: () => null,
            filters: {},
        });

        const { container } = render(<FlightList />);
        // Check for shimmer effect classes
        expect(container.getElementsByClassName('animate-shimmer').length).toBeGreaterThan(0);
    });
});
