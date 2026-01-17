import { create } from 'zustand';
import {
    Flight,
    FilterState,
    SearchParams,
    ChartDataPoint,
    TimeSlot
} from '@/lib/types';
import {
    transformToChartData,
    getUniqueAirlines,
    getPriceRange,
    isInTimeSlot
} from '@/lib/utils';

interface FlightStore {
    // Raw data from API
    searchResults: Flight[];
    carriers: Record<string, string>;
    isLoading: boolean;
    error: string | null;
    hasSearched: boolean;

    // Search params
    searchParams: SearchParams | null;

    // Filter state
    filters: FilterState;

    // Available filter options (derived from search results)
    availableAirlines: { code: string; name: string; count: number }[];
    priceRange: [number, number];

    // Actions
    setSearchResults: (flights: Flight[], carriers: Record<string, string>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSearchParams: (params: SearchParams) => void;
    updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    resetFilters: () => void;
    clearSearch: () => void;

    // Computed getters
    getFilteredResults: () => Flight[];
    getChartData: () => ChartDataPoint[];
    getCheapestFlightId: () => string | null;
}

const defaultFilters: FilterState = {
    stops: [0, 1, 2],
    priceRange: [0, 10000],
    airlines: [],
    departureTimes: ['morning', 'afternoon', 'evening', 'night'],
    maxDuration: 0, // 0 = no limit
    directOnly: false,
    sortBy: 'price',
};

export const useFlightStore = create<FlightStore>((set, get) => ({
    // Initial state
    searchResults: [],
    carriers: {},
    isLoading: false,
    error: null,
    hasSearched: false,
    searchParams: null,
    filters: defaultFilters,
    availableAirlines: [],
    priceRange: [0, 10000],

    // Actions
    setSearchResults: (flights, carriers) => {
        const airlines = getUniqueAirlines(flights);
        const [minPrice, maxPrice] = getPriceRange(flights);

        set({
            searchResults: flights,
            carriers,
            hasSearched: true,
            availableAirlines: airlines,
            priceRange: [minPrice, maxPrice],
            // Reset filters to include all new data
            filters: {
                ...defaultFilters,
                airlines: airlines.map((a) => a.code),
                priceRange: [minPrice, maxPrice],
            },
        });
    },

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    setSearchParams: (params) => set({ searchParams: params }),

    updateFilter: (key, value) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: value,
            },
        }));
    },

    resetFilters: () => {
        const { availableAirlines, priceRange } = get();
        set({
            filters: {
                ...defaultFilters,
                airlines: availableAirlines.map((a) => a.code),
                priceRange,
            },
        });
    },

    clearSearch: () => {
        set({
            searchResults: [],
            carriers: {},
            hasSearched: false,
            searchParams: null,
            error: null,
            availableAirlines: [],
            priceRange: [0, 10000],
            filters: defaultFilters,
        });
    },

    // Computed getters - these run on every call but are fast due to memoization in components
    getFilteredResults: () => {
        const { searchResults, filters } = get();

        return searchResults.filter((flight) => {
            // Filter by direct only
            if (filters.directOnly && flight.stopCount > 0) {
                return false;
            }

            // Filter by stops
            const stopCategory = flight.stopCount >= 2 ? 2 : flight.stopCount;
            if (!filters.stops.includes(stopCategory)) {
                return false;
            }

            // Filter by price
            if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
                return false;
            }

            // Filter by max duration
            if (filters.maxDuration > 0 && flight.duration > filters.maxDuration) {
                return false;
            }

            // Filter by airline
            if (filters.airlines.length > 0 && !filters.airlines.includes(flight.carrierCode)) {
                return false;
            }

            // Filter by departure time
            const matchesTimeSlot = filters.departureTimes.some((slot: TimeSlot) =>
                isInTimeSlot(flight.departureTime, slot)
            );
            if (!matchesTimeSlot) {
                return false;
            }

            return true;
        });
    },

    getChartData: () => {
        const filteredResults = get().getFilteredResults();
        return transformToChartData(filteredResults);
    },

    getCheapestFlightId: () => {
        const filteredResults = get().getFilteredResults();
        if (filteredResults.length === 0) return null;

        const cheapest = filteredResults.reduce((min, flight) =>
            flight.price < min.price ? flight : min
        );
        return cheapest.id;
    },
}));
