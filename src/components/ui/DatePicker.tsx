import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label: string;
    minDate?: string;
    placeholder?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function DatePicker({ value, onChange, label, minDate, placeholder = 'Select date' }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (value) return new Date(value);
        return new Date();
    });

    // Position state for the portal
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const wrapperRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if click is outside both the button and the portal content
            const target = event.target as Node;
            const portalContent = document.getElementById('datepicker-portal-content');

            if (wrapperRef.current &&
                !wrapperRef.current.contains(target) &&
                portalContent &&
                !portalContent.contains(target)) {
                setIsOpen(false);
            }
        }

        // Handle scroll and resize to update position or close
        function handleScrollOrResize() {
            if (isOpen) setIsOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen]);

    // Update position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8, // 8px Offset, viewport relative
                left: rect.left, // Viewport relative
                width: rect.width
            });
        }
    }, [isOpen]);

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00'); // Ensure logical date matching input
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const isDateDisabled = (date: Date) => {
        if (!minDate) return false;
        const min = new Date(minDate);
        min.setHours(0, 0, 0, 0);

        const d = new Date(date);
        d.setHours(0, 0, 0, 0);

        return d < min;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        if (!value) return false;
        const selected = new Date(value + 'T00:00:00');
        return date.getDate() === selected.getDate() &&
            date.getMonth() === selected.getMonth() &&
            date.getFullYear() === selected.getFullYear();
    };

    const handleDateClick = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (isDateDisabled(date)) return;

        // Construct simplified ISO string YYYY-MM-DD manually to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');

        onChange(`${year}-${month}-${d}`);
        setIsOpen(false);
    };

    const goToPrevMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const disabled = isDateDisabled(date);
            const selected = isSelected(date);
            const today = isToday(date);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    disabled={disabled}
                    className={cn(
                        'w-9 h-9 rounded-full text-sm font-medium transition-all duration-200',
                        'hover:bg-primary-100 hover:text-primary-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                        disabled && 'text-surface-300 cursor-not-allowed hover:bg-transparent',
                        selected && 'bg-primary-600 text-white hover:bg-primary-700 hover:text-white',
                        today && !selected && 'border-2 border-primary-500 text-primary-600',
                        !selected && !today && !disabled && 'text-surface-700'
                    )}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
                {label}
            </label>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-full flex items-center gap-3 rounded-lg border border-surface-300 bg-white px-4 py-3',
                    'text-left transition-all duration-200',
                    'hover:border-primary-400',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                    isOpen && 'border-primary-500 ring-2 ring-primary-500/20'
                )}
            >
                <Calendar className="w-5 h-5 text-surface-400" />
                <span className={cn(
                    'flex-1',
                    value ? 'text-surface-900' : 'text-surface-500' // Fixed incorrect text color logic
                )}>
                    {value ? formatDisplayDate(value) : placeholder}
                </span>
            </button>

            {isOpen && coords.width > 0 && createPortal(
                <div
                    id="datepicker-portal-content"
                    // Changed animation to slide-in-from-top-2 for a nice drop effect relative to trigger
                    className="fixed z-[9999] bg-white rounded-xl border border-surface-200 shadow-xl p-4 min-w-[320px] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 ease-out"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        minWidth: Math.max(320, coords.width)
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={goToPrevMonth}
                            className="p-2 rounded-full hover:bg-surface-100 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-surface-600" />
                        </button>
                        <span className="font-semibold text-surface-900 select-none">
                            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </span>
                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="p-2 rounded-full hover:bg-surface-100 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-surface-600" />
                        </button>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map(day => (
                            <div key={day} className="w-9 h-9 flex items-center justify-center text-xs font-medium text-surface-500 select-none">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>

                    {/* Quick actions */}
                    <div className="mt-4 pt-3 border-t border-surface-100 flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                onChange(today.toISOString().split('T')[0]);
                                setIsOpen(false);
                            }}
                            className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                onChange(tomorrow.toISOString().split('T')[0]);
                                setIsOpen(false);
                            }}
                            className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            Tomorrow
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
