import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getCurrentAdmin } from '@/lib/auth/session';

interface AdminDashboardLayoutProps {
    children: ReactNode;
}

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
    const admin = await getCurrentAdmin();

    if (!admin) {
        redirect('/admin/login');
    }

    return (
        <AdminShell adminEmail={admin.email}>
            {children}
        </AdminShell>
    );
}
