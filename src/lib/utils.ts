import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Flight, FlightOffer, ChartDataPoint, TimeSlot } from './types';

// Tailwind class merge utility
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Parse ISO 8601 duration to minutes
export function parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    return hours * 60 + minutes;
}

// Format duration for display
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Format time from ISO string
export function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

// Format date for display
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

// Format price with currency
export function formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(price);
}

// Get time slot from hour
export function getTimeSlot(isoString: string): TimeSlot {
    const hour = new Date(isoString).getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    return 'night';
}

// Check if departure time is in time slot
export function isInTimeSlot(isoString: string, slot: TimeSlot): boolean {
    return getTimeSlot(isoString) === slot;
}

// Normalize Amadeus API response to our Flight type
export function normalizeFlightOffer(
    offer: FlightOffer,
    carriers: Record<string, string>
): Flight {
    const firstItinerary = offer.itineraries[0];
    const segments = firstItinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    const durationMinutes = parseDuration(firstItinerary.duration);

    return {
        id: offer.id,
        carrierCode: offer.validatingAirlineCodes[0],
        carrierName: carriers[offer.validatingAirlineCodes[0]] || offer.validatingAirlineCodes[0],
        price: parseFloat(offer.price.grandTotal),
        currency: offer.price.currency,
        departureTime: firstSegment.departure.at,
        arrivalTime: lastSegment.arrival.at,
        duration: durationMinutes,
        durationFormatted: formatDuration(durationMinutes),
        stopCount: segments.length - 1,
        originAirport: firstSegment.departure.iataCode,
        destinationAirport: lastSegment.arrival.iataCode,
        segments,
    };
}

// Transform flights to chart data (grouped by airline)
export function transformToChartData(flights: Flight[]): ChartDataPoint[] {
    const grouped = flights.reduce((acc, flight) => {
        const key = flight.carrierCode;
        if (!acc[key]) {
            acc[key] = {
                name: flight.carrierName,
                prices: [],
                carrierCode: key,
            };
        }
        acc[key].prices.push(flight.price);
        return acc;
    }, {} as Record<string, { name: string; prices: number[]; carrierCode: string }>);

    return Object.values(grouped).map((group) => ({
        name: group.name,
        price: Math.min(...group.prices),
        count: group.prices.length,
        carrierCode: group.carrierCode,
    })).sort((a, b) => a.price - b.price);
}

// Get unique airlines from flights
export function getUniqueAirlines(flights: Flight[]): { code: string; name: string; count: number }[] {
    const airlineMap = flights.reduce((acc, flight) => {
        if (!acc[flight.carrierCode]) {
            acc[flight.carrierCode] = {
                code: flight.carrierCode,
                name: flight.carrierName,
                count: 0,
            };
        }
        acc[flight.carrierCode].count++;
        return acc;
    }, {} as Record<string, { code: string; name: string; count: number }>);

    return Object.values(airlineMap).sort((a, b) => b.count - a.count);
}

// Get price range from flights
export function getPriceRange(flights: Flight[]): [number, number] {
    if (flights.length === 0) return [0, 1000];
    const prices = flights.map((f) => f.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
