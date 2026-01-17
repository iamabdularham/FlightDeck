/**
 * US-001: Search for Flights by Route and Date
 * 
 * As a traveler, I want to search for flights by entering origin, 
 * destination, and travel dates, so that I can find available flight options.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchForm } from '@/components/SearchForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

// Mock hooks
vi.mock('@/hooks/useFlightSearch', () => ({
    useFlightSearch: () => ({
        searchFlights: vi.fn(),
        searchParams: null,
    }),
    useAirportSearch: (query: string) => ({
        data: query.length >= 2 ? [
            { code: 'JFK', name: 'John F Kennedy', city: 'New York', country: 'USA' },
            { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA' },
        ] : [],
        isLoading: false,
    }),
}));

vi.mock('@/store/flightStore', () => ({
    useFlightStore: () => ({
        isLoading: false,
        error: null,
    }),
}));

describe('US-001: Search for Flights by Route and Date', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('AC-1: Search form displays origin and destination input fields', () => {
        render(<SearchForm />, { wrapper: Wrapper });

        expect(screen.getByPlaceholderText('Where from?')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Where to?')).toBeInTheDocument();
    });

    it('AC-2: Form has date picker for departure date', () => {
        render(<SearchForm />, { wrapper: Wrapper });

        expect(screen.getByLabelText(/Departure/i)).toBeInTheDocument();
    });

    it('AC-3: "Search Flights" button is disabled until all required fields are valid', () => {
        render(<SearchForm />, { wrapper: Wrapper });

        const searchButton = screen.getByRole('button', { name: /search flights/i });
        expect(searchButton).toBeDisabled();
    });

    it('AC-4: Origin and destination fields have proper accessibility labels', () => {
        render(<SearchForm />, { wrapper: Wrapper });

        expect(screen.getByLabelText(/From/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/To/i)).toBeInTheDocument();
    });

    it('AC-5: Swap button exists and has accessible label', () => {
        render(<SearchForm />, { wrapper: Wrapper });

        const swapButton = screen.getByLabelText('Swap origin and destination');
        expect(swapButton).toBeInTheDocument();
    });

    it('AC-6: Trip type toggle exists (Round Trip / One Way)', () => {
        render(<SearchForm />, { wrapper: Wrapper });

        expect(screen.getByRole('button', { name: /Round Trip/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /One Way/i })).toBeInTheDocument();
    });
});
