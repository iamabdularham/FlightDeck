import { useMemo } from 'react';
import { Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { Button } from '@/components/ui/Button';
import { useFlightStore } from '@/store/flightStore';
import { formatPrice, cn } from '@/lib/utils';
import { TimeSlot } from '@/lib/types';

const STOP_OPTIONS = [
    { value: 0, label: 'Non-stop' },
    { value: 1, label: '1 stop' },
    { value: 2, label: '2+ stops' },
];

const TIME_SLOTS: { value: TimeSlot; label: string; time: string }[] = [
    { value: 'morning', label: 'Morning', time: '6AM - 12PM' },
    { value: 'afternoon', label: 'Afternoon', time: '12PM - 6PM' },
    { value: 'evening', label: 'Evening', time: '6PM - 12AM' },
    { value: 'night', label: 'Night', time: '12AM - 6AM' },
];

interface FilterSidebarProps {
    className?: string;
    isMobile?: boolean;
    onClose?: () => void;
}

export function FilterSidebar({ className, isMobile, onClose }: FilterSidebarProps) {
    const {
        filters,
        updateFilter,
        resetFilters,
        availableAirlines,
        priceRange,
        hasSearched,
        getFilteredResults,
        searchResults,
    } = useFlightStore();

    const filteredCount = useMemo(() => getFilteredResults().length, [getFilteredResults, filters]);

    // Calculate airline counts after applying non-airline filters (for dimming airlines with 0 matches)
    const airlineCountsPostFilter = useMemo(() => {
        const counts: Record<string, number> = {};

        // Apply all filters EXCEPT airline filter to get post-filter counts
        searchResults.forEach((flight) => {
            // Filter by stops
            const stopCategory = flight.stopCount >= 2 ? 2 : flight.stopCount;
            if (!filters.stops.includes(stopCategory)) return;

            // Filter by price
            if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return;

            // Filter by departure time
            const hour = new Date(flight.departureTime).getHours();
            let timeSlot: TimeSlot;
            if (hour >= 6 && hour < 12) timeSlot = 'morning';
            else if (hour >= 12 && hour < 18) timeSlot = 'afternoon';
            else if (hour >= 18 && hour < 24) timeSlot = 'evening';
            else timeSlot = 'night';
            if (!filters.departureTimes.includes(timeSlot)) return;

            // Count this airline
            counts[flight.carrierCode] = (counts[flight.carrierCode] || 0) + 1;
        });

        return counts;
    }, [searchResults, filters.stops, filters.priceRange, filters.departureTimes]);

    if (!hasSearched) {
        return null;
    }

    const handleStopToggle = (value: number, checked: boolean) => {
        const newStops = checked
            ? [...filters.stops, value]
            : filters.stops.filter((s) => s !== value);
        updateFilter('stops', newStops);
    };

    const handleAirlineToggle = (code: string, checked: boolean) => {
        const newAirlines = checked
            ? [...filters.airlines, code]
            : filters.airlines.filter((a) => a !== code);
        updateFilter('airlines', newAirlines);
    };

    const handleTimeSlotToggle = (slot: TimeSlot, checked: boolean) => {
        const newSlots = checked
            ? [...filters.departureTimes, slot]
            : filters.departureTimes.filter((s) => s !== slot);
        updateFilter('departureTimes', newSlots);
    };

    const handleSelectAllAirlines = () => {
        updateFilter('airlines', availableAirlines.map((a) => a.code));
    };

    const handleClearAllAirlines = () => {
        updateFilter('airlines', []);
    };

    return (
        <div
            className={cn(
                'bg-white rounded-xl border border-surface-200 shadow-card overflow-hidden',
                className
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-surface-200 bg-surface-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                        <h3 className="font-semibold text-surface-900">Filters</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-surface-500 hover:text-primary-600"
                    >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                    </Button>
                </div>
                <p className="text-sm text-surface-500 mt-1">
                    {filteredCount} {filteredCount === 1 ? 'flight' : 'flights'} found
                </p>
            </div>

            <div className="p-4 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* Stops Filter */}
                <div>
                    <h4 className="font-medium text-surface-900 mb-3 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-surface-400" />
                        Stops
                    </h4>
                    <div className="space-y-2">
                        {STOP_OPTIONS.map((option) => (
                            <Checkbox
                                key={option.value}
                                checked={filters.stops.includes(option.value)}
                                onChange={(checked) => handleStopToggle(option.value, checked)}
                                label={option.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Direct Only - Quick Toggle */}
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <div className="flex-1 mr-4">
                        <p className="font-medium text-surface-900">Direct Flights Only</p>
                        <p className="text-xs text-surface-500">Show only non-stop flights</p>
                    </div>
                    <button
                        onClick={() => updateFilter('directOnly', !filters.directOnly)}
                        className={cn(
                            'relative flex-shrink-0 w-14 h-7 rounded-full transition-all duration-300 border-2',
                            filters.directOnly
                                ? 'bg-primary-600 border-primary-600'
                                : 'bg-surface-200 border-surface-300'
                        )}
                        aria-label="Toggle direct flights only"
                    >
                        <span
                            className={cn(
                                'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300',
                                filters.directOnly ? 'left-7' : 'left-0.5'
                            )}
                        />
                    </button>
                </div>

                {/* Max Duration Filter */}
                <div>
                    <h4 className="font-medium text-surface-900 mb-3">Max Flight Duration</h4>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min={0}
                            max={1440}
                            step={30}
                            value={filters.maxDuration}
                            onChange={(e) => updateFilter('maxDuration', Number(e.target.value))}
                            className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-sm">
                            <span className="text-surface-500">
                                {filters.maxDuration === 0 ? 'Any duration' : `Max ${Math.floor(filters.maxDuration / 60)}h ${filters.maxDuration % 60}m`}
                            </span>
                            {filters.maxDuration > 0 && (
                                <button
                                    onClick={() => updateFilter('maxDuration', 0)}
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price Range Filter */}
                <div>
                    <h4 className="font-medium text-surface-900 mb-3">Price Range</h4>
                    <RangeSlider
                        min={priceRange[0]}
                        max={priceRange[1]}
                        value={filters.priceRange}
                        onChange={(value) => updateFilter('priceRange', value)}
                        step={10}
                        formatValue={(v) => formatPrice(v)}
                        showManualInput={true}
                    />
                </div>

                {/* Departure Time Filter */}
                <div>
                    <h4 className="font-medium text-surface-900 mb-3">Departure Time</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map((slot) => (
                            <button
                                key={slot.value}
                                onClick={() =>
                                    handleTimeSlotToggle(
                                        slot.value,
                                        !filters.departureTimes.includes(slot.value)
                                    )
                                }
                                className={cn(
                                    'p-2 rounded-lg border text-center transition-all duration-200',
                                    filters.departureTimes.includes(slot.value)
                                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                                        : 'bg-white border-surface-200 text-surface-600 hover:border-primary-200'
                                )}
                            >
                                <div className="text-sm font-medium">{slot.label}</div>
                                <div className="text-xs opacity-70">{slot.time}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Airlines Filter */}
                {availableAirlines.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-surface-900">Airlines</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSelectAllAirlines}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    All
                                </button>
                                <span className="text-surface-300">|</span>
                                <button
                                    onClick={handleClearAllAirlines}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    None
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {availableAirlines.map((airline) => {
                                const postFilterCount = airlineCountsPostFilter[airline.code] || 0;
                                const isDimmed = postFilterCount === 0;
                                return (
                                    <div
                                        key={airline.code}
                                        className={cn(
                                            "flex items-center justify-between transition-opacity duration-200",
                                            isDimmed && "opacity-40"
                                        )}
                                    >
                                        <Checkbox
                                            checked={filters.airlines.includes(airline.code)}
                                            onChange={(checked) => handleAirlineToggle(airline.code, checked)}
                                            label={airline.name}
                                        />
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            isDimmed
                                                ? "text-surface-300 bg-surface-50"
                                                : "text-surface-400 bg-surface-100"
                                        )}>
                                            {postFilterCount}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Apply Button */}
            {isMobile && onClose && (
                <div className="p-4 border-t border-surface-200 bg-surface-50">
                    <Button onClick={onClose} className="w-full">
                        Apply Filters ({filteredCount} results)
                    </Button>
                </div>
            )}
        </div>
    );
}
