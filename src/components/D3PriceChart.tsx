import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useFlightStore } from '@/store/flightStore';
import { Flight } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { TrendingUp, BarChart3, ScatterChart } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChartType = 'scatter' | 'distribution' | 'airline';

export function D3PriceChart() {
    const { hasSearched, isLoading, getFilteredResults } = useFlightStore();
    const [activeChart, setActiveChart] = useState<ChartType>('scatter');
    const [hoveredFlight, setHoveredFlight] = useState<Flight | null>(null);

    const flights = getFilteredResults();

    if (isLoading) {
        return <ChartSkeleton />;
    }

    if (!hasSearched || flights.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-card">
            {/* Chart Type Selector */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-surface-900">Price Analysis</h3>
                    <p className="text-sm text-surface-500">Interactive D3 visualizations</p>
                </div>
                <div className="flex gap-1 bg-surface-100 rounded-lg p-1">
                    {[
                        { type: 'scatter' as ChartType, icon: ScatterChart, label: 'Scatter' },
                        { type: 'distribution' as ChartType, icon: BarChart3, label: 'Distribution' },
                        { type: 'airline' as ChartType, icon: TrendingUp, label: 'By Airline' },
                    ].map(({ type, icon: Icon, label }) => (
                        <button
                            key={type}
                            onClick={() => setActiveChart(type)}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                                activeChart === type
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-surface-600 hover:text-surface-900'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="min-h-[300px]">
                {activeChart === 'scatter' && (
                    <ScatterPlot flights={flights} onHover={setHoveredFlight} />
                )}
                {activeChart === 'distribution' && (
                    <PriceDistribution flights={flights} onHover={setHoveredFlight} />
                )}
                {activeChart === 'airline' && (
                    <AirlineComparison flights={flights} onHover={setHoveredFlight} />
                )}
            </div>

            {/* Tooltip */}
            {hoveredFlight && (
                <div className="mt-4 p-4 bg-surface-50 rounded-lg border border-surface-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-surface-900">
                                {hoveredFlight.carrierName} ({hoveredFlight.carrierCode})
                            </p>
                            <p className="text-sm text-surface-500">
                                {hoveredFlight.originAirport} → {hoveredFlight.destinationAirport}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-primary-600">
                                {formatPrice(hoveredFlight.price, hoveredFlight.currency)}
                            </p>
                            <p className="text-sm text-surface-500">{hoveredFlight.durationFormatted}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Scatter Plot: Price vs Duration
function ScatterPlot({ flights, onHover }: { flights: Flight[]; onHover: (f: Flight | null) => void }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || flights.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 50, left: 70 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = 280 - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(flights, d => d.duration) || 1000])
            .range([0, width])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(flights, d => d.price) || 1000])
            .range([height, 0])
            .nice();

        // Color scale by airline
        const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
            .domain([...new Set(flights.map(f => f.carrierCode))]);

        // Grid lines
        g.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d => `${Math.floor(+d / 60)}h`))
            .selectAll('text')
            .attr('fill', '#64748b');

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d => `$${d}`))
            .selectAll('text')
            .attr('fill', '#64748b');

        // Axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 40)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('font-size', '12px')
            .text('Flight Duration');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -50)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('font-size', '12px')
            .text('Price (USD)');

        // Data points
        g.selectAll('circle')
            .data(flights)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.duration))
            .attr('cy', d => yScale(d.price))
            .attr('r', 8)
            .attr('fill', d => colorScale(d.carrierCode))
            .attr('opacity', 0.7)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseenter', (event, d) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('r', 12)
                    .attr('opacity', 1);
                onHover(d);
            })
            .on('mouseleave', (event) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('r', 8)
                    .attr('opacity', 0.7);
                onHover(null);
            });

    }, [flights, onHover]);

    return <svg ref={svgRef} className="w-full" height={280} />;
}

// Price Distribution Histogram
function PriceDistribution({ flights, onHover }: { flights: Flight[]; onHover: (f: Flight | null) => void }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || flights.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = 280 - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const prices = flights.map(f => f.price);

        // Create histogram bins
        const histogram = d3.bin()
            .domain([d3.min(prices) || 0, d3.max(prices) || 1000])
            .thresholds(10);

        const bins = histogram(prices);

        const xScale = d3.scaleLinear()
            .domain([bins[0].x0 || 0, bins[bins.length - 1].x1 || 1000])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length) || 1])
            .range([height, 0])
            .nice();

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d => `$${d}`))
            .selectAll('text')
            .attr('fill', '#64748b');

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .attr('fill', '#64748b');

        // Axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 40)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('font-size', '12px')
            .text('Price Range');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -35)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('font-size', '12px')
            .text('Number of Flights');

        // Bars with gradient
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'barGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#14b8a6');

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#0d9488');

        g.selectAll('rect')
            .data(bins)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.x0 || 0) + 1)
            .attr('y', height)
            .attr('width', d => Math.max(0, xScale(d.x1 || 0) - xScale(d.x0 || 0) - 2))
            .attr('height', 0)
            .attr('fill', 'url(#barGradient)')
            .attr('rx', 4)
            .style('cursor', 'pointer')
            .transition()
            .duration(500)
            .delay((_, i) => i * 50)
            .attr('y', d => yScale(d.length))
            .attr('height', d => height - yScale(d.length));

    }, [flights, onHover]);

    return <svg ref={svgRef} className="w-full" height={280} />;
}

// Airline Comparison Bar Chart
function AirlineComparison({ flights, onHover }: { flights: Flight[]; onHover: (f: Flight | null) => void }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || flights.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 60, left: 70 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = 280 - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Aggregate by airline
        const airlineData = d3.rollup(
            flights,
            v => ({
                avgPrice: d3.mean(v, d => d.price) || 0,
                minPrice: d3.min(v, d => d.price) || 0,
                maxPrice: d3.max(v, d => d.price) || 0,
                count: v.length,
                name: v[0].carrierName
            }),
            d => d.carrierCode
        );

        const data = Array.from(airlineData, ([code, values]) => ({
            code,
            ...values
        })).sort((a, b) => a.avgPrice - b.avgPrice);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.code))
            .range([0, width])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.maxPrice) || 1000])
            .range([height, 0])
            .nice();

        const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
            .domain(data.map(d => d.code));

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('fill', '#64748b')
            .attr('transform', 'rotate(-45)')
            .attr('text-anchor', 'end');

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d => `$${d}`))
            .selectAll('text')
            .attr('fill', '#64748b');

        // Error bars (min-max range)
        g.selectAll('.range-line')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', d => (xScale(d.code) || 0) + xScale.bandwidth() / 2)
            .attr('x2', d => (xScale(d.code) || 0) + xScale.bandwidth() / 2)
            .attr('y1', d => yScale(d.minPrice))
            .attr('y2', d => yScale(d.maxPrice))
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 2);

        // Average price dots
        g.selectAll('.avg-dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => (xScale(d.code) || 0) + xScale.bandwidth() / 2)
            .attr('cy', d => yScale(d.avgPrice))
            .attr('r', 10)
            .attr('fill', d => colorScale(d.code))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');

        // Labels
        g.selectAll('.price-label')
            .data(data)
            .enter()
            .append('text')
            .attr('x', d => (xScale(d.code) || 0) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.avgPrice) - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#374151')
            .attr('font-size', '11px')
            .attr('font-weight', '600')
            .text(d => `$${Math.round(d.avgPrice)}`);

    }, [flights, onHover]);

    return <svg ref={svgRef} className="w-full" height={280} />;
}

export { D3PriceChart as PriceGraph };
