# ✈️ FlightDeck - Smart Flight Search Engine

A modern, responsive flight search engine built with React, TypeScript, and the Amadeus API. Features real-time price visualization, interactive D3.js charts, and instant filter synchronization.

![FlightDeck](https://via.placeholder.com/800x400?text=FlightDeck+Demo)

## 🚀 Features

- **Smart Search**: Autocomplete for worldwide airports with real-time API integration
- **Advanced Visualizations**: Interactive D3.js Scatter Plots and Price Distribution histograms
- **Instant Filtering**: Filter by max duration, direct flights, stops, and airlines
- **Detailed Itineraries**: Comprehensive modal view with layover calculations and aircraft info
- **Custom DatePicker**: Built from scratch with React Portals for a flawless UX
- **Responsive Design**: Mobile-first architecture with collapsible drawers
- **Skeleton Loading**: Polished loading states for every component

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + Shadcn UI |
| State Management | Zustand |
| Data Fetching | TanStack Query + Axios |
| Visualizations | D3.js (Advanced) + Recharts |
| Icons | Lucide React |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── RangeSlider.tsx
│   │   ├── Badge.tsx
│   │   └── Skeleton.tsx
│   ├── SearchForm.tsx   # Search with autocomplete
│   ├── FilterSidebar.tsx# Filter controls
│   ├── PriceGraph.tsx   # Recharts visualization
│   ├── FlightCard.tsx   # Flight result card
│   └── FlightList.tsx   # Results list with sorting
├── hooks/
│   └── useFlightSearch.ts  # API hooks
├── store/
│   └── flightStore.ts   # Zustand state management
├── lib/
│   ├── api.ts           # Amadeus API client
│   ├── types.ts         # TypeScript definitions
│   └── utils.ts         # Helper functions
├── App.tsx              # Main application
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Amadeus API credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flight-search-engine.git
cd flight-search-engine
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Amadeus credentials:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
VITE_AMADEUS_CLIENT_ID=your_client_id
VITE_AMADEUS_CLIENT_SECRET=your_client_secret
```

> 📝 Get your free API credentials at [developers.amadeus.com](https://developers.amadeus.com/register)

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔑 Key Implementation Details

### State Sync Architecture

The app uses Zustand for state management with a critical feature: **instant filter updates**. When any filter changes, both the flight list AND the price graph update simultaneously without re-fetching from the API.

```typescript
// Filters update derived state instantly
const getFilteredResults = () => {
  return searchResults.filter((flight) => {
    // Apply all filters client-side
    return matchesStops && matchesPrice && matchesAirline && matchesTime;
  });
};
```

### OAuth2 Token Management

The `useAmadeus` hook automatically handles token lifecycle:
- Caches tokens in memory until expiration
- Auto-refreshes 60 seconds before expiry
- Retries failed requests after token refresh

### Performance Optimizations

- **Memoized Selectors**: Filter computations use useMemo
- **Debounced Search**: Airport autocomplete debounced by 300ms
- **TanStack Query Caching**: API results cached for 5 minutes

## 📊 Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Filter Update Latency | < 200ms | ✅ |
| Time to Interactive | < 3s | ✅ |
| Mobile Usability | 100% | ✅ |
| Lighthouse Score | > 90 | ✅ |

## 📚 Documentation

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Software Requirements Specification (SRS)](./docs/SRS.md)
- [User Stories](./docs/USER_STORIES.md)

## 🚀 Deployment

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ for Spotter Technical Assessment
