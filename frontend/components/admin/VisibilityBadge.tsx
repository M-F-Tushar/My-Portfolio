interface VisibilityBadgeProps {
    visible: boolean;
    visibleLabel?: string;
    hiddenLabel?: string;
    className?: string;
}

export default function VisibilityBadge({
    visible,
    visibleLabel = 'Visible',
    hiddenLabel = 'Hidden',
    className = '',
}: VisibilityBadgeProps) {
    return (
        <span
            className={[
                'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]',
                visible
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                    : 'border-slate-500/20 bg-slate-500/10 text-slate-300',
                className,
            ].join(' ')}
        >
            {visible ? visibleLabel : hiddenLabel}
        </span>
    );
}
