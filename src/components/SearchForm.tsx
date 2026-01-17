import { useState, useRef, useEffect } from 'react';
import { Plane, MapPin, Users, ArrowRightLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { useAirportSearch, useFlightSearch } from '@/hooks/useFlightSearch';
import { useFlightStore } from '@/store/flightStore';
import { cn, debounce } from '@/lib/utils';

interface AirportOption {
    code: string;
    name: string;
    city: string;
    country: string;
}

function AirportAutocomplete({
    value,
    onChange,
    placeholder,
    label,
    icon,
}: {
    value: string;
    onChange: (code: string, display: string) => void;
    placeholder: string;
    label: string;
    icon: React.ReactNode;
}) {
    const [query, setQuery] = useState('');
    const [displayValue, setDisplayValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const id = `airport-${label.toLowerCase().replace(/\s+/g, '-')}`;

    const { data: airports = [], isLoading } = useAirportSearch(query);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = debounce((value: string) => {
        setQuery(value);
    }, 300);

    const handleSelect = (airport: AirportOption) => {
        const display = `${airport.code} - ${airport.city || airport.name}`;
        setDisplayValue(display);
        onChange(airport.code, display);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div ref={wrapperRef} className="relative flex-1">
            <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                    {icon}
                </div>
                <input
                    id={id}
                    type="text"
                    value={displayValue}
                    onChange={(e) => {
                        setDisplayValue(e.target.value);
                        handleInputChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={cn(
                        'w-full rounded-lg border border-surface-300 bg-white pl-10 pr-4 py-3 text-surface-900 placeholder:text-surface-400',
                        'transition-all duration-200',
                        'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                    )}
                />
            </div>

            {isOpen && (query.length >= 2 || airports.length > 0) && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-surface-200 shadow-lg max-h-60 overflow-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-surface-500">
                            <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
                        </div>
                    ) : airports.length > 0 ? (
                        airports.map((airport: AirportOption) => (
                            <button
                                key={airport.code}
                                onClick={() => handleSelect(airport)}
                                className="w-full px-4 py-3 text-left hover:bg-surface-50 transition-colors flex items-center gap-3 border-b border-surface-100 last:border-0"
                            >
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-primary-700 font-semibold text-sm">{airport.code}</span>
                                </div>
                                <div>
                                    <div className="font-medium text-surface-900">{airport.name}</div>
                                    <div className="text-sm text-surface-500">{airport.city}, {airport.country}</div>
                                </div>
                            </button>
                        ))
                    ) : query.length >= 2 ? (
                        <div className="p-4 text-center text-surface-500">No airports found</div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export function SearchForm() {
    const [origin, setOrigin] = useState('');
    const [originDisplay, setOriginDisplay] = useState('');
    const [destination, setDestination] = useState('');
    const [destinationDisplay, setDestinationDisplay] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');

    const { searchFlights } = useFlightSearch();
    const { isLoading, error } = useFlightStore();

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!origin || !destination || !departureDate) {
            return;
        }

        const params = {
            origin,
            destination,
            departureDate,
            returnDate: tripType === 'round-trip' ? returnDate : undefined,
            passengers,
            tripType,
        };

        try {
            await searchFlights(params);
        } catch {
            // Error is handled in the store
        }
    };

    const swapLocations = () => {
        const tempCode = origin;
        const tempDisplay = originDisplay;
        setOrigin(destination);
        setOriginDisplay(destinationDisplay);
        setDestination(tempCode);
        setDestinationDisplay(tempDisplay);
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-glass border border-white/20 p-6 md:p-8">
            {/* Trip Type Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setTripType('round-trip')}
                    className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                        tripType === 'round-trip'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    )}
                >
                    Round Trip
                </button>
                <button
                    onClick={() => setTripType('one-way')}
                    className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                        tripType === 'one-way'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    )}
                >
                    One Way
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Row 1: Origin, Swap, Destination */}
                <div className="flex items-end gap-2 mb-4">
                    <AirportAutocomplete
                        value={originDisplay}
                        onChange={(code, display) => {
                            setOrigin(code);
                            setOriginDisplay(display);
                        }}
                        placeholder="Where from?"
                        label="From"
                        icon={<MapPin className="w-5 h-5" />}
                    />

                    <button
                        type="button"
                        onClick={swapLocations}
                        aria-label="Swap origin and destination"
                        className="mb-0.5 p-3 rounded-full bg-surface-100 hover:bg-surface-200 text-surface-600 transition-all duration-200 hover:rotate-180 flex-shrink-0"
                    >
                        <ArrowRightLeft className="w-5 h-5" />
                    </button>

                    <AirportAutocomplete
                        value={destinationDisplay}
                        onChange={(code, display) => {
                            setDestination(code);
                            setDestinationDisplay(display);
                        }}
                        placeholder="Where to?"
                        label="To"
                        icon={<Plane className="w-5 h-5" />}
                    />
                </div>

                {/* Row 2: Departure, Return (if round trip), Passengers */}
                <div className={`grid gap-4 mb-6 ${tripType === 'round-trip' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {/* Departure Date */}
                    <DatePicker
                        label="Departure"
                        value={departureDate}
                        onChange={setDepartureDate}
                        minDate={today}
                        placeholder="Select departure"
                    />

                    {/* Return Date - only shown for round trip */}
                    {tripType === 'round-trip' && (
                        <DatePicker
                            label="Return"
                            value={returnDate}
                            onChange={setReturnDate}
                            minDate={departureDate || today}
                            placeholder="Select return"
                        />
                    )}

                    {/* Passengers */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1.5">
                            Passengers
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <select
                                value={passengers}
                                onChange={(e) => setPassengers(Number(e.target.value))}
                                className={cn(
                                    'w-full rounded-lg border border-surface-300 bg-white pl-10 pr-4 py-3 text-surface-900',
                                    'transition-all duration-200 appearance-none',
                                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                                )}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? 'Passenger' : 'Passengers'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                    disabled={!origin || !destination || !departureDate}
                    className="w-full md:w-auto md:min-w-[200px]"
                >
                    <Search className="w-5 h-5 mr-2" />
                    Search Flights
                </Button>
            </form>
        </div>
    );
}
