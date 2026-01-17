import { describe, it, expect } from 'vitest';
import { formatPrice, formatDuration, getPriceRange } from '@/lib/utils';
import { Flight } from '@/lib/types';

describe('Utils', () => {
    it('formats price correctly', () => {
        expect(formatPrice(1234.56)).toBe('$1,234.56');
    });

    it('formats duration correctly', () => {
        expect(formatDuration(125)).toBe('2h 5m');
    });

    it('calculates price range correctly', () => {
        const flights = [
            { price: 100 },
            { price: 50 },
            { price: 200 },
        ] as Flight[];

        expect(getPriceRange(flights)).toEqual([50, 200]);
    });
});
