'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
    compact?: boolean;
}

export default function SignOutButton({ compact = false }: SignOutButtonProps) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const handleSignOut = async () => {
        if (pending) {
            return;
        }

        setPending(true);

        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            router.replace('/admin/login');
            router.refresh();
        }
    };

    return (
        <button
            type="button"
            onClick={handleSignOut}
            disabled={pending}
            className={[
                'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-400/20 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-60',
                compact ? 'sm:w-auto' : '',
            ].join(' ')}
        >
            <LogOut className="h-4 w-4" />
            {pending ? 'Signing out' : 'Sign out'}
        </button>
    );
}
