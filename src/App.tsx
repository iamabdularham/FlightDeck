import { useState, Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Compass, Menu, X, Sparkles } from 'lucide-react';
import { SearchForm } from '@/components/SearchForm';
import { FilterSidebar } from '@/components/FilterSidebar';
import { FlightList } from '@/components/FlightList';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { useFlightStore } from '@/store/flightStore';
import { cn } from '@/lib/utils';

// Lazy load heavy D3 chart component
const PriceGraph = lazy(() => import('@/components/D3PriceChart').then(module => ({ default: module.PriceGraph })));

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
        },
    },
});

function AppContent() {
    const { hasSearched } = useFlightStore();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                                    <Compass className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-surface-900">
                                    Flight<span className="text-primary-600">Deck</span>
                                </h1>
                                <p className="text-[10px] text-surface-500 font-medium tracking-wide uppercase">
                                    Smart Travel Search
                                </p>
                            </div>
                        </div>

                        {/* Nav Links - Desktop */}
                        <nav className="hidden md:flex items-center gap-1">
                            {['Explore', 'Deals', 'About'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Mobile Filter Toggle */}
                        {hasSearched && (
                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="lg:hidden p-2.5 rounded-xl bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
                                aria-label="Toggle filters"
                            >
                                {isMobileFilterOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden hero-gradient">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
                    <div className="absolute top-40 right-20 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center mb-10 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
                            <Sparkles className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-primary-700">Compare prices from 100+ airlines</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mb-4 text-balance">
                            Find Your Perfect Flight
                        </h2>
                        <p className="text-lg text-surface-600 max-w-2xl mx-auto text-balance">
                            Search, compare, and discover the best flight deals with real-time price visualization
                        </p>
                    </div>
                    <div className="animate-slide-up">
                        <SearchForm />
                    </div>
                </div>
            </section>

            {/* Results Section */}
            {hasSearched && (
                <section className="flex-1 bg-surface-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Filter Sidebar - Desktop */}
                            <aside className="hidden lg:block">
                                <div className="sticky top-24">
                                    <FilterSidebar />
                                </div>
                            </aside>

                            {/* Main Content */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Price Graph */}
                                <Suspense fallback={<ChartSkeleton />}>
                                    <PriceGraph />
                                </Suspense>

                                {/* Flight List */}
                                <FlightList />
                            </div>
                        </div>

                        {/* Mobile Filter Drawer */}
                        <div
                            className={cn(
                                'fixed inset-0 z-50 lg:hidden transition-all duration-300',
                                isMobileFilterOpen ? 'visible' : 'invisible'
                            )}
                        >
                            {/* Backdrop */}
                            <div
                                className={cn(
                                    'absolute inset-0 bg-surface-900/60 backdrop-blur-sm transition-opacity duration-300',
                                    isMobileFilterOpen ? 'opacity-100' : 'opacity-0'
                                )}
                                onClick={() => setIsMobileFilterOpen(false)}
                            />

                            {/* Drawer */}
                            <div
                                className={cn(
                                    'absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl transition-transform duration-300 ease-out-expo overflow-hidden',
                                    isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'
                                )}
                            >
                                <div className="w-12 h-1.5 bg-surface-300 rounded-full mx-auto mt-3" />
                                <FilterSidebar
                                    isMobile
                                    onClose={() => setIsMobileFilterOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-surface-900 text-surface-300 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                    <Compass className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">FlightDeck</span>
                            </div>
                            <p className="text-surface-400 max-w-md">
                                Discover the best flight deals with our smart search engine. Compare prices,
                                visualize trends, and book with confidence.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {['Search Flights', 'Popular Routes', 'Travel Tips'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-primary-400 transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Tech Stack</h4>
                            <ul className="space-y-2 text-surface-400 text-sm">
                                <li>React + TypeScript</li>
                                <li>Tailwind CSS</li>
                                <li>Recharts + Zustand</li>
                                <li>Amadeus API</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-surface-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-surface-500 text-sm">
                            © 2026 FlightDeck. Built with ❤️ for Spotter Assessment.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <a href="#" className="text-surface-400 hover:text-primary-400 transition-colors">Privacy</a>
                            <a href="#" className="text-surface-400 hover:text-primary-400 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <AppContent />
            </ErrorBoundary>
        </QueryClientProvider>
    );
}
