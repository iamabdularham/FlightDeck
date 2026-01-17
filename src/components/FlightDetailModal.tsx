import { X, Plane, Clock, Calendar, Users, Briefcase, ChevronRight } from 'lucide-react';
import { Flight, FlightSegment } from '@/lib/types';
import { formatPrice, formatTime, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface FlightDetailModalProps {
    flight: Flight;
    isOpen: boolean;
    onClose: () => void;
    isBestValue?: boolean;
}

// Helper function to calculate layover duration between segments
function calculateLayoverDuration(currentSegment: FlightSegment, nextSegment: FlightSegment): string {
    const arrivalTime = new Date(currentSegment.arrival.at).getTime();
    const departureTime = new Date(nextSegment.departure.at).getTime();
    const durationMs = departureTime - arrivalTime;

    if (durationMs <= 0) return '';

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}m`;
    }
}

export function FlightDetailModal({ flight, isOpen, onClose, isBestValue }: FlightDetailModalProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Plane className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{flight.carrierName}</h2>
                                    <p className="text-primary-100 text-sm">{flight.carrierCode}</p>
                                </div>
                            </div>
                            {isBestValue && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">
                                    ⭐ Best Value
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Route Summary */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-surface-900">{flight.originAirport}</p>
                            <p className="text-sm text-surface-500">{formatTime(flight.departureTime)}</p>
                            <p className="text-xs text-surface-400">{formatDate(flight.departureTime)}</p>
                        </div>

                        <div className="flex-1 px-6">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-full border-t-2 border-dashed border-surface-300" />
                                <div className="relative bg-white px-4 py-2 flex flex-col items-center">
                                    <Clock className="w-5 h-5 text-surface-400 mb-1" />
                                    <span className="text-sm font-medium text-surface-700">{flight.durationFormatted}</span>
                                    <span className="text-xs text-surface-500">
                                        {flight.stopCount === 0 ? 'Non-stop' : `${flight.stopCount} stop${flight.stopCount > 1 ? 's' : ''}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-3xl font-bold text-surface-900">{flight.destinationAirport}</p>
                            <p className="text-sm text-surface-500">{formatTime(flight.arrivalTime)}</p>
                            <p className="text-xs text-surface-400">{formatDate(flight.arrivalTime)}</p>
                        </div>
                    </div>

                    {/* Flight Segments */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary-500" />
                            Flight Itinerary
                        </h3>

                        <div className="space-y-4">
                            {flight.segments.map((segment, index) => (
                                <div key={index} className="relative">
                                    {/* Connection line */}
                                    {index < flight.segments.length - 1 && (
                                        <div className="absolute left-6 top-full h-8 w-0.5 bg-surface-200" />
                                    )}

                                    <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                                <Plane className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-surface-900">
                                                    {segment.carrierCode} {segment.number}
                                                </p>
                                                <p className="text-sm text-surface-500">
                                                    Aircraft: {segment.aircraft?.code || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                                                    <span className="font-semibold text-surface-900">
                                                        {segment.departure.iataCode}
                                                    </span>
                                                    <span className="text-sm text-surface-500">
                                                        {formatTime(segment.departure.at)}
                                                    </span>
                                                </div>
                                                <div className="ml-1.5 pl-4 border-l-2 border-dashed border-surface-300 py-2">
                                                    <span className="text-xs text-surface-400">
                                                        {segment.duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || flight.durationFormatted}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full border-2 border-primary-500" />
                                                    <span className="font-semibold text-surface-900">
                                                        {segment.arrival.iataCode}
                                                    </span>
                                                    <span className="text-sm text-surface-500">
                                                        {formatTime(segment.arrival.at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Layover info */}
                                    {index < flight.segments.length - 1 && (
                                        <div className="py-4 pl-14 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                            <span className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                {calculateLayoverDuration(segment, flight.segments[index + 1])} layover at {segment.arrival.iataCode}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Info */}
                    <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-surface-400" />
                                <div>
                                    <p className="text-xs text-surface-500">Passengers</p>
                                    <p className="font-medium text-surface-900">1 Adult</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-surface-400" />
                                <div>
                                    <p className="text-xs text-surface-500">Class</p>
                                    <p className="font-medium text-surface-900">Economy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-surface-200 p-6 bg-surface-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-surface-500">Total Price</p>
                            <p className="text-3xl font-bold text-primary-600">
                                {formatPrice(flight.price, flight.currency)}
                            </p>
                        </div>
                        <button
                            className={cn(
                                'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white',
                                'bg-primary-600 hover:bg-primary-700 transition-colors',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                            )}
                        >
                            Book Now
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
