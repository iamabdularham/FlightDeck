import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    step?: number;
    formatValue?: (value: number) => string;
    className?: string;
    showManualInput?: boolean;
}

export function RangeSlider({
    min,
    max,
    value,
    onChange,
    step = 1,
    formatValue = (v) => v.toString(),
    className,
    showManualInput = false,
}: RangeSliderProps) {
    const [localValue, setLocalValue] = useState(value);
    const [minInputValue, setMinInputValue] = useState(value[0].toString());
    const [maxInputValue, setMaxInputValue] = useState(value[1].toString());
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalValue(value);
        setMinInputValue(value[0].toString());
        setMaxInputValue(value[1].toString());
    }, [value]);

    const getPercent = useCallback(
        (val: number) => ((val - min) / (max - min)) * 100,
        [min, max]
    );

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.min(Number(e.target.value), localValue[1] - step);
        const newValue: [number, number] = [newMin, localValue[1]];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.max(Number(e.target.value), localValue[0] + step);
        const newValue: [number, number] = [localValue[0], newMax];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinInputValue(e.target.value);
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxInputValue(e.target.value);
    };

    const handleMinInputBlur = () => {
        let newMin = parseInt(minInputValue, 10);
        if (isNaN(newMin)) newMin = min;
        newMin = Math.max(min, Math.min(newMin, localValue[1] - step));
        setMinInputValue(newMin.toString());
        const newValue: [number, number] = [newMin, localValue[1]];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleMaxInputBlur = () => {
        let newMax = parseInt(maxInputValue, 10);
        if (isNaN(newMax)) newMax = max;
        newMax = Math.min(max, Math.max(newMax, localValue[0] + step));
        setMaxInputValue(newMax.toString());
        const newValue: [number, number] = [localValue[0], newMax];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isMin: boolean) => {
        if (e.key === 'Enter') {
            if (isMin) handleMinInputBlur();
            else handleMaxInputBlur();
        }
    };

    const minPercent = getPercent(localValue[0]);
    const maxPercent = getPercent(localValue[1]);

    return (
        <div className={cn('w-full', className)}>
            {showManualInput ? (
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1">
                        <label className="text-xs text-surface-500 mb-1 block">Min</label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-surface-400 text-sm">$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={minInputValue}
                                onChange={handleMinInputChange}
                                onBlur={handleMinInputBlur}
                                onKeyDown={(e) => handleInputKeyDown(e, true)}
                                className="w-full pl-6 pr-2 py-1.5 text-sm border border-surface-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                aria-label="Minimum price"
                            />
                        </div>
                    </div>
                    <span className="text-surface-400 mt-5">—</span>
                    <div className="flex-1">
                        <label className="text-xs text-surface-500 mb-1 block">Max</label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-surface-400 text-sm">$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={maxInputValue}
                                onChange={handleMaxInputChange}
                                onBlur={handleMaxInputBlur}
                                onKeyDown={(e) => handleInputKeyDown(e, false)}
                                className="w-full pl-6 pr-2 py-1.5 text-sm border border-surface-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                aria-label="Maximum price"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between mb-2 text-sm font-medium text-surface-700">
                    <span>{formatValue(localValue[0])}</span>
                    <span>{formatValue(localValue[1])}</span>
                </div>
            )}
            <div className="relative h-6">
                {/* Track background */}
                <div
                    ref={trackRef}
                    className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-surface-200 rounded-full"
                />
                {/* Active track */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`,
                    }}
                />
                {/* Min thumb */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue[0]}
                    onChange={handleMinChange}
                    className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
                {/* Max thumb */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue[1]}
                    onChange={handleMaxChange}
                    className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
            </div>
        </div>
    );
}
