import { useQuery } from '@tanstack/react-query';
import { flightApi } from '@/lib/api';
import { useFlightStore } from '@/store/flightStore';
import { normalizeFlightOffer } from '@/lib/utils';
import { SearchParams, AmadeusFlightResponse } from '@/lib/types';
import { searchAirportsLocal, Airport } from '@/lib/airports';

export function useFlightSearch() {
    const {
        setSearchResults,
        setLoading,
        setError,
        setSearchParams,
        searchParams
    } = useFlightStore();

    const searchFlights = async (params: SearchParams) => {
        setSearchParams(params);
        setLoading(true);
        setError(null);

        try {
            const response: AmadeusFlightResponse = await flightApi.searchFlights({
                origin: params.origin,
                destination: params.destination,
                departureDate: params.departureDate,
                returnDate: params.tripType === 'round-trip' ? params.returnDate : undefined,
                adults: params.passengers,
            });

            const carriers = response.dictionaries?.carriers || {};
            const normalizedFlights = response.data.map((offer) =>
                normalizeFlightOffer(offer, carriers)
            );

            setSearchResults(normalizedFlights, carriers);
            return normalizedFlights;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to search flights';
            setError(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        searchFlights,
        searchParams,
    };
}

// Hook for airport autocomplete - uses local database for worldwide coverage
export function useAirportSearch(keyword: string) {
    return useQuery({
        queryKey: ['airports', keyword],
        queryFn: async (): Promise<Airport[]> => {
            if (!keyword || keyword.length < 2) {
                return [];
            }

            // Use local airport database for comprehensive worldwide coverage
            const localResults = searchAirportsLocal(keyword);
            return localResults;
        },
        enabled: keyword.length >= 2,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
}
