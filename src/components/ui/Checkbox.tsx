import { cn } from '@/lib/utils';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export function Checkbox({ checked, onChange, label, disabled, className }: CheckboxProps) {
    return (
        <label
            className={cn(
                'flex items-center gap-2 cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={cn(
                        'w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
                        checked
                            ? 'bg-primary-600 border-primary-600'
                            : 'bg-white border-surface-300 hover:border-primary-400'
                    )}
                >
                    {checked && (
                        <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </div>
            </div>
            {label && (
                <span className="text-sm text-surface-700">{label}</span>
            )}
        </label>
    );
}
