import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-surface-900 mb-2">Something went wrong</h2>
                    <p className="text-surface-600 max-w-md mb-6">
                        We're sorry, but the application encountered an unexpected error.
                        Please try refreshing the page.
                    </p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-primary-600 hover:bg-primary-700"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reload Page
                        </Button>
                    </div>
                    {import.meta.env.DEV && (
                        <div className="mt-8 p-4 bg-surface-100 rounded-lg text-left overflow-auto max-w-2xl w-full">
                            <p className="font-mono text-sm text-red-600 mb-2">{this.state.error?.message}</p>
                            <pre className="font-mono text-xs text-surface-600">
                                {this.state.error?.stack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
