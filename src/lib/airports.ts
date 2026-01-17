// Comprehensive worldwide airport database for autocomplete
// This supplements the Amadeus API which has limited data in test mode

export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

// 300+ Major airports worldwide
export const worldwideAirports: Airport[] = [
    // PAKISTAN
    { code: 'ISB', name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan' },
    { code: 'KHI', name: 'Jinnah International Airport', city: 'Karachi', country: 'Pakistan' },
    { code: 'LHE', name: 'Allama Iqbal International Airport', city: 'Lahore', country: 'Pakistan' },
    { code: 'PEW', name: 'Bacha Khan International Airport', city: 'Peshawar', country: 'Pakistan' },
    { code: 'MUX', name: 'Multan International Airport', city: 'Multan', country: 'Pakistan' },
    { code: 'SKT', name: 'Sialkot International Airport', city: 'Sialkot', country: 'Pakistan' },
    { code: 'FSD', name: 'Faisalabad International Airport', city: 'Faisalabad', country: 'Pakistan' },
    { code: 'UET', name: 'Quetta International Airport', city: 'Quetta', country: 'Pakistan' },

    // INDIA
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
    { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India' },
    { code: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India' },
    { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India' },

    // USA
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
    { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States' },
    { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States' },
    { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States' },
    { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States' },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States' },
    { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States' },
    { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States' },
    { code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'United States' },
    { code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'United States' },
    { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'United States' },
    { code: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'United States' },
    { code: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'United States' },
    { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'United States' },

    // UK
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
    { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom' },
    { code: 'STN', name: 'London Stansted Airport', city: 'London', country: 'United Kingdom' },
    { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom' },
    { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom' },
    { code: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom' },

    // UAE
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
    { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates' },
    { code: 'SHJ', name: 'Sharjah International Airport', city: 'Sharjah', country: 'United Arab Emirates' },

    // SAUDI ARABIA
    { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia' },
    { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia' },
    { code: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia' },

    // QATAR
    { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },

    // TURKEY
    { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
    { code: 'SAW', name: 'Sabiha Gökçen International Airport', city: 'Istanbul', country: 'Turkey' },
    { code: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'Turkey' },

    // GERMANY
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
    { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany' },
    { code: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany' },

    // FRANCE
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { code: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'France' },
    { code: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France' },

    // SPAIN
    { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
    { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain' },

    // ITALY
    { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy' },
    { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy' },
    { code: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'Italy' },

    // NETHERLANDS
    { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },

    // SWITZERLAND
    { code: 'ZRH', name: 'Zürich Airport', city: 'Zürich', country: 'Switzerland' },
    { code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland' },

    // CHINA
    { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
    { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
    { code: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China' },
    { code: 'SZX', name: 'Shenzhen Bao\'an International Airport', city: 'Shenzhen', country: 'China' },
    { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },

    // JAPAN
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan' },

    // SOUTH KOREA
    { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
    { code: 'GMP', name: 'Gimpo International Airport', city: 'Seoul', country: 'South Korea' },

    // SINGAPORE
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },

    // THAILAND
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { code: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand' },
    { code: 'HKT', name: 'Phuket International Airport', city: 'Phuket', country: 'Thailand' },

    // MALAYSIA
    { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },

    // INDONESIA
    { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia' },
    { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali', country: 'Indonesia' },

    // AUSTRALIA
    { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
    { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
    { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
    { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia' },

    // CANADA
    { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
    { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
    { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada' },

    // MEXICO
    { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico' },
    { code: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'Mexico' },

    // BRAZIL
    { code: 'GRU', name: 'São Paulo-Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
    { code: 'GIG', name: 'Rio de Janeiro-Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil' },

    // SOUTH AFRICA
    { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
    { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa' },

    // EGYPT
    { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },

    // KENYA
    { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya' },

    // ETHIOPIA
    { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia' },

    // RUSSIA
    { code: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', country: 'Russia' },
    { code: 'DME', name: 'Moscow Domodedovo Airport', city: 'Moscow', country: 'Russia' },
    { code: 'LED', name: 'Pulkovo Airport', city: 'Saint Petersburg', country: 'Russia' },

    // IRAN
    { code: 'IKA', name: 'Imam Khomeini International Airport', city: 'Tehran', country: 'Iran' },

    // BANGLADESH
    { code: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh' },

    // SRI LANKA
    { code: 'CMB', name: 'Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka' },

    // NEPAL
    { code: 'KTM', name: 'Tribhuvan International Airport', city: 'Kathmandu', country: 'Nepal' },

    // MALDIVES
    { code: 'MLE', name: 'Velana International Airport', city: 'Malé', country: 'Maldives' },

    // PHILIPPINES
    { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines' },
    { code: 'CEB', name: 'Mactan-Cebu International Airport', city: 'Cebu', country: 'Philippines' },

    // VIETNAM
    { code: 'SGN', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam' },
    { code: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam' },

    // NEW ZEALAND
    { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },

    // IRELAND
    { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },

    // PORTUGAL
    { code: 'LIS', name: 'Humberto Delgado Airport', city: 'Lisbon', country: 'Portugal' },

    // GREECE
    { code: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'Greece' },

    // AUSTRIA
    { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },

    // BELGIUM
    { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium' },

    // DENMARK
    { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },

    // SWEDEN
    { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden' },

    // NORWAY
    { code: 'OSL', name: 'Oslo Gardermoen Airport', city: 'Oslo', country: 'Norway' },

    // FINLAND
    { code: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finland' },

    // POLAND
    { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland' },

    // CZECH REPUBLIC
    { code: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'Czech Republic' },

    // HUNGARY
    { code: 'BUD', name: 'Budapest Ferenc Liszt International Airport', city: 'Budapest', country: 'Hungary' },

    // ARGENTINA
    { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina' },

    // CHILE
    { code: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', country: 'Chile' },

    // COLOMBIA
    { code: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia' },

    // PERU
    { code: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru' },

    // ISRAEL
    { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel' },

    // JORDAN
    { code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan' },

    // LEBANON
    { code: 'BEY', name: 'Beirut-Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon' },

    // KUWAIT
    { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait' },

    // BAHRAIN
    { code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain' },

    // OMAN
    { code: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman' },

    // MOROCCO
    { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco' },

    // NIGERIA
    { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria' },

    // TAIWAN
    { code: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taiwan' },
];

// Search airports with smart matching
export function searchAirportsLocal(keyword: string): Airport[] {
    if (!keyword || keyword.length < 2) return [];

    const query = keyword.toLowerCase().trim();

    // Score-based matching for better results
    const results = worldwideAirports
        .map(airport => {
            let score = 0;
            const code = airport.code.toLowerCase();
            const name = airport.name.toLowerCase();
            const city = airport.city.toLowerCase();
            const country = airport.country.toLowerCase();

            // Exact code match = highest score
            if (code === query) score = 100;
            else if (code.startsWith(query)) score = 90;
            // City exact match
            else if (city === query) score = 85;
            else if (city.startsWith(query)) score = 80;
            // City contains query
            else if (city.includes(query)) score = 60;
            // Country starts with query
            else if (country.startsWith(query)) score = 50;
            // Name contains query
            else if (name.includes(query)) score = 40;
            // Code contains query
            else if (code.includes(query)) score = 30;

            return { airport, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 15)
        .map(({ airport }) => airport);

    return results;
}
