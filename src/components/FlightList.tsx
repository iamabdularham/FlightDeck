import { useMemo, useState } from 'react';
import { ArrowUpDown, Plane, SlidersHorizontal } from 'lucide-react';
import { FlightCard } from '@/components/FlightCard';
import { FlightDetailModal } from '@/components/FlightDetailModal';
import { FlightCardSkeleton } from '@/components/ui/Skeleton';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';
import { cn } from '@/lib/utils';

type SortOption = 'price' | 'duration' | 'departure';

export function FlightList() {
    const { isLoading, hasSearched, error, getFilteredResults, getCheapestFlightId, filters } =
        useFlightStore();
    const [sortBy, setSortBy] = useState<SortOption>('price');
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

    const filteredResults = useMemo(() => getFilteredResults(), [getFilteredResults, filters]);
    const cheapestId = useMemo(() => getCheapestFlightId(), [getCheapestFlightId, filters]);

    const sortedResults = useMemo(() => {
        const results = [...filteredResults];
        switch (sortBy) {
            case 'price':
                return results.sort((a, b) => a.price - b.price);
            case 'duration':
                return results.sort((a, b) => a.duration - b.duration);
            case 'departure':
                return results.sort(
                    (a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
                );
            default:
                return results;
        }
    }, [filteredResults, sortBy]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <FlightCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Search Failed</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!hasSearched) {
        return (
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Plane className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-surface-900 mb-2">Ready for Takeoff?</h3>
                <p className="text-surface-600 max-w-md mx-auto">
                    Enter your travel details above to discover amazing flight deals with real-time price
                    visualization.
                </p>
            </div>
        );
    }

    if (sortedResults.length === 0) {
        return (
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-surface-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-700 mb-2">No Flights Match</h3>
                <p className="text-surface-500">
                    Try adjusting your filters to see more results.
                </p>
            </div>
        );
    }

    return (
        <>
            <div>
                {/* Sort Options */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-surface-600">
                        <span className="font-semibold text-surface-900">{sortedResults.length}</span>{' '}
                        {sortedResults.length === 1 ? 'flight' : 'flights'} found
                    </p>
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-surface-400" />
                        <span className="text-sm text-surface-500">Sort by:</span>
                        <div className="flex gap-1 bg-surface-100 rounded-lg p-1">
                            {[
                                { value: 'price', label: 'Price' },
                                { value: 'duration', label: 'Duration' },
                                { value: 'departure', label: 'Time' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value as SortOption)}
                                    className={cn(
                                        'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                                        sortBy === option.value
                                            ? 'bg-white text-primary-600 shadow-sm'
                                            : 'text-surface-600 hover:text-surface-900'
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Flight Cards */}
                <div className="space-y-4">
                    {sortedResults.map((flight: Flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            isBestValue={flight.id === cheapestId && sortedResults.length > 1}
                            onClick={() => setSelectedFlight(flight)}
                        />
                    ))}
                </div>
            </div>

            {/* Flight Detail Modal */}
            {selectedFlight && (
                <FlightDetailModal
                    flight={selectedFlight}
                    isOpen={!!selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                    isBestValue={selectedFlight.id === cheapestId && sortedResults.length > 1}
                />
            )}
        </>
    );
}
