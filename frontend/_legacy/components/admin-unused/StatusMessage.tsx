import { useEffect, useState } from 'react';

interface StatusMessageProps {
    type: 'success' | 'error' | 'info';
    message: string;
    onDismiss?: () => void;
}

const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const typeIcons = {
    success: '\u2713',
    error: '\u2717',
    info: '\u2139',
};

export default function StatusMessage({ type, message, onDismiss }: StatusMessageProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onDismiss?.();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    if (!visible || !message) return null;

    return (
        <div className={`border rounded-lg px-4 py-3 mb-4 flex items-center justify-between transition-opacity duration-300 ${typeStyles[type]}`}>
            <div className="flex items-center gap-2">
                <span className="text-lg">{typeIcons[type]}</span>
                <span>{message}</span>
            </div>
            <button
                onClick={() => { setVisible(false); onDismiss?.(); }}
                className="text-current opacity-50 hover:opacity-100 ml-4"
            >
                &times;
            </button>
        </div>
    );
}
