import type { ReactNode } from 'react';

export interface AdminTableColumn {
    header: ReactNode;
    className?: string;
}

export interface AdminTableProps<T> {
    columns: AdminTableColumn[];
    rows: T[];
    rowKey: (row: T) => string | number;
    renderRow: (row: T) => ReactNode;
    emptyState?: ReactNode;
}

export default function AdminTable<T>({
    columns,
    rows,
    rowKey,
    renderRow,
    emptyState = 'No records found.',
}: AdminTableProps<T>) {
    return (
        <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={`${index}-${String(column.header)}`}
                                scope="col"
                                className={[
                                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400',
                                    column.className ?? '',
                                ].join(' ')}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-950/30">
                    {rows.length ? (
                        rows.map((row) => (
                            <tr key={rowKey(row)} className="hover:bg-white/[0.03]">
                                {renderRow(row)}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="px-4 py-6 text-sm text-slate-400" colSpan={columns.length}>
                                {emptyState}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
