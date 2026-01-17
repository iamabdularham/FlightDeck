import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { useFlightStore } from '@/store/flightStore';
import { formatPrice } from '@/lib/utils';
import { ChartSkeleton } from '@/components/ui/Skeleton';

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: {
            name: string;
            price: number;
            count: number;
        };
    }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-surface-200 p-4">
            <p className="font-semibold text-surface-900">{data.name}</p>
            <p className="text-primary-600 font-bold text-lg">
                {formatPrice(data.price)}
            </p>
            <p className="text-sm text-surface-500">
                {data.count} {data.count === 1 ? 'flight' : 'flights'} available
            </p>
        </div>
    );
}

export function PriceGraph() {
    const { isLoading, hasSearched, getChartData, updateFilter, filters } = useFlightStore();

    const chartData = useMemo(() => getChartData(), [getChartData, filters]);

    if (isLoading) {
        return <ChartSkeleton />;
    }

    if (!hasSearched) {
        return null;
    }

    if (chartData.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-card">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Price by Airline</h3>
                <div className="h-48 flex items-center justify-center text-surface-500">
                    No data available for current filters
                </div>
            </div>
        );
    }

    const handleBarClick = (data: { carrierCode: string }) => {
        // Filter to only this airline
        updateFilter('airlines', [data.carrierCode]);
    };

    const minPrice = Math.min(...chartData.map((d) => d.price));

    return (
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900">Price by Airline</h3>
                <span className="text-sm text-surface-500">
                    Click a bar to filter by airline
                </span>
            </div>

            <div
                className="h-64"
                role="img"
                aria-label={`Bar chart showing minimum flight prices by airline. ${chartData.length} airlines displayed. Prices range from ${formatPrice(Math.min(...chartData.map(d => d.price)))} to ${formatPrice(Math.max(...chartData.map(d => d.price)))}.`}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e2e8f0' }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                            height={50}
                        />
                        <YAxis
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                        <Bar
                            dataKey="price"
                            radius={[6, 6, 0, 0]}
                            cursor="pointer"
                            onClick={(data) => handleBarClick(data)}
                            animationDuration={300}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.price === minPrice ? '#22c55e' : '#3b82f6'}
                                    className="transition-all duration-200 hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p className="text-xs text-surface-500 mt-2 text-center">
                Showing lowest price per airline • Green = Best value
            </p>
        </div>
    );
}
