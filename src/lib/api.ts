import axios from 'axios';

// Amadeus API base URL (Test environment)
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

// Create axios instance for Amadeus API
export const amadeusApi = axios.create({
    baseURL: AMADEUS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token storage
let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

// Get or refresh OAuth token
export async function getAmadeusToken(): Promise<string> {
    // Check if token is still valid (with 60s buffer)
    if (accessToken && tokenExpiresAt > Date.now() + 60000) {
        return accessToken;
    }

    const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Amadeus API credentials not configured. Please set VITE_AMADEUS_CLIENT_ID and VITE_AMADEUS_CLIENT_SECRET in .env');
    }

    const response = await axios.post(
        `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

    return accessToken || '';
}

// Request interceptor to add Bearer token
amadeusApi.interceptors.request.use(async (config) => {
    const token = await getAmadeusToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor for error handling
amadeusApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired, clear and retry
            accessToken = null;
            tokenExpiresAt = 0;
            const token = await getAmadeusToken();
            error.config.headers.Authorization = `Bearer ${token}`;
            return axios(error.config);
        }

        if (error.response?.status === 429) {
            throw new Error('API rate limit exceeded. Please try again in a moment.');
        }

        throw error;
    }
);

// API endpoints
export const flightApi = {
    // Search for flight offers
    searchFlights: async (params: {
        origin: string;
        destination: string;
        departureDate: string;
        returnDate?: string;
        adults: number;
    }) => {
        const response = await amadeusApi.get('/v2/shopping/flight-offers', {
            params: {
                originLocationCode: params.origin,
                destinationLocationCode: params.destination,
                departureDate: params.departureDate,
                returnDate: params.returnDate,
                adults: params.adults,
                max: 50,
                currencyCode: 'USD',
            },
        });
        return response.data;
    },

    // Search for airports/cities (autocomplete) - not used, we use local database instead
    searchLocations: async (keyword: string) => {
        const response = await amadeusApi.get('/v1/reference-data/locations', {
            params: {
                keyword,
                subType: 'AIRPORT,CITY',
                'page[limit]': 20,
                view: 'FULL',
            },
        });
        return response.data;
    },
};
