// Flight data types based on Amadeus API response

export interface Airport {
    iataCode: string;
    name: string;
    cityName: string;
    countryCode: string;
}

export interface FlightSegment {
    departure: {
        iataCode: string;
        terminal?: string;
        at: string;
    };
    arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
    };
    carrierCode: string;
    number: string;
    aircraft: {
        code: string;
    };
    duration: string;
    numberOfStops: number;
}

export interface FlightItinerary {
    duration: string;
    segments: FlightSegment[];
}

export interface FlightPrice {
    currency: string;
    total: string;
    base: string;
    grandTotal: string;
}

export interface FlightOffer {
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    itineraries: FlightItinerary[];
    price: FlightPrice;
    pricingOptions: {
        fareType: string[];
        includedCheckedBagsOnly: boolean;
    };
    validatingAirlineCodes: string[];
    travelerPricings: unknown[];
}

// Normalized flight data for our app
export interface Flight {
    id: string;
    carrierCode: string;
    carrierName: string;
    price: number;
    currency: string;
    departureTime: string;
    arrivalTime: string;
    duration: number; // minutes
    durationFormatted: string;
    stopCount: number;
    originAirport: string;
    destinationAirport: string;
    segments: FlightSegment[];
}

// Search parameters
export interface SearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    tripType: 'one-way' | 'round-trip';
}

// Filter state
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface FilterState {
    stops: number[];
    priceRange: [number, number];
    airlines: string[];
    departureTimes: TimeSlot[];
    maxDuration: number; // in minutes, 0 = no limit
    directOnly: boolean;
    sortBy: 'price' | 'duration' | 'departure' | 'arrival';
}

// Chart data for Recharts
export interface ChartDataPoint {
    name: string;
    price: number;
    count: number;
    carrierCode: string;
}

// API Response types
export interface AmadeusTokenResponse {
    type: string;
    username: string;
    application_name: string;
    client_id: string;
    token_type: string;
    access_token: string;
    expires_in: number;
    state: string;
    scope: string;
}

export interface AmadeusFlightResponse {
    meta: {
        count: number;
        links: {
            self: string;
        };
    };
    data: FlightOffer[];
    dictionaries: {
        carriers: Record<string, string>;
        aircraft: Record<string, string>;
        currencies: Record<string, string>;
        locations: Record<string, { cityCode: string; countryCode: string }>;
    };
}

export interface AmadeusLocationResponse {
    data: Array<{
        type: string;
        subType: string;
        name: string;
        detailedName: string;
        id: string;
        iataCode: string;
        address: {
            cityName: string;
            cityCode: string;
            countryName: string;
            countryCode: string;
        };
    }>;
}
