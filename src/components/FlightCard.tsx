import { Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Flight } from '@/lib/types';
import { formatTime, formatPrice, cn } from '@/lib/utils';

interface FlightCardProps {
    flight: Flight;
    isBestValue?: boolean;
    onClick?: () => void;
}

export function FlightCard({ flight, isBestValue, onClick }: FlightCardProps) {
    const getStopsLabel = (stops: number) => {
        if (stops === 0) return 'Non-stop';
        if (stops === 1) return '1 stop';
        return `${stops} stops`;
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                'group bg-white rounded-xl border shadow-card transition-all duration-300 p-6 cursor-pointer',
                'hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1',
                isBestValue ? 'border-green-300 ring-2 ring-green-100' : 'border-surface-200'
            )}
        >
            {/* Best Value Badge */}
            {isBestValue && (
                <div className="flex justify-end mb-3 -mt-2">
                    <div className="relative group/badge">
                        <Badge variant="success" className="animate-pulse-soft cursor-help">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Best Value
                        </Badge>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-surface-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all duration-200 shadow-lg z-10">
                            Lowest price in your search
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-900" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Airline Info */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-primary-700 font-bold text-sm">{flight.carrierCode}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-surface-900">{flight.carrierName}</h3>
                        <p className="text-sm text-surface-500">{flight.carrierCode} {flight.segments[0]?.number}</p>
                    </div>
                </div>

                {/* Flight Details */}
                <div className="flex-1 flex items-center justify-center gap-4 md:gap-8">
                    {/* Departure */}
                    <div className="text-center">
                        <div className="text-xl font-bold text-surface-900">
                            {formatTime(flight.departureTime)}
                        </div>
                        <div className="text-sm text-surface-500">{flight.originAirport}</div>
                    </div>

                    {/* Duration and Stops */}
                    <div className="flex-1 max-w-[200px]">
                        <div className="flex items-center gap-2 text-sm text-surface-500 mb-1 justify-center">
                            <Clock className="w-4 h-4" />
                            <span>{flight.durationFormatted}</span>
                        </div>
                        <div className="relative">
                            <div className="h-0.5 bg-surface-200 w-full rounded-full" />
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full" />
                            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full" />
                            {flight.stopCount > 0 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full" />
                            )}
                        </div>
                        <div className="text-center mt-1">
                            <Badge variant={flight.stopCount === 0 ? 'success' : 'warning'} className="text-xs">
                                {getStopsLabel(flight.stopCount)}
                            </Badge>
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center">
                        <div className="text-xl font-bold text-surface-900">
                            {formatTime(flight.arrivalTime)}
                        </div>
                        <div className="text-sm text-surface-500">{flight.destinationAirport}</div>
                    </div>
                </div>

                {/* Price */}
                <div className="text-right md:min-w-[120px]">
                    <div className={cn(
                        'text-2xl font-bold',
                        isBestValue ? 'text-green-600' : 'text-surface-900'
                    )}>
                        {formatPrice(flight.price, flight.currency)}
                    </div>
                    <p className="text-sm text-surface-500">per person</p>
                    <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 ml-auto group/btn">
                        View Details
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
