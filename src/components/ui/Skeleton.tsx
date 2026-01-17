import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-shimmer rounded-md bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 bg-[length:200%_100%]',
                className
            )}
        />
    );
}

export function FlightCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <Skeleton className="h-6 w-20 ml-auto" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-10" />
                </div>
                <div className="flex-1 mx-6">
                    <Skeleton className="h-px w-full" />
                    <div className="flex justify-center mt-2">
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="space-y-2 text-right">
                    <Skeleton className="h-5 w-16 ml-auto" />
                    <Skeleton className="h-3 w-10 ml-auto" />
                </div>
            </div>
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-card">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="flex items-end gap-2 h-48">
                {[60, 80, 45, 90, 70, 55, 85].map((height, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1 rounded-t-md"
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>
            <div className="flex justify-between mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-3 w-12" />
                ))}
            </div>
        </div>
    );
}
